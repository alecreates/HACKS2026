"use client";

import React, { useEffect, useState } from "react";
import styles from "./activity.module.css";
import Card from "../components/Card";
import { MessageCircle, User } from "lucide-react";

const Activity = () => {
  const initialCommunityRequests: Array<{ id: number | string; title: string; user: string; suffix: string; phone: string }> = [

  ];

  // Sample data for archived requests
  const initialArchivedRequests: Array<{ id: number | string; title: string; user: string; suffix: string; phone: string }> = [
    
  ];

  const [communityRequests, setCommunityRequests] = useState(initialCommunityRequests);
  const [archivedRequests, setArchivedRequests] = useState(initialArchivedRequests);
  const [responseData, setResponseData] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch("https://26.hacks.illuvatar.org/api/responses", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        console.log("Raw API data:", data);

        // Transform API data to match the communityRequests format
        const formattedRequests = data.map((item: any, index: number) => ({
          id: index + 1,                  // just a simple numeric id
          title: item.post_title,         // map from API
          user: item.responder_name,      // map from API
          suffix: "would like to help",   // constant suffix
          phone: item.responder_phone,    // map from API
        }));

        setCommunityRequests(formattedRequests); // update state
        setResponseData(data); // optional if you still want raw data

      } catch (error) {
        console.error("Network error:", error);
        alert("Network error");
      }
    };

    fetchResponses();
  }, []);






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
          <p>Archived requests will go here</p>
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
