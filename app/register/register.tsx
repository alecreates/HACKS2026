"use client";

import React, { useState } from "react";
import styles from "./register.module.css";

const Register = ({ }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Register form submitted:', { username, password });
    // make call to API
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
            <label htmlFor="Display Name">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
        <div className={styles.field}>
          <label htmlFor="Neighborhood Id">Neighborhood ID</label>
          <input
            type="text"
            id="neighborhoodId"
            value={neighborhoodId}
            onChange={(e) => setNeighborhoodId(e.target.value)}
            required
          />
          <div className={styles.field}>
            <label htmlFor="Phone Number">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className={styles.button}>Register</button>
        <div className={styles.header}>Already have an account?</div>
        <div className={styles.header}>Log In</div>
      </form>
    </div>
  );
};

export default Register;