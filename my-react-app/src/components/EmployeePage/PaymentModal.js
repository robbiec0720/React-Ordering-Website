import React, { useContext, useState, useEffect } from 'react'
import Modal from 'react-modal'
import './PaymentModal.css'
import { FaTimes } from 'react-icons/fa'
import SuccessModal from './SuccessModal'
import { LangContext, PrevLangContext, ThemeContext, EmployeeStatusContext, EmployeeIDContext } from '../../App'

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
}
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
}

const PaymentModal = ({ modalIsOpen, afterOpenModal, closeModal, clearCart, cost, subtitle }) => {
  const { lang } = useContext(LangContext)
  const { prevLang } = useContext(PrevLangContext)
  const { theme } = useContext(ThemeContext)
  const {employeeStatus, setEmployeeStatus} = useContext(EmployeeStatusContext)
  const {employeeID, setEmployeeID} = useContext(EmployeeIDContext)
  const [showInput, setShowInput] = useState(false)
  const [cashInput, setCashInput] = useState(0.0)
  const [card, setCard] = useState('Card')
  const [cash, setCash] = useState('Cash')
  const [cancel, setCancel] = useState('Cancel')
  const [pay, setPay] = useState('Cash Payment')
  const [modalIsOpenSuccess, setIsOpenSuccess] = React.useState(false)

  function openModalSuccess() {
    setIsOpenSuccess(true)
  }

  function afterOpenModalSuccess() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00'
  }

  function closeModalSuccess() {
    setIsOpenSuccess(false)
  }

  useEffect(() => {
    let t = [card, cash, cancel, pay]
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
        setCash(split[1])
        setCancel(split[2])
        setPay(split[3])
      })
    }
  }, [prevLang, lang, card, cash, cancel, pay])

  const user = JSON.parse(localStorage.getItem("user"))
  const handleClick = async (payment_type) => {
    console.log("Order Button Clicked with value " + payment_type + "\nEmployee ID = " + employeeID)
    try {
      if (payment_type === 0) {
        setShowInput(true)
      } else {
        const response = await fetch('http://localhost:8081/order/submit?id=' + employeeID + '&type=' + payment_type + '&payment=' + cost, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`)
        }

        const result = await response.json()

        closeModal()
        setShowInput(false)
        clearCart()
        openModalSuccess()
        console.log('result is: ', JSON.stringify(result, null, 4))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleAmount = (e) => {
    e.preventDefault()
    setShowInput(false)
    closeModal()
    clearCart()
  }

  const handleCashSubmit = async (event) => {
    event.preventDefault()
    console.log(cashInput)

    const url = 'http://localhost:8081/order/submit?id=' + employeeID + '&type=0&payment=' + cashInput
    console.log(url)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      const result = await response.json()

      closeModal()
      setShowInput(false)
      clearCart()
      openModalSuccess()
      console.log('result is: ', JSON.stringify(result, null, 4))
    } catch (err) {
      console.log(err)
    }
  }

  const updateInput = (event) => {
    setCashInput(event.target.value)
  }

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
              <form onSubmit={handleAmount} className={`${theme === 'light' && 'form-cash-style'} ${theme === 'dark' && 'form-cash-dark'} ${theme === 'highContrast' && 'form-cash-high-contrast'}`}>
                <p>{pay}</p>
                <input onChange={updateInput} className='cash-input-style' type="number" step="0.01" id="amount" placeholder='Enter The Amount' />
                <input onClick={handleCashSubmit} className='cash-amount-btn' type="submit" value="Confirm" />
                <button onClick={() => setShowInput(false)} className='cash-amount-btn'>{cancel}</button>
              </form>
              :
              <>
                {
                  employeeStatus === 1 || employeeStatus === 2 ?
                    <div className='modal-style'>
                      <div onClick={() => handleClick(1)} className="modal-item">{card}</div>
                      <div onClick={() => handleClick(0)} className="modal-item">{cash}</div>
                      <div onClick={() => handleClick(2)} className="modal-item">Dining Dollars</div>
                    </div>
                    :
                    <div className='modal-style-not-user'>
                      <div onClick={() => handleClick(1)} className="modal-item">{card}</div>

                      <div onClick={() => handleClick(2)} className="modal-item">Dining Dollars</div>
                    </div>
                }
              </>
          }
        </div>
        <button onClick={closeModal} className='close-btn'><FaTimes /></button>
      </Modal>
      <SuccessModal
        modalIsOpenSuccess={modalIsOpenSuccess}
        afterOpenModalSuccess={afterOpenModalSuccess}
        closeModalSuccess={closeModalSuccess}
      ></SuccessModal>
    </div>
  )
}

export default PaymentModal