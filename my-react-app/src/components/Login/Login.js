
import React from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    return (
    <form className="Auth-form">
        <div className="Auth-form-content">
  <h3 className="Auth-form-title">If you're an employee or a Manager: Sign In</h3>
  <div className="form-group">
    <input
      className="login-input"
      placeholder="Your name"
    />
  </div>
  <div className="form-group">
    <input
      type="password"
      className="login-input"
      placeholder="Password"
    />
  </div>
  <div className="">
    <button type="submit" className="submit-button" onClick={() => navigate('/employee')}>
      Submit
    </button>
  </div>
</div>
</form>
    );
};

export default Login;