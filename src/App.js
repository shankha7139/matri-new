import React from "react";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Matri from "./Pages/Matri";
import AllMatri from "./Pages/AllMatri";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/matri" element={<Matri />} />
        <Route path="/all-matri" element={<AllMatri />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
