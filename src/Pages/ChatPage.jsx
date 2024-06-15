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

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? (
          <ChatRoom recipientId="79qLTSL8E0PRyiEShOXVCJoVJJG2" />
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
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
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
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  );
}

export default App;
