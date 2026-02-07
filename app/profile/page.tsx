"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, User, Mail, Calendar, MapPin, LogOut } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import styles from "../profile.module.css"

export default function ProfilePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "jacke@gmail.com"
    const name = localStorage.getItem("userName") || "Jake"
    setUserEmail(email)
    setUserName(name)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/map" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
          </Link>
          <div>
            <h1 className={styles.headerTitle}>Profile</h1>
            <p className={styles.headerSubtitle}>Manage your account settings</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={styles.main}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileContent}>
            <div className={styles.avatar}>
              <span className={styles.avatarText}>{initials}</span>
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{userName}</h2>
              <div className={styles.profileMeta}>
                <div className={styles.metaItem}>
                  <Mail className={styles.metaIcon} />
                  {userEmail}
                </div>
                <div className={styles.metaItem}>
                  <Calendar className={styles.metaIcon} />
                  Member since 2025
                </div>
              </div>
              <span className={styles.badge}>Active User</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Routes Planned</h3>
            <div className={styles.statValue}>24</div>
            <p className={styles.statLabel}>This month</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Saved Locations</h3>
            <div className={styles.statValue}>
              {JSON.parse(localStorage.getItem("savedLocations") || "[]").length}
            </div>
            <p className={styles.statLabel}>Total saved</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Alerts Reported</h3>
            <div className={styles.statValue}>5</div>
            <p className={styles.statLabel}>Community contributions</p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actionsCard}>
          <div className={styles.actionsHeader}>
            <h2 className={styles.actionsTitle}>Account Actions</h2>
            <p className={styles.actionsSubtitle}>Manage your account and preferences</p>
          </div>
          <div className={styles.actionsContent}>
            <Link href="/saved" className={styles.actionButton}>
              <MapPin className={styles.actionIcon} />
              Manage Saved Locations
            </Link>
            <button className={styles.actionButtonDanger} onClick={handleLogout}>
              <LogOut className={styles.actionIcon} />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

