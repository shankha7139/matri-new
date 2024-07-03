import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const FriendsList = ({ onClose }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser) {
        setLoading(true);
        const friendsQuery = query(
          collection(db, "friendRequests"),
          where("status", "==", "accepted"),
          where("recipientId", "==", currentUser.uid)
        );

        const friendsQuery2 = query(
          collection(db, "friendRequests"),
          where("status", "==", "accepted"),
          where("senderId", "==", currentUser.uid)
        );

        try {
          const [querySnapshot1, querySnapshot2] = await Promise.all([
            getDocs(friendsQuery),
            getDocs(friendsQuery2),
          ]);

          const friendsList1 = querySnapshot1.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            friendId: doc.data().senderId,
          }));

          const friendsList2 = querySnapshot2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            friendId: doc.data().recipientId,
          }));

          const combinedFriendsList = [...friendsList1, ...friendsList2];

          // Fetch friend names
          const friendsWithNames = await Promise.all(
            combinedFriendsList.map(async (friend) => {
              const userDoc = await getDoc(doc(db, "users", friend.friendId));
              const userData = userDoc.data();
              return {
                ...friend,
                friendName: userData
                  ? userData.name || "Unknown User"
                  : "Unknown User",
              };
            })
          );

          console.log("Friends with names:", friendsWithNames);
          setFriends(friendsWithNames);
        } catch (error) {
          console.error("Error fetching friends:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFriends();
  }, [currentUser, db]);

  const handleBlock = async (friendRequestId, friendId) => {
    if (
      window.confirm("Are you sure you want to block and unfriend this user?")
    ) {
      try {
        // Delete the friend request document
        await deleteDoc(doc(db, "friendRequests", friendRequestId));

        // Update local state
        setFriends(friends.filter((friend) => friend.id !== friendRequestId));
      } catch (error) {
        console.error("Error blocking friend:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading friends...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Friends</h2>
      {friends.length === 0 ? (
        <p>You have no friends yet.</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded"
            >
              <span>{friend.friendName}</span>
              <button
                onClick={() => handleBlock(friend.id, friend.friendId)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Block & Unfriend
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
