import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Matri() {
  const location = useLocation();

  const [user, setUser] = useState([]);
  const loadData = async () => {
    let response = await fetch("http://localhost:8008/api/matriData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    setUser(response[0]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {location.state.religion ? (
        user
          .filter((item) => item.religion == location.state.religion)
          .map((filtered) => {
            return <div>{filtered.name}</div>;
          })
      ) : (
        <div className="div">
          {location.state.language
            ? user
                .filter((item) => item.motherTongue == location.state.language)
                .map((filtered) => {
                  return <div>{filtered.name}</div>;
                })
            : user
                .filter((item) => item.prof == location.state.prof)
                .map((filtered) => {
                  return <div>{filtered.name}</div>;
                })}
        </div>
      )}
    </div>
  );
}

//30:10---#9
