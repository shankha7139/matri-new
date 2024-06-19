import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useAuth } from "../context/authContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Matri() {
  const { userLoggedIn } = useAuth();
  const [loggedUser, setLoggedUser] = useState("");
  const location = useLocation();
  const auth = getAuth();

  const [searchTerms, setSearchTerms] = useState({
    religion: "",
    language: "",
    prof: "",
  });
  const [user, setUser] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const loadData = async () => {
    let response = await fetch("http://localhost:8008/api/matriData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    setUser(response[0]); // Set the user state to the first (and only) array in the response
    console.log("response", response);
    console.log("user", user);
    console.log("user logged in", userLoggedIn);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms((prevState) => ({ ...prevState, [name]: value }));
  };

  const filterData = () => {
    const filtered = user.filter((item) => {
      const professionLower = item.profession
        ? item.profession.toLowerCase()
        : "";
      const mothertongueLower = item.motherTongue
        ? item.motherTongue.toLowerCase()
        : "";
      const religionLower = item.religion ? item.religion.toLowerCase() : "";

      return (
        professionLower.includes(searchTerms.prof.toLowerCase()) &&
        mothertongueLower.includes(searchTerms.language.toLowerCase()) &&
        religionLower.includes(searchTerms.religion.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        console.log("Usesadasdr email:", email);
        setLoggedUser(user.uid);
        console.log("userid", user.uid, " --- ", loggedUser);
      } else {
        console.log("User is signed out");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterData();
  }, [user, searchTerms]);

  return (
    <>
      <Navbar />
       <button
        className="absolute top-14 left-0 mt-4 ml-4 bg-cyan-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
      <div className="flex flex-wrap justify-between items-center p-4 bg-slate-100 w-full px-4 md:px-24">
        <input
          type="text"
          name="language"
          placeholder="Language"
          className="border p-2 rounded flex-grow mb-2 sm:mb-0 sm:flex-grow-0 sm:w-1/4 mr-0 sm:mr-2"
          value={searchTerms.language}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="prof"
          placeholder="Profession"
          className="border p-2 rounded flex-grow mb-2 sm:mb-0 sm:flex-grow-0 sm:w-1/4 mr-0 sm:mr-2"
          value={searchTerms.prof}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="religion"
          placeholder="Religion"
          className="border p-2 rounded flex-grow mb-2 sm:mb-0 sm:flex-grow-0 sm:w-1/4 mr-0 sm:mr-2"
          value={searchTerms.religion}
          onChange={handleSearchChange}
        />
        <button className="bg-cyan-600 text-white px-4 py-2 rounded w-full sm:w-auto">
          Search
        </button>
      </div>
      <div className="px-4 md:px-20 mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {filteredData.length > 0
          ? filteredData.map((data) => (
              <div key={data.id}>
                {loggedUser != data.chatId && (
                  <Card
                    name={data.name}
                    sex={data.sex}
                    prof={data.profession}
                    photos={data.photos}
                    chatId={data.chatId}
                    age={data.age}
                    number={data.number}
                    email={data.email}
                    religion={data.religion}
                    motherTongue={data.motherTongue}
                    description={data.description}
                  />
                )}
              </div>
            ))
          : user.map((data) => (
              <div key={data.id}>
                {loggedUser != data.chatId && (
                  <Card
                    name={data.name}
                    sex={data.sex}
                    prof={data.profession}
                    photos={data.photos}
                    chatId={data.chatId}
                    age={data.age}
                    number={data.number}
                    email={data.email}
                    religion={data.religion}
                    motherTongue={data.motherTongue}
                    description={data.description}
                  />
                )}
              </div>
            ))}
      </div>
      <Footer />
    </>
  );
}
