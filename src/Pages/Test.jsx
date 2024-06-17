import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    number: "",
    email: "",
    religion: "",
    motherTongue: "",
    sex: "",
    profession: "",
    description: "",
    aadhaarNumber: "", // New field for Aadhaar number
    captcha: "", // New field for captcha
  });
  const [photos, setPhotos] = useState([]);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAudio, setCaptchaAudio] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [result, setResult] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null); // New state for verification status

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (acceptedFiles) => {
    setPhotos([...photos, ...acceptedFiles]);
  };

  const generateCaptcha = () => {
    fetch("http://127.0.0.1:5000/generate-captcha", {
      // Updated URL
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
      // Updated URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusMessage.includes("doesn't")) {
          setResult(
            "Aadhaar verification failed: Aadhaar number doesn't exist."
          );
          setVerificationStatus(false); // Set verification status to false
        } else if (data.status === "Error") {
          setResult(
            "Captcha verification failed. Please enter the correct captcha."
          );
          setVerificationStatus(false); // Set verification status to false
        } else {
          setResult("Aadhaar verification successful: Aadhaar number exists.");
          setVerificationStatus(true); // Set verification status to true
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setResult("Error occurred while verifying Aadhaar.");
        setVerificationStatus(false); // Set verification status to false
      });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    verifyAadhaar();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    photos.forEach((photo, index) => {
      formDataToSend.append("photos", photo);
    });

    try {
      const response = await fetch("http://localhost:8008/api/user/profile", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile submitted successfully!");
      } else {
        // alert(Error: ${data.error});
      }
    } catch (err) {
      console.error("Error submitting profile:", err);
      alert("Error submitting profile");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handlePhotoUpload,
    accept: "image/*",
  });

  return (
    <div className="max-w-md mx-auto bg-white p-4 mt-10 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Name", type: "text", name: "name" },
          { label: "Age", type: "number", name: "age" },
          { label: "Phone Number", type: "text", name: "number" },
          { label: "Email", type: "email", name: "email" },
          { label: "Religion", type: "text", name: "religion" },
          { label: "Mother Tongue", type: "text", name: "motherTongue" },
          { label: "Profession", type: "text", name: "profession" },
        ].map((field) => (
          <div key={field.name}>
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
        <div>
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
        <div>
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
        <div>
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
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Captcha
          </label>
          <img src={captchaImage} alt="Captcha" className="mb-2" />
          <audio controls src={captchaAudio} className="mb-2">
            Your browser does not support the audio element.
          </audio>
          <input
            type="text"
            name="captcha"
            value={formData.captcha}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Refresh Captcha
        </button>
        <button
          type="button"
          onClick={verifyAadhaar}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
        >
          Verify Aadhaar
        </button>
        {verificationStatus !== null && (
          <span className="ml-2">
            {verificationStatus ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </span>
        )}
        <div>
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
      {result && <p className="text-center mt-4">{result}</p>}
    </div>
  );
};

export default ProfileForm;
