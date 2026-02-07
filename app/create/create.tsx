"use client";

import React from "react";
import styles from "./create.module.css";
import Image from "next/image";
import myImage from "./images/jake.jpg";
const Create = ({}) => {

  return (
    <div className={styles.card}>
      <Image 
      src={myImage}
      alt="Avatar" 
      width={200}
      height={200}
      />
      <div className={styles.container}>
        <h4><b>Jake F. State-Farm</b></h4>
        <p>Company Representative</p>
  </div>
</div>

    
  );
};

export default Create;
