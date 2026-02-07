import Image from "next/image";
import Profile from "./profile/profile";
import Login from "./login/login";
import Register from "./register/register";
import Listing from "./listing/listing";

export default function Home() {
  return (
    <Listing
    displayName="Alex Neighbor"
    request="Need help fixing my fence"
    offer=
      "Home-cooked meal"
    createdAt="5 days ago" 
  />
  );
}
