import React, { useState, useEffect } from 'react';
import { FaSearch, FaStar } from 'react-icons/fa';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await API.get('/properties');
        setProperties(res.data.data);
      } catch (err) {
        setError('Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const featured = properties.filter((p) => p.isFeatured);

  const filtered = properties
    .filter((p) => !p.isFeatured)
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.city.toLowerCase().includes(search.toLowerCase()) ||
      p.location.state.toLowerCase().includes(search.toLowerCase())
    );

  const searchFiltered = search
    ? properties.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.city.toLowerCase().includes(search.toLowerCase()) ||
        p.location.state.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div>
      {/* HERO SECTION */}
      <div
        className="text-center py-5 mb-4"
        style={{
          backgroundColor: 'var(--primary)',
          borderRadius: '12px',
          color: 'var(--white)',
        }}>
        <h1 style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
          Find Your Perfect Home
        </h1>
        <p className="mt-2" style={{ color: 'var(--white)' }}>
          Browse verified properties across Nigeria
        </p>

        {/* SEARCH BAR */}
        <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
          <FaSearch color="#F5A623" />
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by title, city or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: '8px', padding: '10px' }}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* SEARCH RESULTS */}
      {search && searchFiltered && (
        <>
          <h5 className="mb-3" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            Search Results ({searchFiltered.length})
          </h5>
          {searchFiltered.length === 0 && (
            <div className="text-center mt-3">
              <h5 style={{ color: 'var(--text-light)' }}>No properties found</h5>
            </div>
          )}
          <div className="row">
            {searchFiltered.map((property) => (
              <div className="col-md-4 mb-4" key={property._id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* FEATURED PROPERTIES */}
      {!search && !loading && featured.length > 0 && (
        <>
          <div className="d-flex align-items-center gap-2 mb-3">
            <FaStar color="#F5A623" size={20} />
            <h5 style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>
              Featured Properties
            </h5>
          </div>
          <div className="row mb-4">
            {featured.map((property) => (
              <div className="col-md-4 mb-4" key={property._id}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1,
                    backgroundColor: '#F5A623',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <FaStar size={10} /> Featured
                  </div>
                  <PropertyCard property={property} />
                </div>
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <hr style={{ borderColor: 'var(--light)', marginBottom: '24px' }} />
        </>
      )}

      {/* ALL PROPERTIES */}
      {!search && !loading && (
        <>
          <h5 className="mb-3" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            {featured.length > 0 ? 'All Properties' : 'Available Properties'}
          </h5>

          {filtered.length === 0 && (
            <div className="text-center mt-3">
              <h5 style={{ color: 'var(--text-light)' }}>No properties found</h5>
            </div>
          )}

          <div className="row">
            {filtered.map((property) => (
              <div className="col-md-4 mb-4" key={property._id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default Home;