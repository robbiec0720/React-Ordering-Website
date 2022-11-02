import './App.css';
import Footer from './components/commons/Footer/Footer';
import Header from './components/commons/Header/Header';
import EmployeePage from './components/EmployeePage/EmployeePage';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <EmployeePage></EmployeePage>
      <Footer></Footer>
    </div>
  );
}

export default App;
