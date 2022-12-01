import { useContext } from "react"
import { LangContext } from "../../App";

function Translate(text) {
    const { lang } = useContext(LangContext)

    if (lang === 'en') {
        return <p>{text}</p>
    }
    else {
        const API_KEY = 'AIzaSyANYWkU1YhvNE5flUIvzJv8g-y0KCHva-0'
        let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
        url += '&q=' + encodeURI(text)
        url += `&source=${'en'}`
        url += `&target=${lang}`
        let translated = new Promise(function(resolve, reject) {
            fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            })
                .then(res => res.json())
                .then((response) => {
                    console.log("response from google: ", response.data.translations[0].translatedText)
                    resolve(response.data.translations[0].translatedText)           
                })
                .catch(error => {
                    console.log("There was an error with the translation request: ", error)
                });
        })
        translated.then((result) => {
            console.log(result)
            return <p>{result}</p>      
        })   
    }
}

export default Translate;
