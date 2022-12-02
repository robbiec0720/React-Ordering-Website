import React, { useContext } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ThemeContext } from '../../App';
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
    const {theme} = useContext(ThemeContext)
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
    }, [])

    return (
        <div className={theme === 'light' ? 'table' : 'table-dark'}>
            <h1>View Menu</h1>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <DataGrid
                    sx={{color: theme === 'light' ? 'black' : 'white'}}
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