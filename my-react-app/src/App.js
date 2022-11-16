import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/commons/Footer/Footer';
import Header from './components/commons/Header/Header';
import EmployeePage from './components/EmployeePage/EmployeePage';
import Auth from './components/Auth';
import ManageAccess from './components/ManageAccessPage/ManageAccess';
import ManagerFunctions from './components/ManagerTables/ManagerFunctions';
import AddSeasonalItem from './components/ManageAccessPage/AddSeasonalItem';
import AddToInventory from './components/ManageAccessPage/AddToInventory';
import DeleteInventory from './components/ManageAccessPage/DeleteInventory';
import DeleteItems from './components/ManageAccessPage/DeleteItems';
import EditInventory from './components/ManageAccessPage/EditInventory';
import EditMenu from './components/ManageAccessPage/EditMenu';
import ExcessReport from './components/ManageAccessPage/ExcessReport';
import RestockOptions from './components/ManageAccessPage/RestockOptions';
import SalesReport from './components/ManageAccessPage/SalesReport';
import ViewInventory from './components/ManageAccessPage/ViewInventory';
import ViewMenu from './components/ManageAccessPage/ViewMenu';


function App() {
  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path='/' element={<Auth></Auth>}></Route>
        {/* <Route path='/' element={<EmployeePage></EmployeePage>}></Route> */}
        <Route path='/employee' element={<EmployeePage></EmployeePage>}></Route>
        <Route path='/manageaccess' element={<ManageAccess></ManageAccess>}></Route>
        <Route path='/inventory' element={<ManagerFunctions></ManagerFunctions>}></Route>
        {/* <Route path='/manage-access' element={<ManageAccess></ManageAccess>}></Route> */}
        <Route path='/manage-access' element={
           <ManageAccess></ManageAccess>
        }>
          <Route index element={<ViewInventory></ViewInventory>}></Route>
          <Route path='/manage-access/edit-menu' element={<EditMenu></EditMenu>}></Route>
          <Route path='/manage-access/delete-Items' element={<DeleteItems></DeleteItems>}></Route>
          <Route path='/manage-access/add-seasonal-items' element={<AddSeasonalItem></AddSeasonalItem>}></Route>
          <Route path='/manage-access/edit-inventory' element={<EditInventory></EditInventory>}></Route>
          <Route path='/manage-access/add-to-inventory' element={<AddToInventory></AddToInventory>}></Route>
          <Route path='/manage-access/delete-inventory' element={<DeleteInventory></DeleteInventory>}></Route>
          <Route path='/manage-access/view-menu' element={<ViewMenu></ViewMenu>}></Route>
          <Route path='/manage-access/restock-options' element={<RestockOptions></RestockOptions>}></Route>
          <Route path='/manage-access/excess-report' element={<ExcessReport></ExcessReport>}></Route>
          <Route path='/manage-access/sales-report' element={<SalesReport></SalesReport>}></Route>
        </Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
 
}export default App;