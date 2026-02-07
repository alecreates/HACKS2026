"use client";

import React from "react";
import styles from "./feed.module.css";
import { ReactElement } from "react";
import Listing from "../listing/page";
import Create from "../create/create";

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

const Feed = ({ }: FeedProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Your Neighbor Listings
      </div>
      <Create></Create>
      <br/>
      <div className={styles["feed-grid"]}>
        <Listing displayName="Alex Neighbor" request="Need help fixing my fence" offer="Home-cooked meal" createdAt="5 days ago" />
        <Listing displayName="Sam Neighbor" request="Need help with gardening" offer="Gardening tools" createdAt="3 days ago" />
        <Listing displayName="Taylor Neighbor" request="Need help with moving boxes" offer="Moving assistance" createdAt="1 day ago" />
        <Listing displayName="Jordan Neighbor" request="Need help with computer setup" offer="Tech support" createdAt="2 days ago" />
        <Listing displayName="Casey Neighbor" request="Need help with pet sitting" offer="Pet care services" createdAt="4 days ago" />
        <Listing displayName="Riley Neighbor" request="Need help with painting a room" offer="Painting supplies" createdAt="6 days ago" />
        <Listing displayName="Morgan Neighbor" request="Need help with car maintenance" offer="Car repair tools" createdAt="7 days ago" />
      </div>
    </div>
  );
};

export default Feed;
