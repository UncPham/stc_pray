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

const ANIMATION_DURATION = 2600; // Khớp với CSS animation ritual-move (2.6s)

export default function Home() {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [animating, setAnimating] = useState(false);
  const animatingRef = useRef(false);

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
          <img src="/the1.png" alt="Hoa mai" className="w-40 xl:w-40 drop-shadow-lg" />
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
                    <div className="pointer-events-none absolute inset-x-0 top-6 z-30 flex justify-center">
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
                          <span className="incense-ember" />
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
                  <button
                    onClick={handleLight}
                    className="rounded-full bg-[#8b4a2b] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#fff2d8] shadow-[0_15px_35px_rgba(120,70,40,0.35)] transition hover:-translate-y-[1px] hover:bg-[#9c5a36] active:translate-y-[1px]"
                  >
                    Thắp hương
                  </button>
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
