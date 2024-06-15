import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doSignOut } from "../../firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState("");
  const { userLoggedIn } = useAuth();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const email = user.email;
      console.log("User email:", email);
      setLoggedUser(email.split("@")[0]);
    } else {
      console.log("User is signed out");
    }
  });
  return (
    <nav className="flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-14  place-content-center items-center bg-[#f43f5e]">
      {userLoggedIn ? (
        <>
          <div
            className="flex flex-shrink-0 items-center cursor-pointer   "
            onClick={() => navigate("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-8 h-8  "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <button
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
            className="text-lg transition ease-in-out px-4 py-2 rounded-lg text-white duration-1000 hover:text-xl cursor-pointer"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-lg transition ease-in-out px-4 py-2 rounded-lg text-white duration-1000 hover:text-xl cursor-pointer"
          >
            {" "}
            {loggedUser}'s profile{" "}
          </button>
        </>
      ) : (
        <>
          <div
            class="flex flex-shrink-0 items-center cursor-pointer "
            onClick={() => navigate("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-8 h-8  "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <Link
            className="text-lg transition ease-in-out px-4 py-2 rounded-lg text-white duration-1000 hover:text-xl cursor-pointer "
            to={"/login"}
          >
            Login
          </Link>
          <Link
            className="text-lg transition ease-in-out px-4 py-2 rounded-lg text-white duration-1000 hover:text-xl cursor-pointer "
            to={"/register"}
          >
            Register New Account
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;
