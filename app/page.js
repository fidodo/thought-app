"use client";

import { useState, useEffect } from "react";
import { auth } from "./lib/firebase"; 
import Login from "./components/Login";
import IdeasSection from "./components/IdeasSection";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmileWink,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase Authentication Listener (Replaces useAuthState)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!user) return <Login />;

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hover:from-blue-400 hover:to-green-500 transition-all duration-500">
        <FontAwesomeIcon
          icon={faFaceSmileWink}
          className="text-yellow-400 dark:text-white px-2"
        />
        THOUGHTS
      </h1>

      <div className="flex justify-between items-center mb-4 py-9 px-9">
        <Image
          src="/phido.png"
          alt="phido Logo for all phido products"
          className="h-16 rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-300 ease-in-out"
          width={100}
          height={100}
        />
        <button
          onClick={handleLogout}
          className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="text-white" />
          Logout
        </button>
      </div>

      <IdeasSection user={user} />
    </div>
  );
}
