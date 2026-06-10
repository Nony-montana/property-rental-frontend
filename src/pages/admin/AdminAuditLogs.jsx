 import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaTrash, FaShieldAlt, FaStar, FaBan, FaCheck } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

const actionIcons = {
  DELETE: <FaTrash color="#dc3545" size={14} />,
  TOGGLE_STATUS: <FaBan color="#F5A623" size={14} />,
  TOGGLE_VERIFIED: <FaShieldAlt color="#28a745" size={14} />,
  TOGGLE_FEATURED: <FaStar color="#F5A623" size={14} />,
};

const actionColors = {
  DELETE: '#dc3545',
  TOGGLE_STATUS: '#F5A623',
  TOGGLE_VERIFIED: '#28a745',
  TOGGLE_FEATURED: '#17a2b8',
};

const AdminAuditLogs = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/admin/audit-logs');
        setLogs(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    navigate('/');
    return null;
  }

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />

      <div style={{ marginLeft: '240px', flex: 1, padding: '30px', backgroundColor: 'var(--light)', minHeight: '100vh' }}>

        <div className="mb-4">
          <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            <FaClipboardList className="me-2" color="#F5A623" />
            Audit Logs
          </h3>
          <p style={{ color: 'var(--text-light)' }}>Track all admin actions</p>
        </div>

        {loading && (
          <div className="text-center mt-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="text-center mt-5">
            <FaClipboardList size={50} color="#F5A623" />
            <h5 className="mt-3" style={{ color: 'var(--text-light)' }}>No audit logs yet</h5>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="card shadow-sm" style={{ borderRadius: '12px', border: 'none', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  <tr>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Details</th>
                    <th>Admin</th>
                    <th>IP Address</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td>
                        <span
                          className="badge d-flex align-items-center gap-1"
                          style={{
                            backgroundColor: actionColors[log.action] || 'var(--primary)',
                            width: 'fit-content'
                          }}>
                          {actionIcons[log.action]}
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: 'var(--primary)' }}>
                          {log.target}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        {log.details}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {log.admin?.firstName} {log.admin?.lastName}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        {log.ip}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminAuditLogs;
