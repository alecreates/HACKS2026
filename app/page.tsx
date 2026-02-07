import Image from "next/image";
import Profile from "./profile/page";
import Login from "./login/page";
import Create from "./create/page";
import Listing from "./listing/page";
import Feed from "./feed/page";
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
<Feed listings={[
  <Listing displayName="Alex Neighbor" request="Need help fixing my fence" offer="Home-cooked meal" createdAt="5 days ago" />,
  <Listing displayName="Sam Neighbor" request="Need help with gardening" offer="Gardening tools" createdAt="3 days ago" />,
  <Listing displayName="Taylor Neighbor" request="Need help with moving boxes" offer="Moving assistance" createdAt="1 day ago" />,
  <Listing displayName="Jordan Neighbor" request="Need help with computer setup" offer="Tech support" createdAt="2 days ago" />,
  <Listing displayName="Casey Neighbor" request="Need help with pet sitting" offer="Pet care services" createdAt="4 days ago"/>,
  <Listing displayName="Riley Neighbor" request="Need help with painting a room" offer="Painting supplies" createdAt="6 days ago"/>,
  <Listing displayName="Morgan Neighbor" request="Need help with car maintenance" offer="Car repair tools" createdAt="7 days ago"/>,
]}>
</Feed>
  )
}
