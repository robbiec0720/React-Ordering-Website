import React from 'react';
import './Header.css';
import { AiOutlineMenu } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();
    return (
        <div className='header-style'>
            <div onClick={()=> navigate('/')} className='logo'>
                <img src="https://i.ibb.co/vskyMYP/Chick-fil-A-logo.png" height="70px" width="120px" alt="" />
            </div>
            <div>
                <div class="dropdown">
                    <span><AiOutlineMenu className='dropdown-icon' /></span>
                    <div class="dropdown-content">
                        <p onClick={()=> navigate('/manageaccess')} className='manage-access'><small>Manage Access</small></p>
                    </div>
                </div>
                
            </div>
            
        </div>
    );
};

export default Header;