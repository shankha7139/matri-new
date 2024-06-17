import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doSignOut } from "../../firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Import Notification and User icons as images
import NotificationIcon from "../../assets/notification.png";
import UserIcon from "../../assets/user.png";

const Header = () => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState("");
  const { userLoggedIn } = useAuth();
  const auth = getAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        console.log("User email:", email);
        setLoggedUser(email.split("@")[0]);
      } else {
        console.log("User is signed out");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <nav className="flex justify-between items-center w-full z-20 fixed top-0 left-0 h-14 bg-[#f43f5e] px-4">
      <div className="flex items-center gap-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl">
            YV
          </span>
        </div>
      </div>

      {userLoggedIn ? (
        <div className="flex items-center gap-4">
          <Link
            className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl"
            to={"/payment-details"}
          >
            Pricing
          </Link>

          <button
            className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl cursor-pointer"
            onClick={() => navigate("/notifications")}
          >
            <img
              src={NotificationIcon}
              alt="Notification Icon"
              className="w-6 h-6"
              style={{ verticalAlign: "middle" }}
            />
          </button>

          <div className="relative">
            <button
              className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={UserIcon}
                alt="User Icon"
                className="w-6 h-6"
                style={{ verticalAlign: "middle" }}
              />
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                onMouseLeave={handleMouseLeave}
                className="absolute right-0 mt-2 py-2 bg-white rounded-md shadow-lg w-48"
              >
                <button
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  onClick={() => navigate("/profile")}
                >
                  Edit Profile
                </button>
                <button
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  onClick={() => {
                    doSignOut().then(() => {
                      navigate("/login");
                    });
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl cursor-pointer"
            to={"/login"}
          >
            Login
          </Link>
          <Link
            className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl cursor-pointer"
            to={"/register"}
          >
            Register New Account
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;