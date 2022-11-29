import React from "react"
import "../App.css"

import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  return (
    <div id="Nav Page">
      <div className="container">

        <div id="nav-page-content">
          <div className="nav-left">
            <h1 class="chickFont">Welcome to Chick-fil-a</h1>
            <h1>Get our Spicy Chicken Sandwich</h1>
            <h3>Send your loved ones Chick-fil-A for the holidays. Introducing order delivery!!!</h3>
            <button className="nav-page-button" onClick={() => navigate('/customer')}>Place an Order</button>

          </div>
          <div className="nav-right">
            <img id="nav-page-main-image" src="CFASpicySandwich.png" alt="Chick-fil-a spicy sandwich" />
          </div>
        </div>
      </div>
    </div>

  );
};
export default Auth;
