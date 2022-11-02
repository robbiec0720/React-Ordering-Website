import React from 'react';
import './FoodItem.css';
const FoodItem = ({ food }) => {
    const { name, price, img } = food;
    return (
        <div className='grid-item'>
            <div>
                <img src={img} height="100px" width="100px" alt="" />
            </div>
            <div className="desc">
                <p className='name'>{name}</p>
                <p>${price}</p>
            </div>
            <button className='order-btn'>Order Now</button>
        </div>
    );
};

export default FoodItem;