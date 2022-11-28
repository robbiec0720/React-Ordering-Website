
import React, { useEffect, useState } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [employee, setEmployee] = useState(-1);

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target.password.value) // from elements property
    // console.log(event.target.username.value)          // or directly
    const loginRequest = 'http://localhost:8081/login?name=' + event.target.username.value + '&id=' + event.target.password.value;
    fetch(loginRequest, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      response.json().then(json => {
        if (parseInt(json) == 1 || parseInt(json) == 2) {
          setEmployee(parseInt(event.target.password.value));
          navigate('../employee', {state: parseInt(event.target.password.value)});
        }
      })
    })

  }

  const navigate = useNavigate();
  return (
    <form onSubmit={handleSubmit} className="Auth-form">
      <div className="Auth-form-content">
        <h3 className="Auth-form-title">If you're an Employee or a Manager: Sign In</h3>
        <div className="form-group">
          <input
            className="login-input"
            name="username"
            placeholder="Your name"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
          />
        </div>
        <div className="">
          <button type="submit" className="submit-button">
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;