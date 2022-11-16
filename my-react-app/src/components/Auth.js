import React from "react"
import "../App.css"

import { useNavigate } from "react-router-dom";

const Auth = () =>{
    const navigate= useNavigate();
  return (
    <div id="Nav Page">
      <div className="container">
    
      <div id="nav-page-content">
        <div className="nav-left">
        <h1 class="chickFont">Welcome to Chick-fil-a</h1>
        <h1>Get our Spicy Chicken Sandwich</h1>
        <h3>Subheading with some kind of company announcement. This should be two or more lines.</h3>
        <button className="nav-page-button" onClick={() => navigate('/customer')}>Browse Menu</button>
      <button className="nav-page-button" onClick={() => navigate('/customer')}>Submit an Order</button>
      
      </div>
      <div className="nav-right">
      <img id="nav-page-main-image"src="CFASpicySandwich.png" alt="Chick-fil-a spicy sandwich"/>
      </div>
      </div>
      </div>
      </div>
    
  );
  };
  export default Auth;
