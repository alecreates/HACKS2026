import Image from "next/image";
import Profile from "./profile/profile";
import Login from "./login/login";
import Nav from "./nav/nav";

export default function Home() {
  return (
   <>
     <Nav></Nav>
     <Login></Login>
   </>
  );
}
