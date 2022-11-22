
import React from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target.elements.username.value) // from elements property
    // console.log(event.target.username.value)          // or directly
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
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name = "password"
            className="login-input"
            placeholder="Password"
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