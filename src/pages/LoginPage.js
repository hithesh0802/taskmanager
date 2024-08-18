import React from 'react'
import { loginUser } from '../context/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/login.css'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password });
            console.log('API response:', response, response.token);
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
        } catch (error) {
            console.log('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <input 
                    type='email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder='Enter Email' 
                    className="input-fil"
                    required
                />
                <input 
                    type='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder='Enter Password' 
                    className="input-fil"
                    required
                />
                <button type='submit' className="login">Login</button>
            </form>
        </div>
    );
};


export default Login;
