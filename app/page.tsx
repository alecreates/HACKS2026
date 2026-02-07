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
    <Create></Create>
  )
}
