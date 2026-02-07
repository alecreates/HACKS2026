"use client";

import React from "react";
import styles from "./feed.module.css";
import { ReactElement } from "react";
import Listing from "../listing/listing";

type FeedProps = {
  listings: ReactElement<typeof Listing>[];
};
/*
interface Props {
  listings: {
    displayName: string;
    request: string;
    offer: string;
    isOwner?: boolean;
    createdAt: string;
  }[];
}*/

const Feed = ({ listings }: FeedProps) => {

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Your Neighbor Listings
      </div>

        <div className={styles["feed-grid"]}>
          {listings}
        </div>

    </div>

  );
};

export default Feed;
