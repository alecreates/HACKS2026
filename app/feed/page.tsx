"use client";

import React, { useEffect, useState } from "react";
import styles from "./feed.module.css";
import Listing from "../listing/page";
import Create from "../create/create";

const Feed = () => {
  const [feedData, setFeedData] = useState<any[]>([]);


  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch("https://26.hacks.illuvatar.org/api/feed", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          throw new Error("Request failed: " + res.status);
        }

        const data = await res.json();   // ✅ parentheses

        console.log("FULL RESPONSE:", data);

        // If it's an array of objects
        data.forEach((item: any, index: number) => {
          console.log(`Item ${index}:`, item);
          console.log("Keys:", Object.keys(item));
        });

        setFeedData(data); // store if you want to render later
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error");
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your Neighbor Listings</div>

      <div className={styles.create_container}>
        <div className={styles.create_card}>
          <p>Need something from the community?</p>
          <button className={styles.create_button} popoverTarget="create">
            Create Post
          </button>
        </div>
      </div>

      <div popover="" id="create" className={styles.create_popover}>
        <Create />
      </div>

      <br />

      <div className={styles["feed-grid"]}>
        {feedData.length === 0 ? (
          <p>Loading listings...</p>
        ) : (
          feedData.map((item, index) => (
            <Listing
              key={index}
              displayName={item.author || item.username}
              request={item.request}
              offer={item.offer}
              createdAt={new Date(item.timestamp * 1000).toLocaleString()}
              isOwner={false}
              username={item.username}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Feed;
