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
                        <div className='btn-styles-div'>
                        <div>
                            <button className="access-btn">Edit Menu</button>
                            <button className="access-btn">Delete Items</button>
                            <button className="access-btn">Add seasonal Items</button>
                        </div>
                        <div>
                            <button className="access-btn">Edit Inventory</button>
                            <button className="access-btn">Add to Inventory</button>
                            <button className="access-btn">Delete Inventory</button>
                        </div>
                        </div>
                    </div>
                </div>

                {/* second block */}
                <div className='blocks'>
                    <div className='half-section'>
                        <h3>Restock Report</h3>
                        <div className='rstck_btn-styles-div'></div>
                        <div>
                        <button className="rstck-btn">Respock Options</button>
                        </div>
                    </div>
                    <div className='half-section'>
                        <h3>View Menu</h3>
                    </div>
                </div>

                {/* third block */}
                <div className='blocks'>
                    <div className='half-section'>
                        <h3>Excess Report</h3>
                    </div>
                    <div className='half-section'>
                        <h3>Sales Report </h3>
                    </div>
                </div>

            </div>


        </div>
    );
};

export default ManageAccess;