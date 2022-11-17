import React from 'react';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Navigation
                // you can use your own router's api to get pathname
                activeItemId="/manage-access/members"
                onSelect={({ itemId }) => {
                   navigate(itemId)
                }}
                items={[
                    {
                        title: 'View Inventory',
                        itemId: '/manage-access/view-inventory',
                    },
                    {
                        title: 'View Menu',
                        itemId: '/manage-access/view-menu',
                    },
                    {
                        title: 'Edit Functions',
                        itemId: '/manage-access/edit-functions',
                        
                        subNav: [
                            {
                                title: 'Edit Menu',
                                itemId: '/manage-access/edit-menu',
                                to: '/manage-access/edit-menu'
                            },
                            {
                                title: 'Add Seasonal Items',
                                itemId: '/manage-access/add-seasonal-items',
                            },
                            {
                                title: 'Delete From Menu',
                                itemId: '/manage-access/delete-Items',
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
                                title: 'Delete From Inventory',
                                itemId: '/manage-access/delete-inventory',
                            },
                        ],
                    },
                    {
                        title: 'Restock Options',
                        itemId: '/manage-access/restock-options',
                        subNav: [
                            {
                                title: 'Restock Report',
                                itemId: '/manage-access/restock-report',
                            },
                        ],
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