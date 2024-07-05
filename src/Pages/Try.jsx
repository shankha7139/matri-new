import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaVolumeUp,
  FaEye,
  FaTrash,
  FaCamera,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase/Firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import "../styles/shimmer.css";
import Headers from "../Components/header";
import { getAuth, deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import { doSignOut } from "../firebase/auth";
import { auth } from "../firebase/Firebase";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const ProfileForm = () => {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [adharCheck, setAdharCheck] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Details
    name: "",
    age: "",
    height: "",
    complexion: "",
    manglic: "",
    motherTongue: "",
    subCaste: "",
    profession: "",
    address: "",
    phone: "",
    bloodGroup: "",
    email: currentUser.email,
    dateOfBirth: "",

    // Family Details
    caste: "",
    status: "",
    familyMembers: "",

    // Educational Details
    marks10th: "",
    marks12th: "",
    employmentStatus: "",
    organization: "",
    salary: "",
    hideSalary: false,
    workAddress: "",
    sameAsPersonalAddress: false,
    currentAddress: "",

    // Aadhaar verification
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
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = (acceptedFiles) => {
    const formattedFiles = acceptedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file,
    }));

    setPhotos([...photos, ...formattedFiles]);
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const uploadProfilePhoto = async () => {
    if (profilePhotoFile) {
      const storageRef = ref(storage, `profilePhotos/${currentUser.uid}`);
      await uploadBytes(storageRef, profilePhotoFile);
      const url = await getDownloadURL(storageRef);
      return url;
    }
    return null;
  };

  const generateCaptcha = () => {
    fetch("http://127.0.0.1:8008/api/generate-captcha", {
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

    fetch("http://127.0.0.1:8008/api/verify-aadhaar", {
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setFormData((prevData) => ({
              ...prevData,
              ...userDoc.data(),
            }));
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    fetchExistingPhotos();
  }, [currentUser.uid]);

  const fetchExistingPhotos = async () => {
    setIsPhotosLoading(true);
    const storageRef = ref(storage, `photos/${currentUser.uid}`);
    try {
      const result = await listAll(storageRef);
      const urlPromises = result.items.map((imageRef) =>
        getDownloadURL(imageRef)
      );
      const urls = await Promise.all(urlPromises);
      setExistingPhotos(
        urls.map((url) => ({
          url: url,
        }))
      );
      if (urls.length > 0) {
        setProfilePhoto(urls[0]);
      }
    } catch (error) {
      console.error("Error fetching existing photos:", error);
    } finally {
      setIsPhotosLoading(false);
    }
  };

  const openDeleteDialog = (photo, index) => {
    setPhotoToDelete({
      photo,
      index,
    });
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPhotoToDelete(null);
  };

  const deletePhoto = async () => {
    if (photoToDelete) {
      try {
        if (photoToDelete.photo.file) {
          setPhotos(photos.filter((_, i) => i !== photoToDelete.index));
        } else {
          const photoRef = ref(storage, photoToDelete.photo.url);
          await deleteObject(photoRef);
          setExistingPhotos(
            existingPhotos.filter((_, i) => i !== photoToDelete.index)
          );
        }
      } catch (error) {
        console.error("Error deleting photo:", error);
        alert("Failed to delete photo. Please try again.");
      }
    }
    closeDeleteDialog();
  };

  const uploadPhoto = async (photo) => {
    const storageRef = ref(storage, `photos/${currentUser.uid}/${photo.name}`);
    await uploadBytes(storageRef, photo.file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (currentPage < 3) {
  //       handleNextPage();
  //       return;
  //     }

  //     if (!adharCheck) {
  //       alert("Please verify your Aadhaar before submitting.");
  //       return;
  //     }

  //     setIsSubmitting(true);

  //     try {
  //       const newPhotoURLs = await Promise.all(photos.map(uploadPhoto));
  //       const allPhotoURLs = [
  //         ...existingPhotos.map((photo) => photo.url),
  //         ...newPhotoURLs,
  //       ];

  //       const userRef = doc(db, "users", currentUser.uid);
  //       await setDoc(
  //         userRef,
  //         {
  //           ...formData,
  //           photos: allPhotoURLs,
  //           adharVarified: adharCheck,
  //           updatedAt: new Date(),
  //         },
  //         { merge: true }
  //       );

  //       setProfileUpdated(true);
  //     } catch (err) {
  //       console.error("Error submitting profile:", err);
  //       alert("Error submitting profile");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

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

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImage("");
  };

  const openDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(true);
  };

  const closeDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(false);
  };

  const closeAndResetDeleteDialog = () => {
    closeDeleteAccountDialog();
    setDeletePassword("");
  };

  const handleDeleteAccount = async () => {
    try {
      if (!deletePassword) {
        alert("Password is required to delete your account.");
        return;
      }

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        deletePassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      await deleteDoc(doc(db, "users", currentUser.uid));

      await deleteUser(auth.currentUser);

      closeDeleteAccountDialog();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeletePassword("");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>User not found. Please log in.</div>;
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const renderPersonalDetails = () => (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
        Personal Details
      </h2>
      {/* Profile Photo Section */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FaCamera className="text-4xl text-gray-400" />
              </div>
            )}
          </div>
          <label
            htmlFor="profilePhotoInput"
            className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2 cursor-pointer"
          >
            <FaCamera className="text-white" />
          </label>
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: "name", placeholder: "Name", type: "text" },
          {
            name: "age",
            placeholder: "Age",
            type: "number",
            min: 23,
            max: 60,
          },
          { name: "height", placeholder: "Height", type: "text" },
          { name: "complexion", placeholder: "Complexion", type: "text" },
          {
            name: "manglic",
            placeholder: "Manglic Status",
            type: "select",
            options: ["Yes", "No"],
          },
          { name: "motherTongue", placeholder: "Mother Tongue", type: "text" },
          { name: "subCaste", placeholder: "Sub Caste", type: "text" },
          { name: "profession", placeholder: "Profession", type: "text" },
          { name: "phone", placeholder: "Phone", type: "tel" },
          { name: "bloodGroup", placeholder: "Blood Group", type: "text" },
          {
            name: "email",
            placeholder: "Email",
            type: "email",
            disabled: true,
          },
          { name: "dateOfBirth", placeholder: "Date of Birth", type: "date" },
        ].map((field) => (
          <div key={field.name} className="relative">
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                required
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                required
                {...(field.min && { min: field.min })}
                {...(field.max && { max: field.max })}
                {...(field.disabled && { disabled: field.disabled })}
              />
            )}
            <label
              htmlFor={field.name}
              className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium"
            >
              {field.placeholder}
            </label>
          </div>
        ))}
        <div className="sm:col-span-2">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Permanent Address"
            className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
            required
            rows={3}
          />
          <label
            htmlFor="address"
            className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium"
          >
            Permanent Address
          </label>
        </div>
      </div>
    </div>
  );

  const checkVarificationandPhotos = () => (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
          Aadhaar Verification and Photos
        </h2>

        <div className="space-y-6">
          {/* Aadhaar Number Input */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="text-lg font-medium text-indigo-800">
              Aadhaar Number:
            </label>
            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
              required
            />
          </div>

          {/* Captcha Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="text-lg font-medium text-indigo-800">
              Captcha:
            </label>
            <img
              src={captchaImage}
              alt="Captcha"
              className="w-32 h-12 rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={playCaptchaAudio}
              className="p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200 ease-in-out"
            >
              <FaVolumeUp className="text-xl" />
            </button>
            <input
              type="text"
              name="captcha"
              value={formData.captcha}
              onChange={handleChange}
              className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
              required
            />
            <button
              type="button"
              onClick={generateCaptcha}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-200 ease-in-out"
            >
              Refresh
            </button>
          </div>

          {/* Verify Aadhaar Button */}
          <button
            type="button"
            onClick={verifyAadhaar}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Verify Aadhaar
          </button>

          {/* Verification Status */}
          {verificationStatus !== null && (
            <p
              className={`mt-2 text-center text-lg font-medium ${
                verificationStatus ? "text-green-600" : "text-red-600"
              }`}
            >
              {verificationStatus
                ? "Aadhaar verified successfully"
                : "Aadhaar verification failed"}
            </p>
          )}

          {/* Photo Upload Section */}
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-indigo-300 p-6 rounded-lg text-center hover:border-indigo-500 transition duration-200 ease-in-out"
          >
            <label className="block text-lg font-medium text-indigo-800 mb-2">
              Upload Photos:
            </label>
            <p className="text-indigo-600 text-sm mb-4">
              The first picture will be the profile photo
            </p>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-indigo-700">Drop the files here...</p>
            ) : (
              <p className="text-indigo-600">
                Drag & drop some files here, or click to select files
              </p>
            )}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...photos, ...existingPhotos].map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                  onClick={() => handleImageClick(photo.url)}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"
                  onClick={() => openDeleteDialog(photo, index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {isPhotosLoading && (
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f49d3f]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderFamilyDetails = () => (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
          Family Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              name: "caste",
              placeholder: "Caste",
              type: "text",
            },
            {
              name: "status",
              placeholder: "Marital Status",
              type: "select",
              options: [
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" },
                { value: "widowed", label: "Widowed" },
              ],
            },
            {
              name: "familyMembers",
              placeholder: "Number of Family Members",
              type: "number",
              min: 1,
            },
          ].map((field) => (
            <div key={field.name} className="relative">
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out appearance-none"
                  required
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                  {...(field.min && { min: field.min })}
                />
              )}
              <label
                htmlFor={field.name}
                className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 text-sm text-indigo-800 font-medium"
              >
                {field.placeholder}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderEducationalDetails = () => (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
          Educational and Professional Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { name: "marks10th", placeholder: "10th Marks", type: "text" },
            { name: "marks12th", placeholder: "12th Marks", type: "text" },
            {
              name: "employmentStatus",
              placeholder: "Employment Status",
              type: "select",
              options: [
                { value: "employed", label: "Employed" },
                { value: "unemployed", label: "Unemployed" },
                { value: "student", label: "Student" },
              ],
            },
          ].map((field) => (
            <div key={field.name} className="relative">
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out appearance-none"
                  required
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                />
              )}
              <label
                htmlFor={field.name}
                className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
              >
                {field.placeholder}
              </label>
            </div>
          ))}

          {formData.employmentStatus === "employed" && (
            <>
              {[
                {
                  name: "organization",
                  placeholder: "Organization",
                  type: "text",
                },
                { name: "salary", placeholder: "Salary", type: "number" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                    required
                  />
                  <label
                    htmlFor={field.name}
                    className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
                  >
                    {field.placeholder}
                  </label>
                </div>
              ))}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hideSalary"
                  checked={formData.hideSalary}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="hideSalary" className="text-indigo-800">
                  Hide Salary
                </label>
              </div>

              <div className="sm:col-span-2 relative">
                <textarea
                  name="workAddress"
                  value={formData.workAddress}
                  onChange={handleChange}
                  placeholder="Work Address"
                  className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                  required
                  rows={3}
                />
                <label
                  htmlFor="workAddress"
                  className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
                >
                  Work Address
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="sameAsPersonalAddress"
                  checked={formData.sameAsPersonalAddress}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="sameAsPersonalAddress"
                  className="text-indigo-800"
                >
                  Same as Permanent Address
                </label>
              </div>

              {!formData.sameAsPersonalAddress && (
                <div className="sm:col-span-2 relative">
                  <textarea
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleChange}
                    placeholder="Current Address"
                    className="w-full p-4 bg-white rounded-lg shadow-inner border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200 ease-in-out"
                    required
                    rows={3}
                  />
                  <label
                    htmlFor="currentAddress"
                    className="absolute left-4 -top-3 bg-gradient-to-r from-indigo-100 to-blue-100 px-2 text-sm text-indigo-800 font-medium"
                  >
                    Current Address
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return renderPersonalDetails();
      case 2:
        return renderFamilyDetails();
      case 3:
        return renderEducationalDetails();
      case 4:
        return checkVarificationandPhotos();
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPage < 4) {
      handleNextPage();
      return;
    }

    if (!adharCheck) {
      alert("Please verify your Aadhaar before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPhotoURLs = await Promise.all(photos.map(uploadPhoto));
      const allPhotoURLs = [
        ...existingPhotos.map((photo) => photo.url),
        ...newPhotoURLs,
      ];

      const profilePhotoURL = await uploadProfilePhoto();

      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          ...formData,
          photos: allPhotoURLs,
          profilePhoto: profilePhotoURL,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setProfileUpdated(true);
    } catch (err) {
      console.error("Error submitting profile:", err);
      alert("Error submitting profile");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Headers />
      <div className="min-h-screen flex items-center justify-center bg-orange-200 py-12 mt-14">
        <div className="bg-white p-6 rounded-2xl shadow-md w-4/5 neumorphic-card">
          <div className="mb-4 flex justify-between">
            <div className="w-1/3 h-2 bg-blue-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentPage / 4) * 100}%` }}
              ></div>
            </div>
            <span>Page {currentPage} of 4</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderCurrentPage()}
            <div className="flex justify-between mt-4">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg neumorphic-button"
                >
                  Previous
                </button>
              )}
              {currentPage < 4 ? (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg neumorphic-button"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-4 py-2 bg-green-500 text-white rounded-lg neumorphic-button ${
                    isSubmitting ? "opacity-50" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Dialog
        open={profileUpdated}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Profile Updated</DialogTitle>
        <DialogContent dividers>
          <p>Your profile has been updated successfully!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close Profile
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete Photo</DialogTitle>
        <DialogContent dividers>
          <p>Are you sure you want to delete this photo?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deletePhoto} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteAccountDialogOpen}
        onClose={closeDeleteAccountDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent dividers>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <p>Please enter your password to confirm account deletion:</p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full p-2 mt-2 rounded-lg border border-gray-300"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAndResetDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {selectedImage && (
        <Dialog open={openImageModal} onClose={handleCloseImageModal}>
          <DialogContent>
            <img src={selectedImage} alt="Selected" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
      {/* Keep existing dialogs and modals */}
    </>
  );
};

export default ProfileForm;