'use strict'

async function login(username, password){
    return new Promise((resolve, reject)=>{
        fetch('/api/login',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ name: username, password : password}),
        }).then((res)=>{
            if(res.ok)
                res.json()
                .then((user)=>{resolve(user)});
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