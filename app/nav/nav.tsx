"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react";
import { usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { User, Bookmark, LogOut } from "lucide-react"
import styles from './nav.module.css'
import { useRouter } from "next/navigation";
import { WandSparkles } from 'lucide-react';




export default function Navbar() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const router = useRouter();

    useEffect(() => {
        setIsHydrated(true)
        
        // Check if there's a name in URL params (from login redirect)
        const nameParam = searchParams.get("name")
        if (nameParam) {
            setIsLoggedIn(true)
            setUsername(nameParam)
            // Store in localStorage for persistence
            localStorage.setItem("isLoggedIn", "true")
            localStorage.setItem("username", nameParam)
        } else {
          // Check if user is already logged in from localStorage
          const storedLoggedIn = localStorage.getItem("isLoggedIn") === "true"
          const storedUsername = localStorage.getItem("username") || ""
          if (storedLoggedIn && storedUsername) {
            setIsLoggedIn(true)
            setUsername(storedUsername)
          } else {
            // Not logged in - ensure state is cleared
            setIsLoggedIn(false)
            setUsername("")
          }
        }

        // Set initial value for mobile
        setIsMobile(window.innerWidth < 768)

        // Add event listener for window resize
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [searchParams])

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUsername("")
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("username")
        localStorage.removeItem("userId")
        localStorage.removeItem("token")
        setIsMenuOpen(false)
        router.push("/")
        // Dispatch a custom event to notify other components of logout
        window.dispatchEvent(new Event("userLogout"))
    }

    const navLinks = [
        //{ href: "/", label: "Home" },
        { href: "/feed", label: "Feed" },
        { href: "/activity", label: "My Activity" },
    ]

    return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <WandSparkles size={26} color="#ffffff" />
            <span className={styles.logoText}>Magic Neighbor</span>
          </Link>







{/* Copied from last project - feel free to adjust as needed 
eg - there is no Map or Report page */}






          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={
                  (!isLoggedIn && (link.label === 'Map' || link.label === 'Report'))
                  ? '/nonauth' 
                  : link.href
                }
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className={styles.authSection}>
            {isLoggedIn ? (
              <>
                <span className={styles.welcomeText}>
                  Welcome, <span className={styles.username}>{username}</span>
                </span>
                { <Link
                  href="/saved"
                  className={styles.iconButton}
                >
                  <Bookmark size={20} color="#ffffff" />
                </Link> }
                <button
                  onClick={handleLogout}
                  className={styles.iconButton}
                  title="Logout"
                >
                  <LogOut size={20} color="#ffffff" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className={styles.iconButton}
                >
                  <User size={20} color="#ffffff" />
                </Link>
                { <Link
                  href={isLoggedIn ? "/saved" : "/nonauth"}
                  className={styles.iconButton}
                >
                  <Bookmark size={20} color="#ffffff" />
                </Link> }
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {isHydrated && (
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={styles.menuButton}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isHydrated && isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.label === 'Map' && !isLoggedIn ? '/nonauth' : link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className={styles.mobileAuthSection}>
                {isLoggedIn ? (
                  <>
                    <p className={styles.mobileAuthText}>
                      Welcome, <span className={styles.username}>{username}</span>
                    </p>
                    { <Link
                      href="/saved"
                      onClick={() => setIsMenuOpen(false)}
                      className={styles.iconButton}
                    >
                      <Bookmark size={20} color="#ffffff" />
                    </Link> }
                    <button
                      onClick={handleLogout}
                      className={styles.iconButton}
                      title="Logout"
                    >
                      <LogOut size={20} color="#ffffff" />
                    </button>
                  </>
                ) : (
                  <div className={styles.mobileAuthButtons}>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={styles.iconButton}
                    >
                      <User size={20} color="#ffffff" />
                    </Link>
                    { <Link
                      href="/saved"
                      onClick={() => setIsMenuOpen(false)}
                      className={styles.iconButton}
                    >
                      <Bookmark size={20} color="#ffffff" />
                    </Link> }
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}