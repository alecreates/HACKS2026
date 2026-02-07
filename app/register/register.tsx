"use client";

import React, { useState } from "react";
import styles from "./register.module.css";

const Register = ({ }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Register form submitted:', { username, password });
  };

  return (
    <div className={styles.container}>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.header}>Register</div>
        <div className={styles.field}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Neighborhood ID</label>
          <input
            type="password"
            id="neighborhoodId"
            value={neighborhoodId}
            onChange={(e) => setNeighborhoodId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Register</button>
        <div className={styles.header}>Already have an account?</div>
        <div className={styles.header}>Log In</div>
        
      </form>


    </div>
  );
};

export default Register;