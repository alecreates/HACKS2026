"use client";

import React, { useState } from "react";
import styles from "./create.module.css";
import { useRouter } from "next/navigation";

const Create = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [request, setRequest] = useState('');
  const [offer, setOffer] = useState('');

  const handlePost = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      title: title,
      request: request,
      offer: offer,
    };

    try {
      const res = await fetch("https://26.hacks.illuvatar.org/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      const response = await res.text();

      if (!res.ok) {
        alert("Posting failed: " + response);
        return;
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error");
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handlePost} className={styles.createForm}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.name}>Create Post</span>
          </div>

          {/* Title */}
          <h2 className={styles.title}>
            Title:
          </h2>
          <div className={styles.field}>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Request */}
          <h2 className={styles.title}>
            Your Request:
          </h2>
          <div className={styles.field}>
            <input
              type="text"
              id="request"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />
          </div>


          {/* Offer */}
          <h2 className={styles.title}>
            Your Offer:
          </h2>
          <div className={styles.field}>
            <input
              type="text"
              id="offer"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.postButton}>
            Post
          </button>
        </div>
      </form>
    </div>

  );
};

export default Create;
