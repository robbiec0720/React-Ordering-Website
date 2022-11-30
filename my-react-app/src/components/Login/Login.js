
import React, { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../../utils/refreshToken';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const clientId = '1061498518280-61io1snf32r4vai9ghighvuio2b2n30r.apps.googleusercontent.com';

const Login = () => {
  // Terrible sphaghetti code, will fix later
  const onSuccess = (res) => {
    console.log("Login success");
    const email = res.profileObj.email.replace('@', '%40');
    const googleID = res.profileObj.googleId;

    refreshTokenSetup(res);

    const idRequest = 'https://project3-api.onrender.com/employee/getID?email=' + email;
    let employeeID = -1
    fetch(idRequest, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      response.json().then(json => {
        employeeID = parseInt(json);
      })
    })

    const loginRequest = 'https://project3-api.onrender.com/login?name=' + email + '&id=' + googleID;
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
        if (parseInt(json) == 2) {
          localStorage.setItem("user", JSON.stringify({ username: email, password: googleID, role: "manager" }))
        }
        else if (parseInt(json) == 1) {
          localStorage.setItem("user", JSON.stringify({ username: email, password: googleID, role: "employee" }))
        }
        if (parseInt(json) == 1 || parseInt(json) == 2) {
          navigate('../employee', {
            state: {
              employeeID: employeeID,
              managerStatus: parseInt(json)
            }
          });
        }
      })
    })


  };

  const onFailure = (res) => {
    console.log("Login failure");
    console.log(res);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target.elements.username.value) // from elements property
    // console.log(event.target.username.value)    
    // or directly
    const username = event.target.username.value
    const password = event.target.password.value
    // if (username && password) {
    //   localStorage.setItem("user", JSON.stringify({ username: username, password: password, role: "manager" }))
    // }

    // console.log(event.target.password.value) // from elements property
    // console.log(event.target.username.value)          // or directly

    const idRequest = 'https://project3-api.onrender.com/employee/getID?email=' + event.target.username.value;
    const encodedIDRequest = idRequest.replace('@', '%40');
    let employeeID = -1
    fetch(encodedIDRequest, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      response.json().then(json => {
        employeeID = parseInt(json);
      })
    })

    const loginRequest = 'https://project3-api.onrender.com/login?name=' + event.target.username.value.replace('@', '%40') + '&id=' + event.target.password.value;
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
        if (parseInt(json) == 2) {
          localStorage.setItem("user", JSON.stringify({ username: username, password: password, role: "manager" }))
        }
        else if (parseInt(json) == 1) {
          localStorage.setItem("user", JSON.stringify({ username: username, password: password, role: "employee" }))
        }
        if (parseInt(json) == 1 || parseInt(json) == 2) {
          navigate('../employee', {
            state: {
              employeeID: employeeID,
              managerStatus: parseInt(json)
            }
          });
        }
      })
    })

  }

  const navigate = useNavigate();
  return (
    <div>
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
      <div>

      </div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
};

export default Login;