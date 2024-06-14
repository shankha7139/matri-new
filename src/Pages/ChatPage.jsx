import React from "react";
import { auth } from "../firebase/Firebase";
import { useAuth } from "../context/authContext";
import Chat from "../Components/Chat";

export default function ChatPage() {
  const { currentUser } = useAuth(auth);
  return (
    <div>
      {!currentUser ? (
        <div>Login karo pehle</div>
      ) : (
        <>
          <Chat />
        </>
      )}
    </div>
  );
}
