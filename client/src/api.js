'use strict'

async function login(mat, password){
    return new Promise((resolve, reject)=>{
        fetch('/api/login',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ code: mat, password : password}),
        }).then((res)=>{
            if(res.ok)
                res.json()
                .then((code)=>{resolve(code)});
            else{
                res.json()
                .then((o)=>{ reject(o)})
                .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
    });
}

async function logout(){
    return new Promise((resolve, reject)=>{
        fetch('/api/logout', {
            method: 'POST',
        })
        .then((res)=>{
            if(res.ok){
                resolve(null);
            }else{
                res.json()
                .then((obj) => { reject(obj); })
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        });
        
    });
}

async function getAllStudent(){
    return new Promise((resolve,reject)=>{
        fetch('/api/getAllStudent/', {
            method:'GET',
        }).then((res)=>{
                if(res.ok){
                    res.json()
                    .then((students)=>resolve(students))
                    .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
                }else{
                    reject(res.status);
                }
            }).catch((err)=>(reject(err)));
        });
    };

async function sendsession(session){
    return new Promise((resolve, reject)=>{
        fetch('/api/session', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ session:[...session]}),
        }).then((res)=>{
            if(res.ok){
                res.json()
                    .then((call)=>resolve(call))
                    .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });     
            }else{
                reject('');
            }
        }).catch((err)=>reject(err));
    });
}

async function sendstudents(students, call){
    return new Promise((resolve, reject)=>{
        fetch('/api/selectedStudents/', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ students:[...students], call:call}),
        }).then((res)=>{
            if(res.ok){
                resolve('done');
            }else{
                reject('');
            }
        }).catch((err)=>reject(err));
    });
}

async function getBookableExams(){
    return new Promise((resolve, reject)=>{
        fetch('/api/BookableExams/', {
            method: 'GET',
            
        }).then((res)=>{
            if(res.ok){
                res.json()
                .then((exams)=>resolve(exams))
                .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 
}

async function getAllSlots(call){
    return new Promise((resolve, reject)=>{
        fetch('/api/allSlots/'+call, {
            method: 'GET',
            
        }).then((res)=>{
            if(res.ok){
                res.json()
                .then((slots)=>resolve(slots))
                .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 
}

async function bookSlot(call, date){
    return new Promise((resolve, reject)=>{
        fetch('/api/bookSlot/'+call+'/'+date, {
            method: 'POST',
            
        }).then((res)=>{
            if(res.ok){
                resolve();
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 
}

async function freeSlot(call, date){
    return new Promise((resolve, reject)=>{
        fetch('/api/bookSlot/'+call+'/'+date, {
            method: 'DELETE',
            
        }).then((res)=>{
            if(res.ok){
                resolve();
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 
}

async function getBookedSlot(){
    return new Promise((resolve, reject)=>{
        fetch('/api/BookeSlots/', {
            method: 'GET',
            
        }).then((res)=>{
            if(res.ok){
                res.json()
                .then((slots)=>resolve(slots))
                .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 
}

async function updatevote(mat, vote){
    return new Promise((resolve, reject)=>{
        fetch('/api/updateVote/',  {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ mat: mat, vote:vote}),
        }).then((res)=>{
            if(res.ok){
                resolve();
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 
}

async function getStudentsResults(){
    return new Promise((resolve, reject)=>{
        fetch('/api/StudentsResults/', {
            method: 'GET',
            
        }).then((res)=>{
            if(res.ok){
                res.json()
                .then((students)=>resolve(students))
                .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 

}

async function getResults(){
    return new Promise((resolve, reject)=>{
        fetch('/api/getResults/', {
            method: 'GET',
            
        }).then((res)=>{
            if(res.ok){
                res.json()
                .then((exams)=>resolve(exams))
                .catch((err)=> {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }else{
                reject(res.status);
            }
        }).catch((err)=>reject(err));
    }); 
}
const API={login, logout, getAllStudent,sendsession, sendstudents, getBookableExams,getAllSlots, bookSlot, freeSlot, getBookedSlot, updatevote, getStudentsResults, getResults};
export default API;