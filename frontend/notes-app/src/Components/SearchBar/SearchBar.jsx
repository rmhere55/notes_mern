import React, { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import styles from "./SearchBar.module.css"; // 👈 import CSS module

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const [debouncedSearch, setDebouncedSearch] = useState(value);

  
  // Debounce the search query to avoid firing search on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500); // Delay search by 500ms

    return () => clearTimeout(timer); // Cleanup on value change
  }, [value]);

  useEffect(() => {
    if (debouncedSearch !== value) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch, handleSearch, value]);
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search Notes"
        value={value}
        onChange={onChange}
        className={styles.input}
        aria-label="Search Notes" // Added for accessibility

      />
      {value && (
        <IoMdClose
          onClick={onClearSearch}
          className={styles.clearIcon}
        />
      )}
      <FaMagnifyingGlass
        className={styles.searchIcon}
        // onClick={handleSearch}
          onClick={() => handleSearch(debouncedSearch)} // Use debounced value
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
