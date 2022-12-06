import React, { useContext, useEffect, useState } from 'react'
import { LangContext, PrevLangContext } from '../../App'

const AddToInventory = () => {
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [report, setReport] = useState('Add To Inventory')
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

    // form to add to inventory
    class AddForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { name: '', quantity: '', threshold: '', reorder: '', cost: '' }

            this.nameChange = this.nameChange.bind(this)
            this.quantityChange = this.quantityChange.bind(this)
            this.thresholdChange = this.thresholdChange.bind(this)
            this.reorderChange = this.reorderChange.bind(this)
            this.costChange = this.costChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        nameChange(event) {
            this.setState({ name: event.target.value })
        }

        quantityChange(event) {
            this.setState({ quantity: event.target.value })
        }

        thresholdChange(event) {
            this.setState({ threshold: event.target.value })
        }

        reorderChange(event) {
            this.setState({ reorder: event.target.value })
        }

        costChange(event) {
            this.setState({ cost: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault()
            const url = 'https://project3-api.onrender.com/inventory/add?array=' + this.state.name + ',' + this.state.quantity + ',' + this.state.threshold + ',' + this.state.reorder + ',' + this.state.cost
            fetch(url, {
                method: 'POST',
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
                        Ingredient Name:&nbsp
                        <input type="text" name={this.state.name} onChange={this.nameChange} />
                    </label>
                    <label>
                        Initial Quantity:&nbsp
                        <input type="text" quantity={this.state.quantity} onChange={this.quantityChange} />
                    </label>
                    <label>
                        Order Threshold:&nbsp
                        <input type="text" threshold={this.state.threshold} onChange={this.thresholdChange} />
                    </label>
                    <label>
                        Reorder Value:&nbsp
                        <input type="text" reorder={this.state.reorder} onChange={this.reorderChange} />
                    </label>
                    <label>
                        Ingredient Cost:&nbsp
                        <input type="text" cost={this.state.cost} onChange={this.costChange} />
                    </label>
                    <input className="submit-btn" type="submit" value={btn} />
                </form>
            )
        }
    }

    return (
        <div className='form'>
            <h1>{report}</h1>
            <AddForm></AddForm>
        </div>
    )
}

export default AddToInventory