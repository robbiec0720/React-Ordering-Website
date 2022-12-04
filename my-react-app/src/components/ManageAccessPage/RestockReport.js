import React, { useContext } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LangContext, PrevLangContext, ThemeContext } from '../../App';
import './ManageAccess.css'

const RestockReport = () => {
    // columns for restock table
    const invCols = [
        { field: 'ingredient_id', headerName: 'Ingredient ID', width: 110 },
        { field: 'ingredient_name', headerName: 'Ingredient Name', width: 200, sortable: false },
        { field: 'unit_quantity', headerName: 'Unit Quantity', width: 130 },
        { field: 'order_threshold', headerName: 'Order Threshold', width: 130 },
        { field: 'reorder_value', headerName: 'Reorder Value', width: 130 },
        { field: 'cost', headerName: 'Cost', width: 75 }
    ]
    const [restock, setRestock] = React.useState()
    const [report, setReport] = React.useState('Restock Report')
    const [btn, setBtn] = React.useState('Restock')
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

    React.useEffect(() => {
        let tempRestock = []

        try {
            // getting restock report through api
            fetch('https://project3-api.onrender.com/inventory/restock-report', {
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
                        tempRestock.push(json[key])
                    }
                    setRestock(tempRestock)
                })
            })
        } catch (err) {
            console.log(err)
        }

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
                        if(lang !== 'en') {
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

    const handleClick = () => {
        // need to change to public api
        fetch('https://project3-api.onrender.com/inventory/restock', {
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
                document.location.reload(true)
            })
        })
    }

    return (
        <div className={theme === 'light' ? 'table' : 'table-dark'}>
            <h1>{report}</h1>
            <button className='submit-btn' onClick={handleClick}>{btn}</button>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <DataGrid
                    getRowId={(row) => row.ingredient_id}
                    rows={restock ? restock : []}
                    columns={invCols}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection={false}
                    disableColumnMenu={true}
                    components={{ Toolbar: GridToolbar }}
                />
            </ThemeProvider>
        </div>
    );
};

export default RestockReport;