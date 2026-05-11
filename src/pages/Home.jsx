import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
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

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.city.toLowerCase().includes(search.toLowerCase()) ||
    p.location.state.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* PROPERTIES */}
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="text-center mt-5">
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
    </div>
  );
};

export default Home;