import * as React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './Table.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DataGrid from '@mui/x-data-grid';

const InventoryButton = () => {
    const [inv, setInv] = React.useState();

    React.useEffect(() => {
        let tempInv = [];
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
                    setInv(tempInv);
                }) 
            });
        } catch (err) {
            console.log(err)
        }
    }, [])

    const cols = [
        {field: 'ingredient_id', headerName: 'Ingredient ID', width: 130},
        {field: 'ingredient_id', headerName: 'Ingredient ID', width: 130},
        {field: 'ingredient_id', headerName: 'Ingredient ID', width: 130},
        {field: 'ingredient_id', headerName: 'Ingredient ID', width: 130},
        {field: 'ingredient_id', headerName: 'Ingredient ID', width: 130},
        {field: 'ingredient_id', headerName: 'Ingredient ID', width: 130},
    ]

    return (
        <Popup trigger={<button>View Inventory</button>} position = "right center">
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ingredient ID</TableCell>
                                <TableCell align="right">Ingredient Name</TableCell>
                                <TableCell align="right">Unit Quantity</TableCell>
                                <TableCell align="right">Order Threshold</TableCell>
                                <TableCell align="right">Reorder Value</TableCell>
                                <TableCell align="right">Cost</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inv?.map((row) => (
                                <TableRow
                                    key={row}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.ingredient_id}
                                    </TableCell>
                                    <TableCell align="right">{row.ingredient_name}</TableCell>
                                    <TableCell align="right">{row.unit_quantity}</TableCell>
                                    <TableCell align="right">{row.order_threshold}</TableCell>
                                    <TableCell align="right">{row.reorder_value}</TableCell>
                                    <TableCell align="right">{row.cost}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Popup>
    )
}

export default InventoryButton;