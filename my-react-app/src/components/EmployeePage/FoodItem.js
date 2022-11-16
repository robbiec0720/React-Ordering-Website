import React from 'react';
import './FoodItem.css';
const FoodItem = ({ food, cart, setCart }) => {
  var condiments = [26, 27]
  const { id, name, price, img } = food;
  // const url = 'https://project3-api.onrender.com/order/add/' + id.toString()
  //const encodedID = encodeURIComponent(id);
  const handleClick = async () => {
    setCart([...cart, id])

    // try {
    //   const response = await fetch(url, {
    //     method: 'GET',
    //     headers: {
    //       Accept: 'application/json',
    //     },
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Error! status: ${response.status}`);
    //   }

    //   const result = await response.json();

    //   console.log('result is: ', JSON.stringify(result, null, 4));
    // } catch (err) {
    //   console.log(err)
    // }
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