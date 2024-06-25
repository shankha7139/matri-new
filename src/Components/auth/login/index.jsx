import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage(""); // Clear any previous error messages
      try {
        await doSignInWithEmailAndPassword(email, password);
        // If successful, the user will be redirected by the Navigate component
      } catch (error) {
        // Handle different types of errors
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else if (error.code === "auth/too-many-requests") {
          setErrorMessage(
            "Too many failed login attempts. Please try again later."
          );
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage(""); // Clear any previous error messages
      doSignInWithGoogle().catch((err) => {
        setErrorMessage(
          "An error occurred with Google Sign-In. Please try again."
        );
        setIsSigningIn(false);
      });
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Welcome Back
              </h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-bold">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            {errorMessage && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isSigningIn
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to={"/register"} className="hover:underline font-bold">
              Sign up
            </Link>
          </p>
          <div className="flex flex-row text-center w-full">
            <div className="border-b-2 mb-2.5 mr-2 w-full"></div>
            <div className="text-sm font-bold w-fit">OR</div>
            <div className="border-b-2 mb-2.5 ml-2 w-full"></div>
          </div>
          <button
            disabled={isSigningIn}
            onClick={(e) => {
              onGoogleSignIn(e);
            }}
            className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${
              isSigningIn
                ? "cursor-not-allowed"
                : "hover:bg-gray-100 transition duration-300 active:bg-gray-100"
            }`}
          >
            {/* Google SVG icon */}
            {isSigningIn ? "Signing In..." : "Continue with Google"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;