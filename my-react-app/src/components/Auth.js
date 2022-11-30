import React, { useContext } from "react"
import "../App.css"
//import { useLazyTranslate } from 'react-google-translate'
import { useNavigate } from "react-router-dom";
import { LangContext } from "../App";

const Auth = () => {
  const navigate = useNavigate()
  const { lang } = useContext(LangContext)
  const API_KEY = 'AIzaSyANYWkU1YhvNE5flUIvzJv8g-y0KCHva-0';
  let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  url += '&q=' + encodeURI('Hello');
  url += `&source=${'en'}`;
  url += `&target=${lang}`;

  fetch(url, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then((response) => {
      console.log("response from google: ", response);
    })
    .catch(error => {
      console.log("There was an error with the translation request: ", error);
    });

  return (
    <div id="Nav Page">
      <div className="container">

        <div id="nav-page-content">
          <div className="nav-left">
            <h1 class="chickFont">{lang}</h1>
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
