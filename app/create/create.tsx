"use client";

import React, { useState, useEffect } from "react";
import styles from "./create.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Create = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [request, setRequest] = useState('');
  const [offer, setOffer] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const popoverElement = document.getElementById('create') as HTMLElement & { showPopover?: () => void };
    
    const handleToggle = () => {
      if (popoverElement?.matches(':popover-open')) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    popoverElement?.addEventListener('toggle', handleToggle);
    return () => {
      popoverElement?.removeEventListener('toggle', handleToggle);
    };
  }, []);

  const handlePost = async (event: React.FormEvent) => {
    event.preventDefault();

    // Manual validation
    if (!title.trim() || !request.trim() || !offer.trim()) {
      alert("All fields are required!");
      return; // Stop the function if any field is empty
    }

    const payload = {
      title: title,
      request: request,
      offer: offer,
    };

    try {
      const res = await fetch("https://26.hacks.illuvatar.org/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      const response = await res.text();

      if (!res.ok) {
        alert("Posting failed: " + response);
        return;
      }

      // Optionally redirect after successful post
      setIsOpen(false);
      
      // Close the parent popover element
      const popoverElement = document.getElementById('create') as HTMLElement & { hidePopover?: () => void };
      if (popoverElement && popoverElement.hidePopover) {
        popoverElement.hidePopover();
      }

      toast.success("Post created!", {
        position: "bottom-right",
        autoClose: 2000,
      });

    } catch (error) {
      console.error("Network error:", error);
      alert("Network error");
    }
  };


  const handleCancel = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsOpen(false); // closes the popover
    
    // Close the parent popover element
    const popoverElement = document.getElementById('create') as HTMLElement & { hidePopover?: () => void };
    if (popoverElement && popoverElement.hidePopover) {
      popoverElement.hidePopover();
    }
  }

  return (
    <>
      {isOpen && (
        <div className={styles.container}>
          <form onSubmit={handlePost} className={styles.createForm}>
            <div className={styles.card}>
              {/* Header */}
              <div className={styles.header}>
                <span className={styles.name}>Create Post</span>
              </div>

              {/* Title */}
              <h2 className={styles.title}>
                Title:
              </h2>
              <div className={styles.field}>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Request */}
              <h2 className={styles.title}>
                Your Request:
              </h2>
              <div className={styles.field}>
                <input
                  type="text"
                  id="request"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  required
                />
              </div>


              {/* Offer */}
              <h2 className={styles.title}>
                Your Offer:
              </h2>
              <div className={styles.field}>
                <input
                  type="text"
                  id="offer"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  required
                />
              </div>
              <div className={styles.buttonDiv}>
                <button className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className={styles.postButton}>
                  Post
                </button>
              </div>

            </div>
          </form>
        </div>
      )}
    </>

  );
};

export default Create;
