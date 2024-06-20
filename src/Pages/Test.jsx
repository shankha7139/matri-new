import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaCheckCircle, FaTimesCircle, FaVolumeUp } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase/Firebase"; // Import storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions

const ProfileForm = () => {
  const { currentUser } = useAuth();
  const [adharCheck, setAdharCheck] = useState(false);
  const [formData, setFormData] = useState({
    uid: currentUser.uid,
    name: "",
    age: "",
    number: "",
    email: currentUser.email,
    religion: "",
    motherTongue: "",
    sex: "",
    profession: "",
    description: "",
    aadhaarNumber: "",
    captcha: "",
  });
  const [photos, setPhotos] = useState([]);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAudio, setCaptchaAudio] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (acceptedFiles) => {
    const formattedFiles = acceptedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file), // Create a local URL for rendering preview
      file: file // Keep the file object itself for uploading/storage
    }));
  
    setPhotos([...photos, ...formattedFiles]);
  };

  const generateCaptcha = () => {
    fetch("http://127.0.0.1:5000/generate-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCaptchaImage("data:image/jpeg;base64," + data.imageBase64);
        setCaptchaAudio("data:audio/mpeg;base64," + data.audioBase64);
        setTransactionId(data.transactionId);
      })
      .catch((error) => console.error("Error:", error));
  };

  const verifyAadhaar = () => {
    const data = {
      aadhaar_number: formData.aadhaarNumber,
      captcha: formData.captcha,
      transaction_id: transactionId,
    };

    fetch("http://127.0.0.1:5000/verify-aadhaar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusMessage.includes("doesn't") || data.status === "Error") {
          setVerificationStatus(false);
          setAdharCheck(false);
        } else {
          setVerificationStatus(true);
          setAdharCheck(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setVerificationStatus(false);
        setAdharCheck(false);
      });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const uploadPhoto = async (photo) => {
    const storageRef = ref(storage, `photos/${currentUser.uid}/${photo.name}`);
    await uploadBytes(storageRef, photo.file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adharCheck) {
      alert("Please verify your Aadhaar before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos and get their URLs
      const photoURLs = await Promise.all(photos.map(uploadPhoto));

      // Save user data in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        uid: formData.uid,
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        number: formData.number,
        email: formData.email,
        religion: formData.religion,
        motherTongue: formData.motherTongue,
        sex: formData.sex,
        profession: formData.profession,
        description: formData.description,
        adharVarified: adharCheck,
        photos: photoURLs, // Store URLs instead of File objects
        updatedAt: new Date()
      }, { merge: true });

      setProfileUpdated(true);
    } catch (err) {
      console.error("Error submitting profile:", err);
      alert("Error submitting profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handlePhotoUpload,
    accept: "image/*",
  });

  const playCaptchaAudio = () => {
    const audio = new Audio(captchaAudio);
    audio.play();
  };

  const handleDialogClose = () => {
    setProfileUpdated(false);
    navigate("/");
  };

  return (
    <div className="container mx-auto bg-red-100 p-6 mt-10 rounded-lg shadow-md">
      <button
        className="absolute top-0 left-0 mt-4 ml-4 bg-cyan-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
      <h1 className="text-2xl font-bold mb-6 text-center">Profile Info</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap -mx-2">
          {[
            { label: "Name", type: "text", name: "name" },
            { label: "Age", type: "number", name: "age" },
            { label: "Phone Number", type: "text", name: "number" },
            { label: "Religion", type: "text", name: "religion" },
            { label: "Mother Tongue", type: "text", name: "motherTongue" },
            { label: "Profession", type: "text", name: "profession" },
          ].map((field) => (
            <div key={field.name} className="w-full sm:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          ))}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sex
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="" disabled>
                Select your sex
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div className="w-full px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              required
            />
          </div>
          <div className="w-full flex items-start px-2 mb-4">
            <div className="flex-1 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Aadhaar Number
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex flex-col items-start flex-1 ml-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Captcha
              </label>
              <div className="flex items-center w-full">
                <img src={captchaImage} alt="Captcha" className="mr-2" />
                <FaVolumeUp
                  className="text-gray-700 cursor-pointer"
                  size={24}
                  onClick={playCaptchaAudio}
                />
                <input
                  type="text"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  required
                />
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center px-2 mb-4">
            <button
              type="button"
              onClick={generateCaptcha}
              className="bg-cyan-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Refresh Captcha
            </button>
            <button
              type="button"
              onClick={verifyAadhaar}
              className="bg-cyan-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Verify Aadhaar
            </button>
            {verificationStatus !== null && (
              <span className="ml-2">
                {verificationStatus ? (
                  <FaCheckCircle className="text-green-500" size={28} />
                ) : (
                  <FaTimesCircle className="text-red-500" size={28} />
                )}
              </span>
            )}
          </div>
          <div className="w-full px-2 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Photos
            </label>
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
            >
              <input {...getInputProps()} multiple />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some photos here, or click to select files</p>
              )}
            </div>
            {photos.length > 0 && (
              <div className="mt-4">
                <h4 className="text-gray-700 text-sm font-bold mb-2">
                  Selected Photos:
                </h4>
                <ul>
                  {photos.map((photo, index) => (
                    <li key={index} className="text-gray-600 text-sm">
                      {photo.name}
                      <img src={photo.url} alt={photo.name} className="mt-2 w-16 h-16 object-cover rounded" />
                    </li>
                  ))}                  
                </ul>
              </div>
            )}
          </div>
        </div>
        {isSubmitting ? (
          <button
            type="button"
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-not-allowed"
            disabled
          >
            Submitting...
          </button>
        ) : profileUpdated ? null : (
          <button
            type="submit"
            className={`bg-cyan-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              !adharCheck ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={!adharCheck}
          >
            Submit
          </button>
        )}
      </form>

      <Dialog open={profileUpdated} onClose={handleDialogClose}>
        <DialogTitle>Profile Updated!</DialogTitle>
        <DialogContent>Your profile has been updated successfully.</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            Go to Home
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileForm;
