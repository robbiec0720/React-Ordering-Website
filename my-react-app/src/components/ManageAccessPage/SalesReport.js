import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ThemeContext, LangContext, PrevLangContext } from '../../App'
import './ManageAccess.css'

const SalesReport = () => {
    // columns for sales report table
    const salesCols = [
        { field: 'food_id', headerName: 'ID', width: 50 },
        { field: 'item_name', headerName: 'Item Name', width: 250, sortable: false },
        { field: 'amount_sold', headerName: 'Units Sold', width: 100 }
    ]

    //state variables
    const [tableTheme, setTableTheme] = useState()
    const [sales, setSales] = useState()
    const [start, setStart] = useState('2022-10-02')
    const [end, setEnd] = React.useState('2022-10-25')
    const { theme } = useContext(ThemeContext)
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [sDate, setSDate] = useState('Start Date')
    const [eDate, setEDate] = useState('End Date')
    const [report, setReport] = useState('Sales Report from')
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
    const contrastTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#ff00ff',
            },
            text: {
                primary: '#00ff00'
            },
            divider: '#ff00ff'
        }
    })

    useEffect(() => {
        if (theme === 'light') {
            setTableTheme(lightTheme)
        }
        else if (theme === 'dark') {
            setTableTheme(darkTheme)
        }
        else if (theme === 'highContrast') {
            setTableTheme(contrastTheme)
        }

        let tempSales = []
        try {
            // getting sales report through api
            const apiSales = 'https://project3-api.onrender.com/sales/' + start + '/' + end
            fetch(apiSales, {
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
                        tempSales.push(json[key])
                    }
                    setSales(tempSales)
                })
            })
        } catch (err) {
            console.log(err)
        }

        let t = [sDate, eDate, report, to, submit]
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
                setSDate(split[0])
                setEDate(split[1])
                setReport(split[2])
                setTo(split[3])
                setSubmit(split[4])
            })
        }

    }, [start, end, eDate, sDate, lang, prevLang, report, submit, to, theme, darkTheme, lightTheme, contrastTheme])

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
                        {sDate} (YYYY-MM-DD):&nbsp;
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

    // form to get end date input
    class EndForm extends React.Component {
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
            setEnd(this.state.value)
        }

        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        {eDate} (YYYY-MM-DD):&nbsp;
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
            <h1>{report} {start} {to} {end}</h1>
            <StartForm></StartForm>
            <EndForm></EndForm>
            <ThemeProvider theme={tableTheme ? tableTheme : lightTheme}>
                <DataGrid
                    getRowId={(row) => row.food_id}
                    rows={sales ? sales : []}
                    columns={salesCols}
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

export default SalesReport