// ProfileDetail.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import Chat from "../Components/Chat";
import Header from "../Components/header";

const ProfileDetail = () => {
  const location = useLocation();
  const profile = location.state?.props;
  const [chatbox, setChatbox] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // ... other code ...

  const displayPhotos = showAllPhotos
    ? profile.photos
    : profile.photos.slice(0, 3);

  if (!profile) {
    return <div className="text-center p-10">No profile data available.</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 mt-10">
        <div className={`flex ${chatbox ? "lg:space-x-4" : ""}`}>
          <div
            className={`${
              chatbox ? "lg:w-1/2" : "w-full"
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

              <h3 className="text-xl font-semibold mt-6 mb-2">Description</h3>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          </div>

          {chatbox && (
            <div className="hidden lg:block lg:w-1/2 transition-all duration-300 ease-in-out">
              <Chat chatId={profile.chatId} />
            </div>
          )}
        </div>

        <div className="fixed bottom-4 right-4 z-10">
          <button
            onClick={() => setChatbox(!chatbox)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
          >
            <AiOutlineSend size={24} />
          </button>
        </div>

        {chatbox && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-auto">
            <div className="p-4">
              <button
                onClick={() => setChatbox(false)}
                className="mb-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Close Chat
              </button>
              <Chat chatId={profile.chatId} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetail;
