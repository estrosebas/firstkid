import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Technique from "./pages/Technique";

export default function App() {
  return (
    <BrowserRouter
      // opt-in to future v7 behaviors to silence dev-time warnings

      // this is a temporary measure and can be removed in a future update

      // sad bug :C
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/technique/:slug" element={<Technique />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

// if you can read this, please dont touch my code :D
