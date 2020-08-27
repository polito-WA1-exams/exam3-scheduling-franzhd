'use strict'

const dbsetup=require('./dbsetup.js');
const sqlite=require('sqlite3');

const db=dbsetup.db();

dbsetup.tableSetUp().catch((err)=>{ console.log(err)});

exports.login= function(mat, password){
    let [letter, code]=[...mat];
    code=code.toString();
    if(letter='t'){
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM teacher WHERE code=? AND password=?',[code,password], (err, row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }else if(letter='s'){
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM student WHERE code=?',[code], (err, row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }
};