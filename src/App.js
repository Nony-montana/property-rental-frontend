import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import ChatPage from "./pages/ChatPage";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import { useLocation } from 'react-router-dom';
import EditProperty from './pages/EditProperty';

function AppContent() {
  const { loading } = useContext(AuthContext);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border" style={{ color: '#1A2E4A' }}></div>
    </div>
  );

  return (
    <>
      {!isAdminPage && <Navbar />}
      <div className={isAdminPage ? '' : 'container mt-4'}>
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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Routes>
      </div>
      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
