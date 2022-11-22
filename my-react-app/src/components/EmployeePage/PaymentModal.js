import React, { useContext } from 'react';
import Modal from 'react-modal';
import './PaymentModal.css'
import {FaTimes} from 'react-icons/fa'
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
const PaymentModal = ({ modalIsOpen, afterOpenModal, closeModal}) => {
    const {theme}  = useContext(ThemeContext)
    return (
        <div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={theme === 'light' ? customStyles : customStylesDark}
          contentLabel="Example Modal"
        >
          <div className='modal-style'>
            <div className="modal-item">Card</div>
            <div className="modal-item">Cash</div>
            <div className="modal-item">Dining Dollars</div>
          </div>
          <button onClick={closeModal} className='close-btn'><FaTimes /></button>
        </Modal>
      </div>
    );
};

export default PaymentModal;