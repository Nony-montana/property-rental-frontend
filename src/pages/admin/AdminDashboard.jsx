 import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHome, FaChartBar, FaComments, FaUserTie, FaUserCheck } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    navigate('/');
    return null;
  }

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '30px', backgroundColor: 'var(--light)', minHeight: '100vh' }}>

        {/* HEADER */}
        <div className="mb-4">
          <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Dashboard Overview</h3>
          <p style={{ color: 'var(--text-light)' }}>Welcome back, {user?.firstName}!</p>
        </div>

        {loading && (
          <div className="text-center mt-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
          </div>
        )}

        {stats && (
          <>
            {/* STATS CARDS */}
            <div className="row mb-4">

              <div className="col-md-3 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      backgroundColor: 'rgba(26,46,74,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <FaUsers size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{stats.totalUsers}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Total Users</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      backgroundColor: 'rgba(245,166,35,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <FaUserTie size={24} color="var(--accent)" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{stats.totalLandlords}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Landlords</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      backgroundColor: 'rgba(40,167,69,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <FaUserCheck size={24} color="#28a745" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{stats.totalTenants}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Tenants</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      backgroundColor: 'rgba(220,53,69,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <FaChartBar size={24} color="#dc3545" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{stats.totalBuyers}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Buyers</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* SECOND ROW */}
            <div className="row mb-4">

              <div className="col-md-4 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      backgroundColor: 'rgba(26,46,74,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <FaHome size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{stats.totalProperties}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Total Properties</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      backgroundColor: 'rgba(40,167,69,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <FaHome size={24} color="#28a745" />
                    </div>
                    <div>
                      <h3 style={{ color: '#28a745', fontWeight: 'bold', margin: 0 }}>{stats.availableProperties}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Available</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      backgroundColor: 'rgba(220,53,69,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                    }}>
                      <FaComments size={24} color="#dc3545" />
                    </div>
                    <div>
                      <h3 style={{ color: '#dc3545', fontWeight: 'bold', margin: 0 }}>{stats.totalChats}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Total Chats</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* QUICK ACTIONS */}
            <div className="card p-4 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
              <h5 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
                Quick Actions
              </h5>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="btn"
                  style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px' }}>
                  <FaUsers className="me-2" /> Manage Users
                </button>
                <button
                  onClick={() => navigate('/admin/properties')}
                  className="btn"
                  style={{ backgroundColor: 'var(--accent)', color: 'white', borderRadius: '8px' }}>
                  <FaHome className="me-2" /> Manage Properties
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
