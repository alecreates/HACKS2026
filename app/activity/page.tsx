"use client";

import React from "react";
import styles from "./activity.module.css";
import Card from "../components/Card";
import { MessageCircle, User } from "lucide-react";

const Activity = () => {
  const communityRequests = [
    { id: 1, title: "Help moving furniture", user: "Sarah Neighbor", location: "3 blocks away", urgency: "high" },
    { id: 2, title: "Garden watering", user: "Tom Neighbor", location: "2 blocks away", urgency: "low" },
    { id: 3, title: "Dog walking", user: "Maria Neighbor", location: "1 block away", urgency: "medium" },
  ];

  // Sample data for my requests
  const myRequests = [
    { id: 1, title: "Grocery shopping help", status: "pending", responses: 2, createdAt: "2 days ago" },
    { id: 2, title: "Tech support needed", status: "in-progress", responses: 1, createdAt: "5 days ago" },
    { id: 3, title: "Furniture assembly", status: "completed", responses: 3, createdAt: "1 week ago" },
  ];
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>My Activity</h1>
            <p className={styles.headerSubtitle}>Track community requests and your own activities</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Community Requests Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Community Requests</h2>
          <Card className={styles.requestCard}>
            <div className={styles.requestsContainer}>
              {communityRequests.map((request) => (
                <div key={request.id} className={styles.requestItem}>
                  <div className={styles.requestHeader}>
                    <div className={styles.requestTitle}>{request.title}</div>
                    <span className={`${styles.urgency} ${styles[`urgency${request.urgency}`]}`}>
                      {request.urgency}
                    </span>
                  </div>
                  <div className={styles.requestDetails}>
                    <div className={styles.requestUser}>
                      <User size={16} />
                      {request.user}
                    </div>
                    <div className={styles.requestLocation}>📍 {request.location}</div>
                  </div>
                  <button className={styles.respondButton}>Respond</button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* My Requests Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>My Requests</h2>
          <Card className={styles.requestCard}>
            <div className={styles.requestsContainer}>
              {myRequests.map((request) => (
                <div key={request.id} className={styles.requestItem}>
                  <div className={styles.requestHeader}>
                    <div className={styles.requestTitle}>{request.title}</div>
                    <span className={`${styles.status} ${styles[`status${request.status}`]}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className={styles.requestDetails}>
                    <div className={styles.responses}>
                      <MessageCircle size={16} />
                      {request.responses} response{request.responses !== 1 ? 's' : ''}
                    </div>
                    <div className={styles.createdAt}>{request.createdAt}</div>
                  </div>
                  <button className={styles.viewButton}>View Details</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Activity;
