import React, { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
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
// import { collection, query, where, orderBy } from "firebase/firestore";

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

// ... (rest of your code remains the same)

function App() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  return (
    <div className="App">
      <section>
        {user ? (
          <ChatRoom recipientId={location.state.chatId} />
        ) : (
          <div>sign in karo pehle</div>
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

  // Create a reference to the conversation collection
  const conversationsRef = collection(firestore, "conversations");

  // Create a query to fetch messages for the current conversation'

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

  console.log(messages);

  const [formValue, setFormValue] = useState("");

  console.log(messages);

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
      <main className="flex-1 p-4 overflow-y-auto">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage} className="flex p-4 bg-gray-200">
        <input
          className="flex-1 py-2 px-4 mr-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
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
  const { text, senderId } = props.message;
  const auth = getAuth();

  const messageClass = senderId === auth.currentUser.uid ? "sent" : "received";

  return (
    <div
      className={`flex ${
        messageClass === "sent" ? "justify-end" : "justify-start"
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
    </div>
  );
}


export default App;
