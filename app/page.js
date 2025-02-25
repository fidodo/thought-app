"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import IdeasSection from "./components/IdeasSection";
import { signOut } from "firebase/auth";

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
      <div className="flex justify-between items-center mb-4 py-9 px-9">
        <h1 className="  text-2xl font-bold">Thoughts App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <IdeasSection />
    </div>
  );
}
