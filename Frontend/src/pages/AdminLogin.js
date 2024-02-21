import React, {useState} from 'react';
import logo from './../images/admin.jpg';
import './../css/AdminLogin.css';

const AdminLogin = () => {
    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');

    const handleLogin = () => {
        if (username === '' || password === '') {
            alert('Please enter Username and password');
            return;
        }

        if (username === 'admin' || password === 'password') {
            alert('Login successful!');
        } else {
            alert('Invalid username, password, or OTP');
        }
    };

    return (
        <div className="container">
          <div className="login-container">
            <img src={logo} alt="Admin Logo" className="admin-logo" />
            <input type="text" placeholder="UserName" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      );
};

export default AdminLogin;