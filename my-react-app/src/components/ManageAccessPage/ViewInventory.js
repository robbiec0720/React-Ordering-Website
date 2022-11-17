import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';


const ViewInventory = () => {
    // columns for view inventory and restock table
    const invCols = [
        { field: 'ingredient_id', headerName: 'Ingredient ID', width: 110 },
        { field: 'ingredient_name', headerName: 'Ingredient Name', width: 200, sortable: false },
        { field: 'unit_quantity', headerName: 'Unit Quantity', width: 130 },
        { field: 'order_threshold', headerName: 'Order Threshold', width: 130 },
        { field: 'reorder_value', headerName: 'Reorder Value', width: 130 },
        { field: 'cost', headerName: 'Cost', width: 75 } 
    ]
    const [inv, setInv] = React.useState()

    React.useEffect(() => {
        let tempInv = []

        try {
            // getting inventory through api
            console.log('test')
            fetch('https://project3-api.onrender.com/inventory', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`)
                }
                console.log(response)
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
    }, [])

    return (
        <div>
            <h1>View Inventory</h1>
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
    );
};

export default ViewInventory;