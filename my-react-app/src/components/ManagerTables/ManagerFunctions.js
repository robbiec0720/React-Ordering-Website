import * as React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './Table.css'
import { DataGrid } from '@mui/x-data-grid';

const InventoryButton = () => {
    const [inv, setInv] = React.useState()
    const [menu, setMenu] = React.useState()
    const [sales, setSales] = React.useState()

    React.useEffect(() => {
        // getting inventory through api
        let tempInv = []
        let tempMenu = []
        let tempSales = []
        try {
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
                    console.log(json)
                    for (var key in json) {
                        tempInv.push(json[key])
                    }
                    setInv(tempInv)
                })
            })

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
                    console.log(json)
                    for (var key in json) {
                        tempMenu.push(json[key])
                    }
                    setMenu(tempMenu)
                })
            })

            // getting sales report
            /* fetch('https://project3-api.onrender.com/', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`)
                }

                response.json().then(json => {
                    console.log(json)
                    for (var key in json) {
                        tempInv.push(json[key])
                    }
                    setInv(tempInv)
                })
            }) */

            // getting excess report
        } catch (err) {
            console.log(err)
        }
        
    }, [])

    const invCols = [
        { field: 'ingredient_id', headerName: 'Ingredient ID', width: 110 },
        { field: 'ingredient_name', headerName: 'Ingredient Name', width: 200, sortable: false },
        { field: 'unit_quantity', headerName: 'Unit Quantity', width: 130 },
        { field: 'order_threshold', headerName: 'Order Threshold', width: 130 },
        { field: 'reorder_value', headerName: 'Reorder Value', width: 130 },
        { field: 'cost', headerName: 'Cost', width: 75 },
    ]

    const menuCols = [
        { field: 'food_id', headerName: 'ID', width: 50},
        { field: 'item_name', headerName: 'Item Name', width: 250},
        { field: 'ingredients', headerName: 'Ingredients', width: 200},
        { field: 'cost', headerName: 'Cost', width: 75},
        { field: 'item_type', headerName: 'Item Type', width: 100},
        { field: 'is_seasonal', headerName: 'Seasonal?', width: 90}
    ]

    return (
        <div className="popup-wrapper">
            <Popup trigger={<button className="popup-btn">View Inventory</button>} position="right top" contentStyle={{ width: '100%' }}>
                <div className="popup">
                    <DataGrid
                        getRowId={(row) => row.ingredient_id}
                        rows={inv}
                        columns={invCols}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection={false}
                        disableColumnMenu={true}
                    />
                </div>
            </Popup>
            <Popup trigger={<button className="popup-btn">View Menu</button>} position="right top" contentStyle={{ width: '100%' }}>
                <div className="popup">
                    <DataGrid
                        getRowId={(row) => row.food_id}
                        rows={menu}
                        columns={menuCols}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection={false}
                        disableColumnMenu={true}
                    />
                </div>
            </Popup>
            <Popup trigger={<button className="popup-btn">Sales Report</button>} position="right top" contentStyle={{ width: '100%' }}>
                <div className="popup">
                    <DataGrid
                        getRowId={(row) => row.food_id}
                        rows={menu}
                        columns={menuCols}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection={false}
                        disableColumnMenu={true}
                    />
                </div>
            </Popup>
        </div>
    )
}

export default InventoryButton