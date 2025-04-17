// src/components/NewsSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSection = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("https://developer-lostark.game.onstove.com/news/notices", {
          headers: {
            accept: "application/json",
            authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`,
          },
        });
        setNotices(res.data.slice(0, 6));
      } catch (err) {
        console.error("공지사항을 불러오지 못했습니다:", err);
      }
    };
    fetchNotices();
  }, []);

  return (
    <section className="w-[372px] h-[455px] bg-[#ffffff01] border border-[#16181d] rounded shadow-md overflow-hidden">
      <div className="h-11 bg-[#1b1d22] px-3 flex items-center justify-between">
        <span className="text-sm font-normal text-[#f7f7f7]">로스트아크 공지사항</span>
        <a
          href="https://lostark.game.onstove.com/News/Notice/List"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#31373f] text-[#cecfd4] text-[11.8px] px-2 py-1 rounded text-xs"
        >
          더보기
        </a>
      </div>

      <ul className="divide-y divide-[#0f1114]">
        {notices.map((item, idx) => (
          <li
            key={idx}
            className="px-3 py-3 bg-[#1b1d22] hover:bg-[#22252c] transition"
          >
            <a
              href={item.Link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <p className="text-[#cecfd4] text-[14px] font-normal truncate">
                {item.Title}
              </p>
              <div className="text-[#989ba4] text-[12px] mt-1">
                {item.Type} | {item.Date?.slice(2, 10)}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewsSection;
