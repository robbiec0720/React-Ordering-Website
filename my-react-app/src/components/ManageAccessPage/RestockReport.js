import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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

    }, [])

    return (
        <div className="table">
            <h1>Restock Report</h1>
            <DataGrid
                getRowId={(row) => row.ingredient_id}
                rows={restock ? restock : []}
                columns={invCols}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection={false}
                disableColumnMenu={true}
            />
        </div>
    );
};

export default RestockReport;