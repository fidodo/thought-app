import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).catch((error) => alert(error.message));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={signInWithGoogle}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
