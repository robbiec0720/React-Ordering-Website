import React, { useContext } from 'react';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App';
import './ManageAccess.css'
const Sidebar = () => {
    const navigate = useNavigate()
    const {theme}  = useContext(ThemeContext)
    return (
        <div className={theme === 'light' ? 'sidebar-style' : 'sidebar-style-dark'}>
            <Navigation
                // you can use your own router's api to get pathname
                activeItemId="/manage-access/members"
                onSelect={({ itemId }) => {
                   navigate(itemId)
                }}
                style={{padding: 0}}
                items={[
                    {
                        title: 'View Inventories',
                        itemId: '/manage-access',
                    },
                    {
                        title: 'Edit Inventories',
                        // itemId: '/manage-access',
                        
                        subNav: [
                            {
                                title: 'Edit Menu',
                                itemId: '/manage-access/edit-menu',
                                to: '/manage-access/edit-menu'
                            },
                            {
                                title: 'Delete Items',
                                itemId: '/manage-access/delete-Items',
                            },
                            {
                                title: 'Add Seasonal Items',
                                itemId: '/manage-access/add-seasonal-items',
                            },
                            {
                                title: 'Edit Inventory',
                                itemId: '/manage-access/edit-inventory',
                            },
                            {
                                title: 'Add To Inventory',
                                itemId: '/manage-access/add-to-inventory',
                            },
                            {
                                title: 'Delete Inventory',
                                itemId: '/manage-access/delete-inventory',
                            },
                        ],
                    },
                    {
                        title: 'View Menu',
                        itemId: '/manage-access/view-menu',
                    },
                    {
                        title: 'Restock Report',
                        itemId: '#',
                        subNav: [
                            {
                                title: 'Restock Options',
                                itemId: '/manage-access/restock-options',
                            },
                        ],
                        title: 'Restock Report',
                        itemId: '/manage-access/restock-report',
                    },
                    {
                        title: 'Excess Report',
                        itemId: '/manage-access/excess-report',
                    },
                    {
                        title: 'Sales Report',
                        itemId: '/manage-access/sales-report',
                    },
                ]}
            />
        </div>
    );
};

export default Sidebar;