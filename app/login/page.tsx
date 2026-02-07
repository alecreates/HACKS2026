"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";


const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      username,
      password,
    };

    try {
      const res = await fetch("https://26.hacks.illuvatar.org/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Read the plain text token from the response
      const token = await res.text();

      if (!res.ok) {
        console.error("Login failed:", token);
        alert("Login failed: " + token);
        return;
      }

      console.log("Login successful, token:", token);

      // Store username and token in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);

      // trigger global update
      window.dispatchEvent(new Event("auth-change"));

      alert("Login successful!");

      // Redirect to home page
      router.push("/");

    } catch (error) {
      console.error("Network error:", error);
      alert("Network error");
    }

  }

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
