import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaBan, FaCheck, FaShieldAlt, FaSearch } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import API from "../../utils/api";
import AdminSidebar from "../../components/AdminSidebar";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchUsers();
}, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const url = roleFilter
        ? `/admin/users?role=${roleFilter}`
        : "/admin/users";
      const res = await API.get(url);
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    navigate("/");
    return null;
  }
  const handleToggleStatus = async (id) => {
    try {
      await API.put(`/admin/users/${id}/toggle-status`);
      setUsers(
        users.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleVerified = async (id) => {
    try {
      await API.put(`/admin/users/${id}/toggle-verified`);
      setUsers(
        users.map((u) =>
          u._id === id ? { ...u, isVerified: !u.isVerified } : u,
        ),
      );
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
      await API.delete(`/admin/users/${deleteId}`);
      setUsers(users.filter((u) => u._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div
        style={{
          marginLeft: "240px",
          flex: 1,
          padding: "30px",
          backgroundColor: "var(--light)",
          minHeight: "100vh",
        }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 style={{ color: "var(--primary)", fontWeight: "bold" }}>
              Manage Users
            </h3>
            <p style={{ color: "var(--text-light)" }}>
              {users.length} users total
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div
          className="card p-3 shadow-sm mb-4"
          style={{ borderRadius: "12px", border: "none" }}
        >
          <div className="row align-items-center">
            <div className="col-md-6 mb-2">
              <div className="d-flex align-items-center gap-2">
                <FaSearch color="var(--text-light)" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ borderRadius: "8px" }}
              >
                <option value="">All Roles</option>
                <option value="LANDLORD">Landlords</option>
                <option value="RENT">Tenants</option>
                <option value="BUY">Buyers</option>
              </select>
            </div>
          </div>
        </div>

        {/* USERS TABLE */}
        {loading ? (
          <div className="text-center mt-5">
            <div
              className="spinner-border"
              style={{ color: "var(--primary)" }}
            ></div>
          </div>
        ) : (
          <div
            className="card shadow-sm"
            style={{ borderRadius: "12px", border: "none", overflow: "hidden" }}
          >
            <div className="table-responsive">
              <table className="table mb-0">
                <thead
                  style={{ backgroundColor: "var(--primary)", color: "white" }}
                >
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u._id}>
                      <td>
                        {u.firstName} {u.lastName}
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>{u.email}</td>
                      <td style={{ fontSize: "0.85rem" }}>{u.phone}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              u.role === "LANDLORD"
                                ? "var(--accent)"
                                : u.role === "RENT"
                                  ? "#17a2b8"
                                  : "#6f42c1",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              u.isActive !== false ? "#28a745" : "#dc3545",
                          }}
                        >
                          {u.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {u.role === "LANDLORD" && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: u.isVerified
                                ? "#28a745"
                                : "var(--text-light)",
                            }}
                          >
                            {u.isVerified ? "Verified" : "Unverified"}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          {/* TOGGLE STATUS */}
                          <button
                            onClick={() => handleToggleStatus(u._id)}
                            title={
                              u.isActive !== false ? "Deactivate" : "Activate"
                            }
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            {u.isActive !== false ? (
                              <FaBan color="#dc3545" size={16} />
                            ) : (
                              <FaCheck color="#28a745" size={16} />
                            )}
                          </button>

                          {/* VERIFY LANDLORD */}
                          {u.role === "LANDLORD" && (
                            <button
                              onClick={() => handleToggleVerified(u._id)}
                              title={u.isVerified ? "Unverify" : "Verify"}
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                              }}
                            >
                              <FaShieldAlt
                                color={
                                  u.isVerified ? "#28a745" : "var(--text-light)"
                                }
                                size={16}
                              />
                            </button>
                          )}

                          {/* DELETE */}
                          <button
                            onClick={() => handleDelete(u._id)}
                            title="Delete user"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "var(--white)",
                borderRadius: "12px",
                padding: "30px",
                width: "400px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <FaTrash size={40} color="#dc3545" className="mb-3" />
              <h5
                style={{
                  color: "var(--primary)",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                Delete User
              </h5>
              <p style={{ color: "var(--text-light)" }}>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="d-flex gap-3 justify-content-center mt-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: "8px 24px",
                    borderRadius: "8px",
                    border: "2px solid var(--primary)",
                    backgroundColor: "transparent",
                    color: "var(--primary)",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: "8px 24px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "white",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
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

export default AdminUsers;
