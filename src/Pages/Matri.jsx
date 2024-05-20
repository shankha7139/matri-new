import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../Components/Card";
import Footer from "../Components/Footer";

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
    <>
      <div className="px-20 mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {location.state.religion ? (
          user
            .filter((item) => item.religion == location.state.religion)
            .map((filtered) => {
              return (
                <div>
                  <Card
                    name={filtered.name}
                    sex={filtered.sex}
                    prof={filtered.prof}
                  />
                </div>
              );
            })
        ) : (
          <>
            {location.state.language
              ? user
                  .filter(
                    (item) => item.motherTongue == location.state.language
                  )
                  .map((filtered) => {
                    return (
                      <div>
                        <Card
                          name={filtered.name}
                          sex={filtered.sex}
                          prof={filtered.prof}
                        />
                      </div>
                    );
                  })
              : user
                  .filter((item) => item.prof == location.state.prof)
                  .map((filtered) => {
                    return (
                      <div>
                        <Card
                          name={filtered.name}
                          sex={filtered.sex}
                          prof={filtered.prof}
                        />
                      </div>
                    );
                  })}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
