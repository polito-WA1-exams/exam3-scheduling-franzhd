const express = require('express');
const morgan = require('morgan');
const dao= require('./dao');

const shh = require('./secret');
const cookieParser=require('cookie-parser');
const jwt=require('express-jwt');
const jsonwebtoken= require('jsonwebtoken');


const PORT = 3001;

app = new express();
app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());
const key= shh.key();
const expireT=1200;

app.post('/api/login',(req, res)=>{
    dao.login(req.body.name, req.body.password).then((user)=>{
        const token= jsonwebtoken.sign({user_id: user.user_id},key,{expiresIn: expireT});
        res.cookie('token', token, {httpOnly:true, sameSite: true, maxAge: 1000*expireT});
        res.json(req.body.name);
    }).catch(()=>{
        console.log("login failed");
        res.status(401).end()
    })


});

app.use(jwt({
    secret: key,
    getToken: req => req.cookies.token,
    algorithms: ['HS256']
}));

app.use(function(err,req,res, next){
    if(err.name==='UnauthorizedError'){
        res.status(401).json('Unauthorizer User tryed to extract data');
    }
    
});

app.use(function (req,res, next){
    let token=req.cookies.token.split('.')[1];
    const user=jsonwebtoken.verify(req.cookies.token, key);
    console.log('authorized request');
    req.user_id=user.user_id;
    console.log(req.params);
    console.log(req.body);
    next();
});

app.post('/api/logout', (req,res)=>{
    res.clearCookie('token').end();
});
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));