import React from 'react';
import './FoodItem.css';
const FoodItem = ({ food, cart, setCart }) => {
  var condiments = [26, 27]
  const { id, name, price, img, count } = food;
  const url = 'https://project3-api.onrender.com/order/add/' + id.toString()
  //const encodedID = encodeURIComponent(id);
  const handleClick = async () => {
    await fetch(url, {
      method: 'GET',
      headers: {
          Accept: 'application/json',
      },
    });

    if (cart.includes(food)) {
      cart[cart.indexOf(food)]["count"] += 1;
      setCart([...cart]);
    }
    else {
      food.count += 1;
      setCart([...cart, food]);
    }
    console.log(cart);
  };

  return (
    <div className='grid-item'>
      <div>
        <img src={img} height="100px" width="100px" alt="" />
      </div>
      <div className="desc">
        <p className='name'>{name}</p>
        <p>${price}</p>
      </div>
      <button className='order-btn' onClick={handleClick}>Order Now</button>
    </div>
  );
};
export default FoodItem;