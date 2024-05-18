import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Matri() {
  const location = useLocation();

  const [user, setUser] = useState();
  const loadData = async () => {
    let response = await fetch("http://localhost:8008/api/matriData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    console.log(respose[0]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      {location.state.religion}
      {location.state.language}
      {location.state.prof}
    </div>
  );
}
