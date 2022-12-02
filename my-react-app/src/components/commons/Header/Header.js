import React, { useContext } from 'react';
import './Header.css';
import { AiOutlineMenu } from 'react-icons/ai'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import { LangContext, PrevLangContext, ThemeContext } from '../../../App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Header = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const { lang, setLang } = useContext(LangContext)
    const { setPrevLang } = useContext(PrevLangContext)
    const { theme, setTheme } = useContext(ThemeContext)
    const lightTheme = createTheme({
        palette: {
            mode: 'light'
        }
    })
    const darkTheme = createTheme({
        palette: {
            mode: 'dark'
        }
    })
    const handleChange = (event) => {
        setPrevLang(lang)
        setLang(event.target.value)
        if(event.target.value === 'en') {
            window.location.reload(false);
        }
    }
   
    const handleLogout = () =>{
        localStorage.removeItem("user")
        navigate('/')
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
                    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="select-label">Language</InputLabel>
                            <Select
                                labelId="select-label"
                                id="simple-select"
                                value={lang}
                                label="Language"
                                onChange={handleChange}
                            >
                                <MenuItem value={'en'}>English</MenuItem>
                                <MenuItem value={'es'}>Spanish</MenuItem>
                                <MenuItem value={'de'}>German</MenuItem>
                                <MenuItem value={'fr'}>French</MenuItem>
                                <MenuItem value={'ru'}>Russian</MenuItem>
                            </Select>
                        </FormControl>
                    </ThemeProvider>
                </div>

                <div className={theme === "light" ? "dropdown" : "dropdown-dark"}>
                    <span><AiOutlineMenu className={theme === 'light' ? 'dropdown-icon' : 'dropdown-icon-dark'} /></span>
                    <div className={theme === 'light' ? "dropdown-content" : "dropdown-content-dark"}>
                        {
                            user ?
                            <p onClick={handleLogout} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>Logout</small></p>
                            :
                            <p onClick={() => navigate('/Login')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>Login</small></p>
                        }
                        
                       {
                           user?.role === "manager" &&  <p onClick={() => navigate('/manage-access')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>Manager Access</small></p>
                       }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;