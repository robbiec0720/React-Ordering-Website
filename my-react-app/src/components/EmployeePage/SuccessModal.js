import React, { useContext, useState, useEffect } from 'react'
import Modal from 'react-modal'
import './SuccessModal.css'
import { FaTimes } from 'react-icons/fa'
import { LangContext, PrevLangContext, ThemeContext } from '../../App'

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

const SuccessModal = ({ modalIsOpenSuccess, afterOpenModalSuccess, closeModalSuccess }) => {
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const { theme } = useContext(ThemeContext)
    const [ok, setOk] = useState('Ok')
    const [confirm, setConfirm] = useState('You have successfully placed your order!')

    useEffect(() => {
        let t = [ok, confirm]
        let text = t.join('')
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
            var split = result.split('')
            console.log(split)
            setOk(split[0])
            setConfirm(split[1])
          })
        }
      }, [prevLang, lang, ok, confirm])

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
                <h4 className={`${theme === 'light' && ''} ${theme === 'dark' && customStylesDark} ${theme === 'highContrast' && 'high-contrast'}`}>{confirm}</h4>
                <button onClick={closeModalSuccess} className='ok-btn'>{ok}</button>
                <button onClick={closeModalSuccess} className='close-btn'><FaTimes /></button>
            </Modal>
        </div>
    )
}

export default SuccessModal
