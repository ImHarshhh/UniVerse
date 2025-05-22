import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  navbar: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 500,
  },
  searchContainer: {
    marginLeft: '20px',
  },
  searchInput: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: 'none',
    outline: 'none',
  }
};

const Navbar = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // You can hook this to a search API or filter logic
    alert(`Searching for user: ${search}`);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.title}>MyApp</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/create" style={styles.link}>Create Post</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>
        <form onSubmit={handleSearch} style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
