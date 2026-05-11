 import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaStar, FaSearch, FaEye } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminProperties = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await API.get('/admin/properties');
        setProperties(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    navigate('/');
    return null;
  }

  const handleToggleFeatured = async (id) => {
    try {
      await API.put(`/admin/properties/${id}/toggle-featured`);
      setProperties(properties.map((p) =>
        p._id === id ? { ...p, isFeatured: !p.isFeatured } : p
      ));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/admin/properties/${deleteId}`);
      setProperties(properties.filter((p) => p._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = properties.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.city?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.state?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />

      <div style={{ marginLeft: '240px', flex: 1, padding: '30px', backgroundColor: 'var(--light)', minHeight: '100vh' }}>

        {/* HEADER */}
        <div className="mb-4">
          <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Manage Properties</h3>
          <p style={{ color: 'var(--text-light)' }}>{properties.length} properties total</p>
        </div>

        {/* SEARCH */}
        <div className="card p-3 shadow-sm mb-4" style={{ borderRadius: '12px', border: 'none' }}>
          <div className="d-flex align-items-center gap-2">
            <FaSearch color="var(--text-light)" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, city or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* PROPERTIES TABLE */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
          </div>
        ) : (
          <div className="card shadow-sm" style={{ borderRadius: '12px', border: 'none', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Landlord</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontSize: '0.85rem', fontWeight: '500' }}>{p.title}</td>
                      <td style={{ fontSize: '0.85rem' }}>{p.location?.city}, {p.location?.state}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        ₦{p.price?.toLocaleString()}
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: 'var(--accent)' }}>
                          {p.propertyType}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {p.landlord?.firstName} {p.landlord?.lastName}
                      </td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: p.isAvailable ? '#28a745' : '#dc3545'
                        }}>
                          {p.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleFeatured(p._id)}
                          title={p.isFeatured ? 'Unfeature' : 'Feature'}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                          }}>
                          <FaStar color={p.isFeatured ? '#F5A623' : '#ccc'} size={18} />
                        </button>
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <button
                            onClick={() => navigate(`/property/${p._id}`)}
                            title="View property"
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px'
                            }}>
                            <FaEye color="var(--primary)" size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            title="Delete property"
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px'
                            }}>
                            <FaTrash color="#dc3545" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: 'var(--white)',
              borderRadius: '12px',
              padding: '30px',
              width: '400px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <FaTrash size={40} color="#dc3545" className="mb-3" />
              <h5 style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '10px' }}>
                Delete Property
              </h5>
              <p style={{ color: 'var(--text-light)' }}>
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="d-flex gap-3 justify-content-center mt-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '8px 24px', borderRadius: '8px',
                    border: '2px solid var(--primary)',
                    backgroundColor: 'transparent',
                    color: 'var(--primary)', fontWeight: '500', cursor: 'pointer'
                  }}>
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: '8px 24px', borderRadius: '8px',
                    border: 'none', backgroundColor: '#dc3545',
                    color: 'white', fontWeight: '500', cursor: 'pointer'
                  }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProperties;
