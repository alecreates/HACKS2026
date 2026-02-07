"use client";

import React, {useState} from "react";
import styles from "./create.module.css";
import Image from "next/image";
import myImage from "./images/jake.jpg";



const Create = () => {
  
  const [request, setRequest] = useState('');
  const [offer, setOffer] = useState('');

  const handlePost = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Post Created:', { request, offer });
  }

  return (
    <div className={styles.container}>
      
      <form onSubmit={handlePost} className={styles.createForm}>
        <div className={styles.card}>

          {/* Header */}
          <div className={styles.header}>
            <span className={styles.name}>Create Post!</span>
          </div>
          
          {/* Title */}
          <h2 className={styles.title}>
            Your request:
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
