import { useNavigate } from 'react-router-dom';

import ProfileInfo from '../Cards/profileInfo';
import SearchBar from '../SearchBar/SearchBar';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css'; // 👈 Import the CSS Module

const Navbar = ({userInfo, onSearchNote ,handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // 👈 Fixed: Add parentheses

  const onLogout = () => {
    localStorage.clear()
    navigate('/login');
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  };
  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch()
  };

    // Optional: Use `useEffect` to delay search or debounce logic.
    useEffect(() => {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500); // Wait for 500ms after typing before executing search.
      return () => clearTimeout(timer); // Clean up the timeout if the search query changes.
    }, [searchQuery]);

  return (
    <div className={styles.navbar}>
      <h2 className={styles.title}>Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClearSearch={onClearSearch}
        handleSearch={handleSearch}
      />

      <ProfileInfo userInfo= {userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
