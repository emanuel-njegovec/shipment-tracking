import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ShipmentTable from './Components/ShipmentTable';

import ShipmentDetail from './Components/ShipmentDetail';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/shipmentTracking" />} />
          <Route path="/shipmentTracking" element={<ShipmentTable />}/>
          <Route path="/shipmentTracking/new" element={<ShipmentDetail />}/>
          <Route path="/shipmentTracking/:id" element={<ShipmentDetail />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
