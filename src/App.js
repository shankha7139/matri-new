import React from "react";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Matri from "./Pages/Matri";
import AllMatri from "./Pages/AllMatri";
import Test from "./Pages/Test";

import Login from "./Components/auth/login";
import Register from "./Components/auth/register";

import Header from "./Components/header";

import { AuthProvider } from "./context/authContext";
import { useRoutes } from "react-router-dom";

const App = () => {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Home />,
    },
  ];
  // let routesElement = useRoutes(routesArray);
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/matri" element={<Matri />} />
          <Route path="/all-matri" element={<AllMatri />} />
          <Route path="/profile" element={<Test />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
