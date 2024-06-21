import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  query,
  where,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const FriendRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const auth = getAuth();
  const firestore = getFirestore();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  useEffect(() => {
    const incomingRequestsQuery = query(
      collection(firestore, "friendRequests"),
      where("recipientId", "==", currentUserId),
      where("status", "==", "pending")
    );

    const outgoingRequestsQuery = query(
      collection(firestore, "friendRequests"),
      where("senderId", "==", currentUserId),
      where("status", "==", "pending")
    );

    const unsubscribeIncoming = onSnapshot(
      incomingRequestsQuery,
      (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() });
        });
        setIncomingRequests(requests);
      }
    );

    const unsubscribeOutgoing = onSnapshot(
      outgoingRequestsQuery,
      (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() });
        });
        setOutgoingRequests(requests);
      }
    );

    return () => {
      unsubscribeIncoming();
      unsubscribeOutgoing();
    };
  }, [currentUserId, firestore]);

  const handleAcceptRequest = async (requestId) => {
    try {
      const requestRef = doc(
        collection(firestore, "friendRequests"),
        requestId
      );
      await updateDoc(requestRef, { status: "accepted" });
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const requestRef = doc(
        collection(firestore, "friendRequests"),
        requestId
      );
      await deleteDoc(requestRef);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };
  console.log(incomingRequests);
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Incoming Requests</h3>
          {incomingRequests.length === 0 ? (
            <p>No incoming friend requests.</p>
          ) : (
            <ul className="space-y-2">
              {incomingRequests.map((request) => (
                <li
                  key={request.id}
                  className="bg-white shadow-md rounded-md p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <p className="mb-2 sm:mb-0">From: {request.senderId}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Outgoing Requests</h3>
          {outgoingRequests.length === 0 ? (
            <p>No outgoing friend requests.</p>
          ) : (
            <ul className="space-y-2">
              {outgoingRequests.map((request) => (
                <li
                  key={request.id}
                  className="bg-white shadow-md rounded-md p-3"
                >
                  <p>To: {request.recipientId}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
