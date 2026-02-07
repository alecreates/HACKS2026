"use client"

import { useEffect, useState } from "react"
import { User, Mail, Calendar, LogOut } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import styles from "./profile.module.css"
import Card from "../components/Card"
import Image from "next/image"

export default function ProfilePage() {

  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "jake@gmail.com"
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
        <Card className={styles.profileCard}>
          <div className={styles.profileContent}>
            <Image
              src="/jake.png"
              alt={userName}
              width={96}
              height={96}
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{userName}</h2>
              <div className={styles.profileMeta}>
                <div className={styles.metaItem}>
                  <Mail className={styles.metaIcon} />
                  {userEmail}
                </div>
                <div className={styles.metaItem}>
                  <Calendar className={styles.metaIcon} />
                  Neighbor since 2020
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
            <div className={styles.statValue}>8</div>
            <p className={styles.statLabel}>This month</p>
          </Card>
          <Card className={styles.statCard}>
            <h3 className={styles.statTitle}>Requests Made</h3>
            <div className={styles.statValue}>2</div>
            <p className={styles.statLabel}>Total</p>
          </Card>
          <Card className={styles.statCard}>
            <h3 className={styles.statTitle}>Favors Exchanged</h3>
            <div className={styles.statValue}>10</div>
            <p className={styles.statLabel}>All time</p>
          </Card>
        </div>

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

