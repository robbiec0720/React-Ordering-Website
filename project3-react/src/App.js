
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./Auth"
import Employee from "./Employee"
import Manager from "./Manager"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Auth />} />
        <Route path="/employee" element ={<Employee />}/>
        <Route path="/manager" element={<Manager />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
