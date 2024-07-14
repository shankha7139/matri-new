import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { MdOutlineReportOff } from "react-icons/md";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function Card(props) {
  const navigate = useNavigate();
  const hasImage = props.photos && props.photos.length > 0 && props.photos[0];
  const [isReported, setIsReported] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const checkReportStatus = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", props.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setIsReported(userData.reported || false);

        // Check if the current user is not the profile owner
        const currentUser = auth.currentUser;
        const isOwnProfile = currentUser && currentUser.uid === props.uid;

        // Show report button if it's not the user's own profile
        setShowReportButton(!isOwnProfile);
      }
    };
    checkReportStatus();
  }, [props.uid, auth]);

  const handleReport = async () => {
    if (isReported) return;

    const db = getFirestore();
    const userRef = doc(db, "users", props.uid);

    try {
      await updateDoc(userRef, {
        reported: true,
      });
      setIsReported(true);
      setOpenDialog(false);
      alert("Profile reported successfully");
    } catch (error) {
      console.error("Error reporting profile:", error);
      alert("Failed to report profile. Please try again.");
    }
  };

  const handleOpenDialog = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div
      className="bg-orange-200 p-4 rounded-xl relative shadow-xl cursor-pointer"
      onClick={() => navigate("/individualProfile", { state: { props } })}
    >
      {showReportButton && (
        <>
          <Button
            onClick={handleOpenDialog}
            disabled={isReported}
            className={`absolute top-10 right-0 z-10 ${
              isReported
                ? "bg-gray-500 cursor-default"
                : "bg-red-500 hover:bg-red-600"
            } text-white font-bold py-1 px-2 rounded-full text-xs`}
          >
            {isReported ? (
              <MdOutlineReportOff className="w-6 h-6 text-cyan-500" />
            ) : (
              <MdOutlineReportGmailerrorred className="w-6 h-6 text-red-500" />
            )}
          </Button>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <DialogTitle>{"Are you sure?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This action will report the user's profile. Are you sure you
                want to proceed?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleReport} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none hover:opacity-75 lg:h-80 flex items-center justify-center">
          {hasImage ? (
            <img
              src={props.photos[0]}
              alt="User has not set any image"
              className="object-cover object-center lg:h-full lg:w-full"
            />
          ) : (
            <FaUser className="text-gray-500 text-6xl" />
          )}
          <h3 className="text-sm absolute bottom-14 left-2 bg-gray-200 px-2 py-1 rounded-full">
            <a href="#" aria-hidden="true">
              {props.name}
            </a>
          </h3>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <p className="mt-1 text-sm text-gray-500">{props.prof}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">{props.ex}</p>
        </div>
      </div>
    </div>
  );
}
