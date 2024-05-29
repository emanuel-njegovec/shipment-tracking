import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShipmentTable from './Components/ShipmentTable';

import ShipmentDetail from './Components/ShipmentDetail';
import ShipmentUpdate from './Components/ShipmentUpdate';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/shipmentTracking" element={<ShipmentTable />}/>
          <Route path="/shipmentTracking/new" element={<ShipmentDetail />}/>
          <Route path="/shipmentTracking/:id" element={<ShipmentDetail />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
