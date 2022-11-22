import React from 'react';

const DeleteInventory = () => {
    // form to delete from inventory
    class DeleteForm extends React.Component {
        constructor(props) {
            super(props)
            this.state = { id: '' }

            this.idChange = this.idChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
        }

        idChange(event) {
            this.setState({ id: event.target.value })
        }

        handleSubmit(event) {
            event.preventDefault();
            // change to publicly hosted
            const url = 'https://project3-api.onrender.com/entry/delete?id=' + this.state.id + '&table=Inventory&pkcol=ingredient_id';
            fetch(url, {
                method: 'DELETE',
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
                    <input className="submit-btn" type="submit" value="Submit" />
                </form>
            )
        }
    }

    return (
        <div className='form'>
            <h1>Delete From Inventory</h1>
            <DeleteForm></DeleteForm>
        </div>
    );
};

export default DeleteInventory;