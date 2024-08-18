import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../styling/home.css'

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        navigate('/register');
    };

    return (
      <div className="home-container">
        <div className="home-content">
            <h1>Welcome to Task Manager</h1>
            <p>Manage your tasks efficiently and collaborate with your team seamlessly.</p>
            <div className="buttons">
                <button className="btn register-btn" onClick={handleRegister}>Register</button>
                <button className="btn login-btn" onClick={handleLogin}>Login</button>
            </div>
        </div>
    </div>
    );
  };


export default Home;
