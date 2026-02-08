"use client"

import { useEffect, useState } from "react"
import { Smartphone, Calendar, LogOut } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import styles from "./profile.module.css"
import Card from "../components/Card"
import Image from "next/image"

function formatRelativeTime(date) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diffMs = date - now;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  let result;
  if (Math.abs(diffSeconds) < 60) result = rtf.format(diffSeconds, 'second');
  else if (Math.abs(diffMinutes) < 60) result = rtf.format(diffMinutes, 'minute');
  else if (Math.abs(diffHours) < 24) result = rtf.format(diffHours, 'hour');
  else if (Math.abs(diffDays) < 7) result = rtf.format(diffDays, 'day');
  else if (Math.abs(diffWeeks) < 4) result = rtf.format(diffWeeks, 'week');
  else if (Math.abs(diffMonths) < 12) result = rtf.format(diffMonths, 'month');
  else result = rtf.format(diffYears, 'year');

  return result.replace(' ago', '').replace(' from now', '');
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch("https://api.26.hacks.illuvatar.org/user", {
          method: "GET",
          headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
        });
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchInfo();
  }, []);

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <>
      <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>Profile</h1>
            <p className={styles.headerSubtitle}>Manage your account settings</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={styles.main}>
        {/* Profile Card */}
        {userData.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
          <Card className={styles.profileCard}>
            <div className={styles.profileContent}>
              <Image
                src="/jake.png"
                alt={userData.basic.name}
                width={96}
                height={96}
                className={styles.profileImage}
              />
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>{userData.basic.name}</h2>
                <div className={styles.profileMeta}>
                  <div className={styles.metaItem}>
                    <Smartphone className={styles.metaIcon} />
                    {userData.basic.phone}
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar className={styles.metaIcon} />
                    Neighbor for {formatRelativeTime(new Date(userData.basic.joined * 1000))}
                  </div>
                </div>
                <span className={styles.badge}>Active User</span>
              </div>
            </div>
          </Card>
  
	  {/* Stats */}
          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <h3 className={styles.statTitle}>Neighbors Helped</h3>
              <div className={styles.statValue}>{userData.additional.neighbors_helped}</div>
              <p className={styles.statLabel}>This month</p>
            </Card>
            <Card className={styles.statCard}>
              <h3 className={styles.statTitle}>Requests Made</h3>
              <div className={styles.statValue}>{userData.additional.requests_made}</div>
              <p className={styles.statLabel}>Total</p>
            </Card>
            <Card className={styles.statCard}>
              <h3 className={styles.statTitle}>Favors Exchanged</h3>
              <div className={styles.statValue}>{userData.additional.favors_exchanged}</div>
              <p className={styles.statLabel}>All time</p>
            </Card>
          </div>
          </>
        )}

        {/* Actions */}
        <Card className={styles.actionsCard}>
          <div className={styles.actionsHeader}>
            <h2 className={styles.actionsTitle}>Account Actions</h2>
            <p className={styles.actionsSubtitle}>Manage your account and preferences</p>
          </div>
          <div className={styles.actionsContent}>
            <button className={styles.actionButtonDanger} onClick={handleLogout}>
              <LogOut className={styles.actionIcon} />
              Sign Out
            </button>
          </div>
        </Card>
      </main>
    </div>
    </>
  )
}
