import Image from "next/image";
import Profile from "./profile/profile";
import Login from "./login/login";
import Create from "./create/create";
import Listing from "./listing/listing";
import Feed from "./feed/feed";
import type React from "react"
import Link from "next/link"
import { HeartHandshake, Repeat, Users, WandSparkles } from 'lucide-react'
import styles from "./splash.module.css"
import Navbar from "./nav/nav"



export default function SplashPage() {
  return (

  /*   <Listing
  displayName="Alex Neighbor"
  request="Need help fixing my fence"
  offer=
    "Home-cooked meal"
  createdAt="5 days ago" 
/> */

    <div className={styles.splashContainer}>
      <Navbar />
      {/* Hero Section */}
      <div className={styles.hero}>
        {/* Background Pattern */}
        <div className={styles.backgroundPattern}>
          <div className={styles.patternGrid} />
        </div>

        <div className={styles.heroContent}>
          {/* Logo/Brand */}
          <div className={styles.brandSection}>
            <div className={styles.logoCircle}>
              <WandSparkles className={styles.logoIcon} />
            </div>
            <h1 className={styles.title}>Magic Neighbor</h1>
            <p className={styles.subtitle}>
              A neighborhood exchange built on helping hands. Request help, offer your time, and support your community.         
               </p>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <Link href="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
              Register
            </Link>
            <Link href="/login" className={`${styles.btn} ${styles.btnOutline}`}>
              Log In
            </Link>
          </div>

          {/* Feature Grid */}
          <div className={styles.featureGrid}>
            <FeatureCard
              icon={<HeartHandshake className={styles.featureIcon} />}
              title="Post a Request"
              description="Ask neighbors for help with everyday needs, from fixing a fence to watching a dog."
            />
            <FeatureCard
              icon={<Repeat className={styles.featureIcon} />}
              title="Trade Favors"
              description="Respond to requests with what you can offer and exchange help instead of money."
            />
            <FeatureCard
              icon={<Users className={styles.featureIcon} />}
              title="Build Community"
              description="Strengthen your neighborhood by keeping support, skills, and trust local."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p></p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIconWrapper}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  )
}
