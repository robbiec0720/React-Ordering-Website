import React from 'react';
import { Outlet } from 'react-router-dom';
import './ManageAccess.css'
import Sidebar from './Sidebar';
const ManageAccess = () => {
    return (
        <div className='manage-page-style'>
            <div>
                
                <div className='main-layout'>
                    <div className='sidebar'>
                    <Sidebar></Sidebar>
                    </div>
                    <div className='main-content'>
                        <Outlet></Outlet>
                        
                {/* <div className='blocks'>
                    <div className='half-section'>
                        <h3>View Inventory</h3>
                    </div>
                    <div className='half-section'>
                        <h3>Edit Inventory</h3>
                    </div>
                </div> */}

                
                {/* <div className='blocks'>
                    <div className='half-section'>
                        <h3>Restock Reports</h3>
                    </div>
                    <div className='half-section'>
                        <h3>Restock Inventory</h3>
                    </div>
                </div> */}

                
                {/* <div className='blocks'>
                    <div className='half-section'>
                        <h3>Access Report</h3>
                    </div>
                    <div className='half-section'>
                        <h3>Sales Report</h3>
                    </div>
                </div> */}
                {/* <div className='seasonal-item'>
                <h3>Sales Report</h3>
                <p></p>
                </div> */}
                    </div>
                </div>

            </div>


        </div>
    );
};

export default ManageAccess;