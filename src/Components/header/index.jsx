import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doSignOut } from "../../firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from "../../assets/Logo.png";
import { FaSearch, FaBars, FaTimes, FaUserFriends } from "react-icons/fa"; // Import FaUserFriends
import { auth } from "../../firebase/Firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { getFirestore, query, where, collection, onSnapshot } from "firebase/firestore";
import NotificationIcon from "../../assets/notification.png";
import UserIcon from "../../assets/user.png";
import Pricing from "../../assets/Pricing.png";
import FriendRequests from "../FriendRequests";
import { BsChatDots } from "react-icons/bs";
import FriendsList from "../FriendList";

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState("");
  const { userLoggedIn } = useAuth();
  const auth = getAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (userLoggedIn && auth.currentUser) {
      const firestore = getFirestore();
      const currentUserId = auth.currentUser.uid;

      const incomingRequestsQuery = query(
        collection(firestore, "friendRequests"),
        where("recipientId", "==", currentUserId),
        where("status", "==", "pending")
      );

      const getUserLoggedIn = onAuthStateChanged(auth, (user) => {
        if (user) {
          const email = user.email;
          console.log("User email:", email);
          setLoggedUser(email.split("@")[0]);
        } else {
          console.log("User is signed out");
        }
      });

      const unsubscribe = onSnapshot(incomingRequestsQuery, (querySnapshot) => {
        const requests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIncomingRequests(requests);
      });

      return () => {
        unsubscribe();
        getUserLoggedIn();
      };
    }
  }, [userLoggedIn, auth]);

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const openDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(true);
  };

  const closeDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(false);
  };

  const closeAndResetDeleteDialog = () => {
    closeDeleteAccountDialog();
    setDeletePassword("");
  };

  const handleDeleteAccount = async () => {
    try {
      if (!deletePassword) {
        alert("Password is required to delete your account.");
        return;
      }

      const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(auth.currentUser);

      closeDeleteAccountDialog();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeletePassword("");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center w-full z-20 fixed top-0 left-0 h-14 bg-gradient-to-r from-orange-200 via-[#f49d3f] to-[#f49d3f] px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-3xl font-bold text-white transition-all duration-1000 ease-in-out px-4 py-2 rounded-lg hover:text-4xl">
              <img className="mx-auto h-14 w-auto" src={logo} alt="Logo" />
            </span>
          </div>
        </div>

        <div className="lg:hidden">
          <button
            className="text-white text-2xl"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`flex-col lg:flex-row lg:flex lg:items-center gap-4 lg:gap-0 ${isMobileMenuOpen ? 'flex' : 'hidden'} absolute lg:relative top-14 lg:top-0 left-0 w-full lg:w-auto bg-gradient-to-r from-orange-200 via-[#f49d3f] to-[#f49d3f] lg:bg-transparent px-4 lg:px-0`}>
          {userLoggedIn ? (
            <div className="flex flex-col lg:flex-row items-start lg:items-center w-full lg:w-auto">
              <button onClick={() => navigate("/all-matri")} className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl w-full lg:w-auto">
                <FaSearch className="w-6 h-6 text-white animate-pulse" />
              </button>
              <Link className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl w-full lg:w-auto" to={"/payment-details"}>
                <img src={Pricing} alt="Pricing" className="w-6 h-6" />
              </Link>
              <button onClick={() => navigate("/allChats")} className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl w-full lg:w-auto">
                <BsChatDots className="w-6 h-6 text-white" />
              </button>
              <button onClick={() => setShowFriends(!showFriends)} className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl w-full lg:w-auto">
                <FaUserFriends className="w-6 h-6 text-white" /> {/* Fixed import */}
              </button>
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl cursor-pointer relative w-full lg:w-auto">
                <img src={NotificationIcon} alt="Notification Icon" className="w-6 h-6" />
                {incomingRequests.length > 0 && (
                  <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-green-500 animate-ping border-2 border-white"></span>
                )}
              </button>
              <div className="relative w-full lg:w-auto">
                <button className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl cursor-pointer w-full lg:w-auto" onClick={() => setShowDropdown(!showDropdown)}>
                  <img src={UserIcon} alt="User Icon" className="w-6 h-6" />
                </button>
                {showDropdown && (
                  <div ref={dropdownRef} onMouseLeave={handleMouseLeave} className="absolute lg:right-0 mt-2 py-2 px-2 bg-white rounded-md shadow-lg w-full lg:w-48">
                    <div className="block px-4 py-2 text-gray-800 w-full text-center bg-gray-200">Hi! {loggedUser}</div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-center" onClick={() => navigate("/profile")}>
                      Edit Profile
                    </button>
                    <button type="button" onClick={openDeleteAccountDialog} className="w-full py-2 mt-4 rounded-lg bg-red-500 text-white neumorphic-button-delete">
                      Delete Account
                    </button>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-center" onClick={() => {
                      doSignOut().then(() => {
                        navigate("/login");
                      });
                    }}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-start lg:items-center w-full lg:w-auto">
              <Link className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl w-full lg:w-auto" to={"/login"}>
                Login
              </Link>
              <Link className="text-lg text-white transition ease-in-out px-4 py-2 rounded-lg duration-1000 hover:text-xl w-full lg:w-auto" to={"/register"}>
                Register New Account
              </Link>
            </div>
          )}
        </div>
      </nav>

      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Notifications</h2>
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="p-4">
              <FriendRequests />
            </div>
          </div>
        </div>
      )}

      {showFriends && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">All Friends</h2>
              <button onClick={() => setShowFriends(!showFriends)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <div className="p-4">
              <FriendsList onClose={() => setShowFriends(false)} />
            </div>
          </div>
        </div>
      )}

      <Dialog open={deleteAccountDialogOpen} onClose={closeDeleteAccountDialog} fullWidth maxWidth="sm">
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent dividers>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p>Please enter your password to confirm account deletion:</p>
          <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="w-full p-2 mt-2 rounded-lg border border-gray-300" />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAndResetDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeleteAccount} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
