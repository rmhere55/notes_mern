import  { useState } from "react";
import styles from "./SignUp.module.css";

import Navbar from "../../components/Navbar/Navbar";
import Passwordinput from "../../components/Inputs/Passwordinput";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { validateEmail } from '../../utils/Helper'
import axiosInstance from "../../utils/axiosInstance";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

const navigate = useNavigate()
  const handleSignUp = async(e)=>{
    e.preventDefault();
  
    // Basic validation checks

    if(!name){
      setError("Please enter your name");
      return
    }
    if(!validateEmail(email)){
      setError("Invalid Email");
      return;
  }
    else if(password.length< 8){
      setError("Password must be at least 8 characters")
      return;
      }
      else{
        console.log("Email: ", email);
        console.log("Password: ", password);
        console.log("Name: ", name);
        setError('');
        }
        // signUp api call
        // Clear previous error messages
    setError('');

        
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName:name,
        email: email,
        password: password,
      });
      // Handle successful register response

      if (response.data && response.data.error) {
        setError(response.data.message)
        return
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setEmail("");
        setPassword("");
        setName("");
          navigate('/')
        
      }
    } catch (error) {
      // handle signup error 
      console.error("Login error:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : "Login failed. Please try again.");
    }

  }

  return (
    <>
         
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <form onSubmit={handleSignUp}>
            <h4 className={styles.title}>Sign Up</h4>

            <input
              type="text"
              placeholder="Name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* <Passwordinput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            /> */}
            <Passwordinput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className={styles.passwordInput}
/>


            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button}>
              Sign Up
            </button>

            <p className={styles.footerText}>
              Already have an account?{" "}
              <Link to="/login" className={styles.link}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div> 
    
    </>
  )
}

export default SignUp