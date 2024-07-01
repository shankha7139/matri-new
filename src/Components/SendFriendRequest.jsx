import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const SendFriendRequest = ({ recipientId }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [areFriends, setAreFriends] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();
  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    console.log(recipientId);
    const friendRequestQuery = query(
      collection(firestore, "friendRequests"),
      where("senderId", "in", [currentUserId, recipientId]),
      where("recipientId", "in", [currentUserId, recipientId]),
      where("status", "==", "accepted")
    );

    const unsubscribe = onSnapshot(friendRequestQuery, (querySnapshot) => {
      setAreFriends(!querySnapshot.empty);
    });

    return unsubscribe;
  }, [currentUserId, recipientId, firestore]);

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
      setRequestSent(true);
      console.log("Friend request sent ✅.");
    } catch (error) {
      console.error("Error sending friend request:", error);
      setError("Failed to send friend request. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      {areFriends ? (
        <p className="bg-[#41379d] text-[#ececfe] p-4 text-xl rounded-xl ">
          You are already friends
        </p>
      ) : requestSent ? (
        <p className="bg-[#41379d] text-[#ececfe] p-4 text-xl rounded-xl ">
          Friend request sent ✅
        </p>
      ) : (
        <button
          onClick={handleSendRequest}
          disabled={isSending}
          className="bg-lime-600 text-[#ececfe] p-4 text-xl rounded-xl "
        >
          {isSending ? "Sending..." : "Send Friend Request"}
        </button>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default SendFriendRequest;
