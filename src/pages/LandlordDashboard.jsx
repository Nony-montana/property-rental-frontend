import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaEye,
  FaComments,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";

const LandlordDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const res = await API.get("/properties/my-properties");
        setProperties(res.data.data);
      } catch (err) {
        setError("Failed to fetch your properties");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProperties();
  }, []);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/properties/${deleteId}`);
      setProperties(properties.filter((p) => p._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await API.put(`/properties/${id}/toggle-availability`);
      setProperties(
        properties.map((p) =>
          p._id === id ? { ...p, isAvailable: !currentStatus } : p,
        ),
      );
    } catch (err) {
      alert("Failed to update availability");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div
        className="p-4 mb-4"
        style={{
          backgroundColor: "var(--primary)",
          borderRadius: "12px",
          color: "var(--white)",
        }}
      >
        <h3 style={{ color: "var(--accent)" }}>
          <FaHome className="me-2" />
          Welcome, {user?.firstName}!
        </h3>
        <p className="mb-0">Manage your property listings from here</p>
      </div>

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm" style={{ borderRadius: "12px", border: "none" }}>
            <h2 style={{ color: "var(--accent)", fontWeight: "bold" }}>
              {properties.length}
            </h2>
            <p style={{ color: "var(--text-light)" }}>Total Listings</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm" style={{ borderRadius: "12px", border: "none" }}>
            <h2 style={{ color: "#28a745", fontWeight: "bold" }}>
              {properties.filter((p) => p.isAvailable).length}
            </h2>
            <p style={{ color: "var(--text-light)" }}>Available</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm" style={{ borderRadius: "12px", border: "none" }}>
            <h2 style={{ color: "#dc3545", fontWeight: "bold" }}>
              {properties.filter((p) => !p.isAvailable).length}
            </h2>
            <p style={{ color: "var(--text-light)" }}>Not Available</p>
          </div>
        </div>
      </div>

      {/* ADD PROPERTY BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ color: "var(--primary)", fontWeight: "bold" }}>My Listings</h5>
        <Link
          to="/add-property"
          className="btn d-flex align-items-center gap-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--white)", borderRadius: "8px" }}>
          <FaPlusCircle /> Add New Property
        </Link>
      </div>

      {/* PROPERTIES TABLE */}
      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border" style={{ color: "var(--primary)" }}></div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && properties.length === 0 && (
        <div className="text-center mt-4 p-5" style={{ backgroundColor: "var(--white)", borderRadius: "12px" }}>
          <FaHome size={50} color="#F5A623" />
          <h5 className="mt-3" style={{ color: "var(--text-light)" }}>
            You have no listings yet
          </h5>
          <Link
            to="/add-property"
            className="btn mt-2"
            style={{ backgroundColor: "var(--primary)", color: "var(--white)", borderRadius: "8px" }}>
            Add Your First Property
          </Link>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="table-responsive">
          <table className="table" style={{ backgroundColor: "var(--white)", borderRadius: "12px" }}>
            <thead style={{ backgroundColor: "var(--primary)", color: "var(--white)" }}>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td>{property.title}</td>
                  <td>{property.location.city}, {property.location.state}</td>
                  <td style={{ color: "var(--accent)", fontWeight: "bold" }}>
                    ₦{property.price.toLocaleString()}
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "var(--accent)" }}>
                      {property.propertyType}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      onClick={() => toggleAvailability(property._id, property.isAvailable)}
                      style={{
                        backgroundColor: property.isAvailable ? "#28a745" : "#dc3545",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      title="Click to toggle availability">
                      {property.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/property/${property._id}`}>
                        <FaEye color="#1A2E4A" size={18} />
                      </Link>
                      <Link to={`/edit-property/${property._id}`}>
                        <FaEdit color="#F5A623" size={18} />
                      </Link>
                      <FaTrash
                        color="#dc3545"
                        size={18}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(property._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CHAT SECTION */}
      <div className="mt-5">
        <h5 className="mb-3 d-flex align-items-center gap-2" style={{ color: "var(--primary)", fontWeight: "bold" }}>
          <FaComments color="#F5A623" /> My Conversations
        </h5>
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm" style={{ borderRadius: "12px", border: "none", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", backgroundColor: "var(--primary)", color: "var(--white)", fontWeight: "bold" }}>
                Conversations
              </div>
              <ChatList onSelectChat={setSelectedChat} selectedChatId={selectedChat?._id} />
            </div>
          </div>
          <div className="col-md-8">
            {selectedChat ? (
              <div className="card shadow-sm" style={{ borderRadius: "12px", border: "none", overflow: "hidden" }}>
                <ChatBox chat={selectedChat} />
              </div>
            ) : (
              <div
                className="card shadow-sm d-flex align-items-center justify-content-center"
                style={{ borderRadius: "12px", border: "none", height: "400px", backgroundColor: "var(--white)" }}>
                <div className="text-center">
                  <FaComments size={50} color="#F5A623" />
                  <h5 className="mt-3" style={{ color: "var(--primary)" }}>Select a conversation</h5>
                  <p style={{ color: "var(--text-light)" }}>Choose a chat from the left to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div style={{
          position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: "var(--white)",
            borderRadius: "12px",
            padding: "30px",
            width: "400px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}>
            <FaTrash size={40} color="#dc3545" className="mb-3" />
            <h5 style={{ color: "var(--primary)", fontWeight: "bold", marginTop: "10px" }}>
              Delete Property
            </h5>
            <p style={{ color: "var(--text-light)" }}>
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="d-flex gap-3 justify-content-center mt-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "8px 24px", borderRadius: "8px",
                  border: "2px solid var(--primary)",
                  backgroundColor: "transparent",
                  color: "var(--primary)", fontWeight: "500", cursor: "pointer",
                }}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "8px 24px", borderRadius: "8px",
                  border: "none", backgroundColor: "#dc3545",
                  color: "var(--white)", fontWeight: "500", cursor: "pointer",
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;