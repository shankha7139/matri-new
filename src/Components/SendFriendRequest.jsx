import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const SendFriendRequest = ({ recipientId }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();
  const currentUserId = auth.currentUser.uid;

  const handleSendRequest = async () => {
    setIsSending(true);
    setError(null);

    try {
      const friendRequestsRef = collection(firestore, "friendRequests");
      await addDoc(friendRequestsRef, {
        senderId: currentUserId,
        recipientId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      console.log("Friend request sent successfully.");
    } catch (error) {
      console.error("Error sending friend request:", error);
      setError("Failed to send friend request. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <button onClick={handleSendRequest} disabled={isSending}>
        {isSending ? "Sending..." : "Send Friend Request"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SendFriendRequest;
