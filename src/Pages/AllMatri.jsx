import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import Headers from "../Components/header";
import { useAuth } from "../context/authContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';
import DualSlider from "../Components/DualSlider";

const SkeletonCard = () => (
  <div className="border rounded-lg p-4 max-w-sm w-full mx-auto">
    <div className="animate-pulse flex flex-col space-y-4">
      <div className="rounded-full bg-slate-200 h-40 w-40 mx-auto"></div>
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

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
  const [isLoading, setIsLoading] = useState(true);
  const [ageRange, setAgeRange] = useState({ low: 20, high: 60 });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleAgeRangeChange = (range) => {
    setAgeRange(range);
  };

  const loadData = async () => {
    setIsLoading(true);
    const db = getFirestore();
    const usersCollection = collection(db, "users");

    try {
      const querySnapshot = await getDocs(usersCollection);
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUser(userData);
      console.log("Users data:", userData);

      // Get logged user's gender
      const loggedUserData = userData.find(user => user.uid === loggedUser);
      if (loggedUserData) {
        setLoggedUserGender(loggedUserData.sex);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms((prevState) => ({ ...prevState, [name]: value }));
  };

  const filterData = () => {
    const filtered = user.filter((item) => {
      const professionLower = item.profession ?
        item.profession.toLowerCase() :
        "";
      const mothertongueLower = item.motherTongue ?
        item.motherTongue.toLowerCase() :
        "";
      const religionLower = item.religion ? item.religion.toLowerCase() : "";
      const age = item.age ? parseInt(item.age) : 0;

      return (
        professionLower.includes(searchTerms.prof.toLowerCase()) &&
        mothertongueLower.includes(searchTerms.language.toLowerCase()) &&
        religionLower.includes(searchTerms.religion.toLowerCase()) &&
        age >= ageRange.low &&
        age <= ageRange.high
      );
    });
    setFilteredData(filtered);
  };
  useEffect(() => {
    loadData();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedUser(user.uid); // Use user.uid directly
        console.log("User email:", user.email);
        console.log("userid", user.uid);
      } else {
        console.log("User is signed out");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterData();
  }, [user, searchTerms, ageRange]);

  return (
    <>
      <Headers />
      <div className="flex justify-between">
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
        <div className="mt-28 px-4 md:px-24">
          <button
            onClick={toggleFilterVisibility}
            className="bg-cyan-600 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          >
            {isFilterVisible ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      <div>
        {isFilterVisible && (
          <div className="flex flex-wrap justify-between items-center p-4 w-full bg-gray-100 pb-10 rounded-lg ">
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
            <div  className = "w-full mt-4 px-4 mx-auto" >
              <h3 className="text-lg font-semibold mb-2">
                Age Range: {ageRange.low} - {ageRange.high}
              </h3>
              <DualSlider min={20} max={60} onChange={handleAgeRangeChange} />
            </div>
          </div>
        )}
      </div>
      <div className="px-4 md:px-20 mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {isLoading
          ? // Display skeleton cards while loading
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : filteredData.length > 0
          ? filteredData
              .filter((data) => loggedUser !== data.uid && data.name) // Filter out the logged-in user's profile and profiles with no name
              .map((data) => (
                <div key={data.id}>
                  <Card
                    name={data.name}
                    sex={data.sex}
                    prof={data.profession}
                    photos={data.photos}
                    uid={data.uid}
                    age={data.age}
                    number={data.number}
                    email={data.email}
                    religion={data.religion}
                    motherTongue={data.motherTongue}
                    description={data.description}
                  />
                </div>
              ))
          : user
              .filter((data) => loggedUser !== data.uid && data.name) // Filter out the logged-in user's profile and profiles with no name
              .map((data) => (
                <div key={data.id}>
                  <Card
                    name={data.name}
                    sex={data.sex}
                    prof={data.profession}
                    photos={data.photos}
                    uid={data.uid}
                    age={data.age}
                    number={data.number}
                    email={data.email}
                    religion={data.religion}
                    motherTongue={data.motherTongue}
                    description={data.description}
                  />
                </div>
              ))}
      </div>
      <Footer />
    </>
  );
}