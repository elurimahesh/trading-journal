"use client";
import Image from "next/image";
import { IoMdArrowDropup } from "react-icons/io";
// import Bear from "./../../../assets/img/bear-ligh-base.png"
// import Bull from "./../../../assets/img/bull-ligh-base.png"
export default function BehavioralBiasCard() {
  // Dummy values for now – later we’ll make these dynamic
  const totalTrades = 124;
  const sellTrades = 48;
  const buyTrades = 76;

  const sellPercent = Math.round((sellTrades / totalTrades) * 100);
  const buyPercent = Math.round((buyTrades / totalTrades) * 100);

  // biasPosition: 0 = full bear, 50 = neutral, 100 = full bull
  // Simple example: based on % of buy trades
  const biasPosition = Math.max(0, Math.min(100, buyPercent)); // clamp

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pt-7 pl-7 pr-7">
        <div>
          <h2 className="text-sm font-semibold">Behavioral Bias</h2>
        </div>
        <div className="text-right flex item-center">
          <p className="text-[14px] uppercase tracking-wide text-gray-500">
            Total Trades:
          </p>
          <p className="text-[14px] font-semibold">{totalTrades}</p>
        </div>
      </div>

      {/* Bear / Neutral / Bull labels */}
      <div className="flex items-center justify-between text-xs font-medium">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center text-lg">
          <Image src={"/img/bear.png"} alt="Bear"  width={120} height={120} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/10 text-gray-500 text-lg">
            😐
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center">
          <Image src={"/img/bull.png"} alt="Bull"  width={120} height={120} />
          </div>
        </div>
      </div>

      {/* Bias bar */}
      <div className="mt-1 pl-7 pr-7">
        <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-red-500/40 via-gray-400/40 to-emerald-500/40">
          {/* pointer */}
          <div
            className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-[#5750F1] shadow-sm"
            style={{ left: `${biasPosition}%` }}
          />
        </div>
      
      </div>

      {/* Bottom stats */}
      <div className="mt-2 flex items-start justify-between text-xs pl-7 pb-3">
        {/* Bear / Sell side */}
        <div className="flex flex-col items-start gap-1">
          <span className="font-semibold">
            {sellTrades}{" "}
            <span className="text-[14px] text-gray-500">({sellPercent}%)</span>
          </span>
        </div>

        {/* Spacer for neutral if you want something later */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-gray-500"><IoMdArrowDropup size={25}/></span>
        </div>

        {/* Bull / Buy side */}
        <div className="flex flex-col items-end gap-1 pr-7 pb-3">
          <span className="font-semibold">
            {buyTrades}{" "}
            <span className="text-[14px] text-gray-500">({buyPercent}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
