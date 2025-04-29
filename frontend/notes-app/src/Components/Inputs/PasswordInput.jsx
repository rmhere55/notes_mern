import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import styles from './Passwordinput.module.css'; // 👈 import the CSS Module

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className={styles.input}
        aria-label="Password input field"

      />
      {isShowPassword ? (
        <FaRegEye
          size={22}
          className={styles.iconActive}
          onClick={toggleShowPassword}
          aria-label="Hide password"

        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className={styles.icon}
          onClick={toggleShowPassword}
          aria-label="Show password"

        />
      )}
    </div>
  );
};

export default PasswordInput;
