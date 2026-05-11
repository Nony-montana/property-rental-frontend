import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import LandlordDashboard from './pages/LandlordDashboard';
import TenantDashboard from './pages/TenantDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import ChatPage from './pages/ChatPage';

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border" style={{ color: '#1A2E4A' }}></div>
    </div>
  );

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;