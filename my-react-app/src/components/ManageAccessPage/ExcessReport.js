import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const ExcessReport = () => {
    // columns for excess report table
    const excessCols = [
        { field: 'ingredient_id', headerName: 'Ingredient ID', width: 110 },
        { field: 'ingredient_name', headerName: 'Ingredient Name', width: 200, sortable: false },
        { field: 'amount_sold', headerName: 'Unit Quantity', width: 130 },
        { field: 'reorder_value', headerName: 'Reorder Value', width: 130 },
        { field: 'percentage_sold', headerName: '% Sold', width: 75 }
    ]

    // state columns
    const [excess, setExcess] = React.useState()
    const [start, setStart] = React.useState('2022-10-02')

    React.useEffect(() => {
        let tempExcess = []

        try {
             // getting excess report through api
             const apiExcess = 'https://project3-api.onrender.com/excess/' + start + '/2022-10-25'
             fetch(apiExcess, {
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
                         tempExcess.push(json[key])
                     }
                     setExcess(tempExcess)
                 })
             })
        } catch (err) {
            console.log(err)
        }

    }, [start])

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
                        Start Date (YYYY-MM-DD):
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            )
        }
    }

    return (
        <div className='table'>
            <h1>Excess Report from {start} to 2022-10-25</h1>
            <StartForm></StartForm>
            <DataGrid
                getRowId={(row) => row.ingredient_id}
                rows={excess ? excess : []}
                columns={excessCols}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection={false}
                disableColumnMenu={true}
            />
        </div>
    );
};

export default ExcessReport;