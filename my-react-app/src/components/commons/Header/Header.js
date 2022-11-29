import React, { useContext } from 'react';
import './Header.css';
import { AiOutlineMenu } from 'react-icons/ai'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import { LangContext, ThemeContext } from '../../../App';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Header = () => {
    const navigate = useNavigate()
    const { lang, setLang } = useContext(LangContext)
    const { theme, setTheme } = useContext(ThemeContext)
    const handleChange = (event) => {
        setLang(event.target.value)
    }

    return (
        <div className={theme === 'light' ? 'header-style' : 'header-style-dark'}>
            <div onClick={() => navigate('/')} className='logo'>
                <img src="https://i.ibb.co/vskyMYP/Chick-fil-A-logo.png" height="70px" width="120px" alt="" />
            </div>
            <div>
                {
                    theme !== 'light' ?
                        <button onClick={() => setTheme('light')} className='theme-btn-dark'><BsFillSunFill /></button>
                        :
                        <button onClick={() => setTheme('dark')} className='theme-btn-light'><BsFillMoonFill /></button>
                }

                <div className={theme === "light" ? "dropdown" : "dropdown-dark"}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="select-label">Language</InputLabel>
                        <Select
                            labelId="select-label"
                            id="simple-select"
                            value={lang}
                            label="Language"
                            onChange={handleChange}
                        >
                            <MenuItem value={'English'}>English</MenuItem>
                            <MenuItem value={'Spanish'}>Spanish</MenuItem>
                            <MenuItem value={'German'}>German</MenuItem>
                            <MenuItem value={'French'}>French</MenuItem>
                            <MenuItem value={'Russian'}>Russian</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className={theme === "light" ? "dropdown" : "dropdown-dark"}>
                    <span><AiOutlineMenu className={theme === 'light' ? 'dropdown-icon' : 'dropdown-icon-dark'} /></span>
                    <div className={theme === 'light' ? "dropdown-content" : "dropdown-content-dark"}>
                        <p onClick={() => navigate('/Login')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>Login</small></p>
                        <p onClick={() => navigate('/manage-access')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>Manage Access</small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;