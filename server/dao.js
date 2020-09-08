'use strict'

const dbsetup=require('./dbsetup.js');
const sqlite=require('sqlite3');

const db=dbsetup.db();

dbsetup.tableSetUp().catch((err)=>{ console.log(err)});

exports.login= function(mat, password){

    let code=[...mat];
    let letter=code.shift();
    console.log(code);
    code=code.join().replace(/,/g,'');
    console.log(code);
    console.log("code:"+code+"  is:"+letter);
    if(letter=='t'){
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM teachers WHERE code=? AND password=?',[code,password], (err, row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }else if(letter=='s'){
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM students WHERE code=?',[code], (err, row)=>{
                if(err){
                    reject(err);
                    console.log(err);
                    return;
                }
                resolve(row);
            });
        });
    }
};


exports.getPossibleStudent=function(exam){
    return new Promise((resolve, reject)=>{
        db.all('SELECT * FROM students WHERE code IN(SELECT code FROM students EXCEPT SELECT code FROM results WHERE exam=? AND passed=1)',[exam],
         function(err, rows){
            if(err){
                console.log(err);
                reject(err);
                return;
            }
            console.log(rows);
            rows.map((row)=>{return {code:row.code, name:row.name, surname:row.surname}});
            resolve(rows);
            
        });
    });
};

exports.insertSession=function(session, code){
    

    return new Promise((resolve,reject)=>{
        let call;

        db.run('INSERT INTO exam_call(exam) VALUES(?)',[code],
        function(err){
            if(err){
                console.log(err);
                reject(err);
                return;
            } 

            call=this.lastID;
            session.forEach(slot => {
          
                db.run('INSERT INTO exam_slot(call, exam, date, duration, booked, mat) VALUES(?,?,?,?,0,0)',
                 [call,slot.code, slot.date,slot.duration],
                  function(err){
                    if(err){
                        console.log(err);
                        reject(err);
                        return;
                    }
                });
               
                
            });
            resolve(call);
            

            
        });
        
    });
}

exports.insertSelectedStudents=function(students, exam, call){

    return new Promise((resolve, reject)=>{
        console.log(students);
        students.forEach(student =>{
            db.run('INSERT OR REPLACE INTO results(code, exam, vote, passed) VALUES(?,?,0,0);',
             [student, exam],
              function(err){
                if(err){
                    console.log(err);
                    reject(err);
                    return;
                }
                
            });

            db.run('INSERT INTO call_students(call, mat) VALUES(?,?)',[call, student], function(err){
                if(err){
                    console.log(err);
                    reject(err);
                    return;
                }
            })


        });
        resolve();
    });
}

exports.getBookableExams=function(mat){

    return new Promise((resolve, reject)=>{
        console.log(mat);
        db.all('SELECT exam_call.call, name, surname, course\
                 FROM call_students\
                 INNER JOIN exam_call ON exam_call.call=call_students.call\
                 INNER JOIN teachers ON exam_call.exam=teachers.code\
                 INNER JOIN results ON results.exam=teachers.code\
                 WHERE call_students.mat=? AND results.code=? AND results.vote=0',
        [mat, mat], function(err, rows){
            if(err){
                console.log(err);
                reject(err);
                return;
            }
            console.log(rows);
            resolve(rows);
        });
    });
}

exports.getAllSlots=function(call){
    return new Promise((resolve, reject)=>{
        db.all('SELECT * FROM exam_slot WHERE call=? ORDER BY date',
        [call], function(err,rows){
            if(err){
                console.log(err);
                reject(err);
                return;
            }
            console.log(rows);
            resolve(rows);
        });
    });
}

exports.book=function(date, call, mat){
    return new Promise((resolve,reject)=>{
        db.run('UPDATE exam_slot SET booked=1, mat=? WHERE date=? AND call=?', [mat, date, call], function(err){
            if(err){
                console.log(err);
                reject();
            }
            resolve();
        });
    });
}

exports.free=function(date, call, mat){
    return new Promise((resolve,reject)=>{
        db.run('UPDATE exam_slot SET booked=0, mat=0 WHERE date=? AND call=? AND mat=?', [date, call, mat], function(err){
            if(err){
                console.log(err);
                reject();
                return;
            }
            resolve();
        });
    });
}

exports.getBookedSlot=function(code,call){
    return new Promise((resolve, reject)=>{
        db.all('SELECT date, mat, name, surname \
                FROM results \
                INNER JOIN students ON students.code=results.code\
                INNER JOIN exam_slot ON exam_slot.mat=students.code AND exam_slot.exam=results.exam \
                WHERE exam_slot.exam=? AND results.vote=0 AND exam_slot.booked=1 ORDER BY date',
         [code],function(err, rows){
            if(err){
                console.log(err);
                reject(err);
                return;
            }
            console.log(rows);
            resolve(rows);
        });
    });
}

exports.updatevote=function(mat,vote,exam){
    return new Promise((resolve, reject)=>{
        if(vote=='fail' || vote=='absent' || vote=='withdraw'){
            db.run('UPDATE results SET vote=?, passed=0 WHERE code=? AND exam=?',
             [vote, mat, exam],function(err){
                if(err){
                    console.log(err);
                    reject();
                    return;
                }
                resolve(); 
            });
        }else{
            db.run('UPDATE results SET vote=?, passed=1 WHERE code=? AND exam=?',
            [vote, mat, exam],function(err){
               if(err){
                   console.log(err);
                   reject();
                   return;
               }
               resolve(); 
           });
        }

    });
}

exports.StudentsResults=function(exam){

    return new Promise((resolve, reject)=>{
        db.all('SELECT date, mat, name, surname, vote, passed, booked \
                FROM results \
                INNER JOIN students ON results.code=students.code \
                INNER JOIN exam_slot ON results.code=exam_slot.mat AND results.exam=exam_slot.exam \
                WHERE results.exam=? ORDER BY date',[exam], function(err,rows){
        if(err){
            console.log(err);
            reject(err);
            return;
        }
        rows.forEach((row)=>{
            let date= new Date(row.date);
            Object.assign(row, {date:date.toDateString(), time:date.toTimeString().replace('GMT+0200 (GMT+02:00)','')});
        });
        console.log(rows);
            db.all('SELECT name, surname,students.code\
                    FROM students\
                    INNER JOIN results ON students.code=results.code\
                    WHERE results.exam=? AND\
                    students.code NOT IN(SELECT mat FROM exam_slot \
                                         WHERE exam_slot.booked=1 AND exam_slot.exam=?)', [exam, exam], function(err, righe){
                if(err){
                    console.log(err);
                    reject(err);
                    return;
                }
                
                righe.forEach((riga)=>Object.assign(riga, {booked: 0, mat:riga.code}));
                console.log(righe);
                righe.forEach((riga)=>rows.push(riga));
                console.log(rows);      
            resolve(rows);
            });
            
    });
    });

}

exports.getResults= function(mat){

    return new Promise((resolve, reject)=>{
        db.all('SELECT passed, vote, teachers.course, results.exam\
                FROM results\
                INNER JOIN teachers ON results.exam=teachers.code\
                WHERE results.code=?', [mat],function(err, rows){
            if(err){
                console.log(err);
                reject(err);
                return;
            }
            db.all('SELECT * FROM exam_slot WHERE mat=?', [mat], function(err, righe){
                if(err){
                    console.log(err);
                    reject(err);
                    return;
                }
                let exams=[];
                rows.forEach(row=>{
                    if(row.passed==1 ||(row.passed==0 && row.vote!=0))
                        exams.push(row);
                    else if(row.passed==0 && row.vote==0){
                        let trovati=righe.filter(riga=> riga.exam==row.exam);
                        trovati.forEach(trovato=>{
                            Object.assign(trovato, row);
                            exams.push(trovato);
                        });
                        
                    }
                });
                console.log(exams);
                resolve(exams);

            });
            
        });
    });
}
