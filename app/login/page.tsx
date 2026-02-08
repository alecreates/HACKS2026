"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = { username, password };

    try {
      const res = await fetch("https://api.26.hacks.illuvatar.org/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const token = await res.text();

      if (!res.ok) {
        toast.error(`Login failed: ${token}`, {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      // Store username and token
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);

      // trigger global update
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Login successful!", {
        position: "bottom-right",
        autoClose: 2000,
      });

      // Redirect after small delay so toast shows
      setTimeout(() => {
        router.push("/feed");
      }, 1200);

    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className={styles.container}>

      {/* Toast container must be rendered */}
      <ToastContainer />

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
