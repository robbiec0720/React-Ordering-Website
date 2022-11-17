import React from 'react';

const EditInventory = () => {
    // form to edit inventory
    class EditForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { id: '', col: '', value: '' }

            this.idChange = this.idChange.bind(this)
            this.colChange = this.colChange.bind(this)
            this.valChange = this.valChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        idChange(event) {
            this.setState({ id: event.target.value })
        }

        colChange(event) {
            this.setState({ col: event.target.value })
        }

        valChange(event) {
            this.setState({ value: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault();
            // need to change to publicly hosted api
            const url = 'http://localhost:8081/edit?array=Inventory,' + this.state.id + ',' + this.state.col + ',' + this.state.value + ',ingredient_id'
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`)
                }
                response.json().then(json => {
                    alert(json)
                })
            })
        }

        render() {
            return (
                <form className="form" onSubmit={this.handleSubmit}>
                    <label>
                        ID:&nbsp;
                        <input type="text" id={this.state.id} onChange={this.idChange} />
                    </label>
                    <label>
                        Column:&nbsp;
                        <input type="radio" name="Column" value="unit_quantity" onChange={this.colChange} />Unit Quantity
                        <input type="radio" name="Column" value="order_threshold" onChange={this.colChange} />Order Threshold
                        <input type="radio" name="Column" value="reorder_value" onChange={this.colChange} />Reorder Value
                        <input type="radio" name="Column" value="cost" onChange={this.colChange} />Cost
                    </label>
                    <label>
                        New Value:&nbsp;
                        <input type="text" value={this.state.value} onChange={this.valChange} />
                    </label>
                    <input className="submit-btn" type="submit" value="Submit" />
                </form>
            )
        }
    }

    return (
        <div className='form'>
            <h1>Edit Inventory</h1>
            <EditForm></EditForm>
        </div>
    );
};

export default EditInventory;