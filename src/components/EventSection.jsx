import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import dotActive from "../assets/dot-active.png";
import dotInactive from "../assets/dot-inactive.png";
import axios from "axios";

const EventSection = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "https://developer-lostark.game.onstove.com/news/events",
          {
            headers: {
              accept: "application/json",
              authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`,
            },
          }
        );
        setEvents(res.data);
      } catch (err) {
        console.error("이벤트 데이터를 불러오지 못했습니다:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-dot {
        all: unset;
        display: inline-block;
        width: 9px;
        height: 8px;
        margin: 0 2px !important;
        background-image: url('${dotInactive}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .swiper-pagination-bullet-active.custom-dot {
        width: 20px;
        background-image: url('${dotActive}');
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="relative w-full max-w-[614px] bg-[#ffffff01] border border-[#16181d] rounded shadow-md overflow-hidden mx-auto">
      <div className="h-11 bg-[#1b1d22] px-3 flex items-center">
        <span className="text-sm font-normal text-[#f7f7f7]">진행중인 이벤트</span>
      </div>

      {events.length > 0 && (
        <Swiper
          key={events.length} // 이벤트 수 바뀌면 강제 재렌더링
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} custom-dot"></span>`;
            },
          }}
          className="w-full"
        >
          {events.map((event, idx) => (
            <SwiperSlide key={idx}>
              <a href={event.Link} target="_blank" rel="noopener noreferrer">
                <img
                  src={event.Thumbnail}
                  alt="이벤트 배너"
                  className="w-full aspect-video object-cover"
                />
                <div className="text-center py-2 px-3 text-[#cecfd4] text-sm leading-5 pb-6 break-keep">
                  {event.Title}
                  <br />
                  <span className="text-xs">
                    {event.StartDate?.slice(2)} ~ {event.EndDate?.slice(2)}
                  </span>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="swiper-pagination absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex" />
    </section>
  );
};

export default EventSection;
