import React, { useContext } from 'react';
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
const PaymentModal = ({ modalIsOpen, afterOpenModal, closeModal, cost, clearCart}) => {

  const handleClick = async (payment_type) => {
    console.log("Order Button Clicked with Value: " + payment_type)
    const url = 'https://project3-api.onrender.com/order/submit?id=1&type=' + payment_type + '&payment=' + cost
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

      console.log('result is: ', JSON.stringify(result, null, 4));
      // openModal()
    } catch (err) {
      console.log(err)
    }
    // clearCart()
    closeModal()
  };

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
        <div className='modal-style'>
          <div onClick={() => handleClick(1)} className="modal-item">Card</div>
          <div onClick={() => handleClick(0)} className="modal-item">Cash</div>
          <div onClick={() => handleClick(2)} className="modal-item">Dining Dollars</div>
        </div>
        <button onClick={closeModal} className='close-btn'><FaTimes /></button>
      </Modal>
    </div>
  );
};

export default PaymentModal;