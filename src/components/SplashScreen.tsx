import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash for 1.3 seconds, then fade out
    const timer = setTimeout(() => {
      setFading(true);
    }, 1200);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      id="splash-screen"
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0B1325] text-white p-8 cursor-pointer select-none transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacer */}
      <div className="pt-8 text-center">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
          On-Device Study System
        </span>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#D4AF37] to-blue-500 opacity-30 blur-md animate-pulse" />
          <img
            src="./app-icon.png"
            alt="NIWAS Logo"
            className="relative h-28 w-28 rounded-2xl shadow-2xl border border-[#D4AF37]/50 object-cover"
          />
        </div>

        <h1 className="text-4xl font-black tracking-[0.25em] text-white uppercase drop-shadow-md">
          NIWAS
        </h1>

        <div className="h-0.5 w-16 bg-[#D4AF37] my-3 rounded-full" />

        <p className="text-xs font-semibold tracking-wider text-blue-200/90 uppercase">
          Exam Preparation Register
        </p>

        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
          Syllabus Mastery • Sectional Mocks • Performance Analytics
        </p>
      </div>

      {/* Bottom Footer Info */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Local Storage Ready</span>
        </div>
        <p className="text-[10px] text-slate-500">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
};
