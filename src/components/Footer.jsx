import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Logo = () => (
  <svg
    width="35"
    height="35"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="20,4 36,18 4,18" fill="#F5A623" />
    <rect x="8" y="18" width="24" height="16" fill="#F5A623" opacity="0.9" />
    <rect x="15" y="24" width="10" height="10" fill="#1A2E4A" />
    <circle
      cx="30"
      cy="30"
      r="4"
      stroke="#FFFFFF"
      strokeWidth="2"
      fill="none"
    />
    <line x1="33" y1="30" x2="38" y2="30" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="36" y1="30" x2="36" y2="32" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="38" y1="30" x2="38" y2="32" stroke="#FFFFFF" strokeWidth="2" />
  </svg>
);

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--white)",
        marginTop: "60px",
      }}
    >
      <div className="container py-5">
        <div className="row">
          {/* BRAND */}
          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Logo />
              <span
                style={{
                  color: "var(--accent)",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                }}
              >
                Home<span style={{ color: "var(--white)" }}>Find</span>
              </span>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.9rem",
                lineHeight: "1.7",
              }}
            >
              Nigeria's trusted property rental and sales platform. Find your
              perfect home or list your property with ease.
            </p>
            {/* SOCIAL LINKS */}
            <div className="d-flex gap-3 mt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)", fontSize: "1.3rem" }}
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)", fontSize: "1.3rem" }}
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)", fontSize: "1.3rem" }}
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)", fontSize: "1.3rem" }}
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-md-2 mb-4">
            <h6
              style={{
                color: "var(--accent)",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Quick Links
            </h6>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li className="mb-2">
                <Link
                  to="/"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/register"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Register
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/login"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* PROPERTY TYPES */}
          <div className="col-md-3 mb-4">
            <h6
              style={{
                color: "var(--accent)",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Property Types
            </h6>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Apartment", "House", "Duplex", "Studio", "Self Contain"].map(
                (type) => (
                  <li key={type} className="mb-2">
                    <span
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {type}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-md-3 mb-4">
            <h6
              style={{
                color: "var(--accent)",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Contact Us
            </h6>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li
                className="mb-2"
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
              >
                📧 support@homefind.ng
              </li>
              <li
                className="mb-2"
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
              >
                📞 +234 816 606 2863
              </li>
              <li
                className="mb-2"
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
              >
                📍 Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="d-flex justify-content-between align-items-center pt-4 flex-wrap gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.85rem",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} HomeFind. All rights reserved.
          </p>
          {/* <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
            Built with ❤️ in Nigeria
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
