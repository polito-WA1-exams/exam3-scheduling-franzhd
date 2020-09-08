import React from 'react';
import './App.css';
import API from './api';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {Switch} from 'react-router';
import {Redirect, Route,Link, NavLink} from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import FormText from 'react-bootstrap/esm/FormText';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



class App extends React.Component{
  constructor(props){
    super(props);
    this.state={loggedin: false, code:'', password:'', errlogin:'', is:'', };
  }

  updatefield=(name, value)=>{
    this.setState({[name]: value});
  }

  showLogin=()=>{
    if (!this.state.loggedin) {
      return <LoginForm updatefield={this.updatefield} 
      login={this.login} 
      user={this.state.user} 
      errlogin={this.state.errlogin}
      loggedin={this.state.loggedin}/>
    }else if(this.state.is=="student"){ 
      return  <Redirect to='/Book'></Redirect>;
    }else if(this.state.is=="teacher"){
      return <Redirect to='/NewExam'></Redirect>
    }
  }

  showbutton=()=>{
    if(this.state.loggedin && this.state.is=="teacher"){
      return <Form inline>
      <NavLink to='/NewExam' activeClassName='active border-dark space' className='btn btn-primary'>Create Exam</NavLink>
      <NavLink to='/Schedule' activeClassName='active border-dark space' className='btn btn-primary'>Schedule</NavLink>
      <NavLink to='/StudentsResults' activeClassName='active border-dark space' className='btn btn-primary'>Result</NavLink>
      <Button className="border-dark" href='/login' onClick={()=>this.logout()} >logout</Button>
    </Form>;
    }else if(this.state.loggedin && this.state.is=="student") {
      return <Form inline>
      <NavLink to='/Result' activeClassName='active border-dark space' className='btn btn-primary'>Result</NavLink>
      <NavLink to='/Book' activeClassName='active border-dark space' className='btn btn-primary'>Book</NavLink>
      <Button className="border-dark" href='/login' onClick={()=>this.logout()} >logout</Button>
    </Form>;
    }else{
      return <></>;
    }
  }

  login=(ev)=>{
    ev.preventDefault();
    API.login(this.state.code,this.state.password)
    .then((c)=>{
          
          let code=[...this.state.code];
          const id=code[0];
          if(id=="s"){
            this.setState({code: c,is:'student',loggedin: true, errorlogin: '',password:''});
          }else if(id=="t"){
            this.setState({code: c, is:'teacher',loggedin: true, errorlogin: '',password:''});
          }

    }).catch(()=>this.setState({errlogin: 'inserted wrong username or password, type again your credential', password:'', code:''}));
    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = ""));
  }

  logout=()=>{
    API.logout().then(()=>{
      this.setState({code: '', loggedin: false, is:'', id:''}); 
    }).catch();
  }

  StudentOrProf=()=>{
    if(this.state.is=='teacher'){
      return <>
             <Route path='/NewExam'>
              <div className="container centered">
                  <ExamCreator className='col-6' code={this.state.code}  ></ExamCreator>
              </div>
            </Route>

            <Route path='/Schedule'>
              <div className="container centered">
              <Schedule code={this.state.code}></Schedule>
              </div>

            </Route>

            <Route path='/StudentsResults'>
              <div className="container centered">
                <StudentsResults exam={this.state.code}></StudentsResults>
              </div>
            </Route>

      </>
    }else if(this.state.is=='student'){
      return <>
              <Route exact path='/Book'>
                <div className="container centered" >
                 <Book  code={this.state.code}></Book>
                </div> 
              </Route>

            <Route path='/Booking/:call' render={({match})=><div className='container centered'><AllSlots  call={match.params.call} code={this.state.code}></AllSlots></div>}></Route>

            <Route path='/Result'>
              <div className="container centered">
                  <Results code={this.state.code}></Results>
              </div>
            </Route>
      </>
    }
  }

  render(){
    return (

      <Router>
              <Navbar bg="primary shadow fixed-top">
                <Navbar.Brand>
                  <img
                    src="./img/booking.png"
                    width="35"
                    height="35"
                    className="d-inline-block align-top sticky-top"
                    alt="not"
                  ></img>{''} Exam Scheduler   
                </Navbar.Brand>
                {this.showbutton()} 
              </Navbar>
            <Switch>
            <Route  path='/login'>
               <div className="container centered">
                {this.showLogin()}
                </div>
             </Route>

              {this.StudentOrProf()}

             <Route exact path='/'>
              <Redirect to='/login'></Redirect>
            </Route>

            </Switch>
        

      </Router>

);
}
}

class LoginForm extends React.Component{
  constructor(props){
    super(props);
  }

  

  render(){
   
    return(<>
     
      <Container className="col-6 col-md-auto shadow-lg p-3 mb-5 bg-primary rounded topspace">      
                <h5 >Teacher</h5>
                <p></p>
                <Form className="container" onSubmit={(ev)=>this.props.login(ev)}>
                    <Form.Group controlId="Tloginform">
                    <Form.Label  >Teacher id</Form.Label>
                    <p></p>
                    <Form.Control required  type="text" placeholder="Teacher id" name="code" value={this.code}
                    onChange={(ev)=>this.props.updatefield(ev.target.name, ev.target.value)}/>
                    <p></p>
                    <Form.Label>Password</Form.Label>
                    <p></p>
                    <Form.Control required  type="password" placeholder="Password" name="password" value={this.password} 
                    onChange={(ev)=>this.props.updatefield(ev.target.name, ev.target.value)}/>
                    <p></p>
                    </Form.Group>
                    <Button variant="info" type="submit" className="contain"> Login</Button>
                    <p></p>
                    <FormText className="redtext" >{this.props.errlogin}</FormText>
                  
                </Form>
          
          </Container>

          <h5 className="leftspace">or</h5>

          <Container className="col-6 col-md-auto shadow-lg p-3 mb-5 bg-primary rounded topspace">
            <h5>Student</h5>
            <Form className="container" onSubmit={(ev)=>{this.props.login(ev)}}>
            <Form.Group controlId="Sloginform">
            <Form.Label  >Student id</Form.Label>
            <Form.Control required type="text" placeholder="Student id" name="code" value={this.code}
                    onChange={(ev)=>this.props.updatefield(ev.target.name, ev.target.value)}/>
            </Form.Group>
            <Button variant="info" type="submit" className="contain" > Login</Button>
            <FormText className="redtext" >{this.props.errlogin}</FormText>
            </Form>
            
          </Container>
          
    </>
    );
  }

}


class ExamCreator extends React.Component{
  constructor(props){
    super(props);
    this.state={students:[], number:0, selected:[], slots:'0', disabled:true, day:'', duration:0, allslots:0, session:[],time:'', missing:0, msg:''};
  }

  addStudent=(student)=>{
    
    this.setState({selected:[...this.state.selected, student] ,number:this.state.number+1, msg:''});

  }

  updatefield=(name, value)=>{
    this.setState({[name]: value});
  }

  addsession=(ev)=>{
    ev.preventDefault();
    let day= new Date(this.state.day);
    let duration= this.state.duration;
    var slots= this.state.slots;
    let time=this.state.time.split(':');
    day.setHours(time[0]);
    day.setMinutes(time[1]);
    let session=[];
    let start=(day.getTime()); 
    let tmp;
    for(let i=0; i<slots; i++){
        tmp={
          code:this.props.code,
          date:new Date(start),
          duration:duration
        };
        session.push(tmp);
        start=(start+(duration*60000));
    }
    var s=this.state.allslots;
    this.setState({session:[...this.state.session, ...session], day:'', duration:0, slots:0, time:'', allslots:+s+ +slots});
    let miss=this.state.number-s-slots;
    if(miss<= 0){
      this.setState({disabled:false});
    }
    this.setState({missing:+miss});

    Array.from(document.querySelectorAll("input")).forEach(
      input => (input.value = ""));

  }

    sendsession=(ev)=>{
      ev.preventDefault();
      API.sendsession(this.state.session).then((call)=>{
        API.sendstudents(this.state.selected, call).then(()=>{
          this.setState({number:0, missing:0, selected:[], slots:0, disabled:true, day:'', duration:0, allslots:0, session:[],time:'', msg:'Session added'});
        }).catch();
        
      }).catch();
      
     
    
    }
  

  componentDidMount(){
    API.getAllStudent(this.props.code).then((s)=>{
      if(s){
        this.setState({students:s});
      }else{
        this.setState({students:{name:'all student done the exam', surname:' well done', code: -6005}});
      }
    }).catch(()=>this.setState({error:true, msg:'Error occurred'}));
  }

  render(){

    return (<>
       
        {this.state.students.map((student)=><StudentCard key={student.code} student={student} addStudent={this.addStudent}>
                                              </StudentCard>)}
    
    <h4 className='container centered'>Number of Selected Student: {this.state.number} </h4>
    <h4 className='container centered'>Missing slots:{this.state.missing}</h4>

        <Container className="col-9 col-md-auto shadow-lg p-3 mb-5 bg-primary rounded topspace">      
                <h5 >Time and Date detail</h5>
                <p></p>
                <Form className="container" onSubmit={(ev)=>this.addsession(ev)}>
                    <Form.Label> Duration in Minutes</Form.Label>      
                    <Form.Control required type='number' placeholder='0' name='duration' value={this.duration}  onChange={(ev)=>this.updatefield(ev.target.name, ev.target.value)}></Form.Control>
                    <Form.Label> Date</Form.Label>      
                    <Form.Control required type='date' placeholder='gg/mm/aa' name='day' value={this.day}  onChange={(ev)=>this.updatefield(ev.target.name, ev.target.value)}></Form.Control>
                    <Form.Label> Time Begin</Form.Label>      
                    <Form.Control required type='time' placeholder='00:00' name='time' value={this.time}  onChange={(ev)=>this.updatefield(ev.target.name, ev.target.value)}></Form.Control>
                    
                    <Form.Label> Number of Slots</Form.Label>      
                    <Form.Control required type='number' placeholder='0' name='slots' value={this.slots}  onChange={(ev)=>this.updatefield(ev.target.name, ev.target.value)}></Form.Control>
                    
                    <Button  type='submit' variant='primary topspace'>Add Slots</Button>
                </Form>

                </Container>
        <Container className='col-1 bottomspace'>
                    <h5>{this.state.msg}</h5>
           <Button  variant="primary" disabled={this.state.disabled} onClick={(ev)=>this.sendsession(ev)}>Done!</Button>
        </Container>
        
        

    </>);
  }
}


class StudentCard extends React.Component{
  constructor(props){
    super(props);
    this.state={disable:false, text:'Select'};
  }
  update=()=>{
    this.props.addStudent(this.props.student.code);
    this.setState({disable:true, text:'Selected'});
  }
  render(){

    return(<Card className=' col-6 col-md-auto shadow-lg p-3 mb-5 rounded topspace' >
              <Card.Header>Serial Number:{this.props.student.code}</Card.Header>
              <Card.Body>
                <Card.Title><p>{this.props.student.name}</p> <p>{this.props.student.surname}</p> </Card.Title>                                                 
                <Button variant="primary" disabled={this.state.disable} onClick={()=>this.update()}>{this.state.text}</Button>
              </Card.Body>
            </Card>

    )
  }
}

class Book extends React.Component{
  constructor(props){
    super(props);
    this.state={exams:[], msg:'', error:false, selected:'', redirect:false};
  }

  redirectionTO=()=>{
    if(this.state.redirect){
      return <Redirect to={'/Booking/'+this.state.selected}></Redirect>
    }else{
      return <></>;
    }
  }

  allowRedirect=(ev,exam)=>{
    ev.preventDefault();
    this.setState({selected:exam, redirect:true});
  }

  componentDidMount(){
    API.getBookableExams(this.props.code).then((exams)=>{
      if(exams){
      this.setState({exams:[...exams]});
      }else{
        this.setState({msg:'you don\'t have bookable exams'});
      }
    }).catch(()=>this.setState({msg:'you don\'t have bookable exams ', error:true}));
  }
  

  render(){

    return(<>
                {this.redirectionTO()}
                <h4>{this.state.msg}</h4>

                {this.state.exams.map((exam)=><ExamCard key={exam.call}
                                                         examCall={exam.call} examName={exam.course} 
                                                         name={exam.name} surname={exam.surname}
                                                         allowRedirect={this.allowRedirect}></ExamCard>)}


    </>);
  }
}

function ExamCard(props){
 
    return<>
            
            <Card className=' col-6 col-md-auto shadow-lg p-3 mb-5 rounded topspace' >
              <Card.Header>Course Name:{props.examName}</Card.Header>
              <Card.Body>
                <Card.Title><p>Teacher:</p><p>{props.name}</p> <p>{props.surname}</p> </Card.Title>                                                 
                <Button variant="primary"  onClick={(ev)=>props.allowRedirect(ev, props.examCall)}>See Available Slots</Button>
              </Card.Body>
           </Card>
    
           </>
    
  
}

class AllSlots extends React.Component{
  constructor(props){
    super(props);
    this.state={slots:[], reserved:false};
  }

  bookSlot=(call, date)=>{
    
    API.bookSlot(call, date).then(()=>{
      this.setState({reserved:true});

    }).catch();

  }

  freeSlot=(call,date)=>{
    API.freeSlot(call, date).then(()=>{
      this.setState({bookForMe:false});
      this.setState({reserved:false});
    }).catch();
   
  }
  componentDidMount(){
    API.getAllSlots(this.props.call).then((slots)=>{
      this.setState({slots:[...slots]});
    }).catch();
  }

  reserve=()=>{
    this.setState({reserved:true});
  }

  render(){

    return(<>
          
          {this.state.slots.map((slot)=><SingleSlot key={slot.date}  duration={slot.duration} date={slot.date} exam={slot.call} mat={slot.mat} booked={slot.booked}
                                                   reserved={this.state.reserved} code={this.props.code} bookSlot={this.bookSlot} freeSlot={this.freeSlot} reserve={this.reserve}></SingleSlot>)}
    </>);
  }
}


class SingleSlot extends React.Component{
  constructor(props){
    super(props);
    this.state={BookedfromSomeoneElse: false, bookForMe:false, date:new Date(this.props.date)};
  }

  componentDidMount(){
    if(this.props.booked==1 && this.props.code!=this.props.mat){
      this.setState({BookedfromSomeoneElse:true});
    }else if(this.props.booked==1 && this.props.code==this.props.mat){
      this.setState({bookForMe:true});
      this.props.reserve();
    }
  }


  book=()=>{
    if(!this.props.reserved){
        this.setState({bookForMe:true});
        this.props.bookSlot(this.props.exam, this.props.date);
      }
    

  }

  free=()=>{
    this.setState({bookForMe:false});
    this.props.freeSlot(this.props.exam, this.props.date);
  }


  showbutton=()=>{

    if(this.state.BookedfromSomeoneElse){
      return <Button variant='secondary' disabled={true} >Slot busy</Button>
    }else if(!this.state.bookForMe){
      return <Button variant='primary' disabled={this.props.reserved} onClick={()=>this.book()}>Book</Button>
    }else if(this.state.bookForMe){
      return <Button variant='warning' onClick={()=>this.free()}>Cancel Booking</Button>
    }

  }



  render(){

    return(<>
              
              <Card className='col-6 col-md-auto shadow-lg p-3 mb-5 rounded topspace' >
              
              <Card.Body>
                <Card.Title>Date:<time>{this.state.date.toDateString()}</time> Time:<time>{this.state.date.toTimeString().replace('GMT+0200 (Ora legale dell’Europa centrale)', '')}</time>
                  <p>Duration: {this.props.duration+'   minutes'}</p>
                </Card.Title>                                                 
                {this.showbutton()}
              </Card.Body>
           </Card>
    </>);
  }
}

class Schedule extends React.Component{
  constructor(props){
    super(props);
    this.state={scheduled:[]};
  }

  componentDidMount(){
    API.getBookedSlot().then((slots)=>{
      this.setState({scheduled:[...slots]});
    }).catch();
  }

  updatevote=(mat,vote)=>{
    API.updatevote(mat, vote).then().catch();

  }

  render(){
    return(
            <>
            <div className='container centered'></div>
              {this.state.scheduled.map((slot)=><ScheduleSlot mat={slot.mat} date={slot.date} name={slot.name} surname={slot.surname} updatevote={this.updatevote}></ScheduleSlot>)}
            </>
    );
  }
}


class ScheduleSlot extends React.Component{
  constructor(props){
    super(props);
    this.state={date:new Date(this.props.date), vote:'none'};
  }

  setvote=(vote)=>{
    this.setState({vote: vote});
    this.props.updatevote(this.props.mat, vote);
  }

  render(){
    return(<>
          <Card className='col-6 col-md-auto shadow-lg p-3 mb-5 rounded'>
            <Card.Header>
            <time>Date:{'  '+this.state.date.toDateString()+' '}</time>
              <time>Time:{'  '+this.state.date.toTimeString().replace('GMT+0200 (Ora legale dell’Europa centrale)', '')}</time>
            </Card.Header>
            <Card.Body>
            <p>Name:{'  '+this.props.name}</p>
            <p>SurName:{'  '+this.props.surname}</p>
            <DropdownButton id="dropdown" title="Assign vote or Absence">
                <Dropdown.ItemText>Select </Dropdown.ItemText>
                <Dropdown.Item as="button" onClick={()=>{}}>Absent</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('fail')}>Fail</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('absent')}>Absent</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('withdraw')}>Withdraw</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('18')}>18</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('19')}>19 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('20')}>20 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('21')}>21 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('22')}>22 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('23')}>23 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('24')}>24 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('25')}>25 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('26')}>26 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('27')}>27 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('28')}>28 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('29')}>29 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('30')}>30 </Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=>this.setvote('30L')}>30L </Dropdown.Item>
              </DropdownButton>
              <Badge variant='primary'>Current: {this.state.vote} </Badge>
            </Card.Body>
          </Card>
    </>);
  }
}

class StudentsResults extends React.Component{

  constructor(props){
    super(props);
    this.state={students:[]};
  }

  componentDidMount(){
    API.getStudentsResults().then((students)=>{
      this.setState({students:[...students]});
    }).catch();
  }

  render(){

    return(

      <> 
        {this.state.students.map((student)=><SingleStudent key={student.mat}  student={student} date></SingleStudent>)}
      
      </>
    );

  }

}

function SingleStudent(props){

  if(props.student.booked){
    if(props.student.vote!=0){
        return <>
                <Card className='col-6 col-md-auto shadow-lg p-3 mb-5  rounded topspace'>
                  <Card.Body>
                    <p>Code:{props.student.mat} </p>
                    <p>Name:{'  '+props.student.name}</p>
                    <p>SurName:{'  '+props.student.surname}</p>
                    <p>Oral done on{'   '}
                      <time>Date:{'     '+props.student.date+' '}</time>
                      <time>at Time:{'     '+props.student.time+' '}</time>
                    </p>
                    <p>Curent vote: {'  '+props.student.vote}</p>
                  </Card.Body>
          </Card>
              </>;
    }else{
      return <>
                 <Card className='col-6 col-md-auto shadow-lg  p-3 mb-5 rounded topspace'>
                  <Card.Body>
                    <p>Code: {props.student.mat}</p>
                    <p>Name:{'  '+props.student.name}</p>
                    <p>SurName:{'  '+props.student.surname}</p>
                    <p>Oral will be performed in {'   '}
                      <time>Date:{'     '+props.student.date+' '}</time>
                      <time>at Time:{'     '+props.student.time+' '}</time>
                    </p>
                    
                  </Card.Body>
                 </Card>
            </>;
    }
  }else if(props.student.booked==0){
    return <>
            <Card className='col-6 col-md-auto shadow-lg p-3 mb-5 rounded topspace'>
                  <Card.Body >
                    <p>Code: {props.student.mat}</p>
                    <p>Name:{'  '+props.student.name}</p>
                    <p>SurName:{'  '+props.student.surname}</p>
                    <p>Not yet booked</p>
                  </Card.Body>
                 </Card>
          </>;
  }
}

class Results extends React.Component{

  constructor(props){
    super(props);
    this.state={exams:[]};
  }

  freeSlot=(call,date)=>{
    API.freeSlot(call, date).then(()=>{
      this.setState({exams:this.state.exams.filter(exam=>exam.call!=call)});
    }).catch();
  }

  componentDidMount(){
    API.getResults()
    .then((exams)=>this.setState({exams:[...exams]}))
    .catch();
  }

  render(){

    return(<>
            {this.state.exams.map((exam)=><SingleExam key={exam.call} exam={exam} freeSlot={this.freeSlot}></SingleExam>)}
    </>);
  }

  
}

class SingleExam extends React.Component{
  
  constructor(props){
    super(props);
    if(this.props.exam.vote==0){
      this.state={date:new Date(this.props.exam.date), show:true};
    }else
      this.state={show:true};
  }

 
  render(){
    if(this.props.exam.vote!='0'){
      return <Card className='col-6 col-md-auto shadow-lg p-3 mb-5 rounded topspace'>
                <Card.Header>{this.props.exam.course}</Card.Header>
                <Card.Body>
                    <Card.Title>
                      your current vote:{this.props.exam.vote}
                    </Card.Title>
                </Card.Body>
             </Card>
    }else{
      return  <Card  className='col-6 col-md-auto shadow-lg p-3 mb-5 rounded topspace' >
              
                <Card.Header>{this.props.exam.course}</Card.Header>
                <Card.Body>
                  <Card.Title><p>You booked a slot in</p>
                    Date:<time>{this.state.date.toDateString()}</time> 
                    Time:<time>{this.state.date.toTimeString().replace('GMT+0200 (Ora legale dell’Europa centrale)', '')}</time>
                    <p>Duration: {this.props.exam.duration+'   minutes'}</p>
                  </Card.Title>                                                 
                  <Button variant='warning' onClick={()=>this.props.freeSlot(this.props.exam.call, this.props.exam.date)}>Cancel Booking</Button>
                </Card.Body>
              </Card>
    }
  }

}
export default App;