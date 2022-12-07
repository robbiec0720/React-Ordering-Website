import React, { useContext, useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LangContext, PrevLangContext, ThemeContext } from '../../App'
import './ManageAccess.css'

const ViewInventory = () => {
    // columns for view inventory
    const invCols = [
        { field: 'ingredient_id', headerName: 'Ingredient ID', width: 110 },
        { field: 'ingredient_name', headerName: 'Ingredient Name', width: 200, sortable: false },
        { field: 'unit_quantity', headerName: 'Unit Quantity', width: 130 },
        { field: 'order_threshold', headerName: 'Order Threshold', width: 130 },
        { field: 'reorder_value', headerName: 'Reorder Value', width: 130 },
        { field: 'cost', headerName: 'Cost', width: 75 }
    ]
    const [inv, setInv] = useState()
    const [view, setView] = useState('View Inventory')
    const [tableTheme, setTableTheme] = useState()
    const { theme } = useContext(ThemeContext)
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
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
        if(theme === 'light') {
            setTableTheme(lightTheme)
        }
        else if(theme === 'dark') {
            setTableTheme(darkTheme)
        }
        else if(theme === 'highContrast') {
            setTableTheme(contrastTheme)
        }

        let tempInv = []
        try {
            // getting inventory through api
            fetch('https://project3-api.onrender.com/inventory', {
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
                        tempInv.push(json[key])
                    }
                    setInv(tempInv)
                })
            })
        } catch (err) {
            console.log(err)
        }

        let text = view
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
                console.log(result)
                setView(result)
            })
        }
    }, [view, lang, prevLang, theme, darkTheme, lightTheme, contrastTheme])

    return (
        <div className={`${theme === 'light' && 'table'} ${theme === 'dark' && 'table-dark'} ${theme === 'highContrast' && 'table-high-contrast'}`}>
            <h1>{view}</h1>
            <ThemeProvider theme={tableTheme}>
                <DataGrid
                    getRowId={(row) => row.ingredient_id}
                    rows={inv ? inv : []}
                    columns={invCols}
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

export default ViewInventory