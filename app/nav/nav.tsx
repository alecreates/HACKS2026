"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WandSparkles, Bookmark, LogOut, User } from "lucide-react"
import styles from './nav.module.css'

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  // Check token on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
  
      if (token) {
        setIsLoggedIn(true);
        setUsername(username || "");
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };
  
    // run on mount
    checkAuth();
  
    // listen for login/logout
    window.addEventListener("auth-change", checkAuth);
  
    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);
  

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
          <Link href={isLoggedIn ? "/feed" : "/"} className={styles.logo}>
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
