import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import './PaymentModal.css'
import { FaTimes } from 'react-icons/fa'
import { ThemeContext } from '../../App';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    background: '#e4e7eb',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const customStylesDark = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    background: 'black',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const PaymentModal = ({ modalIsOpen, afterOpenModal, closeModal, cart, setCart, employee }) => {
  const [showInput, setShowInput] = useState(false);
  const [cashInput, setCashInput] = useState(0.0);

  const user = JSON.parse(localStorage.getItem("user"))
  const handleClick = async (payment_type) => {
    console.log("Order Button Clicked with value " + payment_type + "Employee ID = " + employee)
    try {
      if (payment_type === 0) {
        setShowInput(true)
      } else {
        const response = await fetch('https://project3-api.onrender.com/order/submit?id=' + employee + '&type=' + payment_type + '&payment=20.00', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();

        closeModal()
        setShowInput(false)
        setCart([]);
        console.log('result is: ', JSON.stringify(result, null, 4));
      }

      // openModal()
    } catch (err) {
      console.log(err)
    }

    // closeModal();
  };
  const handleAmount = (e) => {
    e.preventDefault()
    setShowInput(false)
    closeModal()
    setCart([]);
  }

  const handleCashSubmit = async (event) => {
    event.preventDefault();
    console.log(cashInput);

    const url = 'https://project3-api.onrender.com/order/submit?id=' + employee + '&type=0&payment=' + cashInput;
    console.log(url)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();

      closeModal();
      setShowInput(false);
      setCart([]);
      console.log('result is: ', JSON.stringify(result, null, 4));


      // openModal()
    } catch (err) {
      console.log(err)
    }
  }

  const updateInput = (event) => {
    setCashInput(event.target.value);
  }

  const { theme } = useContext(ThemeContext)
  return (
    <div>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={theme === 'light' ? customStyles : customStylesDark}
        contentLabel="Example Modal"
      >
        <div>
          {
            showInput ?
              <form onSubmit={handleAmount} className='form-cash-style'>
                <p>Cash Payment</p>
                <input onChange={updateInput} className='cash-input-style' type="number" step="0.01" id="amount" placeholder='Enter The Amount' />
                <input onClick={handleCashSubmit} className='cash-amount-btn' type="submit" value="Confirm" />
                <button onClick={() => setShowInput(false)} className='cash-amount-btn'>Cancel</button>
              </form>
              :
              <>
                {
                  user ?
                    <div className='modal-style'>
                      <div onClick={() => handleClick(1)} className="modal-item">Card</div>
                      <div onClick={() => handleClick(0)} className="modal-item">Cash</div>
                      <div onClick={() => handleClick(2)} className="modal-item">Dining Dollars</div>
                    </div>
                    :
                    <div className='modal-style-not-user'>
                      <div onClick={() => handleClick(1)} className="modal-item">Card</div>

                      <div onClick={() => handleClick(2)} className="modal-item">Dining Dollars</div>
                    </div>
                }
              </>
          }

        </div>
        <button onClick={closeModal} className='close-btn'><FaTimes /></button>
      </Modal>
    </div>
  );
};

export default PaymentModal;