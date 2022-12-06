import React, { useContext, useEffect, useState } from "react"
import "../App.css"
import { useNavigate } from "react-router-dom"
import { LangContext, PrevLangContext } from "../App"

const Auth = () => {
  const navigate = useNavigate()
  const { lang } = useContext(LangContext)
  const { prevLang } = useContext(PrevLangContext)
  const [spicy, setSpicy] = useState('Get our Spicy Chicken Sandwhich')
  const [welcome, setWelcome] = useState('Welcome to Chick-Fil-A')
  const [deliv, setDeliv] = useState('Send your loved ones Chick-fil-A for the holidays. Introducing order delivery.')
  const [btn, setBtn] = useState('Place an Order')

  useEffect(() => {
    let t = [spicy, welcome, deliv, btn]
    let text = t.join(';')
    if (lang !== prevLang) {
      const API_KEY = 'AIzaSyANYWkU1YhvNE5flUIvzJv8g-y0KCHva-0'
      let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
      url += '&q=' + encodeURI(text)
      url += `&source=${prevLang}`
      url += `&target=${lang}`
      let translated = new Promise(function (resolve, reject) {
        fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
          .then(res => res.json())
          .then((response) => {
            //console.log("response from google: ", response.data.translations[0].translatedText)
            resolve(response.data.translations[0].translatedText)
          })
          .catch(error => {
            if (lang !== 'en') {
              alert("There was an error during translation. Reverting back to English")
              window.location.reload(false)
            }
          })
      })
      translated.then((result) => {
        var split = result.split(';')
        console.log(split)
        setSpicy(split[0])
        setWelcome(split[1])
        setDeliv(split[2])
        setBtn(split[3])
      })
    }
  }, [prevLang, lang, spicy, welcome, deliv, btn])

  return (
    <div id="Nav Page">
      <div className="container">
        <div id="nav-page-content">
          <div className="nav-left">
            <h1 class="chickFont">{welcome}</h1>
            <h1>{spicy}</h1>
            <h2>{deliv}</h2>
            <button className="nav-page-button" onClick={() => navigate('/customer')}>{btn}</button>
          </div>
          <div className="nav-right">
            <img id="nav-page-main-image" src="CFASpicySandwich.png" alt="Chick-fil-a spicy sandwich" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
