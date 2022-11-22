import React from 'react';
import './Header.css';
import { AiOutlineMenu } from 'react-icons/ai'
import {BsFillMoonFill, BsFillSunFill} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
const Header = () => {
    const navigate = useNavigate();
    const {theme, setTheme}  = useContext(ThemeContext)
    return (
        <div className={theme === 'light' ? 'header-style' : 'header-style-dark'}>
            <div onClick={()=> navigate('/')} className='logo'>
                <img src="https://i.ibb.co/vskyMYP/Chick-fil-A-logo.png" height="70px" width="120px" alt="" />
            </div>
            <div>
                {
                theme !== 'light' ?
                <button onClick={()=> setTheme('light')} className='theme-btn-dark'><BsFillSunFill /></button>
                :
                <button onClick={()=> setTheme('dark')} className='theme-btn-light'><BsFillMoonFill /></button>
                }
               
                <div className={theme === "light" ? "dropdown" : "dropdown-dark"}>
                    <span><AiOutlineMenu className={theme === 'light' ? 'dropdown-icon' : 'dropdown-icon-dark'} /></span>
                    <div className={theme === 'light' ? "dropdown-content": "dropdown-content-dark"}>
                        <p onClick={()=> navigate('/Login')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>Login</small></p>
                        <p onClick={()=> navigate('/manage-access')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>Manage Access</small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;