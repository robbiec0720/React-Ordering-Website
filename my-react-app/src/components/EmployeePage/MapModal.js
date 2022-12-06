import React, { useContext, useState, useEffect } from 'react';
import Modal from 'react-modal';
import './MapModal.css'
import { FaTimes } from 'react-icons/fa'
import { LangContext, PrevLangContext, ThemeContext } from '../../App';

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
  const { theme } = useContext(ThemeContext)
  const { lang } = useContext(LangContext)
  const { prevLang } = useContext(PrevLangContext)
  const [card, setCard]= useState('Card')
  const [country, setCountry] = useState('Country or Region')
  const [code, setCode] = useState('Postal Code')
  const [pay, setPay] = useState('Choose a Payment Option')
  const [addr, setAddr] = useState('Deilver To')
  const [apt, setApt] = useState('Apartment, Unit, Suite, or Floor Number')
  const [state, setState] = useState('State or Province')
  const [sub, setSub] = useState('Save Address and Submit Order')
  const [clear, setClear] = useState('Clear Form')
  const [deliv, setDeliv] = useState('Enter Address for Delivery')
  const [req, setReq] = useState('Required Field')
  const [city, setCity] = useState('City')

  useEffect(() => {
    let t = [card, country, code, pay, addr, apt, state, sub, clear, deliv, req, city]
    let text = t.join(';')
    if (lang !== prevLang) {
      const API_KEY = 'AIzaSyANYWkU1YhvNE5flUIvzJv8g-y0KCHva-0'
      let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
      url += '&q=' + encodeURI(text)
      url += `&source=${prevLang}`
      url += `&target=${lang}`
      let translated = new Promise(function (resolve, reject) {
        fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
          .then(res => res.json())
          .then((response) => {
            //console.log("response from google: ", response.data.translations[0].translatedText)
            resolve(response.data.translations[0].translatedText)
          })
          .catch(error => {
            if (lang !== 'en') {
              alert("There was an error during translation. Reverting back to English")
              window.location.reload(false)
            }
          })
      })
      translated.then((result) => {
        var split = result.split(';')
        console.log(split)
        setCard(split[0])
        setCountry(split[1])
        setCode(split[2])
        setPay(split[3])
        setAddr(split[4])
        setApt(split[5])
        setState(split[6])
        setSub(split[7])
        setClear(split[8])
        setDeliv(split[9])
        setReq(split[10])
        setCity(split[11])
      })
    }
  }, [prevLang, lang, card, country, code, pay, addr, apt, state, sub, clear, deliv, req, city])


  const handleClick = async (payment_type) => {
    console.log("Order Button Clicked with value " + payment_type)
    try {
      const response = await fetch('https://project3-api.onrender.com/order/submit?id=0&type=1&payment=' + cost, {
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
          <form classname="form-map" id="address-form" action="" method="get" autocomplete="off">
            <p class="title">{deliv}</p>
            <p class="note"><em>* = {req}</em></p>
            <label class="full-field">

              <span class="form-label">{addr}*</span>
              <input
                className="input-map"
                id="ship-address"
                name="ship-address"
                required
                autocomplete="off"
              />
            </label>
            <label class="full-field">
              <span class="form-label">{apt}</span>
              <input className="input-map" id="address2" name="address2" />
            </label>
            <label class="full-field">
              <span class="form-label">{city}*</span>
              <input className="input-map" id="locality" name="locality" required />
            </label>
            <label class="slim-field-left">
              <span class="form-label">{state}*</span>
              <input className="input-map" id="state" name="state" required />
            </label>
            <label class="slim-field-right" for="postal_code">
              <span class="form-label">{code}*</span>
              <input className="input-map" id="postcode" name="postcode" required />
            </label>
            <label class="full-field">
              <span class="form-label">{country}*</span>
              <input className="input-map" id="country" name="country" required />
            </label>
            <label for="cars">{pay}:</label>
            <select name="payment" id="pay">
              <option value="Cash">{card}</option>
              <option value="Dining">Dining Dollars</option>
            </select>
            <button onClick={handleClick} type="button" class="submit">{sub}</button>
            <input className="input-map" type="reset" value={clear} />
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