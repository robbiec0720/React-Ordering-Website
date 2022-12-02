import React, { useContext, useEffect } from 'react';
import { LangContext, PrevLangContext } from '../../App';

const DeleteInventory = () => {
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [report, setReport] = React.useState('Delete From Inventory')
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
                        console.log("There was an error with the translation request: ", error)
                    });
            })
            translated.then((result) => {
                var split = result.split(';')
                console.log(split)
                setReport(split[0])
                setBtn(split[1])
            })
        }
    }, [lang, prevLang, btn, report])

    // form to delete from inventory
    class DeleteForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { id: '' }

            this.idChange = this.idChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        idChange(event) {
            this.setState({ id: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault();
            // change to publicly hosted
            const url = 'https://project3-api.onrender.com/entry/delete?id=' + this.state.id + '&table=Inventory&pkcol=ingredient_id';
            fetch(url, {
                method: 'DELETE',
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
                        ID:&nbsp;
                        <input type="text" id={this.state.id} onChange={this.idChange} />
                    </label>
                    <input className="submit-btn" type="submit" value={btn} />
                </form>
            )
        }
    }

    return (
        <div className='form'>
            <h1>{report}</h1>
            <DeleteForm></DeleteForm>
        </div>
    );
};

export default DeleteInventory;