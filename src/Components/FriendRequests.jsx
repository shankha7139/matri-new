import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const FriendRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const auth = getAuth();
  const firestore = getFirestore();
  const currentUserId = auth.currentUser.uid;

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Incoming Requests</h3>
          {incomingRequests.length === 0 ? (
            <p>No incoming friend requests.</p>
          ) : (
            <ul className="space-y-2">
              {incomingRequests.map((request) => (
                <li
                  key={request.id}
                  className="bg-white shadow-md rounded-md p-4 flex justify-between items-center"
                >
                  <p>From: {request.senderId}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
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
                  className="bg-white shadow-md rounded-md p-4"
                >
                  <p>To: {request.recipientId}</p>
                  {/* You can add additional actions or information here */}
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
