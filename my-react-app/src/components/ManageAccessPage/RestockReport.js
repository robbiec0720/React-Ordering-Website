import React, { useContext } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ThemeContext } from '../../App';
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
    const {theme} = useContext(ThemeContext)

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
            <h1>Restock Report</h1>
            <button className='submit-btn' onClick={handleClick}>Restock</button>
            <DataGrid
                sx={{color: theme === 'light' ? 'black' : 'white'}}
                getRowId={(row) => row.ingredient_id}
                rows={restock ? restock : []}
                columns={invCols}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection={false}
                disableColumnMenu={true}
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    );
};

export default RestockReport;