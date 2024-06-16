import React, { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getDoc, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useLocation } from "react-router-dom";
const firebaseConfig = {
  apiKey: "AIzaSyCUqEZklvL_n9rwZ2v78vxXWVv6z_2ALUE",
  authDomain: "matri-site-cf115.firebaseapp.com",
  projectId: "matri-site-cf115",
  storageBucket: "matri-site-cf115.appspot.com",
  messagingSenderId: "231063048901",
  appId: "1:231063048901:web:968969b3f06dd22f1096ac",
  measurementId: "G-351NC8Z306",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

function App(props) {
  const [user] = useAuthState(auth);
  const location = useLocation();
  return (
    <div className="App h-full">
      <section className="h-full">
        {user ? (
          <ChatRoom recipientId={props.chatId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}
function ChatRoom({ recipientId }) {
  const dummy = useRef();
  const firestore = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const conversationsRef = collection(firestore, "conversations");

  const [conversationDoc, setConversationDoc] = useState(null);

  useEffect(() => {
    async function fetchConversation() {
      const conversationId = [currentUser.uid, recipientId].sort().join(":");
      const conversationRef = doc(conversationsRef, conversationId);
      const conversationSnapshot = await getDoc(conversationRef);

      if (conversationSnapshot.exists()) {
        setConversationDoc(conversationRef);
      } else {
        const newConversationRef = await getOrCreateConversation(
          conversationsRef,
          currentUser.uid,
          recipientId
        );
        setConversationDoc(newConversationRef);
      }
    }

    fetchConversation();
  }, [currentUser.uid, recipientId]);

  const messagesRef = conversationDoc
    ? collection(conversationDoc, "messages")
    : null;
  const messagesQuery = messagesRef
    ? query(messagesRef, orderBy("createdAt"))
    : null;

  const [messages] = useCollectionData(messagesQuery, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (conversationDoc) {
      await addDoc(collection(conversationDoc, "messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        senderId: currentUser.uid,
      });

      setFormValue("");
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 overflow-y-auto mb-16"> {/* Add mb-16 to create space for the form */}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage} className="p-4 bg-gray-200 sticky bottom-0 w-full">
        <div className="flex items-center space-x-4">
          <input
            className="flex-1 py-2 px-4 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type a message..."
          />

          <button
            type="submit"
            disabled={!formValue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}


async function getOrCreateConversation(
  conversationsRef,
  currentUserId,
  recipientId
) {
  const conversationId = [currentUserId, recipientId].sort().join(":");
  const conversationRef = doc(conversationsRef, conversationId);

  const conversationDoc = await getDoc(conversationRef);

  if (conversationDoc.exists()) {
    return conversationRef;
  }

  await setDoc(conversationRef, {
    participants: [currentUserId, recipientId],
    createdAt: serverTimestamp(),
  });

  await updateDoc(conversationRef, {
    participants: arrayUnion(currentUserId, recipientId),
  });

  return conversationRef;
}

function ChatMessage(props) {
  const { text, senderId, createdAt } = props.message;
  const auth = getAuth();

  const messageClass = senderId === auth.currentUser.uid ? "sent" : "received";

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div
      className={`flex flex-col ${
        messageClass === "sent" ? "items-end" : "items-start"
      } mb-4`}
    >
      <div
        className={`py-2 px-4 rounded-lg max-w-xs lg:max-w-md ${
          messageClass === "sent"
            ? "bg-blue-600 text-white"
            : "bg-gray-300 text-gray-800"
        }`}
      >
        <p>{text}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1">
        {createdAt?.seconds
          ? formatDate(new Date(createdAt.seconds * 1000))
          : ""}
      </span>
    </div>
  );
}

export default App;
