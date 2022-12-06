import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import './SuccessModal.css'
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
        overflow: "hidden"
    },
}
const customStylesDark = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        background: 'black',
        marginRight: '-50%',
        color: "white",
        transform: 'translate(-50%, -50%)',
        overflow: "hidden"
    },
}
const SuccessModal = ({ modalIsOpenSuccess, afterOpenModalSuccess, closeModalSuccess}) => {


    const { theme } = useContext(ThemeContext)
    return (
        <div>
            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpenSuccess}
                onAfterOpen={afterOpenModalSuccess}
                onRequestClose={closeModalSuccess}
                style={theme === 'light' ? customStyles : customStylesDark}
                contentLabel="Example Modal"
            >
                <h4 className={`${theme === 'light' && ''} ${theme === 'dark' && customStylesDark} ${theme === 'highContrast' && 'high-contrast'}`}>You have successfully placed your order</h4>
                <button onClick={closeModalSuccess} className='ok-btn'>Ok</button>
                <button onClick={closeModalSuccess} className='close-btn'><FaTimes /></button>
            </Modal>
        </div>
    );
};

export default SuccessModal;
