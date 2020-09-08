const sqlite=require('sqlite3');

const db= new sqlite.Database('./Exams.db', (err) =>{ 
    if(err) {
      
        throw err;
        }
    });

exports.db=function (){return db;}


exports.tableSetUp= function(){
    return new Promise((resolve, reject)=>{
        
        db.run('CREATE TABLE IF NOT EXISTS teachers(\
            code INTEGER PRIMARY KEY AUTOINCREMENT,\
            name TEXT NOT NULL,\
            surname TEXT NOT NULL,\
            course TEXT NOT NULL,\
            password TEXT NOT NULL);', function (err){
              if(err){
                  reject(err);
                  return;
              }
            db.get('SELECT * FROM teachers WHERE name=\'Gianni\';', function (err, row){
                if(err){
                   console.log(err);
                   return;
                }
                if(row==null){
                    
                    db.run('INSERT INTO teachers(name, surname, course, password)\
                            VALUES(\'Gianni\', \'Surace\', \'Web Application I\', \'12345\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    })
                }
            });
        });

      
        db.run('CREATE TABLE IF NOT EXISTS students(\
            code INTEGER PRIMARY KEY AUTOINCREMENT,\
            name TEXT NOT NULL,\
            surname TEXT NOT NULL);', function (err){
                if(err){
                  reject(err);
                  return;
                }
                
                db.get('SELECT * FROM students WHERE name=\'Marco\';', function (err, row){
                if(err){
                   console.log(err);
                   return;
                }
                if(row==null){
                    
                    db.run('INSERT INTO students(name, surname)\
                            VALUES(\'Marco\', \'Gullotto\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });

                    db.run('INSERT INTO students(name, surname)\
                            VALUES(\'Federica\', \'Giorgione\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });

                    db.run('INSERT INTO students(name, surname)\
                            VALUES(\'Silvia\', \'Giammarinaro\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });
                }
            });
        
        });

        db.run('CREATE TABLE IF NOT EXISTS results(\
            code INTEGER NOT NULL,\
            exam INTEGER NOT NULL,\
            vote TEXT NOT NULL,\
            passed BOOLEAN NOT NULL CHECK (passed IN (0,1)),\
            primary key (code, exam))', function(err){
                if(err){
                    console.log(err);
                    return;
                }
        });

        db.run('CREATE TABLE IF NOT EXISTS exam_slot(\
            exam INTEGER NOT NULL,\
            date TEXT NOT NULL,\
            duration INTEGER NOT NULL,\
            call  INTEGER NOT NULL,\
            booked BOOLEAN NOT NULL CHECK (booked in (0,1)),\
            mat INTEGER NOT NULL)', function(err){
                if(err){
                    console.log(err);
                    return;
                }
            });
        
            db.run('CREATE TABLE IF NOT EXISTS exam_call(\
                call INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                exam INTEGER NOT NULL)', function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                });
                db.run('CREATE TABLE IF NOT EXISTS call_students(\
                    call INTEGER NOT NULL ,\
                    mat INTEGER NOT NULL)', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });
   
    });
}