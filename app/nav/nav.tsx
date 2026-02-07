"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WandSparkles, Bookmark, LogOut, User } from "lucide-react"
import styles from './nav.module.css'

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [username, setUsername] = useState("")

  // Check token on mount
  // useEffect(() => {
  //   const token = localStorage.getItem("token")
  //   const storedUsername = localStorage.getItem("username") || ""
  //   if (token) {
  //     setIsLoggedIn(true)
  //     setUsername(storedUsername)
  //   } else {
  //     setIsLoggedIn(false)
  //     setUsername("")
  //   }
  // }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    setUsername("")
    router.push("/")
  }



  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navInner}>
          {/* Logo always visible */}
          <Link href="/" className={styles.logo}>
            <WandSparkles size={26} color="#ffffff" />
            <span className={styles.logoText}>Magic Neighbor</span>
          </Link>

          {/* Render everything else only if logged in */}
          {isLoggedIn && (
            <>
              {/* Desktop links */}
              <div className={styles.desktopNav}>
                <Link href="/feed" className={styles.navLink}>Feed</Link>
                <Link href="/activity" className={styles.navLink}>My Activity</Link>
              </div>

              {/* Auth section */}
              <div className={styles.authSection}>
                <span className={styles.welcomeText}>
                  Welcome, <span className={styles.username}>{username}</span>
                </span>
                <Link href="/profile" className={styles.iconButton}>
                  <User size={20} color="#ffffff" />
                </Link>
                <button
                  onClick={handleLogout}
                  className={styles.iconButton}
                  title="Logout"
                >
                  <LogOut size={20} color="#ffffff" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
