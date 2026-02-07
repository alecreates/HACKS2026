"use client";

import React, { useState } from "react";
import styles from "./activity.module.css";
import Card from "../components/Card";
import { MessageCircle, User } from "lucide-react";

const Activity = () => {
  const initialCommunityRequests: Array<{ id: number | string; title: string; user: string; suffix: string; phone: string }> = [
    { id: 1, title: "Help moving furniture", user: "Sarah Neighbor", suffix: "would like to help.", phone: "555 555 5551"},
    { id: 2, title: "Garden watering", user: "Tom Neighbor", suffix: "would like to help.", phone: "555 555 5552"},
    { id: 3, title: "Dog walking", user: "Maria Neighbor", suffix: "would like to help.", phone: "555 555 5553"},
  ];

  // Sample data for archived requests
  const initialArchivedRequests: Array<{ id: number | string; title: string; user: string; suffix: string; phone: string }> = [
    { id: 1, title: "Grocery shopping help", user: "Sarah Neighbor", suffix: "helped with this request.", phone: "555 555 5551" },
    { id: 2, title: "Tech support needed", user: "Tom Neighbor", suffix: "helped with this request.", phone: "555 555 5552" },
  ];

  const [communityRequests, setCommunityRequests] = useState(initialCommunityRequests);
  const [archivedRequests, setArchivedRequests] = useState(initialArchivedRequests);

  const handleCheckRequest = (requestId: number | string) => {
    const requestToArchive = communityRequests.find(req => req.id === requestId);
    if (requestToArchive) {
      // Change the suffix when moving to archived and create a unique ID
      const archivedRequest = {
        ...requestToArchive,
        id: `archived-${requestToArchive.id}-${Date.now()}`,
        suffix: `helped with this request.`
      };
      setCommunityRequests(communityRequests.filter(req => req.id !== requestId));
      setArchivedRequests([...archivedRequests, archivedRequest]);
    }
  };



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
        {/* Incoming Requests Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Incoming Requests</h2>
          <Card className={styles.requestCard}>
            <div className={styles.requestsContainer}>
              {communityRequests.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No current requests 😄</p>
                </div>
              ) : (
                communityRequests.map((request) => (
                  <div key={request.id} className={styles.requestItem}>
                    <input 
                      type="checkbox" 
                      className={styles.requestCheckbox}
                      onChange={() => handleCheckRequest(request.id)}
                    />
                    <div className={styles.requestContent}>
                      <div className={styles.requestHeader}>
                        <div className={styles.requestTitle}>{request.title}</div>
                      </div>
                      <div className={styles.requestDetails}>
                        <div className={styles.requestUser}>
                          <User size={16} />
                          {request.user} {request.suffix}
                        </div>
                        <div className={styles.contactInfo}>Contact: {request.phone}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Archived Requests Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Archived Requests</h2>
          <Card className={styles.requestCard}>
            <div className={styles.requestsContainer}>
              {archivedRequests.map((request) => (
                <div key={request.id} className={styles.requestItem}>
                  <div className={styles.requestHeader}>
                    <div className={styles.requestTitle}>{request.title}</div>
                  </div>
                  <div className={styles.requestDetails}>
                    <div className={styles.requestUser}>
                      <User size={16} />
                      {request.user} {request.suffix}
                    </div>
                  </div>
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
