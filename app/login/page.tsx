"use client";

import React, { useState } from "react";
import styles from "./login.module.css";

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Login submitted:', { username, password });
  };

  return (
    
    <div className={styles.container}>
      
      <form onSubmit={handleSubmit} className={styles.loginForm}>
      <div className={styles.header}>Log in</div>
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
        <button type="submit" className={styles.button}>Log In</button>
      </form>
    </div>

  );
};

export default Login;
