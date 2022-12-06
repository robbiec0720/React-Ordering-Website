import React, { useEffect, useState, useContext } from 'react';
import './EmployeePage.css';
import FoodItem from './FoodItem';
import PaymentModal from './PaymentModal';
import { LangContext, PrevLangContext } from '../../App';
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from '@emotion/react';

const EmployeePage = () => {
    const navigate = useNavigate();
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [foods, setFoods] = useState([]);
    const [cart, setCart] = useState([]);
    //const [totalPrice, setTotal] = useState([]);
    const [employeeID] = useState(parseInt(useLocation().state["employeeID"]));
    //const [managerStatus, ManagerStatus] = useState(parseInt(useLocation().state["managerStatus"]));
    const [order, setOrder] = useState('Current Order')
    const [item, setItem] = useState('Total Items')
    const [sub, setSub] = useState('Subtotal')
    const [price, setPrice] = useState('Total Price')
    const [dine, setDine] = useState('Submit Order')
    const [clear, setClear] = useState('Clear Order')
    const [log, setLog] = useState('Logout')
    const { theme } = useContext(ThemeContext)
    console.log("Theme", theme)
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        fetch('foods.json')
            .then(res => res.json())
            .then(result => setFoods(result));
        let t = [order, item, sub, price, dine, clear, log]
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
                setLog(split[6])
            })
        }
    }, [prevLang, lang, order, item, sub, price, dine, clear, log])
    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    const clearCart = async () => {
        cart.forEach((element) => element["count"] = 0)
        setCart([]);
        await fetch('https://project3-api.onrender.com/order/clear', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });
    }

    const removeFromCart = async item => {
        console.log(cart.indexOf(item));
        const url = 'https://project3-api.onrender.com/order/remove/' + item.id.toString()
        await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (item["count"] >= 1) {
            item["count"]--;
            setCart([...cart]);
        }
        if (item["count"] === 0) {
            console.log(item === cart[0]);
            setCart(cart => cart.filter((_, i) => cart[i] !== item));
        }

        console.log(cart);
    }
    console.log(theme)
    return (
        <div className='employee-page-style'>
            <div className='sub-employee-one'>
                {
                    foods?.map(food => <FoodItem key={food.id} food={food} cart={cart} setCart={setCart}></FoodItem>)
                }
            </div>
            <div className='sub-employee-two'>
                <div className={`${theme === 'light' && 'selected-items-style'} ${theme === 'dark' && 'selected-items-style-dark'} ${theme === 'highContrast' && 'selected-items-style-high-contrast'}`}>
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
                    <button className='logout-btn' onClick={openModal}>{dine}</button>
                    {/* <button className='logout-btn'>Edit Order</button> */}
                    <button className='logout-btn' onClick={clearCart}>{clear}</button>
                    <button className='logout-btn' onClick={() => navigate('../')}>{log}</button>
                </div>
            </div>
            <PaymentModal openModal={openModal} modalIsOpen={modalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeModal} clearCart={clearCart} employee={employeeID}></PaymentModal>
        </div>
    );
};
export default EmployeePage;
