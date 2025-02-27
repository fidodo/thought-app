"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).catch((error) => alert(error.message));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <img
          src="/thinking-person.svg"
          alt="Thought emoji"
          className="w-64 h-64 mx-auto mb-8"
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Organize Your Thoughts, <br />
          <span className="text-blue-600">Bring Ideas to Life</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Capture, prioritize, and act on your ideas effortlessly. Start your
          creative journey today!
        </p>

        <button
          onClick={signInWithGoogle}
          className="bg-blue-600 text-gray-900 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
