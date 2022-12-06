import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LangContext, PrevLangContext, ThemeContext } from '../../App'
import './ManageAccess.css'

const ExcessReport = () => {
    // columns for excess report table
    const excessCols = [
        { field: 'ingredient_id', headerName: 'Ingredient ID', width: 110 },
        { field: 'ingredient_name', headerName: 'Ingredient Name', width: 200, sortable: false },
        { field: 'amount_sold', headerName: 'Unit Quantity', width: 130 },
        { field: 'reorder_value', headerName: 'Reorder Value', width: 130 },
        { field: 'percentage_sold', headerName: '% Sold', width: 75 }
    ]

    // state columns
    const [excess, setExcess] = useState()
    const [start, setStart] = useState('2022-10-02')
    const { theme } = useContext(ThemeContext)
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [date, setDate] = useState('Start Date')
    const [report, setReport] = useState('Excess Report from')
    const [to, setTo] = useState('to')
    const [submit, setSubmit] = useState('Submit')

    const lightTheme = createTheme({
        palette: {
            mode: 'light'
        }
    })
    const darkTheme = createTheme({
        palette: {
            mode: 'dark'
        }
    })

    useEffect(() => {
        let tempExcess = []

        try {
            // getting excess report through api
            const apiExcess = 'https://project3-api.onrender.com/excess/' + start + '/2022-10-25'
            fetch(apiExcess, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`)
                }

                response.json().then(json => {
                    for (var key in json) {
                        tempExcess.push(json[key])
                    }
                    setExcess(tempExcess)
                })
            })
        } catch (err) {
            console.log(err)
        }

        let t = [date, report, to, submit]
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
                setDate(split[0])
                setReport(split[1])
                setTo(split[2])
                setSubmit(split[3])
            })
        }

    }, [start, date, submit, to, report, lang, prevLang])

    // form to get start date input
    class StartForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        handleChange(event) {
            this.setState({ value: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault()
            console.log(this.state.value)
            setStart(this.state.value)
        }

        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        {date} (YYYY-MM-DD): &nbsp;
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <input className="submit-btn" type="submit" value={submit} />
                </form>
            )
        }
    }

    return (
        <div className={`${theme === 'light' && 'table'} ${theme === 'dark' && 'table-dark'} ${theme === 'highContrast' && 'table-high-contrast'}`}>
            <h1>{report} {start} {to} 2022-10-25</h1>
            <StartForm></StartForm>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <DataGrid
                    getRowId={(row) => row.ingredient_id}
                    rows={excess ? excess : []}
                    columns={excessCols}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection={false}
                    disableColumnMenu={true}
                    components={{ Toolbar: GridToolbar }}
                />
            </ThemeProvider>
        </div>
    )
}

export default ExcessReport