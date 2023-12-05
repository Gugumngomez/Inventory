import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inventory from './components/inventory/Inventory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inventory />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
