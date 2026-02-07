"use client";

import React, { useState } from "react";
import styles from "./register.module.css";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";

const Register = ({ }) => {

  const router = useRouter();

  type RegisterPayload = {
    username: string;
    name: string;
    raw_password: string;
    nhood: number;
    phone: string;
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');

  const payload: RegisterPayload = {
    username: username,
    name: displayName,
    raw_password: password,
    nhood: Number(neighborhoodId),
    phone: phoneNumber,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch("https://26.hacks.illuvatar.org/api/register", {  // use your Rust server URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Backend returns a string like "Success" or an error
      const data = await res.text();

      if (!res.ok) {
        console.error("Registration failed:", data);
        alert("Registration failed: " + data);
        return;
      }

      console.log("Registration successful:", data);
      alert("Registration successful!");

      // route to feed
      router.push("/login");


      // Optional: redirect to login page
      // window.location.href = "/login";

    } catch (err) {
      console.error("Network error:", err);
      alert("Network error");
    }
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