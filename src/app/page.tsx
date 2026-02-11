"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Be_Vietnam_Pro, Noto_Serif_Display } from "next/font/google";

const bodyFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const titleFont = Noto_Serif_Display({
  subsets: ["vietnamese"],
  weight: ["500", "700"],
});

const MAX_STICKS = 32;
const GRID_COLUMNS = 8;
const GRID_SPACING_X = 14;
const GRID_SPACING_Y = 12;
const BASE_Y = 12;

const ANIMATION_DURATION = 1000; // Khớp với CSS animation ritual-move (2.6s)
const CHANT_DURATION = 60000; // 60 seconds for chant mode

// Sample prayer text - can be used as reference
const SAMPLE_PRAYER = [
  "Nam mô A Di Đà Phật",
  "Con xin hướng về Phật Tổ",
  "Cầu mong gia đình bình an",
  "Sức khỏe dồi dào",
  "Vạn sự như ý",
];

export default function Home() {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isChanting, setIsChanting] = useState(false);
  const [showPrayerInput, setShowPrayerInput] = useState(false);
  const [prayerText, setPrayerText] = useState<string[]>([]);
  const [newPrayerLine, setNewPrayerLine] = useState("");
  const animatingRef = useRef(false);
  const chantTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!animatingRef.current && pending > 0) {
      animatingRef.current = true;
      setAnimating(true);
      const timer = setTimeout(() => {
        setCount((current) => current + 1);
        setPending((current) => Math.max(0, current - 1));
        animatingRef.current = false;
        setAnimating(false);
      }, ANIMATION_DURATION);
      return () => {
        clearTimeout(timer);
        animatingRef.current = false;
      };
    }
  }, [pending]);

  const handleLight = () => {
    setPending((current) => current + 1);
  };

  const handleReset = () => {
    setCount(0);
    setPending(0);
    setAnimating(false);
    animatingRef.current = false;
  };

  const handleOpenPrayerInput = () => {
    setShowPrayerInput(true);
  };

  const handleClosePrayerInput = () => {
    setShowPrayerInput(false);
    setNewPrayerLine("");
  };

  const handleAddPrayerLine = () => {
    if (newPrayerLine.trim()) {
      setPrayerText([...prayerText, newPrayerLine.trim()]);
      setNewPrayerLine("");
    }
  };

  const handleRemovePrayerLine = (index: number) => {
    setPrayerText(prayerText.filter((_, i) => i !== index));
  };

  const handleUseSamplePrayer = () => {
    setPrayerText(SAMPLE_PRAYER);
  };

  const handleClearAll = () => {
    setPrayerText([]);
  };

  const handleChant = () => {
    setShowPrayerInput(false);
    setIsChanting(true);
    // Auto close after CHANT_DURATION
    chantTimerRef.current = setTimeout(() => {
      setIsChanting(false);
    }, CHANT_DURATION);
  };

  const handleCompleteChant = () => {
    if (chantTimerRef.current) {
      clearTimeout(chantTimerRef.current);
    }
    setIsChanting(false);
  };

  useEffect(() => {
    return () => {
      if (chantTimerRef.current) {
        clearTimeout(chantTimerRef.current);
      }
    };
  }, []);

  const visibleSticks = useMemo(() => {
    const visibleCount = Math.min(count, MAX_STICKS);
    return Array.from({ length: visibleCount }, (_, index) => {
      const column = index % GRID_COLUMNS;
      const row = Math.floor(index / GRID_COLUMNS);
      const gridWidth = (GRID_COLUMNS - 1) * GRID_SPACING_X;
      const x = -gridWidth / 2 + column * GRID_SPACING_X;
      const y = BASE_Y + row * GRID_SPACING_Y;
      const rotate = ((index * 7) % 10) - 5;
      return { x, y, rotate };
    });
  }, [count]);

  return (
    <div
      className={`${bodyFont.className} min-h-screen bg-[#efe4d2] text-[#3d2a1a]`}
    >
      {/* Prayer Input Modal */}
      {showPrayerInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClosePrayerInput}
          />
          
          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-[#c8ad8b] bg-gradient-to-b from-[#f7edda] to-[#e7d4b9] p-8 shadow-2xl">
            <div className={`${titleFont.className} mb-2 text-center text-2xl font-semibold text-[#4a2f1d]`}>
              Soạn lời cầu nguyện
            </div>
            <p className="mb-6 text-center text-sm text-[#6a4b32]/80">
              Hãy tự do ghi lời khấn của riêng bạn
            </p>

            {/* Prayer lines list */}
            <div className="mb-6 max-h-64 space-y-2 overflow-y-auto rounded-2xl bg-white/40 p-4">
              {prayerText.length === 0 ? (
                <div className="space-y-3 py-4 text-center">
                  <p className="text-sm text-[#6a4b32]/60">
                    Chưa có lời cầu nguyện
                  </p>
                  <button
                    onClick={handleUseSamplePrayer}
                    className="text-xs text-[#8b4a2b] hover:text-[#9c5a36] underline"
                  >
                    Hoặc dùng mẫu tham khảo
                  </button>
                </div>
              ) : (
                prayerText.map((line, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 shadow-sm"
                  >
                    <span className="flex-1 text-[#3d2a1a]">{line}</span>
                    <button
                      onClick={() => handleRemovePrayerLine(index)}
                      className="text-red-700/60 hover:text-red-700 transition"
                      title="Xóa dòng này"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new line */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={newPrayerLine}
                onChange={(e) => setNewPrayerLine(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPrayerLine()}
                placeholder="Nhập lời cầu nguyện..."
                className="flex-1 rounded-full border border-[#c8ad8b] bg-white/60 px-6 py-3 text-[#3d2a1a] placeholder:text-[#6a4b32]/40 focus:border-[#8b4a2b] focus:outline-none focus:ring-2 focus:ring-[#8b4a2b]/20"
              />
              <button
                onClick={handleAddPrayerLine}
                disabled={!newPrayerLine.trim()}
                className="rounded-full bg-[#8b4a2b] px-6 py-3 text-sm font-semibold text-[#fff2d8] shadow-lg transition hover:bg-[#9c5a36] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Thêm
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleClearAll}
                disabled={prayerText.length === 0}
                className="flex-1 min-w-[120px] rounded-full border-2 border-red-700/30 bg-transparent px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-700/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Xóa tất cả
              </button>
              <button
                onClick={handleUseSamplePrayer}
                className="flex-1 min-w-[120px] rounded-full border-2 border-[#8b4a2b]/30 bg-transparent px-4 py-3 text-sm font-semibold text-[#8b4a2b] transition hover:bg-[#8b4a2b]/10"
              >
                Dùng mẫu
              </button>
              <button
                onClick={handleClosePrayerInput}
                className="flex-1 min-w-[120px] rounded-full bg-[#c77a55] px-4 py-3 text-sm font-semibold text-[#fff2d8] shadow-lg transition hover:bg-[#d68b66]"
              >
                Đóng
              </button>
              <button
                onClick={handleChant}
                disabled={prayerText.length === 0}
                className="flex-1 min-w-[120px] rounded-full bg-[#8b4a2b] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#fff2d8] shadow-lg transition hover:bg-[#9c5a36] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Bắt đầu khấn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Chant Overlay */}
      {isChanting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark vignette background */}
          <div 
            className="absolute inset-0 bg-gradient-radial from-black/40 via-black/60 to-black/80 backdrop-blur-[3px] prayer-overlay-fade"
            onClick={handleCompleteChant}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="prayer-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Prayer text container */}
          <div className="relative z-10 max-w-2xl px-8 text-center">
            <div className="space-y-6">
              {prayerText.map((line, index) => (
                <div
                  key={index}
                  className={`${titleFont.className} prayer-text-line text-3xl sm:text-4xl md:text-5xl font-bold text-[#ffd700] tracking-wide`}
                  style={{
                    animationDelay: `${index * 0.4}s`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
            
            {/* Complete button */}
            <button
              onClick={handleCompleteChant}
              className="mt-12 rounded-full bg-[#8b4a2b]/90 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#fff2d8] shadow-[0_15px_35px_rgba(120,70,40,0.5)] backdrop-blur-sm transition hover:bg-[#9c5a36] prayer-button-fade"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}

      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fff1d6_0%,_#f1e1c8_35%,_#e1cfb5_70%,_#cdb79b_100%)]" />
        <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_20%_20%,_#ffffff_0px,_transparent_120px)]" />

        {/* Cây trang trí bên trái */}
        <div className="pointer-events-none fixed left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center lg:flex">
          <img src="/dao.png" alt="Hoa đào" className="w-100 xl:w-100 drop-shadow-lg" />
          <img src="/the1.png" alt="Hoa mai" className="w-40 xl:w-40 drop-shadow-lg" />
        </div>

        {/* Cây trang trí bên phải */}
        <div className="pointer-events-none fixed right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center lg:flex">
          <img src="/the2.png" alt="Hoa mai" className="w-40 xl:w-40 drop-shadow-lg" />
          <img src="/mai.png" alt="Hoa mai" className="w-100 xl:w-100 drop-shadow-lg" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-12">
          <div className="relative w-full overflow-hidden rounded-[32px] border border-[#c8ad8b] bg-gradient-to-b from-[#f7edda] to-[#e7d4b9] shadow-[0_30px_80px_rgba(60,38,20,0.25)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fff4de_0%,_transparent_60%)] opacity-70" />

            <div className="relative px-8 py-10 sm:px-12">
              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className={`${titleFont.className} text-3xl font-semibold tracking-wide text-[#4a2f1d] sm:text-4xl`}
                >
                  Sống Tình Cảm adidaphat
                </div>
                <p className="max-w-xl text-sm text-[#6a4b32] sm:text-base">
                  Hãy thắp hương để thể hiện lòng thành kính và cầu
                </p>
              </div>

              <div className="mt-10 flex flex-col items-center gap-8">
                <div className="relative h-[400px] w-full max-w-3xl">
                  <div className="absolute left-1/2 top-0 h-full w-[92%] -translate-x-1/2 rounded-[28px] bg-gradient-to-b from-[#ead7b7] via-[#d7bf9c] to-[#c8ad8b] shadow-[inset_0_0_40px_rgba(255,255,255,0.4)]" />

                  {(count > 0 || animating) && (
                    <div className={`pointer-events-none absolute inset-x-0 top-6 z-30 flex justify-center ${isChanting ? 'chant-smoke-intense' : ''}`}>
                      <div className="relative h-48 w-64">
                        <span className="smoke s1" />
                        <span className="smoke s2" />
                        <span className="smoke s3" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-12 left-1/2 h-32 w-[88%] -translate-x-1/2 rounded-[28px] bg-gradient-to-b from-[#7a4b2e] via-[#5c3622] to-[#3b2216] shadow-[0_24px_50px_rgba(0,0,0,0.35)]" />
                  <div className="absolute bottom-36 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#c99a60] to-[#8a5d36] shadow-[0_16px_40px_rgba(0,0,0,0.25)]" />
                  <div className="absolute bottom-36 left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-full bg-[#3a2416] opacity-30" />

                  <div className="absolute -bottom-12 left-1/2 h-80 w-120 -translate-x-1/2">
                    <img
                      src="/44231867881905f166bf4ffeb9fde2cd-removebg-preview.png"
                      alt="Lư hương"
                      className="absolute inset-0 h-full w-full object-contain"
                    />

                    <div className="absolute left-1/2 top-0 h-[120px] w-40 -translate-x-1/2">
                      {visibleSticks.map((pos, index) => (
                        <div
                          key={`${pos.x}-${pos.y}-${index}`}
                          className="incense-stick"
                          style={{
                            left: `calc(50% + ${pos.x}px)`,
                            bottom: `${pos.y}px`,
                            transform: `translateX(-50%) rotate(${pos.rotate}deg)`,
                          }}
                        >
                          <span className="incense-band" />
                          <span className={`incense-ember ${isChanting ? 'chant-ember-glow' : ''}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {animating && (
                    <div className="ritual-layer">
                      <div className="ritual-stick">
                        <span className="incense-band" />
                        <span className="incense-ember ritual-ember" />
                        <span className="ritual-flame" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3 pb-2">
                  <div className="flex gap-4">
                    <button
                      onClick={handleLight}
                      disabled={isChanting || showPrayerInput}
                      className="rounded-full bg-[#8b4a2b] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#fff2d8] shadow-[0_15px_35px_rgba(120,70,40,0.35)] transition hover:-translate-y-[1px] hover:bg-[#9c5a36] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Thắp hương
                    </button>
                    <button
                      onClick={handleOpenPrayerInput}
                      disabled={isChanting || showPrayerInput || count === 0}
                      className="rounded-full bg-[#c77a55] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#fff2d8] shadow-[0_15px_35px_rgba(150,90,60,0.35)] transition hover:-translate-y-[1px] hover:bg-[#d68b66] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Khấn
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isChanting || showPrayerInput || count === 0}
                      className="rounded-full bg-[#d64545] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#fff2d8] shadow-[0_15px_35px_rgba(214,69,69,0.35)] transition hover:-translate-y-[1px] hover:bg-[#e55555] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="text-sm text-[#5e4330]">
                    Đã thắp: <span className="font-semibold">{count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
