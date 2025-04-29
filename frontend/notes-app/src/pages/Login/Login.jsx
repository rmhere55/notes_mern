// import useState from 'react';
import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Passwordinput from "../../Components/Inputs/PasswordInput";
import styles from './Login.module.css'; // 👈 Import the CSS Module
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Basic email and password validation

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setEmail("");
        setPassword("");
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : "Login failed. Please try again.");
    }
  };

  return (
    <div>
      
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <form onSubmit={handleLogin}>
            <h4 className={styles.title}>Login</h4>

            <input
              type='text'
              placeholder='Email'
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type='submit' className={styles.button}>
              Login
            </button>

            <p className={styles.footerText}>
              Not registered yet?{' '}
              <Link to='/signup' className={styles.link}>
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
