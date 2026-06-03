import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaHome, FaChartBar, FaComments, FaUserTie, FaUserCheck
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

const COLORS = ['#1A2E4A', '#F5A623', '#28a745', '#dc3545'];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, propertiesRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
          API.get('/admin/properties'),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
        setProperties(propertiesRes.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    navigate('/');
    return null;
  }

  // PIE CHART — Users by role
  const userRoleData = [
    { name: 'Landlords', value: stats?.totalLandlords || 0 },
    { name: 'Tenants', value: stats?.totalTenants || 0 },
    { name: 'Buyers', value: stats?.totalBuyers || 0 },
  ];

  // BAR CHART — Properties by type
  const propertyTypeData = ['apartment', 'house', 'duplex', 'studio', 'selfcon'].map((type) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count: properties.filter((p) => p.propertyType === type).length,
  }));

  // BAR CHART — Properties by state
  const stateData = properties.reduce((acc, p) => {
    const state = p.location?.state || 'Unknown';
    const existing = acc.find((s) => s.state === state);
    if (existing) existing.count++;
    else acc.push({ state, count: 1 });
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 6);

  // LINE CHART — Registrations by month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const registrationData = monthNames.map((month, index) => ({
    month,
    users: users.filter((u) => new Date(u.createdAt).getMonth() === index).length,
  }));

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />

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
                    <div style={{ backgroundColor: 'rgba(26,46,74,0.1)', borderRadius: '10px', padding: '12px' }}>
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
                    <div style={{ backgroundColor: 'rgba(245,166,35,0.1)', borderRadius: '10px', padding: '12px' }}>
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
                    <div style={{ backgroundColor: 'rgba(40,167,69,0.1)', borderRadius: '10px', padding: '12px' }}>
                      <FaHome size={24} color="#28a745" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{stats.totalProperties}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Properties</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ backgroundColor: 'rgba(220,53,69,0.1)', borderRadius: '10px', padding: '12px' }}>
                      <FaComments size={24} color="#dc3545" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{stats.totalChats}</h3>
                      <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.85rem' }}>Total Chats</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 1 — LINE CHART + PIE CHART */}
            <div className="row mb-4">

              {/* LINE CHART — Registrations per month */}
              <div className="col-md-8 mb-3">
                <div className="card p-4 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <h6 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
                    User Registrations by Month
                  </h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#1A2E4A"
                        strokeWidth={2}
                        dot={{ fill: '#F5A623', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PIE CHART — Users by role */}
              <div className="col-md-4 mb-3">
                <div className="card p-4 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <h6 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
                    Users by Role
                  </h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value">
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* ROW 2 — BAR CHARTS */}
            <div className="row mb-4">

              {/* BAR CHART — Properties by type */}
              <div className="col-md-6 mb-3">
                <div className="card p-4 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <h6 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
                    Properties by Type
                  </h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={propertyTypeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1A2E4A" radius={[6, 6, 0, 0]}>
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1A2E4A' : '#F5A623'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BAR CHART — Properties by state */}
              <div className="col-md-6 mb-3">
                <div className="card p-4 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                  <h6 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px' }}>
                    Top States by Listings
                  </h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#F5A623" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
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
                <button
                  onClick={() => navigate('/admin/chats')}
                  className="btn"
                  style={{ backgroundColor: '#28a745', color: 'white', borderRadius: '8px' }}>
                  <FaComments className="me-2" /> View All Chats
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