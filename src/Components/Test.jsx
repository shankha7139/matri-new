import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

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
  });
  const [photos, setPhotos] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (acceptedFiles) => {
    setPhotos([...photos, ...acceptedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert(`Error: ${data.error}`);
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
    </div>
  );
};

export default ProfileForm;
