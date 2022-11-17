import React from 'react';
import { Outlet } from 'react-router-dom';
import './ManageAccess.css'
import Sidebar from './Sidebar';
const ManageAccess = () => {
    return (
        <div className='manage-page-style'>
            <div className='main-layout'>
                <div className='sidebar'>
                <Sidebar></Sidebar>
                </div>
                <div className='main-content'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default ManageAccess;