// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center text-[11.8px] text-[#cecfd4] opacity-25 mt-8">
      <div className="flex gap-6 mb-1">
        <a href="#" className="hover:underline">공식 홈페이지</a>
        <a href="#" className="hover:underline">API 확인</a>
      </div>
      <p className="text-center text-[11.8px]">
        © 2025 easysium All rights reserved. This site is not associated with Smilegate RPG &amp; Smilegate Stove.
      </p>
    </footer>
  );
};

export default Footer;
