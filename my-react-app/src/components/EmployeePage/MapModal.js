import React, { useContext } from 'react';
import Modal from 'react-modal';
import './MapModal.css'
import { FaTimes } from 'react-icons/fa'
import { ThemeContext } from '../../App';
//import { Map, GoogleApiWrapper } from 'google-maps-react';
import { withTheme } from '@mui/material';
<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
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
    background: 'grey',
    color: 'white',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const location = {
  address: '275 Joe Routt Blvd, College Station, Texas.',
  lat: 30.6123,
  lng: -96.3415,
}

const MapModal = ({ modalIsOpen, afterOpenModal, closeModal, clearCart, cost }) => {

  const handleClick = async (payment_type) => {
    console.log("Order Button Clicked with value " + payment_type)
    try {
      const response = await fetch('https://project3-api.onrender.com/order/submit?id=0&type=' + payment_type + '&payment=' + cost, {
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
    clearCart();
    closeModal();
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
          <form id="address-form" action="" method="get" autocomplete="off">
            <p class="title">Enter address for Delivery</p>
            <p class="note"><em>* = required field</em></p>
            <label class="full-field">

              <span class="form-label">Deliver to*</span>
              <input
                id="ship-address"
                name="ship-address"
                required
                autocomplete="off"
              />
            </label>
            <label class="full-field">
              <span class="form-label">Apartment, unit, suite, or floor #</span>
              <input id="address2" name="address2" />
            </label>
            <label class="full-field">
              <span class="form-label">City*</span>
              <input id="locality" name="locality" required />
            </label>
            <label class="slim-field-left">
              <span class="form-label">State/Province*</span>
              <input id="state" name="state" required />
            </label>
            <label class="slim-field-right" for="postal_code">
              <span class="form-label">Postal code*</span>
              <input id="postcode" name="postcode" required />
            </label>
            <label class="full-field">
              <span class="form-label">Country/Region*</span>
              <input id="country" name="country" required />
            </label>
            <label for="cars">Choose a payment option:</label>
            <select name="payment" id="pay">
              <option value="Cash">Cash</option>
              <option value="Dining">Dining</option>
            </select>
            <button onClick={handleClick} type="button" class="submit">Save address and Submit</button>
            <input type="reset" value="Clear form" />
          </form>
          <div id="map">
            <iframe id="msc-map"
              width="600"
              height="450"
              loading="lazy"
              /* allowFullScreen */
              title="MSC"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBOkjc0jDF0N-fPFXOOppRJ3MbySWygPbk&q=Memorial+Student+Center,CollegeStation+TX">
            </iframe>
          </div>
        </div>
        <button onClick={closeModal} className='close-btn'><FaTimes /></button>
      </Modal>
    </div>
  );
};


export default MapModal;
//api key: 'AIzaSyBOkjc0jDF0N-fPFXOOppRJ3MbySWygPbk'
//<MapSection location={location} zoomLevel={17} /> {/* include it here */} 