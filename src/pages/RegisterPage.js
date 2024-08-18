import React, { useState } from 'react'
import { registerUser } from '../context/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username,setUsername]= useState("");
    const [password,setPassword]= useState("");
    const [email,setEmail]= useState("");
    const navigate= useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
          const response = await registerUser({ username, email, password });
          console.log('API response:', response); 
        //   localStorage.setItem('token', response.token);
          navigate('/login');
        }catch (error) {
          console.log('Registration error:', error);
        }
    }
  return (
    <div>
      <form onSubmit={handleSubmit} >
        <input type='email' value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Enter Email'></input>
        <input type='text' value={username} onChange={(e)=> setUsername(e.target.value)} placeholder='Enter Username'></input>
        <input type='password' value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Enter Password'></input>
        <button type='submit' >Register </button>
      </form>
    </div>
  )
}

export default Register;
