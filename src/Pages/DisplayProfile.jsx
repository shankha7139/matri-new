import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import Chat from "../Components/Chat";
import Header from "../Components/header";
import SendFriendRequest from "../Components/SendFriendRequest";

const ProfileDetail = () => {
  const location = useLocation();
  const profile = location.state?.props;
  const [chatbox, setChatbox] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!profile) {
    return <div className="text-center p-10">No profile data available.</div>;
  }

  const displayPhotos = showAllPhotos
    ? profile.photos
    : profile.photos.slice(0, 3);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 mt-10">
        <button
          className="absolute top-14 left-10 mt-4 ml-4 bg-cyan-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
        <div className="relative">
          <div
            className={`${
              chatbox ? "hidden" : "block"
            } transition-all duration-300 ease-in-out`}
          >
            <h1 className="text-3xl font-bold mb-6 text-center">
              {profile.name}'s Profile
            </h1>

            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayPhotos.map((photo, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1">
                    <img
                      src={photo}
                      alt={`${profile.name}'s photo ${index + 1}`}
                      className="object-cover rounded-lg shadow-md w-full h-full"
                    />
                  </div>
                ))}
              </div>

              {profile.photos.length > 3 && !showAllPhotos && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Show More Photos ({profile.photos.length - 3} more)
                  </button>
                </div>
              )}

              {showAllPhotos && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllPhotos(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Show Less
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <span className="font-bold">Age:</span> {profile.age}
                  </p>
                  <p>
                    <span className="font-bold">Religion:</span>{" "}
                    {profile.religion}
                  </p>
                  <p>
                    <span className="font-bold">Mother Tongue:</span>{" "}
                    {profile.motherTongue}
                  </p>
                  <p>
                    <span className="font-bold">Gender:</span> {profile.sex}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-bold">Profession:</span>{" "}
                    {profile.profession}
                  </p>
                  <p>
                    <span className="font-bold">Height:</span> {profile.height}
                  </p>
                  <p>
                    <span className="font-bold">Email:</span> {profile.email}
                  </p>
                  <p>
                    <span className="font-bold">Phone:</span> {profile.number}
                  </p>
                </div>
              </div>
              <div className="bg-cyan-600 p-4 rounded-xl">
                {" "}
                <SendFriendRequest recipientId={profile.chatId} />
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-2">Description</h3>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          </div>

          {chatbox && (
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16">
                  <img
                    src={profile.photos[0]}
                    alt={`${profile.name}'s profile`}
                    className="object-cover rounded-full w-full h-full"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                </div>
                <button
                  onClick={() => setChatbox(false)}
                  className="absolute top-0 right-0 m-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  &#x2715;
                </button>
              </div>
              <div
                className="overflow-auto"
                style={{ maxHeight: "calc(100vh - 112px)" }}
              >
                <Chat chatId={profile.chatId} />
              </div>
            </div>
          )}

          {!chatbox && (
            <div className="fixed bottom-4 right-4 z-50">
              <button
                onClick={() => setChatbox(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
              >
                <AiOutlineSend size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileDetail;
