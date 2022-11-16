import React, { useEffect, useState } from 'react';
import './EmployeePage.css';
import FoodItem from './FoodItem';
import { useNavigate } from "react-router-dom";

const EmployeePage = () => {
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotal] = useState([]);

    useEffect(() => {
        fetch('foods.json')
            .then(res => res.json())
            .then(result => setFoods(result));


    }, [])

    const clearCart = () => setCart([]);

    const removeFromCart = item => {
        console.log(cart);
        console.log(cart.indexOf(item));
        setCart(cart => cart.filter((_, i) => cart[i] !== item));
    }

    const getTotalCost = (productList) => {
        return productList.reduce((totalCost, { cost: itemCost }) => totalCost + parseFloat(itemCost), 0);
    };

    const handleClick = async () => {
        console.log("Order Button Clicked")
        try {
            const response = await fetch('https://project3-api.onrender.com/order/submit?id=1&type=0&payment=20.00', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('result is: ', JSON.stringify(result, null, 4));

        } catch (err) {
            console.log(err)
        }
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
                    <h3>Current Orders</h3>
                    <h4>Total Items</h4>
                    {cart.map((product) => {
                        return (
                            <div key={product.id} className='total-items'>
                                <button  id="cart-item" className='item-name' onClick={() => removeFromCart(product)}>{product.name} ${product.price} x{product.count}</button>
                            </div>
                        )
                    })}


                    <div className='total-items'>
                        <h4>Total Price: ${cart.reduce((total, item) => total + Math.round(parseFloat(item.price) * 100) / 100, 0)}</h4>
                    </div>


                </div>
                <div className='submit-div'>
                    <button className='logout-btn' onClick={handleClick}>Submit Order</button>
                    <button className='logout-btn'>Edit Order</button>
                    <button className='logout-btn' onClick={clearCart}>Clear Order</button>
                    <button className='logout-btn' onClick={() => navigate('../')}>Logout</button>
                </div>
            </div>
        </div>
    );
};
export default EmployeePage;