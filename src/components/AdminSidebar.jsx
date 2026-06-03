import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartBar, FaUsers, FaHome, FaSignOutAlt, FaComments } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { path: "/admin/users", label: "Users", icon: <FaUsers /> },
    { path: "/admin/properties", label: "Properties", icon: <FaHome /> },
    { path: '/admin/chats', label: 'Chats', icon: <FaComments /> },
  ];

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        backgroundColor: "var(--primary)",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* LOGO */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              color: "var(--accent)",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            Home<span style={{ color: "white" }}>Find</span>
          </span>
        </Link>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.75rem",
            margin: "4px 0 0",
          }}
        >
          Admin Panel
        </p>
      </div>

      {/* NAV LINKS */}
      <nav style={{ padding: "16px 0", flex: 1 }}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 20px",
              color:
                location.pathname === link.path
                  ? "var(--accent)"
                  : "rgba(255,255,255,0.7)",
              textDecoration: "none",
              backgroundColor:
                location.pathname === link.path
                  ? "rgba(245,166,35,0.1)"
                  : "transparent",
              borderLeft:
                location.pathname === link.path
                  ? "3px solid var(--accent)"
                  : "3px solid transparent",
              fontSize: "0.95rem",
              fontWeight: location.pathname === link.path ? "600" : "400",
              transition: "all 0.2s",
            }}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>

      {/* LOGOUT */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#dc3545",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            padding: "8px 0",
            width: "100%",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
