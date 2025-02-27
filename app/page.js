"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import IdeasSection from "./components/IdeasSection";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmileWink,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (!user) return <Login />;

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hover:from-blue-400 hover:to-green-500 transition-all duration-500">
        <div>
          <FontAwesomeIcon
            icon={faFaceSmileWink}
            className="text-yellow-400 dark:text-white px-2"
          />
        </div>
        THOUGHTS
      </h1>
      <div className="flex justify-between items-center mb-4 py-9 px-9">
        <img
          src="/phido.png"
          alt="phido Logo for all phido products"
          className="h-16 rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-300 ease-in-out"
        />
        <button
          onClick={handleLogout}
          className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
        >
          <div>
            <FontAwesomeIcon icon={faRightFromBracket} className="text-white" />
          </div>
          Logout
        </button>
      </div>
      <IdeasSection />
    </div>
  );
}
