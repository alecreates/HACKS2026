"use client";

import React, { useEffect, useState } from "react";
import styles from "./activity.module.css";
import Card from "../components/Card";
import { MessageCircle, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const Activity = () => {
  const initialCommunityRequests: Array<{ id: number | string; title: string; user: string; suffix: string; phone: string, postId: string }> = [

  ];

  // Sample data for archived requests
  const initialArchivedRequests: Array<{ id: number | string; title: string; user: string; suffix: string; phone: string, postId: string }> = [

  ];

  const [communityRequests, setCommunityRequests] = useState(initialCommunityRequests);
  const [archivedRequests, setArchivedRequests] = useState(initialArchivedRequests);
  const [responseData, setResponseData] = useState<any[]>([]);


  const handleCheckRequest = async (requestId: number | string, postId: string) => {
    // Find the request in communityRequests
    const requestToArchive = communityRequests.find(req => req.id === requestId);
    if (!requestToArchive) return;
  
    try {
      // Call the API to archive the post
      const res = await fetch(`https://api.26.hacks.illuvatar.org/rkyv?pid=${postId}`, {
        method: "GET", // or "PUT" depending on your API
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          
        },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to archive post with id ${requestId}`);
      }
  
      // Update the UI only after successful API call
      const archivedRequest = {
        ...requestToArchive,
        id: `archived-${requestToArchive.id}-${Date.now()}`,
        suffix: "helped with this request.",
      };
  
      setCommunityRequests(prev => prev.filter(req => req.id !== requestId));
      setArchivedRequests(prev => [...prev, archivedRequest]);

      toast.success('Post archived successfully', {
        position: "bottom-right",
        autoClose: 1000,
      });

      
    } catch (error) {
      console.error("Error archiving post:", error);
      toast.error('Failed to archive post.', {
                position: "bottom-right",
                autoClose: 3000,
              });
    }
  };
  

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch("https://api.26.hacks.illuvatar.org/responses", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        console.log("Raw API data:", data);

        // Separate archived and active requests based on post_archived flag
        const activeRequests = data
          .filter((item: any) => !item.post_archived) // only not archived
          .map((item: any, index: number) => ({
            id: index + 1,
            title: item.post_title,
            user: item.responder_name,
            suffix: "would like to help",
            phone: item.responder_phone,
            postId: item.post_id
          }));

        const archivedRequests = data
          .filter((item: any) => item.post_archived) // only archived
          .map((item: any, index: number) => ({
            id: `archived-${index + 1}-${Date.now()}`,
            title: item.post_title,
            user: item.responder_name,
            suffix: "helped with this request",
            phone: item.responder_phone,
            postId: item.post_id
          }));

        setCommunityRequests(activeRequests);
        setArchivedRequests(archivedRequests);

        setResponseData(data); // optional if you want raw data

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
                      onChange={() => handleCheckRequest(request.id, request.postId)}
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
