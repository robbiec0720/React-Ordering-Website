import './App.css';
import Footer from './components/commons/Footer/Footer';
import Header from './components/commons/Header/Header';
import EmployeePage from './components/EmployeePage/EmployeePage';
import Auth from './components/Auth';
import Manager from './components/EmployeePage/ManagerPage'
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    
    <div className="App">
      <Header></Header>
      <BrowserRouter>
      <Routes>
        <Route path="" element={<Auth />} />
        <Route path="/employee" element ={<EmployeePage />}/>
        <Route path="/manager" element={<Manager />}/>
      </Routes>
    </BrowserRouter>
      <Footer></Footer>
    </div>
  );
}

export default App;
