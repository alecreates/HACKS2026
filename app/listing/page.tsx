"use client";

import React from "react";
import styles from "./listing.module.css";

type Props = {
    displayName: string;
    request: string;
    offer: string;
    isOwner?: boolean;
    username?: string;
    createdAt: string;
};

const handleMatchButton = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Match Made:');
};

const Listing = ({ displayName, request, offer, createdAt, username, isOwner = false }: Props) => {

    const currentUser = localStorage.getItem("username");
    isOwner = username === currentUser;

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.name}>
                        {isOwner ? "You" : displayName}
                    </span>
                </div>

                {/* Title */}
                <h2 className={styles.title}>{request}</h2>

                {/* Offer */}
                <h2 className={styles.offers}>
                    Offering: {offer}
                </h2>

                <h2 className={styles.offers}>
                    Created: {createdAt}
                </h2>

                {/* Action */}
                {!isOwner && (
                    <button className={styles.matchButton}>
                        Match
                    </button>
                )}

            </div>
        </div>

    );
};

export default Listing;
