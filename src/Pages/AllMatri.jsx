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
      {user != []
        ? user.map((data) => {
            return <div>{data.name}</div>;
          })
        : ""}
    </div>
  );
}

//30:10---#9
