import React from 'react';

const AddToInventory = () => {
    // form to add to inventory
    class AddForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { name: '', quantity: '', threshold: '', reorder: '', cost: '' }

            this.nameChange = this.nameChange.bind(this)
            this.quantityChange = this.quantityChange.bind(this)
            this.thresholdChange = this.thresholdChange.bind(this)
            this.reorderChange = this.reorderChange.bind(this)
            this.costChange = this.costChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        nameChange(event) {
            this.setState({ name: event.target.value })
        }

        quantityChange(event) {
            this.setState({ quantity: event.target.value })
        }

        thresholdChange(event) {
            this.setState({ threshold: event.target.value })
        }

        reorderChange(event) {
            this.setState({ reorder: event.target.value })
        }

        costChange(event) {
            this.setState({ cost: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault();
            console.log('Sumbitted')
            // need to change to publicly hosted api
            const url = 'https://project3-api.onrender.com/inventory/add?array=' + this.state.name + ',' + this.state.quantity + ',' + this.state.threshold + ',' + this.state.reorder + ',' + this.state.cost
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
                        Ingredient Name:&nbsp;
                        <input type="text" name={this.state.name} onChange={this.nameChange} />
                    </label>
                    <label>
                        Initial Quantity:&nbsp;
                        <input type="text" quantity={this.state.quantity} onChange={this.quantityChange} />
                    </label>
                    <label>
                        Order Threshold:&nbsp;
                        <input type="text" threshold={this.state.threshold} onChange={this.thresholdChange} />
                    </label>
                    <label>
                        Reorder Value:&nbsp;
                        <input type="text" reorder={this.state.reorder} onChange={this.reorderChange} />
                    </label>
                    <label>
                        Ingredient Cost:&nbsp;
                        <input type="text" cost={this.state.cost} onChange={this.costChange} />
                    </label>
                    <input className="submit-btn" type="submit" value="Submit" />
                </form>
            )
        }
    }

    return (
        <div className='form'>
            <h1>Add To Inventory</h1>
            <AddForm></AddForm>
        </div>
    );
};

export default AddToInventory;