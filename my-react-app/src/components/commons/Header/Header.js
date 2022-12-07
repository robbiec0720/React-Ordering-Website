import React, { useContext, useState, useEffect } from 'react'
import './Header.css'
import { AiOutlineMenu } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { LangContext, PrevLangContext, ThemeContext, EmployeeStatusContext, EmployeeIDContext } from '../../../App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

const Header = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const { lang, setLang } = useContext(LangContext)
    const { prevLang, setPrevLang } = useContext(PrevLangContext)
    const { theme, setTheme } = useContext(ThemeContext)
    const { employeeStatus, setEmployeeStatus } = useContext(EmployeeStatusContext)
    const { employeeID, setEmployeeID } = useContext(EmployeeIDContext)
    const [login, setLogin] = useState('Login')
    const [logout, setLogout] = useState('Logout')
    const [manage, setManage] = useState('Manager Access')
    const [drop, setDrop] = useState('Language')
    const [tDrop, setTDrop] = useState('Theme')
    const [light, setLight] = useState('Light Mode')
    const [dark, setDark] = useState('Dark Mode')
    const [high, setHigh] = useState('High Contrast')
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

    useEffect(() => {
        let t = [login, logout, manage, drop, tDrop, light, dark, high]
        let text = t.join(';')
        if (lang !== prevLang) {
            const API_KEY = 'AIzaSyANYWkU1YhvNE5flUIvzJv8g-y0KCHva-0'
            let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
            url += '&q=' + encodeURI(text)
            url += `&source=${prevLang}`
            url += `&target=${lang}`
            let translated = new Promise(function (resolve, reject) {
                fetch(url, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                })
                    .then(res => res.json())
                    .then((response) => {
                        //console.log("response from google: ", response.data.translations[0].translatedText)
                        resolve(response.data.translations[0].translatedText)
                    })
                    .catch(error => {
                        if (lang !== 'en') {
                            alert("There was an error during translation. Reverting back to English")
                            window.location.reload(false)
                        }
                    })
            })
            translated.then((result) => {
                var split = result.split(';')
                console.log(split)
                setLogin(split[0])
                setLogout(split[1])
                setManage(split[2])
                setDrop(split[3])
                setTDrop(split[4])
                setLight(split[5])
                setDark(split[6])
                setHigh(split[7])
            })
        }
    }, [prevLang, lang, login, logout, manage, drop, tDrop, light, dark, high])

    const handleChange = (event) => {
        setPrevLang(lang)
        setLang(event.target.value)
        if (event.target.value === 'en') {
            window.location.reload(false)
        }
    }

    const handleLogout = () => {
        setEmployeeID(0)
        setEmployeeStatus(0)
        navigate('/')
    }

    return (
        <div className={`${theme === 'light' && 'header-style'} ${theme === 'dark' && 'header-style-dark'} ${theme === 'highContrast' && 'header-style-high-contrast'}`}>
            <div onClick={() => navigate('/')} className='logo'>
                <img src="https://i.ibb.co/vskyMYP/Chick-fil-A-logo.png" height="70px" width="120px" alt="" />
            </div>
            <div>
                {/* dropdown for dark and light mode */}
                <div className={theme === "light" ? "dropdown" : "dropdown-dark"}>
                    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="select-label">{tDrop}</InputLabel>
                            <Select
                                labelId="select-label"
                                id="simple-select"
                                value={theme}
                                label={tDrop}
                                onChange={e => setTheme(e.target.value)}
                            >
                                <MenuItem value={'light'}>{light}</MenuItem>
                                <MenuItem value={'highContrast'}>{high}</MenuItem>
                                <MenuItem value={'dark'}>{dark}</MenuItem>

                            </Select>
                        </FormControl>
                    </ThemeProvider>
                </div>

                <div className={theme === "light" ? "dropdown" : "dropdown-dark"}>
                    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="select-label">{drop}</InputLabel>
                            <Select
                                labelId="select-label"
                                id="simple-select"
                                value={lang}
                                label={drop}
                                onChange={handleChange}
                            >
                                <MenuItem value={'en'}>English</MenuItem>
                                <MenuItem value={'es'}>Spanish</MenuItem>
                                <MenuItem value={'de'}>German</MenuItem>
                                <MenuItem value={'ru'}>Russian</MenuItem>
                            </Select>
                        </FormControl>
                    </ThemeProvider>
                </div>

                <div className={theme === "light" ? "dropdown" : "dropdown-dark"}>
                    <span><AiOutlineMenu className={theme === 'light' ? 'dropdown-icon' : 'dropdown-icon-dark'} /></span>
                    <div className={theme === 'light' ? "dropdown-content" : "dropdown-content-dark"}>
                        {
                            employeeStatus === 1 || employeeStatus === 2 ?
                                <p onClick={handleLogout} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>{logout}</small></p>
                                :
                                <p onClick={() => navigate('/Login')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>{login}</small></p>
                        }

                        {
                            employeeStatus === 2 && <p onClick={() => navigate('/manage-access')} className={theme === 'light' ? 'manage-access' : 'manage-access-dark'}><small>{manage}</small></p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header