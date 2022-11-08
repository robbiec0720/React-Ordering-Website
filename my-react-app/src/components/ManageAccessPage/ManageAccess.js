import React from 'react';
import './ManageAccess.css'
const ManageAccess = () => {
    return (
        <div className='manage-page-style'>
            <div className="container">

                {/* first block */}
                <div className='blocks'>
                    <div className='half-section'>
                        <h3>View Inventory</h3>
                    </div>
                    <div className='half-section'>
                        <h3>Edit Inventory</h3>
                    </div>
                </div>

                {/* second block */}
                <div className='blocks'>
                    <div className='half-section'>
                        <h3>Restock Reports</h3>
                    </div>
                    <div className='half-section'>
                        <h3>Restock Inventory</h3>
                    </div>
                </div>

                {/* third block */}
                <div className='blocks'>
                    <div className='half-section'>
                        <h3>Excess Report</h3>
                    </div>
                    <div className='half-section'>
                        <h3>View Menu</h3>
                    </div>
                </div>
                <div className='seasonal-item'>
                <h3>Sales Report</h3>
                <p></p>
                </div>

            </div>


        </div>
    );
};

export default ManageAccess;