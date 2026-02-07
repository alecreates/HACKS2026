"use client";

import React from "react";
import styles from "./feed.module.css";
import { ReactElement } from "react";
import Listing from "../listing/listing";
import Create from "../create/create";

type FeedProps = {
  listings: ReactElement<typeof Listing>[];
};

const Feed = ({ listings }: FeedProps) => {

  
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Your Neighbor Listings
      </div>

      <Create></Create>

      <div className={styles["feed-grid"]}>
        {listings}
      </div>
    </div>

  );
};

export default Feed;
