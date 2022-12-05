import { createContext, useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/commons/Footer/Footer';
import Header from './components/commons/Header/Header';
import EmployeePage from './components/EmployeePage/EmployeePage';
import CustomerPage from './components/EmployeePage/CustomerPage';
import Auth from './components/Auth';
import ManageAccess from './components/ManageAccessPage/ManageAccess';
import Login from './components/Login/Login';
import AddSeasonalItem from './components/ManageAccessPage/AddSeasonalItem';
import AddToInventory from './components/ManageAccessPage/AddToInventory';
import DeleteInventory from './components/ManageAccessPage/DeleteInventory';
import DeleteItems from './components/ManageAccessPage/DeleteItems';
import EditInventory from './components/ManageAccessPage/EditInventory';
import EditMenu from './components/ManageAccessPage/EditMenu';
import ExcessReport from './components/ManageAccessPage/ExcessReport';
import RestockReport from './components/ManageAccessPage/RestockReport';
import SalesReport from './components/ManageAccessPage/SalesReport';
import ViewInventory from './components/ManageAccessPage/ViewInventory';
import ViewMenu from './components/ManageAccessPage/ViewMenu';
export const ThemeContext = createContext();
export const LangContext = createContext();
export const PrevLangContext = createContext();

const clientId = '1061498518280-61io1snf32r4vai9ghighvuio2b2n30r.apps.googleusercontent.com';

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };

    gapi.load('client:auth2', start);
  })

  const [theme, setTheme] = useState('light')
  const [lang, setLang] = useState('en')
  const [prevLang, setPrevLang] = useState('en')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <PrevLangContext.Provider value={{ prevLang, setPrevLang }}>
          <div className={`${theme === 'light' && 'App align-things'} ${theme === 'dark' && 'App align-things dark'} ${theme === 'highContrast' && 'App align-things high-contrast'}`}>
            <div>
              <Header></Header>
              <Routes>
                <Route path='/' element={<Auth></Auth>}></Route>
                {/* <Route path='/' element={<EmployeePage></EmployeePage>}></Route> */}
                <Route path='/employee' element={<EmployeePage></EmployeePage>}></Route>
                <Route path='/customer' element={<CustomerPage></CustomerPage>}></Route>
                <Route path='/login' element={<Login></Login>}></Route>
                <Route path='/manage-access' element={<ManageAccess></ManageAccess>}>
                  <Route path='/manage-access/edit-functions' element={<div></div>}></Route>
                  <Route path='/manage-access/view-inventory' element={<ViewInventory></ViewInventory>}></Route>
                  <Route path='/manage-access/edit-menu' element={<EditMenu></EditMenu>}></Route>
                  <Route path='/manage-access/delete-Items' element={<DeleteItems></DeleteItems>}></Route>
                  <Route path='/manage-access/add-seasonal-items' element={<AddSeasonalItem></AddSeasonalItem>}></Route>
                  <Route path='/manage-access/edit-inventory' element={<EditInventory></EditInventory>}></Route>
                  <Route path='/manage-access/add-to-inventory' element={<AddToInventory></AddToInventory>}></Route>
                  <Route path='/manage-access/delete-inventory' element={<DeleteInventory></DeleteInventory>}></Route>
                  <Route path='/manage-access/view-menu' element={<ViewMenu></ViewMenu>}></Route>
                  <Route path='/manage-access/restock-report' element={<RestockReport></RestockReport>}></Route>
                  <Route path='/manage-access/excess-report' element={<ExcessReport></ExcessReport>}></Route>
                  <Route path='/manage-access/sales-report' element={<SalesReport></SalesReport>}></Route>
                </Route>
              </Routes>
            </div>
            <div>
              <Footer></Footer>
            </div>
          </div>
        </PrevLangContext.Provider>
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
} export default App;