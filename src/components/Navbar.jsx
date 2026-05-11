import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaSignInAlt, FaUserPlus, FaComments, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import API from '../utils/api';
import socket from '../utils/socket';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,4 36,18 4,18" fill="#F5A623" />
    <rect x="8" y="18" width="24" height="16" fill="#F5A623" opacity="0.9" />
    <rect x="15" y="24" width="10" height="10" fill="#1A2E4A" />
    <circle cx="30" cy="30" r="4" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    <line x1="33" y1="30" x2="38" y2="30" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="36" y1="30" x2="36" y2="32" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="38" y1="30" x2="38" y2="32" stroke="#FFFFFF" strokeWidth="2" />
  </svg>
);

const Navbar = () => {
  const { user, logout, getDashboardRoute } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
  if (!user) {
    setUnreadCount(0);
    socket.off('receive_message');
    return;
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get('/chats/unread-count');
      setUnreadCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  fetchUnreadCount();

  socket.on('receive_message', () => {
    fetchUnreadCount();
  });

  return () => {
    socket.off('receive_message');
  };
}, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDropdownOpen(false);
    setUnreadCount(0);
    navigate('/');
  };

  const handleDashboard = () => {
    navigate(getDashboardRoute(user.role));
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav style={{ backgroundColor: 'var(--primary)' }} className="py-3 px-4">
      <div className="container d-flex justify-content-between align-items-center">

        {/* LOGO */}
        <Link to="/" className="d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
          <Logo />
          <span style={{ color: 'var(--accent)', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            Home<span style={{ color: 'var(--white)' }}>Find</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <Link to="/" className="d-flex align-items-center gap-1" style={{ color: 'var(--white)', textDecoration: 'none' }}>
            <FaHome /> Home
          </Link>

          {user && (
            <Link
              to="/chats"
              className="d-flex align-items-center gap-1"
              style={{ color: 'var(--white)', textDecoration: 'none', position: 'relative' }}>
              <FaComments /> Chats
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="d-flex align-items-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  border: 'none',
                  color: 'var(--white)',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                Hi, {user.firstName} <FaChevronDown size={12} />
              </button>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  backgroundColor: 'var(--white)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  minWidth: '160px',
                  zIndex: 1000,
                }}>
                  {user.role === 'LANDLORD' && (
                    <button
                      onClick={handleDashboard}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: 'var(--primary)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--light)'
                      }}>
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: '#dc3545',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="d-flex align-items-center gap-1" style={{ color: 'var(--white)', textDecoration: 'none' }}>
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                className="d-flex align-items-center gap-1"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--white)',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}>
                <FaUserPlus /> Register
              </Link>
            </>
          )}
        </div>

        {/* HAMBURGER BUTTON - mobile only */}
        <button
          className="d-md-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--white)', fontSize: '1.5rem' }}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="d-md-none mt-3 px-3 pb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="d-flex align-items-center gap-2 py-2"
            style={{ color: 'var(--white)', textDecoration: 'none' }}>
            <FaHome /> Home
          </Link>

          {user && (
            <Link
              to="/chats"
              onClick={() => setMenuOpen(false)}
              className="d-flex align-items-center gap-2 py-2"
              style={{ color: 'var(--white)', textDecoration: 'none', position: 'relative' }}>
              <FaComments /> Chats
              {unreadCount > 0 && (
                <span style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              {user.role === 'LANDLORD' && (
                <button
                  onClick={handleDashboard}
                  className="d-flex align-items-center gap-2 py-2 w-100"
                  style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: '500', padding: '8px 0' }}>
                  Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="d-flex align-items-center gap-2 py-2 w-100"
                style={{ backgroundColor: 'transparent', border: 'none', color: '#dc3545', fontWeight: '500', padding: '8px 0' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="d-flex align-items-center gap-2 py-2"
                style={{ color: 'var(--white)', textDecoration: 'none' }}>
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="d-flex align-items-center gap-2 py-2"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' }}>
                <FaUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;