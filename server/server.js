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
    console.log(req.body.code+"/"+req.body.password);
    dao.login(req.body.code, req.body.password).then((user)=>{
        console.log("login done!");
        const token= jsonwebtoken.sign({code: user.code},key,{expiresIn: expireT});
        res.cookie('token', token, {httpOnly:true, sameSite: true, maxAge: 1000*expireT});
        res.json(user.code);
    }).catch(()=>{
        console.log("login failed");
        res.status(401).end()
    });


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
    req.code=user.code;
    console.log(req.body);
    console.log(req.code);
    next();
});

app.post('/api/logout', (req,res)=>{
    res.clearCookie('token').end();
});

app.get('/api/getAllStudent/', (req,res)=>{
    dao.getPossibleStudent(req.code)
    .then((students)=>res.json(students).end())
    .catch(()=>res.status(401).end());
});

app.post('/api/session', (req,res)=>{
    dao.insertSession(req.body.session, req.code)
    .then((call)=>res.json(call).status(200).end())
    .catch(()=>res.status(500).end())}
);

app.post('/api/selectedStudents/', (req,res)=>{
    dao.insertSelectedStudents(req.body.students, req.code,req.body.call)
    .then(()=>res.status(200).end())
    .catch(()=>res.status(500).end())}
);

app.get('/api/BookableExams/', (req,res)=>{

    dao.getBookableExams(req.code)
    .then((exams)=>res.json(exams).status(200).end())
    .catch(()=>res.status(401).end());
});

app.get('/api/allSlots/:call', (req,res)=>{

    dao.getAllSlots(req.params.call)
    .then((slots)=>res.json(slots).status(200).end())
    .catch(()=>res.status(401).end());
});

app.post('/api/bookSlot/:call/:date', (req,res)=>{
    dao.book(req.params.date, req.params.call,req.code)
    .then(()=>res.status(200).end())
    .catch(()=>res.status(500).end())}
);

app.delete('/api/bookSlot/:call/:date', (req,res)=>{
    dao.free(req.params.date,req.params.call,req.code)
    .then(()=>res.status(200).end())
    .catch(()=>res.status(500).end())}
);

app.get('/api/BookeSlots/', (req,res)=>{

    dao.getBookedSlot(req.code)
    .then((slots)=>res.json(slots).status(200).end())
    .catch(()=>res.status(401).end());
});

app.post('/api/updateVote/', (req,res)=>{
    dao.updatevote(req.body.mat,req.body.vote,req.code)
    .then(()=>res.status(200).end())
    .catch(()=>res.status(500).end())}
);

app.get('/api/StudentsResults/', (req,res)=>{

    dao.StudentsResults(req.code)
    .then((slots)=>res.json(slots).status(200).end())
    .catch(()=>res.status(401).end());
});

app.get('/api/getResults/', (req,res)=>{

    dao.getResults(req.code)
    .then((exams)=>{
        res.json(exams).status(200).end();
    }).catch(()=>res.status(401).end());
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));