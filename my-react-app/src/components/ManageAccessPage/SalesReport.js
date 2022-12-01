import React, { useContext } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ThemeContext } from '../../App';
import './ManageAccess.css'

const SalesReport = () => {
    // columns for sales report table
    const salesCols = [
        { field: 'food_id', headerName: 'ID', width: 50 },
        { field: 'item_name', headerName: 'Item Name', width: 250, sortable: false },
        { field: 'amount_sold', headerName: 'Units Sold', width: 100 }
    ]

    //state variables
    const [sales, setSales] = React.useState()
    const [start, setStart] = React.useState('2022-10-02')
    const [end, setEnd] = React.useState('2022-10-25')
    const {theme} = useContext(ThemeContext)

    React.useEffect(() => {
        let tempSales = []

        // getting sales report through api
        const apiSales = 'https://project3-api.onrender.com/sales/' + start + '/' + end;
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

        try {
        } catch (err) {
            console.log(err)
        }

    }, [start, end])

    // form to get start date input
    class StartForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        handleChange(event) {
            this.setState({ value: event.target.value})
        }

        handleSubmit(event) {  
            event.preventDefault();     
            console.log(this.state.value)
            setStart(this.state.value)          
        }

        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Start Date (YYYY-MM-DD):&nbsp;
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <input className="submit-btn" type="submit" value="Submit" />
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
            this.setState({ value: event.target.value})
        }

        handleSubmit(event) {
            event.preventDefault();
            console.log(this.state.value)
            setEnd(this.state.value)
        }

        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        End Date (YYYY-MM-DD):&nbsp;
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <input className="submit-btn" type="submit" value="Submit" />
                </form>
            )
        }
    }

    return (
        <div className={theme === 'light' ? 'table' : 'table-dark'}>
            <h1>Sales Report from {start} to {end}</h1>
            <StartForm></StartForm>
            <EndForm></EndForm>
            <DataGrid
                sx={{color: theme === 'light' ? 'black' : 'white'}}
                getRowId={(row) => row.food_id}
                rows={sales ? sales : []}
                columns={salesCols}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection={false}
                disableColumnMenu={true}
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    );
};

export default SalesReport;