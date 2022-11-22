import React, { useEffect, useState } from 'react';
import './EmployeePage.css';
import FoodItem from './FoodItem';
import { useNavigate } from "react-router-dom";
import PaymentModal from './PaymentModal';
//import Popup from 'reactjs-popup';


const CustomerPage = () => {
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotal] = useState([]);

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
    }, [])

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    const clearCart = () => {
        cart.forEach((element) => element["count"] = 0)
        setCart([]);
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
        if (item["count"] == 0) {
            console.log(item == cart[0]);
            setCart(cart => cart.filter((_, i) => cart[i] !== item));
        }

        console.log(cart);
    }

    // const handleClick = async () => {
    //     console.log("Order Button Clicked")
    //     try {
    //         const response = await fetch('https://project3-api.onrender.com/order/submit?id=1&type=0&payment=20.00', {
    //             method: 'POST',
    //             headers: {
    //                 Accept: 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error! status: ${response.status}`);
    //         }

    //         const result = await response.json();

    //         console.log('result is: ', JSON.stringify(result, null, 4));
    //         openModal()
    //     } catch (err) {
    //         console.log(err)
    //     }
    // };

    return (
        <div className='employee-page-style'>
            <div className='sub-employee-one'>
                {
                    foods?.map(food => <FoodItem key={food.id} food={food} cart={cart} setCart={setCart}></FoodItem>)
                }
            </div>
            <div className='sub-employee-two'>
                <div className='selected-items-style'>
                    <h3>Current Orders</h3>
                    <h4>Total Items</h4>
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
                        <h4>Total Price: ${round(cart.reduce((total, item) => total + parseInt(item.count) * parseFloat(item.price), 0), 2)}</h4>
                        {/* <h4>Total Price: ${getTotalCost(cart)}</h4> */}
                    </div>
                </div>
                <div className='submit-div'>
                    <button className='logout-btn' onClick={openModal}>Dine-In</button>
                    <button className='logout-btn' onClick={clearCart}>Clear Order</button>
                    <button className='logout-btn' onClick={() => navigate('../')}>Deliver</button>
                </div>
            </div>
            <PaymentModal openModal={openModal} modalIsOpen={modalIsOpen} afterOpenModal={afterOpenModal} closeModal={closeModal} cart={cart} setCart={setCart}></PaymentModal>
        </div>
    );
};
export default CustomerPage;