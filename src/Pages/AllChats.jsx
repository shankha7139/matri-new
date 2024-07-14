import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import Chat from "../Components/Chat"; // Import the Chat component

function AllChats() {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(firestore, "conversations"),
          where("participants", "array-contains", currentUser.uid)
        );

        const unsubscribeChats = onSnapshot(q, (snapshot) => {
          const chatList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChats(chatList);
        });

        return () => unsubscribeChats();
      }
    });

    return () => unsubscribe();
  }, []);

  const getOtherParticipantName = async (participants) => {
    const otherParticipantId = participants.find((p) => p !== user.uid);
    try {
      const userDoc = await getDoc(doc(firestore, "users", otherParticipantId));
      if (userDoc.exists()) {
        return userDoc.data().name;
      } else {
        return "Unknown User";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Error";
    }
  };

  const getOtherParticipantDp = async (participants) => {
    const otherParticipantId = participants.find((p) => p !== user.uid);
    try {
      const userDoc = await getDoc(doc(firestore, "users", otherParticipantId));
      if (userDoc.exists()) {
        return userDoc.data().photos[0];
      } else {
        return "Unknown User";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Error";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600">
          Please log in to view your chats.
        </p>
      </div>
    );
  }

  //   console.log(selectedChat.participants);

  const handleChatSelect = (chat) => {
    const recipientId = chat.participants.find((p) => p !== user.uid);
    setSelectedChat({ uid: recipientId, chatId: chat.id });
  };

  if (selectedChat) {
    return (
      <div className="mt-20">
        <Chat uid={selectedChat.uid} chatId={selectedChat.chatId} />
      </div>
    );
  }

  //   if (selectedChat) {
  //     console.log(
  //       "yala buga",
  //       selectedChat.participants.find((p) => p !== user.uid)
  //     );
  //     const temp = selectedChat.participants.find((p) => p !== user.uid);
  //     console.log(temp);
  //     return <Chat uid={temp} />;
  //     // return <div>{selectedChat.participants.find((p) => p !== user.uid)}</div>;
  //   }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-indigo-100">
        <p className="text-xl text-[#f49d3f] font-semibold">
          Please log in to view your chats.
        </p>
      </div>
    );
  }

  if (selectedChat) {
    return (
      <div className="mt-20">
        <Chat uid={selectedChat.uid} chatId={selectedChat.chatId} />
      </div>
    );
  }

  return (
    <div className="mx-auto bg-indigo-100 h-screen flex flex-col">
      <header className="bg-gradient-to-r from-[#f49d3f] to-[#ffa726] px-4 text-white p-6 shadow-lg flex justify-center text-center">
        <h1 className="text-2xl font-bold">All Chats</h1>
      </header>
      <button
        className="absolute top-0 left-0 mt-6 ml-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => window.history.back()}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>
      <ul className="flex-grow overflow-y-auto px-4 py-6">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            userId={user.uid}
            getOtherParticipantName={getOtherParticipantName}
            getOtherParticipantDp={getOtherParticipantDp}
            onSelect={() => handleChatSelect(chat)}
          />
        ))}
      </ul>
    </div>
  );
}

function ChatItem({
  chat,
  userId,
  getOtherParticipantName,
  onSelect,
  getOtherParticipantDp,
}) {
  const [otherParticipantName, setOtherParticipantName] =
    useState("Loading...");
  const [otherParticipantDp, setOtherParticipantDp] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      const name = await getOtherParticipantName(chat.participants);
      setOtherParticipantName(name);
      const dp = await getOtherParticipantDp(chat.participants);
      setOtherParticipantDp(dp);
    };
    fetchName();
  }, [chat.participants, getOtherParticipantName, getOtherParticipantDp]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <li
      className="bg-white hover:bg-indigo-50 cursor-pointer rounded-lg shadow-md mb-4 transition duration-300 ease-in-out transform hover:scale-102"
      onClick={onSelect}
    >
      <div className="flex items-center px-6 py-4">
        <div className="flex-shrink-0 h-14 w-14 rounded-full overflow-hidden bg-[#f49d3f] flex items-center justify-center text-white font-bold text-xl shadow-md">
          <img src={otherParticipantDp} alt="" />
        </div>
        <div className="ml-4 flex-grow">
          <p className="text-lg font-semibold text-gray-900">
            {otherParticipantName}
          </p>
          {chat.lastMessage && (
            <p className="text-sm text-gray-600 mt-1">
              {chat.lastMessage.text.length > 30
                ? chat.lastMessage.text.substring(0, 30) + "..."
                : chat.lastMessage.text}
            </p>
          )}
        </div>
        {chat.lastMessage && (
          <span className="text-xs text-gray-400 ml-2">
            {new Date(chat.lastMessage.timestamp?.toDate()).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )}
          </span>
        )}
      </div>
    </li>
  );
}

export default AllChats;
