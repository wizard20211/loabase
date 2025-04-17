import React from "react";
import HeroSection from "../components/HeroSection";
import EventSection from "../components/EventSection";
import NewsSection from "../components/NewsSection";
import ScheduleSection from "../components/ScheduleSection";
import AuctionCalculator from "../components/AuctionCalculator";
import Footer from "../components/Footer";

const Home = ({ nickname, onLogin, onLogout }) => {
  return (
    <div className="bg-black text-white overflow-x-hidden flex flex-col items-center">
      <HeroSection
        nickname={nickname}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      <div className="w-full max-w-[1200px] flex flex-col items-center gap-6 mt-12 px-4">
        {/* 1행: 이벤트 + 뉴스 */}
        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 items-stretch justify-center">
          <div className="flex flex-col md:flex-row gap-6">
            <EventSection />
            <NewsSection />
          </div>
        </div>

        {/* 2행: 일정 + 경매 계산기 */}
        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 items-stretch justify-center">
          <ScheduleSection />
          <AuctionCalculator />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
