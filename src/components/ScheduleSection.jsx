import React, { useEffect, useState } from "react";
import axios from "axios";
import arrowIcon from "../assets/arrow.svg";

const ScheduleSection = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentSlide, setCurrentSlide] = useState([]);
  const [now, setNow] = useState(new Date());

  const types = ["모험 섬", "필드보스", "카오스게이트"];

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(
        "https://developer-lostark.game.onstove.com/gamecontents/calendar",
        {
          headers: {
            accept: "application/json",
            authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`,
          },
        }
      );

      const serverNow = new Date();
      const serverYMD = serverNow.toISOString().slice(0, 10);

      const grouped = types.map((type) => {
        const matches = res.data.filter(
          (item) =>
            item.CategoryName === type &&
            item.StartTimes?.length &&
            item.StartTimes.some((time) => {
              const adjusted = new Date(time);
              if (type === "카오스게이트") adjusted.setMinutes(adjusted.getMinutes() + 10);
              return adjusted.toISOString().startsWith(serverYMD);
            })
        );

        if (!matches.length) return { type, event: null };

        let nearestEvent = null;
        let nearestTime = Infinity;

        matches.forEach((item) => {
          const futureTimes = item.StartTimes.map((t) => {
            const date = new Date(t);
            if (item.CategoryName === "카오스게이트") {
              date.setMinutes(date.getMinutes() + 10);
            }
            return date;
          }).filter((date) => date > serverNow && date.toISOString().startsWith(serverYMD));

          if (futureTimes.length > 0) {
            const closestTime = futureTimes[0];
            const diff = closestTime - serverNow;
            if (diff < nearestTime) {
              nearestTime = diff;
              nearestEvent = {
                ...item,
                StartTimes: [closestTime.toISOString()],
              };
            }
          }
        });

        return { type, event: nearestEvent };
      });

      setSchedules(grouped);
      setCurrentSlide(Array(grouped.length).fill(0));
    } catch (err) {
      console.error("❌ 일정 불러오기 실패", err);
    }
  };

  const formatDateWithDay = (dateObj) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const day = days[dateObj.getDay()];
    return `${yyyy}-${mm}-${dd} (${day})`;
  };

  const getRemainingTime = (targetTime) => {
    const diff = new Date(targetTime) - now;
    if (diff <= 0) return null;
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleNextSlide = (idx, length) => {
    setCurrentSlide((prev) => {
      const updated = [...prev];
      updated[idx] = (updated[idx] + 1) % length;
      return updated;
    });
  };

  const chunkRewards = (items, size) => {
    const chunks = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <section className="w-full md:w-[613px] min-h-[195px] bg-[#ffffff01] border border-[#16181d] rounded shadow-md overflow-hidden">
      <div className="h-11 bg-[#1b1d22] px-3 flex items-center justify-between">
        <span className="text-sm font-bold text-[#f7f7f7]">오늘의 일정</span>
        <span className="text-sm font-mono text-[#cecfd4]">
          {formatDateWithDay(new Date())}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {schedules.map(({ type, event }, idx) => {
          const remaining = event?.StartTimes?.[0]
            ? getRemainingTime(event.StartTimes[0])
            : null;

          const rewardItems = event?.RewardItems?.[0]?.Items || [];
          const chunkSize = window.innerWidth < 768 ? 12 : 5;
          const chunks = chunkRewards(rewardItems, chunkSize);
          const current = currentSlide[idx] || 0;

          return (
            <div
              key={type}
              className="bg-[#16181d] border-t md:border-t-0 md:border-l border-[#0f1114] flex flex-col"
            >
              <div className="bg-[#1b1d22] border-b border-[#0f1114] h-11 px-3 flex items-center justify-between">
                <span className="text-[13.9px] font-bold text-[#cecfd4]">{type}</span>
                <span className="text-sm font-mono text-[#cecfd4]">
                  {remaining || "종료됨"}
                </span>
              </div>

              {remaining ? (
                <div className="flex px-2 py-8 gap-2 items-start">
                  <img
                    src={event.ContentsIcon}
                    alt="썸네일"
                    className="w-[33px] h-[33px] object-contain shrink-0"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-bold text-[#cecfd4] mb-1">
                      {event.ContentsName}
                    </span>
                    <div className="relative flex items-center">
                      <div className="flex gap-1 pr-6">
                        {chunks[current]?.map((reward, i) => (
                          <img
                            key={i}
                            src={reward.Icon}
                            alt={reward.Name}
                            title={reward.Name}
                            className="w-5 h-5 object-contain shrink-0"
                          />
                        ))}
                      </div>
                      {chunks.length > 1 && (
                        <button
                          onClick={() => handleNextSlide(idx, chunks.length)}
                          className="absolute right-0 z-10 bg-[#1b1d22] p-1"
                        >
                          <img src={arrowIcon} alt="next" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-1 text-sm text-[#cecfd4] min-h-[50px] px-3 py-4">
                  오늘 일정은 종료되었습니다!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ScheduleSection;
