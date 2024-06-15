import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../context/authContext";
import ChatRoom from "../Components/ChatRoom";

const App = () => {
  const [user, loading, error] = useAuthState(useAuth());
  console.log(user, loading);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    // Render a login component or redirect to the login page
    return <div>Please log in to access the chat.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
      <ChatRoom />
    </div>
  );
};

export default App;
