// src/layouts/BoardLayout.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BoardLayout = ({ children, nickname, onLogin, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#0f1114] text-white flex flex-col">
      <Header nickname={nickname} onLogin={onLogin} onLogout={onLogout} />

      <main className="flex-1 px-4 py-8 max-w-[1024px] mx-auto w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default BoardLayout;
