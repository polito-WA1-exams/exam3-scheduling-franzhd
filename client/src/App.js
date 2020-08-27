import React from 'react';
import './App.css';
import API from './api';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Nav from 'react-bootstrap/Nav'
import {Switch} from 'react-router';
import {Redirect, Route,Link, NavLink} from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import FormText from 'react-bootstrap/esm/FormText';


class App extends React.Component{
  constructor(props){
    super(props);
    this.state={loggedin: false, user:'', errlogin:'', is:''};
  }

  updatefield=(name, value)=>{
    this.setState({[name]: value});
  }
  showLogin= ()=>{
    if (!this.state.loggedin) {
      return <LoginForm upadatefield={this.updatefield} 
      login={this.login} 
      user={this.state.user} 
      errlogin={this.state.errlogin}
      loggedin={this.state.loggedin}/>
    }else{
      return  <Redirect to='/Menu'></Redirect>;
    }
  }

  showbutton=()=>{
    if(this.state.loggedin){
      return <Form inline>;
      <Button className="border-dark" href='/login' onClick={()=>this.logout()} >logout</Button>
    </Form>;
    }else{
      return <></>;
    }
  }

  login=(ev)=>{
    ev.preventDefault();
    API.login(this.state.user,this.state.password)
    .then((u)=>{
          
          this.setState({user:u});
          const id=u.shift():
          this.setState({loggedin: true});
          this.setState({errorlogin: ''});   
    }).catch(()=>this.setState({errlogin: 'inserted wrong username or password'}));

  }

  logout=()=>{
    API.logout().then(()=>{
      this.setState({user: ''});
      this.setState({loggedin: false});
    }).catch();
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
                <Form className="container" onClick={(ev)=>ev.preventDefault()}>
                    <Form.Group controlId="Tloginform">
                    <Form.Label  >Teacher id</Form.Label>
                    <p></p>
                    <Form.Control type="text" placeholder="Teacher id" name="user" value={this.name}
                    onChange={(ev)=>this.props.upadatefield(ev.target.name, ev.target.value)}/>
                    <p></p>
                    <Form.Label>Password</Form.Label>
                    <p></p>
                    <Form.Control type="password" placeholder="Password" name="password" value={this.password} 
                    onChange={(ev)=>this.props.upadatefield(ev.target.name, ev.target.value)}/>
                    <p></p>
                    </Form.Group>
                    <Button variant="info" type="submit" className="contain" onClick={(ev)=>{this.props.login(ev)}}> Login</Button>
                    <p></p>
                    <FormText className="redtext" >{this.props.errlogin}</FormText>
                  
                </Form>
          
          </Container>

          <h5 className="leftspace">or</h5>

          <Container className="col-6 col-md-auto shadow-lg p-3 mb-5 bg-primary rounded topspace">
            <h5>Student</h5>
            <Form.Group controlId="Sloginform">
            <Form.Label  >Student id</Form.Label>
            <Form.Control type="text" placeholder="Student id" name="user" value={this.name}
                    onChange={(ev)=>this.props.upadatefield(ev.target.name, ev.target.value)}/>
            </Form.Group>
            <Button variant="info" type="submit" className="contain" onClick={(ev)=>{this.props.login(ev)}}> Login</Button>
            <FormText className="redtext" >{this.props.errlogin}</FormText>
          </Container>
          
    </>
    );
  }

}

export default App;
