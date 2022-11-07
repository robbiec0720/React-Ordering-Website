import React from "react"
import "../App.css"

import { useNavigate } from "react-router-dom";

const Auth = () =>{
    const navigate= useNavigate();
  return (
    <div id="Nav Page">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="">
            <input
              className="input"
              placeholder="Your name"
            />
          </div>
          <div className="">
            <input
              type="password"
              className="form-control mt-1"
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
      <div id="nav-page-content">
        <div className="nav-left">
        <h1>Get our Spicy Chicken Sandwich</h1>
        <h3>Subheading with some kind of company announcement. This should be two or more lines.</h3>
        <button className="nav-page-button" onClick={() => navigate('/employee')}>Browse Menu</button>
      <button className="nav-page-button" onClick={() => navigate('/employee')}>Submit an Order</button>
      </div>
      <div className="nav-right">
      <img id="nav-page-main-image"src="CFASpicySandwich.png" alt="Chick-fil-a spicy sandwich"/>
      </div>
      </div>
      </div>
    
  );
  };
  export default Auth;
