import React from "react";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Matri from "./Pages/Matri";
import AllMatri from "./Pages/AllMatri";
import Register from "./Pages/Register";
import Test from "./Pages/Test";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/matri" element={<Matri />} />
        <Route path="/all-matri" element={<AllMatri />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;