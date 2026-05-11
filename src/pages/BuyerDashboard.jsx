import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaEnvelope, FaHandshake } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const BuyerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await API.get('/properties');
        setProperties(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="p-4 mb-4" style={{ backgroundColor: 'var(--primary)', borderRadius: '12px' }}>
        <h3 style={{ color: 'var(--accent)' }}>
          <FaHandshake className="me-2" />
          Welcome, {user?.firstName}!
        </h3>
        <p className="mb-0" style={{ color: 'var(--white)' }}>
          Find your perfect property to buy across Nigeria
        </p>
      </div>

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
            <h2 style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{properties.length}</h2>
            <p style={{ color: 'var(--text-light)' }}>Available Properties</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
            <h2 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>0</h2>
            <p style={{ color: 'var(--text-light)' }}>Saved Properties</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
            <h2 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>0</h2>
            <p style={{ color: 'var(--text-light)' }}>Messages</p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Link
            to="/"
            className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm text-decoration-none"
            style={{ borderRadius: '12px', border: 'none' }}>
            <FaSearch size={30} color="#F5A623" />
            <div>
              <h6 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '2px' }}>Browse Properties</h6>
              <p style={{ color: 'var(--text-light)', marginBottom: '0', fontSize: '0.85rem' }}>Search properties for sale</p>
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link
            to="/chats"
            className="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm text-decoration-none"
            style={{ borderRadius: '12px', border: 'none' }}>
            <FaEnvelope size={30} color="#F5A623" />
            <div>
              <h6 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '2px' }}>My Messages</h6>
              <p style={{ color: 'var(--text-light)', marginBottom: '0', fontSize: '0.85rem' }}>Chat with landlords</p>
            </div>
          </Link>
        </div>
      </div>

      {/* RECENT LISTINGS */}
      <h5 className="mb-3" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Recent Properties For Sale</h5>

      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
        </div>
      )}

      <div className="row">
        {properties.slice(0, 3).map((property) => (
          <div className="col-md-4 mb-4" key={property._id}>
            <div className="card shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
              <div style={{
                backgroundColor: 'var(--primary)',
                height: '150px',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                  />
                ) : (
                  <FaHome size={40} color="#F5A623" />
                )}
              </div>
              <div className="card-body">
                <h6 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{property.title}</h6>
                <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>₦{property.price.toLocaleString()}</p>
                <Link
                  to={`/property/${property._id}`}
                  className="btn btn-sm w-100"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--white)', borderRadius: '8px' }}>
                  View Property
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;