"use client";  
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import IdeasSection from "./components/IdeasSection";

export default function Home() {
  const [user] = useAuthState(auth);

  if (!user) return <Login />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thoughts App</h1>
      <IdeasSection />
    </div>
  );
}
