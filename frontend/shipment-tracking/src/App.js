import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShipmentTable from './Components/ShipmentTable';
import ShipmentCreate from './Components/ShipmentCreate';
import ShipmentDetail from './Components/ShipmentDetail';
import ShipmentUpdate from './Components/ShipmentUpdate';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/shipmentTracking" element={<ShipmentTable />}/>
          <Route path="/shipmentTracking/new" element={<ShipmentCreate />}/>
          <Route path="/shipmentTracking/:id" element={<ShipmentDetail />}/>
          <Route path="/shipmentTracking/:id/edit" element={<ShipmentUpdate />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
