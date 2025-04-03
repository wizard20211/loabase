import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1 px-4 py-6 md:px-8 lg:px-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
