import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
import '../Components/Styles/login.css'
import { ChatState } from '../context/chatProvider';
function Login() {
  const {
    wantLogin,
    setWantLogin,
  }=ChatState();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate=useNavigate();
  async function login(e){
    if(!email || !password){
      alert('Please fill all the fields')
      return
    }
    e.preventDefault()
    const loginData = {
      email,
      password
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try{
      const { data }=await axios.post(
        'http://localhost:5000/api/user/login',loginData,config)
        .catch((error)=>{
          console.log(error);
        });
        console.log(data);
        if(data.banned==true){
          alert('You are banned from the website');
          return;
        }
        sessionStorage.setItem('userInfo',JSON.stringify(data));
        navigate('/home');
    }
    catch(e){
      console.log(e)
      alert('Invalid Credentials')
    }
  }
  // function goToSignupPage() {
  //   navigate('/SignUp')
  // }
  return (
    <div className='box'>
      <div className='containerLogin'>
        <div className='first'>
          <div className="header1">
            <div className="position1">Welcome,</div>
            <div className="position2">Login to access the website</div>
          </div>
        </div>
        <div className='second'>
          <div className="header">
            <div className="position">Login</div>
          </div>
          <div className='inputs'>
            <div className='input'>
              <input type="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email'/>
            </div>
            <div className='input'>
              <input type="password" onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'/>
            </div>
            <div className='switch' >Don't have an account? 
              <span onClick={()=>{setWantLogin(!wantLogin);navigate('./signup')}}>  Sign Up</span>
            </div>
            <div className='button'>
              <input type="submit" value="Login" onClick={login}/>
            </div>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Login
