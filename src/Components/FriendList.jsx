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
import { FaUserFriends, FaUserSlash } from "react-icons/fa";

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f49d3f]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-orange-100 p-8 max-w-md mx-auto">
      {/* <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#f49d3f] flex items-center">
          <FaUserFriends className="mr-2" />
          Your Friends
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          ×
        </button>
      </div> */}
      {friends.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          You have no friends yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <span className="text-gray-800 font-medium">
                {friend.friendName}
              </span>
              <button
                onClick={() => handleBlock(friend.id, friend.friendId)}
                className="flex items-center bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                <FaUserSlash className="mr-1" />
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