import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  return (
    <div
      className="card h-100 shadow-sm"
      style={{ borderRadius: '12px', border: 'none', overflow: 'hidden' }}>

      {/* IMAGE */}
      <div
        style={{
          backgroundColor: 'var(--primary)',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
          />
        ) : (
          <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,4 36,18 4,18" fill="#F5A623" />
            <rect x="8" y="18" width="24" height="16" fill="#F5A623" opacity="0.9" />
            <rect x="15" y="24" width="10" height="10" fill="#1A2E4A" />
            <circle cx="30" cy="30" r="4" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <line x1="33" y1="30" x2="38" y2="30" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="36" y1="30" x2="36" y2="32" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="38" y1="30" x2="38" y2="32" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        )}
      </div>

      {/* CARD BODY */}
      <div className="card-body" style={{ backgroundColor: 'var(--white)' }}>

        {/* PROPERTY TYPE BADGE */}
        <span
          className="badge mb-2"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--white)' }}>
          {property.propertyType}
        </span>

        {/* TITLE */}
        <h5 className="card-title" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
          {property.title}
        </h5>

        {/* LOCATION */}
        <p className="card-text d-flex align-items-center gap-1" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          <FaMapMarkerAlt color="#F5A623" />
          {property.location.address}, {property.location.city}, {property.location.state}
        </p>

        {/* PRICE */}
        <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>
          ₦{property.price.toLocaleString()} / year
        </p>

        {/* BEDROOMS & BATHROOMS */}
        <div className="d-flex gap-3 mb-3" style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          <span className="d-flex align-items-center gap-1"><FaBed color="#1A2E4A" /> {property.bedrooms} Beds</span>
          <span className="d-flex align-items-center gap-1"><FaBath color="#1A2E4A" /> {property.bathrooms} Baths</span>
        </div>

        {/* VIEW BUTTON */}
        <Link
          to={`/property/${property._id}`}
          className="btn w-100"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--white)',
            borderRadius: '8px',
            fontWeight: '500',
          }}>
          View Property
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;