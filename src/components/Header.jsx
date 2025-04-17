// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import iconDark from "../assets/icon_dark.png";
import searchIcon from "../assets/search-icon.png";
import axios from "axios";

const Header = ({ nickname, onLogin, onLogout }) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    try {
      const res = await axios.get(
        `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(inputValue)}/siblings`,
        {
          headers: {
            accept: "application/json",
            authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`,
          },
        }
      );
      if (!res.data || res.data.length === 0) {
        alert("존재하지 않는 캐릭터입니다.");
        return;
      }
      window.open(`https://iloa.gg/character/${encodeURIComponent(inputValue)}`, "_blank");
    } catch (err) {
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="w-full bg-black border-b border-[#1f1f1f] px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-white z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src={logoImg} alt="로고" className="w-28 md:w-36" />
      </Link>

      {/* 검색창 */}
      <div className="relative w-full max-w-[380px]">
        <input
          type="text"
          placeholder="캐릭터 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 pr-10 bg-[#1b1d22] text-white placeholder-gray-500 border border-[#31373f] rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#50ce97] focus:border-[#50ce97]"
        />
        <button
          type="submit"
          onClick={handleSearch}
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          <img src={searchIcon} alt="검색" className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>

      {/* 메뉴 */}
      <div className="flex items-center gap-4 text-sm">
        <Link to="/board" className="hover:underline whitespace-nowrap">
          자유게시판
        </Link>
        {nickname ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="hover:underline text-[#50ce97] whitespace-nowrap"
            >
              {nickname}님
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-24 bg-[#1b1d22] border border-[#31373f] rounded shadow text-xs text-center z-50">
                <button
                  onClick={onLogout}
                  className="w-full px-2 py-1 text-white hover:bg-[#31373f]"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onLogin} className="hover:underline whitespace-nowrap">로그인</button>
        )}
        <img src={iconDark} alt="다크모드" className="w-4 h-4" />
      </div>
    </header>
  );
};

export default Header;
