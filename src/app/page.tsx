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

export default function Home() {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isChanting, setIsChanting] = useState(false);
  const [prayerText, setPrayerText] = useState("");
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

  const handleChant = () => {
    if (!prayerText.trim()) return;
    setIsChanting(true);
    // Auto close after CHANT_DURATION
    chantTimerRef.current = setTimeout(() => {
      setIsChanting(false);
    }, CHANT_DURATION);
  };

  const handlePrayerSubmit = () => {
    handleChant();
  };

  const handlePrayerKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleChant();
    }
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

  // Phân bố nhang theo cung tròn trên miệng lư hương, tránh chồng lấn
  const visibleSticks = useMemo(() => {
    const visibleCount = Math.min(count, MAX_STICKS);
    const STICK_SPACING = 1; // Khoảng cách giữa các que hương
    const TOTAL_WIDTH = (visibleCount - 1) * STICK_SPACING;
    // Đặt y để các que hương cắm vào đúng mép trên của nền lư hương (bottom-8/sm:bottom-12)
    // h-48 = 192px, bottom-8 = 32px => y = 32px
    // sm:h-56 = 224px, sm:bottom-12 = 48px => y = 48px (có thể responsive sau)
    const BASE_Y = 93; // px, tương ứng bottom-8
    return Array.from({ length: visibleCount }, (_, index) => {
      const x = -TOTAL_WIDTH / 2 + index * STICK_SPACING;
      const y = BASE_Y;
      // Nghiêng trái/phải ngẫu nhiên trong khoảng -8 đến 8 độ
      const rotate = (Math.random() - 0.5) * 60;
      return { x, y, rotate };
    });
  }, [count]);

  return (
    <div
      className={`${bodyFont.className} min-h-screen bg-[#efe4d2] text-[#3d2a1a]`}
    >
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
              <div
                className={`${titleFont.className} prayer-text-line text-3xl sm:text-4xl md:text-5xl font-bold text-[#ffd700] tracking-wide`}
              >
                {prayerText}
              </div>
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
        <div className="pointer-events-none fixed left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center xl:flex">
          <img src="/dao.png" alt="Hoa đào" className="w-80 xl:w-100 drop-shadow-lg opacity-80" />
          <img src="/the1.png" alt="Hoa mai" className="w-32 xl:w-40 drop-shadow-lg opacity-80" />
        </div>

        {/* Cây trang trí bên phải */}
        <div className="pointer-events-none fixed right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center xl:flex">
          <img src="/the2.png" alt="Hoa mai" className="w-32 xl:w-40 drop-shadow-lg opacity-80" />
          <img src="/mai.png" alt="Hoa mai" className="w-80 xl:w-100 drop-shadow-lg opacity-80" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-8 lg:px-6 lg:py-12">
          <div className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px] border border-[#c8ad8b] bg-gradient-to-b from-[#f7edda] to-[#e7d4b9] shadow-[0_30px_80px_rgba(60,38,20,0.25)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fff4de_0%,_transparent_60%)] opacity-70" />

            <div className="relative px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <div
                  className={`${titleFont.className} text-xl font-semibold tracking-wide text-[#4a2f1d] sm:text-2xl lg:text-3xl`}
                >
                  Sống Tình Cảm adidaphat
                </div>
                <p className="max-w-xl text-xs text-[#6a4b32] sm:text-sm leading-relaxed">
                  Hãy thắp hương để thể hiện lòng thành kính và cầu
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                    <div className="relative h-[380px] sm:h-[480px] lg:h-[400px] w-full max-w-2xl lg:max-w-3xl">
                      <div className="absolute left-1/2 top-0 h-full w-[92%] -translate-x-1/2 rounded-[28px] bg-gradient-to-b from-[#ead7b7] via-[#d7bf9c] to-[#c8ad8b] shadow-[inset_0_0_40px_rgba(255,255,255,0.4)]" />

                      {/* Smoke is now rendered per incense-stick */}

                      <div className="absolute bottom-8 sm:bottom-12 left-1/2 h-32 sm:h-40 w-[88%] -translate-x-1/2 rounded-[20px] sm:rounded-[28px] bg-gradient-to-b from-[#7a4b2e] via-[#5c3622] to-[#3b2216] shadow-[0_24px_50px_rgba(0,0,0,0.35)]" />
                      <div className="absolute bottom-36 sm:bottom-48 left-1/2 h-10 sm:h-14 w-[70%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#c99a60] to-[#8a5d36] shadow-[0_16px_40px_rgba(0,0,0,0.25)]" />
                      <div className="absolute bottom-36 sm:bottom-48 left-1/2 h-6 sm:h-8 w-[60%] -translate-x-1/2 rounded-full bg-[#3a2416] opacity-30" />

                      <div className="absolute -bottom-4 sm:-bottom-8 left-1/2 h-64 sm:h-80 w-60 sm:w-80 -translate-x-1/2">
                        <img
                          src="/44231867881905f166bf4ffeb9fde2cd-removebg-preview.png"
                          alt="Lư hương"
                          className="absolute bottom-0 left-0 h-full w-full object-contain"
                        />

                        <div className="absolute left-1/2 top-8 sm:top-0 h-[160px] sm:h-[200px] w-32 sm:w-40 -translate-x-1/2">
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
                              {/* Smoke on top of incense stick, moved higher */}
                              <span className="smoke s1" style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />
                              <span className="smoke s2" style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />
                              <span className="smoke s3" style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />
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

                <div className="flex flex-col items-center gap-3 mt-4">
                  <div className="flex gap-3">
                    <button
                      onClick={handleLight}
                      disabled={isChanting}
                      className="rounded-full bg-[#8b4a2b] px-4 sm:px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fff2d8] shadow-[0_15px_35px_rgba(120,70,40,0.35)] transition hover:-translate-y-[1px] hover:bg-[#9c5a36] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                      Thắp hương
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isChanting || count === 0}
                      className="rounded-full bg-[#d64545] px-4 sm:px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fff2d8] shadow-[0_15px_35px_rgba(214,69,69,0.35)] transition hover:-translate-y-[1px] hover:bg-[#e55555] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="text-sm text-[#5e4330]">
                    Đã thắp: <span className="font-semibold">{count}</span>
                  </div>
                </div>

                {/* Prayer Input Form - Simplified */}
                <div className="w-full max-w-sm border-t border-[#c8ad8b]/30 pt-3 mt-2">
                  <div className={`${titleFont.className} mb-2 text-center text-sm font-semibold text-[#4a2f1d]`}>
                    Lời cầu nguyện
                  </div>
                  <div className="mb-2 flex gap-1">
                    <textarea
                      value={prayerText}
                      onChange={(e) => setPrayerText(e.target.value)}
                      onKeyPress={handlePrayerKeyPress}
                      placeholder={count === 0 ? "Hãy thắp hương để bắt đầu cầu nguyện..." : "Nhập lời cầu nguyện của bạn..."}
                      rows={2}
                      disabled={count === 0}
                      className="flex-1 rounded-lg border border-[#c8ad8b] bg-white/60 px-2 py-2 text-xs text-[#3d2a1a] placeholder:text-[#6a4b32]/40 focus:border-[#8b4a2b] focus:outline-none focus:ring-1 focus:ring-[#8b4a2b]/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/60"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={handlePrayerSubmit}
                      disabled={count === 0 || !prayerText.trim()}
                      className="rounded-full bg-[#c77a55] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#fff2d8] shadow transition hover:bg-[#d68b66] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Khẩn cầu
                    </button>
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
