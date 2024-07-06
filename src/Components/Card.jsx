import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

export default function Card(props) {
  const navigate = useNavigate();
  const hasImage = props.photos && props.photos.length > 0 && props.photos[0];
  const [isReported, setIsReported] = useState(false);

  const handleReport = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the report button
    if (isReported) return;

    const db = getFirestore();
    const userRef = doc(db, "users", props.uid);

    try {
      await updateDoc(userRef, {
        reported: true,
      });
      setIsReported(true);
      alert("Profile reported successfully");
    } catch (error) {
      console.error("Error reporting profile:", error);
      alert("Failed to report profile. Please try again.");
    }
  };

  return (
    <div
      className="bg-orange-200 p-4 rounded-xl relative shadow-xl cursor-pointer"
      onClick={() => navigate("/individualProfile", { state: { props } })}
    >
      <button
        onClick={handleReport}
        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full text-xs transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        disabled={isReported}
      >
        {isReported ? "Reported" : "Report"}
      </button>
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none hover:opacity-75 lg:h-80 flex items-center justify-center">
          {hasImage ? (
            <img
              src={props.photos[0]}
              alt="User has not set any image"
              className="object-cover object-center lg:h-full lg:w-full"
            />
          ) : (
            <FaUser className="text-gray-500 text-6xl" />
          )}
          <h3 className="text-sm absolute bottom-14 left-2 bg-gray-200 px-2 py-1 rounded-full">
            <a href="#" aria-hidden="true">
              {props.name}
            </a>
          </h3>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <p className="mt-1 text-sm text-gray-500">{props.prof}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">{props.ex}</p>
        </div>
      </div>
    </div>
  );
}
