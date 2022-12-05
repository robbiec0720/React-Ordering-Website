import React, { useContext } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { useNavigate } from 'react-router-dom';
import { LangContext, PrevLangContext, ThemeContext } from '../../App';
import './ManageAccess.css'
const Sidebar = () => {
    const navigate = useNavigate()
    const { theme } = useContext(ThemeContext)
    const { lang } = useContext(LangContext)
    const { prevLang } = useContext(PrevLangContext)
    const [inv, setInv] = React.useState('View Inventory')
    const [menu, setMenu] = React.useState('View Menu')
    const [func, setFunc] = React.useState('Edit Functions')
    const [editM, setEditM] = React.useState('Edit Menu')
    const [addM, setAddM] = React.useState('Add Seasonal Item')
    const [delM, setDelM] = React.useState('Delete Menu Item')
    const [editI, setEditI] = React.useState('Edit Inventory')
    const [addI, setAddI] = React.useState('Add To Inventory')
    const [delI, setDelI] = React.useState('Delete From Inventory')
    const [restock, setRestock] = React.useState('Restock Report')
    const [excess, setExcess] = React.useState('Excess Report')
    const [sales, setSales] = React.useState('Sales Report')

    React.useEffect(() => {
        let t = [inv, menu, func, editM, addM, delM, editI, addI, delI, restock, excess, sales]
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
                        if(lang !== 'en') {
                            alert("There was an error during translation. Reverting back to English")
                            window.location.reload(false)
                        }
                    })
            })
            translated.then((result) => {
                var split = result.split(';')
                console.log(split)
                setInv(split[0])
                setMenu(split[1])
                setFunc(split[2])
                setEditM(split[3])
                setAddM(split[4])
                setDelM(split[5])
                setEditI(split[6])
                setAddI(split[7])
                setDelI(split[8])
                setRestock(split[9])
                setExcess(split[10])
                setSales(split[11])
            })
        }
    }, [prevLang, lang, inv, menu, func, editM, addM, delM, editI, addI, delI, restock, excess, sales])

    return (
        <div className={theme === 'light' ? 'sidebar-style' : 'sidebar-style-dark'}>
            <Navigation
                // you can use your own router's api to get pathname
                activeItemId="/manage-access/members"
                onSelect={({ itemId }) => {
                    navigate(itemId)
                }}
                style={{ padding: 0 }}
                items={[
                    {
                        title: inv,
                        itemId: '/manage-access/view-inventory',
                    },
                    {
                        title: menu,
                        itemId: '/manage-access/view-menu',
                    },
                    {
                        title: func,
                        // itemId: '/manage-access',

                        subNav: [
                            {
                                title: editM,
                                itemId: '/manage-access/edit-menu',
                                to: '/manage-access/edit-menu'
                            },
                            {
                                title: addM,
                                itemId: '/manage-access/add-seasonal-items',
                            },
                            {
                                title: delM,
                                itemId: '/manage-access/delete-items',
                            },             
                            {
                                title: editI,
                                itemId: '/manage-access/edit-inventory',
                            },
                            {
                                title: addI,
                                itemId: '/manage-access/add-to-inventory',
                            },
                            {
                                title: delI,
                                itemId: '/manage-access/delete-inventory',
                            },
                        ],
                    },
                    {
                        title: restock,
                        itemId: '/manage-access/restock-report',
                    },
                    {
                        title: excess,
                        itemId: '/manage-access/excess-report',
                    },
                    {
                        title: sales,
                        itemId: '/manage-access/sales-report',
                    },
                ]}
            />
        </div>
    );
};

export default Sidebar;