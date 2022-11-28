
import React from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target.elements.username.value) // from elements property
    // console.log(event.target.username.value)    
          // or directly
          const username = event.target.username.value
          const password = event.target.password.value
          if(username && password){
            localStorage.setItem("user", JSON.stringify({username: username, password: password, role: "manager"}))
          }
    navigate('../employee');
  }

  const navigate = useNavigate();
  return (
    <form onSubmit={handleSubmit} className="Auth-form">
      <div className="Auth-form-content">
        <h3 className="Auth-form-title">If you're an Employee or a Manager: Sign In</h3>
        <div className="form-group">
          <input
            className="login-input"
            name = "username"
            placeholder="Your name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name = "password"
            className="login-input"
            placeholder="Password"
            required
          />
        </div>
        <div className="">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;