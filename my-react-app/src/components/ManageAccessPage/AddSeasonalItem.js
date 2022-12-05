import React, { useContext, useEffect } from 'react';
import { LangContext, PrevLangContext } from '../../App';

const AddSeasonalItem = () => {
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [report, setReport] = React.useState('Add To Menu')
    const [btn, setBtn] = React.useState('Submit')

    useEffect(() => {
        let t = [report, btn]
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
                setReport(split[0])
                setBtn(split[1])
            })
        }
    }, [lang, prevLang, btn, report])

    // form to add to inventory
    class AddForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { name: '', ingredients: '', type: '', cost: ''}

            this.nameChange = this.nameChange.bind(this)
            this.ingredientChange = this.ingredientChange.bind(this)
            this.typeChange = this.typeChange.bind(this)
            this.costChange = this.costChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        nameChange(event) {
            this.setState({ name: event.target.value })
        }

        ingredientChange(event) {
            this.setState({ ingredients: event.target.value })
        }

        typeChange(event) {
            this.setState({ type: event.target.value })
        }

        costChange(event) {
            this.setState({ cost: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault();
            const url = 'https://project3-api.onrender.com/menuItems/add?array=' + this.state.name + ',' + this.state.ingredients + ',' + this.state.cost + ',' + this.state.type + ',1'
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
                        Item Name:&nbsp;
                        <input type="text" name={this.state.name} onChange={this.nameChange} />
                    </label>
                    <label>
                        Ingredients (separated by :):&nbsp;
                        <input type="text" quantity={this.state.ingredients} onChange={this.ingredientChange} />
                    </label>
                    <label>
                        Cost:&nbsp;
                        <input type="text" threshold={this.state.threshold} onChange={this.costChange} />
                    </label>
                    <label>
                        Item Type:&nbsp;
                        <input type="text" reorder={this.state.reorder} onChange={this.typeChange} />
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
    );
};

export default AddSeasonalItem;