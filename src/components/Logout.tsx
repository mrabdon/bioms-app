"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      // Sign out the user and clear the session
      await signOut();

      // Optionally clear anything stored in localStorage or cookies (if needed)
      // localStorage.clear(); // if you're using local storage
      // Cookies.remove('your_cookie_name'); // if you have custom cookies

      // Redirect the user to the login page
      router.push("/login"); // Ensure this points to your login route
    };

    logout();
  }, [signOut, router]);

  return (
    <div>Logging out...</div> // Optional loading text while logging out
  );
};

export default Logout;
