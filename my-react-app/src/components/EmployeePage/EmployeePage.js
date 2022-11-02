import React, { useEffect, useState } from 'react';
import './EmployeePage.css';
import FoodItem from './FoodItem';
const EmployeePage = () => {
    const [foods, setFoods] = useState([]);
    useEffect(()=>{
        fetch('foods.json')
        .then(res => res.json())
        .then(result =>  setFoods(result));
    }, [])
    console.log(foods);
    return (
        <div className='employee-page-style'>
            <div className='sub-employee-one'>
                {
                    foods?.map(food => <FoodItem key={food.id} food={food}></FoodItem>)
                }
            </div>
            <div className='sub-employee-two'>
                <div className='selected-items-style'>
                    <h3>Current Orders</h3>
                    <div className='total-items'>
                        <h4>Total Items</h4>
                        <p className='item-name'>Mac & Cheese</p>
                        <p className='item-name'>Chick-Fil-A Lemonade</p>
                    </div>
                    <div className='total-items'>
                        <h4>Total Price: $15.99</h4>
                    </div>
                </div>
                <div className='submit-div'>
                    <button className='logout-btn'>Submit Order</button>
                    <button className='logout-btn'>Edit Order</button>
                </div>
            </div>
        </div>
    );
};

export default EmployeePage;