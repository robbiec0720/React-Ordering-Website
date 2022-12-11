import React, { useContext, useState, useEffect } from 'react'
import { LangContext, PrevLangContext, ThemeContext } from '../../App'
import './FoodItem.css'

const FoodItem = ({ food, cart, setCart }) => {
  const { id, name, price, img } = food
  const url = 'http://localhost:8081/order/add/' + id.toString()
  const { lang } = useContext(LangContext)
  const { prevLang } = useContext(PrevLangContext)
  const {theme} = useContext(ThemeContext)
  const [order, setOrder] = useState('Order Now')
  
  useEffect(() => {
    let text = order
    if (lang !== prevLang) {
      const API_KEY = 'AIzaSyANYWkU1YhvNE5flUIvzJv8g-y0KCHva-0'
      let trans_url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
      trans_url += '&q=' + encodeURI(text)
      trans_url += `&source=${prevLang}`
      trans_url += `&target=${lang}`
      let translated = new Promise(function (resolve, reject) {
        fetch(trans_url, {
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
        setOrder(result)
      })
    }
  }, [prevLang, lang, order])

  const handleClick = async () => {
    if (cart.includes(food)) {
      cart[cart.indexOf(food)]["count"] += 1
      setCart([...cart])
    }
    else {
      food.count += 1
      setCart([...cart, food])
    }
    await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
  }

  return (
    <div className={`${theme === 'light' && 'grid-item'} ${theme === 'dark' && 'grid-item-dark'} ${theme === 'highContrast' && 'grid-item-high-contrast'}`}>
      <div>
        <img src={img} height="100px" width="100px" alt="" />
      </div>
      <div className="desc">
        <p className='name'>{name}</p>
        <p>${price}</p>
      </div>
      <button className='order-btn' onClick={handleClick}>{order}</button>
    </div>
  )
}

export default FoodItem