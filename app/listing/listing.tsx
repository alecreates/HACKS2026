import React, { useState } from "react";
import styles from "./listing.module.css";

type Props = {
  displayName: string;
  request: string;
  offer: string;
  isOwner?: boolean;
  username?: string;
  createdAt: string;
  id: string;
};

const Listing = ({
  displayName,
  request,
  offer,
  createdAt,
  username,
  id,
  isOwner = false,
}: Props) => {
  const [matched, setMatched] = useState(false); // <-- React state
  const currentUser = localStorage.getItem("username");
  isOwner = username === currentUser;

  const handleMatchButton = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Match Made:", id);

    if (!matched) {
      try {
        const res = await fetch(
          `https://api.26.hacks.illuvatar.org/match?pid=${id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!res.ok) {
          throw new Error("Request failed: " + res.status);
        }

        setMatched(true); // <-- update state to trigger re-render
      } catch (error) {
        console.error("Network error:", error);
        alert("You've already requested this match!");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.name}>{isOwner ? "You" : displayName}</span>
        </div>

        {/* Title */}
        <h2 className={styles.title}>{request}</h2>

        {/* Offer */}
        <h2 className={styles.offers}>Offering: {offer}</h2>
        <h2 className={styles.offers}>Created: {createdAt}</h2>

        {/* Action */}
        {!isOwner && !matched && (
          <button
            className={styles.matchButton}
            onClick={handleMatchButton}
          >
            Match
          </button>
        )}

        {!isOwner && matched && (
          <button className={styles.matchButton} disabled={true}>
            Requested
          </button>
        )}
      </div>
    </div>
  );
};

export default Listing;
