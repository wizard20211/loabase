// src/components/AuctionCalculator.jsx
import React, { useState } from "react";

const AuctionCalculator = () => {
  const [participants, setParticipants] = useState(8);
  const [marketPrice, setMarketPrice] = useState("");
  const [entryPrice, setEntryPrice] = useState(0);
  const [breakEven, setBreakEven] = useState(0);

  const handleCalculate = () => {
    const price = parseInt(marketPrice.replace(/[^0-9]/g, ""));
    if (!price || !participants) return;

    const feeRate = 0.05; // 수수료율 5%
    const entry = Math.floor((price - price / participants) * (1 - feeRate));
    const breakeven = Math.floor((entry + 1) / 1.1);

    setEntryPrice(breakeven);
    setBreakEven(entry);
  };

  return (
    <section className="w-[371px] h-[195px] bg-[#ffffff01] border border-[#16181d] rounded shadow-md overflow-hidden">
      <div className="h-11 bg-[#1b1d22] px-3 flex items-center">
        <span className="text-sm font-normal text-[#f7f7f7]">경매계산기</span>
      </div>

      <div className="px-3 py-2 bg-[#1b1d22] h-[calc(100%-44px)] flex flex-col gap-3">
        {/* 입력 영역 */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#989ba4] font-normal w-[70px]">인원수</span>
              <div className="flex gap-1">
                {[4, 8, 16].map((num) => (
                  <button
                    key={num}
                    onClick={() => setParticipants(num)}
                    className={`px-2 py-[2px] text-[10px] rounded-md font-normal border ${
                      participants === num
                        ? "bg-[#0f1114] text-[#50ce97] border-[#31373f]"
                        : "bg-[#1b1d22] text-[#cecfd4] border-[#31373f]"
                    }`}
                  >
                    {num}인
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#989ba4] font-normal w-[70px]">거래소 가격</span>
              <div className="flex items-center bg-[#0f1114] border border-[#31373f] rounded px-2 py-[2px] h-[28px]">
                <input
                  type="text"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  placeholder="0"
                  className="bg-transparent w-20 text-[10px] text-white outline-none h-full"
                />
                <span className="text-[10px] text-[#cecfd4] ml-1">G</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="h-[58px] px-4 bg-[#31373f] rounded text-[11px] font-normal text-[#cecfd4] flex items-center justify-center"
          >
            계산
          </button>
        </div>

        {/* 결과 */}
        <div className="border-t border-[#0f1114] pt-1 pt-[18px]">
          <div className="flex justify-between text-[11px] text-[#50ce97] font-normal">
            <span>손익 분기점</span>
            <span>{breakEven.toLocaleString()} G</span>
          </div>
          <div className="flex justify-between text-[11px] text-[#50ce97] font-normal mt-[2px]">
            <span>입찰 추천가</span>
            <span>{entryPrice.toLocaleString()} G</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionCalculator;