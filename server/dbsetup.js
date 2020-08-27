const sqlite=require('sqlite3');

const db= new sqlite.Database('./Exams.db', (err) =>{ 
    if(err) {
      
        throw err;
        }
    });

exports.db=function (){return db;}


exports.tableSetUp= function(){
    return new Promise((resolve, reject)=>{
        
        db.run('CREATE TABLE IF NOT EXISTS teacher(\
            code INTEGER PRIMARY KEY AUTOINCREMENT,\
            name TEXT NOT NULL,\
            surname TEXT NOT NULL,\
            course TEXT NOT NULL,\
            password TEXT NOT NULL);', function (err){
              if(err){
                  reject(err);
                  return;
              }
            db.get('SELECT * FROM teacher WHERE name=\'Gianni\';', function (err, row){
                if(err){
                   console.log(err);
                   return;
                }
                if(row==null){
                    
                    db.run('INSERT INTO teacher(name, surname, course, password)\
                            VALUES(\'Gianni\', \'Surace\', \'Web Application I\', \'12345\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    })
                }
            });
        });

      
        db.run('CREATE TABLE IF NOT EXISTS student(\
            code INTEGER PRIMARY KEY AUTOINCREMENT,\
            name TEXT NOT NULL,\
            surname TEXT NOT NULL);', function (err){
                if(err){
                  reject(err);
                  return;
                }
                
                db.get('SELECT * FROM student WHERE name=\'Marco\';', function (err, row){
                if(err){
                   console.log(err);
                   return;
                }
                if(row==null){
                    
                    db.run('INSERT INTO student(name, surname)\
                            VALUES(\'Marco\', \'Surace\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });

                    db.run('INSERT INTO student(name, surname)\
                            VALUES(\'Federica\', \'Giorgione\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });

                    db.run('INSERT INTO student(name, surname)\
                            VALUES(\'Silvia\', \'Giammarino\');', function(err){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });
                }
            });
        
        });


   
   
    });
}