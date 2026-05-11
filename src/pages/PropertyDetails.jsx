import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBed, FaBath, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowLeft, FaComments } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/properties/${id}`);
        setProperty(res.data.data);
      } catch (err) {
        setError('Property not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'LANDLORD') return;
    setChatLoading(true);
    try {
      await API.post('/chats/start', {
        propertyId: property._id,
        landlordId: property.landlord._id,
      });
      navigate('/chats');
    } catch (err) {
      console.log(err);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mt-4">{error}</div>
  );

  return (
    <div className="mt-3">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/')}
        className="btn mb-4 d-flex align-items-center gap-2"
        style={{ backgroundColor: 'var(--primary)', color: 'var(--white)', borderRadius: '8px' }}>
        <FaArrowLeft /> Back to Listings
      </button>

      <div className="row">

        {/* LEFT — IMAGE SLIDER */}
        <div className="col-md-7">
          <div style={{
            backgroundColor: 'var(--primary)',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* MAIN IMAGE */}
            <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[currentImage]}
                  alt={property.title}
                  style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                />
              ) : (
                <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
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

            {/* PREV / NEXT BUTTONS */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '45%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '45%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  ›
                </button>
              </>
            )}

            {/* IMAGE COUNTER */}
            {property.images && property.images.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '70px',
                right: '10px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '2px 10px',
                borderRadius: '20px',
                fontSize: '0.85rem'
              }}>
                {currentImage + 1} / {property.images.length}
              </div>
            )}

            {/* THUMBNAILS */}
            {property.images && property.images.length > 1 && (
              <div className="d-flex gap-2 p-2" style={{ overflowX: 'auto', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() => setCurrentImage(index)}
                    style={{
                      width: '60px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: currentImage === index ? '2px solid var(--accent)' : '2px solid transparent',
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            )}

            {/* AVAILABILITY BADGE */}
            <div className="px-2 pb-2 pt-1">
              <span
                className="badge"
                style={{
                  backgroundColor: property.isAvailable ? '#28a745' : '#dc3545',
                  color: 'var(--white)',
                  fontSize: '0.9rem',
                  padding: '8px 16px'
                }}>
                {property.isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="col-md-5">
          <div className="card p-4 shadow-sm h-100" style={{ borderRadius: '12px', border: 'none' }}>

            {/* BADGE */}
            <span
              className="badge mb-2"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--white)', width: 'fit-content' }}>
              {property.propertyType}
            </span>

            {/* TITLE */}
            <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{property.title}</h3>

            {/* LOCATION */}
            <p className="d-flex align-items-center gap-2 mt-2" style={{ color: 'var(--text-light)' }}>
              <FaMapMarkerAlt color="#F5A623" />
              {property.location.address}, {property.location.city}, {property.location.state}
            </p>

            {/* PRICE */}
            <h4 style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
              ₦{property.price.toLocaleString()} / year
            </h4>

            {/* BEDS & BATHS */}
            <div className="d-flex gap-4 my-3">
              <span className="d-flex align-items-center gap-2" style={{ color: 'var(--primary)' }}>
                <FaBed color="#1A2E4A" /> {property.bedrooms} Bedrooms
              </span>
              <span className="d-flex align-items-center gap-2" style={{ color: 'var(--primary)' }}>
                <FaBath color="#1A2E4A" /> {property.bathrooms} Bathrooms
              </span>
            </div>

            {/* DESCRIPTION */}
            <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>{property.description}</p>

            {/* LANDLORD CONTACT */}
            <div
              className="mt-3 p-3"
              style={{ backgroundColor: 'var(--light)', borderRadius: '8px' }}>
              <h6 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Contact Landlord</h6>
              <p className="d-flex align-items-center gap-2 mb-1" style={{ color: 'var(--text-light)' }}>
                <FaEnvelope color="#F5A623" /> {property.landlord.email}
              </p>
              <p className="d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--text-light)' }}>
                <FaPhone color="#F5A623" /> {property.landlord.phone}
              </p>

              {/* CHAT BUTTON */}
              {user && user.role !== 'LANDLORD' && (
                <button
                  onClick={handleStartChat}
                  disabled={chatLoading}
                  className="btn w-100 d-flex align-items-center justify-content-center gap-2 mt-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--white)',
                    borderRadius: '8px',
                    fontWeight: '500',
                    padding: '10px'
                  }}>
                  <FaComments />
                  {chatLoading ? 'Opening chat...' : 'Chat with Landlord'}
                </button>
              )}

              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="btn w-100 d-flex align-items-center justify-content-center gap-2 mt-2"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--white)',
                    borderRadius: '8px',
                    fontWeight: '500',
                    padding: '10px'
                  }}>
                  <FaComments />
                  Login to Chat
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default PropertyDetails;