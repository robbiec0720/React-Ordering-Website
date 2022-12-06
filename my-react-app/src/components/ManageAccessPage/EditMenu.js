import React, { useContext, useEffect, useState } from 'react'
import { LangContext, PrevLangContext } from '../../App'

const EditMenu = () => {
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [report, setReport] = useState('Edit Menu')
    const [btn, setBtn] = useState('Submit')

    useEffect(() => {
        let t = [report, btn]
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
                setReport(split[0])
                setBtn(split[1])
            })
        }
    }, [lang, prevLang, btn, report])

    // form to edit inventory
    class EditForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { id: '', col: '', value: '' }

            this.idChange = this.idChange.bind(this)
            this.colChange = this.colChange.bind(this)
            this.valChange = this.valChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        idChange(event) {
            this.setState({ id: event.target.value })
        }

        colChange(event) {
            this.setState({ col: event.target.value })
        }

        valChange(event) {
            this.setState({ value: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault()
            // need to change to publicly hosted api
            const url = 'https://project3-api.onrender.com/edit?array=FoodItems,' + this.state.id + ',' + this.state.col + ',' + this.state.value + ',food_id'
            fetch(url, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`)
                }
                response.json().then(json => {
                    alert(json)
                })
            })
        }

        render() {
            return (
                <form className="form" onSubmit={this.handleSubmit}>
                    <label>
                        ID:&nbsp
                        <input type="text" id={this.state.id} onChange={this.idChange} />
                    </label>
                    <label>
                        Column:&nbsp
                        <input type="radio" name="Column" value="item_name" onChange={this.colChange} />Item Name
                        <input type="radio" name="Column" value="ingredients" onChange={this.colChange} />Ingredients
                        <input type="radio" name="Column" value="cost" onChange={this.colChange} />Cost
                        <input type="radio" name="Column" value="item_type" onChange={this.colChange} />Item Type
                    </label>
                    <label>
                        New Value:&nbsp
                        <input type="text" value={this.state.value} onChange={this.valChange} />
                    </label>
                    <input className="submit-btn" type="submit" value={btn} />
                </form>
            )
        }
    }

    return (
        <div className='form'>
            <h1>{report}</h1>
            <EditForm></EditForm>
        </div>
    )
}

export default EditMenu