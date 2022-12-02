import React, { useContext } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LangContext, PrevLangContext, ThemeContext } from '../../App';
import './ManageAccess.css'

const ViewMenu = () => {
    // columns for view menu table
    const menuCols = [
        { field: 'food_id', headerName: 'ID', width: 50 },
        { field: 'item_name', headerName: 'Item Name', width: 250, sortable: false },
        { field: 'ingredients', headerName: 'Ingredients', width: 200, sortable: false },
        { field: 'cost', headerName: 'Cost', width: 75 },
        { field: 'item_type', headerName: 'Item Type', width: 100 },
        { field: 'is_seasonal', headerName: 'Seasonal?', width: 90 }
    ]

    const [menu, setMenu] = React.useState()
    const [view, setView ] = React.useState('View Menu')
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
        let tempMenu = []

        try {
            // getting menu through api
            fetch('https://project3-api.onrender.com/menuItems', {
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
                        tempMenu.push(json[key])
                    }
                    setMenu(tempMenu)
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
                        alert("There was an error during translation. Reverting back to English")
                        window.location.reload(false);
                    });
            })
            translated.then((result) => {
                console.log(result)
                setView(result)
            })
        }
    }, [view, lang, prevLang])

    return (
        <div className={theme === 'light' ? 'table' : 'table-dark'}>
            <h1>{view}</h1>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <DataGrid
                    getRowId={(row) => row.food_id}
                    rows={menu ? menu : []}
                    columns={menuCols}
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

export default ViewMenu;