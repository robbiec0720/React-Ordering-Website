import React, { useContext, useEffect, useState } from 'react';
import './EmployeePage.css';
import FoodItem from './FoodItem';
import { useNavigate } from "react-router-dom";
import PaymentModal from './PaymentModal';
<<<<<<< HEAD
import { LangContext, PrevLangContext } from '../../App';
=======
import MapModal from'./MapModal';
>>>>>>> umaSprint3
//import Popup from 'reactjs-popup';


const CustomerPage = () => {
<<<<<<< HEAD
    const navigate = useNavigate()
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [foods, setFoods] = useState([])
    const [cart, setCart] = useState([])
    //const [totalPrice, setTotal] = useState([])
    const [order, setOrder] = useState('Current Order')
    const [item, setItem] = useState('Total Items')
    const [sub, setSub] = useState('Subtotal')
    const [price, setPrice] = useState('Total Price')
    const [dine, setDine] = useState('Dine-In')
    const [clear, setClear] = useState('Clear Order')
    const [deliv, setDeliv] = useState('Delivery')

    let subtitle
    const [modalIsOpen, setIsOpen] = React.useState(false)
=======
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotal] = useState([]);

    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [mapmodalIsOpen, setMapIsOpen] = React.useState(false);
>>>>>>> umaSprint3

    function openModal() {
        setIsOpen(true)
    }
    function openMap(){
      setMapIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00'
    }

    function closeModal() {
        setIsOpen(false)
    }
    function closeMapModal() {
      setMapIsOpen(false);
  }

    useEffect(() => {
        fetch('foods.json')
            .then(res => res.json())
            .then(result => setFoods(result))
        let t = [order, item, sub, price, dine, clear, deliv]
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
                setOrder(split[0])
                setItem(split[1])
                setSub(split[2])
                setPrice(split[3])
                setDine(split[4])
                setClear(split[5])
                setDeliv(split[6])
            })
        }
    }, [prevLang, lang, order, item, sub, price, dine, clear, deliv])

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
    }

    const clearCart = async () => {
        cart.forEach((element) => element["count"] = 0)
        setCart([])
        console.log('Order Cleared')
        await fetch('https://project3-api.onrender.com/order/clear', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
    }

    const removeFromCart = async item => {
        console.log(cart.indexOf(item))
        const url = 'https://project3-api.onrender.com/order/remove/' + item.id.toString()

        if (item["count"] >= 1) {
            item["count"]--
            setCart([...cart])
        }
        if (item["count"] == 0) {
            console.log(item == cart[0])
            setCart(cart => cart.filter((_, i) => cart[i] !== item))
        }
        await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })

        console.log(cart)
    }

    const handleClick = async () => {
        console.log("Order Button Clicked")
        openModal()
    };

    return (
        <div className='employee-page-style'>
            <div className='sub-employee-one'>
                {
                    foods?.map(food => <FoodItem key={food.id} food={food} cart={cart} setCart={setCart}></FoodItem>)
                }
            </div>
            <div className='sub-employee-two'>
                <div className='selected-items-style'>
                    <h3>{order}</h3>
                    <h4>{item}</h4>
                    {cart.map((product) => {
                        return (
                            <div key={product.id} className='total-items'>
                                <table id="item-table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <button id="cart-item" className='item-name' onClick={() => removeFromCart(product)}>{product.name}  </button>
                                            </td>
                                            <td><p id="cart-descriptor">${round(parseFloat(product.price) * parseInt(product.count), 2)}</p></td>
                                            <td><p id="cart-descriptor">x{product.count}</p></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}
                    <div className='total-items'>
                        <h4>{sub}: ${round(cart.reduce((total, item) => total + parseInt(item.count) * parseFloat(item.price), 0), 2)}</h4>
                        <h4>{price}: ${round((cart.reduce((total, item) => total + parseInt(item.count) * parseFloat(item.price), 0) * 1.0825), 2)}</h4>
                        {/* <h4>Total Price: ${getTotalCost(cart)}</h4> */}
                    </div>
                </div>
                <div className='submit-div'>
<<<<<<< HEAD
                    <button className='logout-btn' onClick={handleClick}>{dine}</button>
                    <button className='logout-btn' onClick={clearCart}>{clear}</button>
                    <button className='logout-btn' onClick={() => navigate('../')}>{deliv}</button>
                </div>
            </div>
            <PaymentModal openModal={openModal} modalIsOpen={modalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeModal} clearCart={clearCart} employee={0}></PaymentModal>
=======
                    <button className='logout-btn' onClick={openModal}>Dine-In</button>
                    <button className='logout-btn' onClick={clearCart}>Clear Order</button>
                    <button className='logout-btn' onClick={openMap}>Deliver</button>
                </div>
            </div>
            <PaymentModal openModal={openModal} modalIsOpen={modalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeModal} cart={cart} setCart={setCart}></PaymentModal>
            <MapModal openMap={openMap}modalIsOpen={mapmodalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeMapModal}></MapModal>
>>>>>>> umaSprint3
        </div>
    );
};
export default CustomerPage;