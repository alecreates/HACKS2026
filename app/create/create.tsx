"use client";

import React from "react";
import styles from "./create.module.css";
const Create = ({}) => {

  return (
    <div className={styles.card}>
      <img 
      src="./images/jake.jpg" 
      alt="Avatar" 
      width={200}
      height={200}
      />
      <div className={styles.container}>
        <h4><b>John Doe</b></h4>
        <p>Architect & Engineer</p>
  </div>
</div>

    
  );
};

export default Create;
