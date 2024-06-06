import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

export default function Matri() {
  const location = useLocation();

  const [searchTerms, setSearchTerms] = useState({
    religion: "",
    language: "",
    prof: "",
  });

  const [user, setUser] = useState([]);

  const loadData = async () => {
    let response = await fetch("http://localhost:3001/api/matriData", { // Update the URL if needed
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    setUser(response[0]);
    console.log("response", response[0]);
    console.log("user", user);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms((prevState) => ({ ...prevState, [name]: value }));
  };

  // Filter data based on search terms
  const filteredData = user.filter((item) => {
    return (
      item.profession.toLowerCase().includes(searchTerms.prof.toLowerCase()) &&
      item.mothertongue
        .toLowerCase()
        .includes(searchTerms.language.toLowerCase()) &&
      item.religion.toLowerCase().includes(searchTerms.religion.toLowerCase())
    );
  });

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap justify-between items-center p-4 bg-slate-100 w-full px-24 ">
        <input
          type="text"
          name="language"
          placeholder="Language"
          className="border p-2 rounded flex-grow mr-2 mb-2 sm:mb-0 sm:flex-grow-0 sm:w-1/4"
          value={searchTerms.language}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="prof"
          placeholder="Profession"
          className="border p-2 rounded flex-grow mr-2 mb-2 sm:mb-0 sm:flex-grow-0 sm:w-1/4"
          value={searchTerms.prof} // Fixed typo
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="religion"
          placeholder="Religion"
          className="border p-2 rounded flex-grow mr-2 mb-2 sm:mb-0 sm:flex-grow-0 sm:w-1/4"
          value={searchTerms.religion} // Fixed typo
          onChange={handleSearchChange}
        />
        <button className="bg-cyan-600 text-white px-4 py-2 rounded w-full sm:w-auto">
          Search
        </button>
      </div>
      <div className="px-20 mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {filteredData.length > 0 ? ( // Fixed conditional rendering
          filteredData.map((data) => {
            return (
              <div>
                <Card name={data.name} sex={data.sex} prof={data.profession} />
              </div>
            );
          })
        ) : (
          user.map((data) => {
            return (
              <div>
                <Card name={data.name} sex={data.sex} prof={data.profession} />
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </>
  );
}