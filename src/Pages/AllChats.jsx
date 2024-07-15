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
import Chat from "../Components/Chat";
import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";

function AllChats() {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

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

  const handleChatSelect = (chat) => {
    const recipientId = chat.participants.find((p) => p !== user.uid);
    setSelectedChat({ uid: recipientId, chatId: chat.id });
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

  return (
    <div className="flex h-screen bg-indigo-100">
      {/* Left Panel - Chat List */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/3 flex flex-col bg-white border-r shadow-lg"
      >
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-br from-indigo-100 to-orange-100 px-4 py-6 text-white flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold text-indigo-500 ">Chats</h1>
          <button
            className="text-2xl cursor-pointer hover:text-indigo-200 transition-colors duration-300"
            onClick={() => navigate("/")}
          >
            <IoHomeOutline className="text-indigo-500" />
          </button>
        </motion.header>

        <div className="flex-grow overflow-y-auto">
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                userId={user.uid}
                getOtherParticipantName={getOtherParticipantName}
                getOtherParticipantDp={getOtherParticipantDp}
                onSelect={() => handleChatSelect(chat)}
                isSelected={selectedChat && selectedChat.chatId === chat.id}
              />
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* Right Panel - Chat Box */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-2/3 flex flex-col bg-indigo-50 overflow-hidden"
      >
        {selectedChat ? (
          <div className="h-full overflow-y-auto">
            <Chat uid={selectedChat.uid} chatId={selectedChat.chatId} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-2xl text-indigo-400 font-semibold"
            >
              Select a chat to start messaging
            </motion.p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ChatItem({
  chat,
  userId,
  getOtherParticipantName,
  onSelect,
  getOtherParticipantDp,
  isSelected,
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

  return (
    <motion.li
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      className={`cursor-pointer py-4 px-6 hover:bg-indigo-50 transition-colors duration-300 border-b border-indigo-100 ${
        isSelected ? "bg-indigo-100" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden shadow-md">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={otherParticipantDp}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="ml-4 flex-grow">
          <p className="text-lg font-semibold text-gray-900">
            {otherParticipantName}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export default AllChats;