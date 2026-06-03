import React, { useState, useEffect } from 'react';
import { FaSearch, FaStar } from 'react-icons/fa';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';

const ITEMS_PER_PAGE = 6;

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  const allFiltered = properties
    .filter((p) => !p.isFeatured)
    .filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.city.toLowerCase().includes(search.toLowerCase()) ||
        p.location.state.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter ? p.propertyType === typeFilter : true;
      return matchSearch && matchType;
    });

  const searchFiltered = search || typeFilter
    ? properties.filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.location.city.toLowerCase().includes(search.toLowerCase()) ||
          p.location.state.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter ? p.propertyType === typeFilter : true;
        return matchSearch && matchType;
      })
    : null;

  // Pagination
  const totalPages = Math.ceil(allFiltered.length / ITEMS_PER_PAGE);
  const paginated = allFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

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
            onChange={handleSearch}
            style={{ borderRadius: '8px', padding: '10px' }}
          />
        </div>
      </div>

      {/* FILTER BY TYPE */}
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
        {['', 'apartment', 'house', 'duplex', 'studio', 'selfcon'].map((type) => (
          <button
            key={type}
            onClick={() => { setTypeFilter(type); setCurrentPage(1); }}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: `2px solid ${typeFilter === type ? 'var(--primary)' : 'var(--light)'}`,
              backgroundColor: typeFilter === type ? 'var(--primary)' : 'var(--white)',
              color: typeFilter === type ? 'var(--white)' : 'var(--text-light)',
              cursor: 'pointer',
              fontWeight: typeFilter === type ? '600' : '400',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}>
            {type === '' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* SEARCH/FILTER RESULTS */}
      {(search || typeFilter) && searchFiltered && (
        <>
          <h5 className="mb-3" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            Results ({searchFiltered.length})
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
      {!search && !typeFilter && !loading && featured.length > 0 && (
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
          <hr style={{ borderColor: 'var(--light)', marginBottom: '24px' }} />
        </>
      )}

      {/* ALL PROPERTIES */}
      {!search && !typeFilter && !loading && (
        <>
          <h5 className="mb-3" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            {featured.length > 0 ? 'All Properties' : 'Available Properties'}
          </h5>

          {paginated.length === 0 && (
            <div className="text-center mt-3">
              <h5 style={{ color: 'var(--text-light)' }}>No properties found</h5>
            </div>
          )}

          <div className="row">
            {paginated.map((property) => (
              <div className="col-md-4 mb-4" key={property._id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4 mb-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: '2px solid var(--primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--primary)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  fontWeight: '500'
                }}>
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '2px solid var(--primary)',
                    backgroundColor: currentPage === page ? 'var(--primary)' : 'transparent',
                    color: currentPage === page ? 'var(--white)' : 'var(--primary)',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}>
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: '2px solid var(--primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--primary)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  fontWeight: '500'
                }}>
                Next →
              </button>
            </div>
          )}

          {/* PAGE INFO */}
          {totalPages > 1 && (
            <p className="text-center" style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
              Page {currentPage} of {totalPages} — {allFiltered.length} properties total
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Home;