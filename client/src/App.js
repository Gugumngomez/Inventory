import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inventory from './components/inventory/Inventory';
import Summary from './components/summary/Summary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inventory />} />
        <Route path='/summary' element={<Summary />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
