import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Home,
  CheckSquare,
  BarChart3,
  Smartphone,
  Maximize2,
  Minimize2,
  Code2,
  Video,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ScreenTab } from '../types';

interface AndroidEmulatorFrameProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  children: React.ReactNode;
  onOpenProjectCode: () => void;
  onOpenPromoVideo: () => void;
  onResetData: () => void;
  completedCount: number;
  totalCount: number;
}

export const AndroidEmulatorFrame: React.FC<AndroidEmulatorFrameProps> = ({
  currentTab,
  onSelectTab,
  children,
  onOpenProjectCode,
  onOpenPromoVideo,
  onResetData,
  completedCount,
  totalCount,
}) => {
  const [currentTime, setCurrentTime] = useState('10:58');
  const [deviceScale, setDeviceScale] = useState<number>(1);
  const [isFullWidth, setIsFullWidth] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-slate-900 text-slate-100 p-2 sm:p-4 selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Emulator Control Bar */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 mb-4 rounded-2xl bg-slate-800/80 px-4 py-2.5 backdrop-blur-md border border-slate-700/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1A237E] to-[#3949AB] text-[#D4AF37] shadow-sm">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">SSC CGL Register</h1>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                Android Emulator v34 (Running)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Kotlin + Jetpack Compose + Room DB (On-Device Storage)
            </p>
          </div>
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Promotional Video Button */}
          <button
            id="btn-open-promo-video"
            onClick={onOpenPromoVideo}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#D4AF37] px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <Video className="h-4 w-4" />
            <span>Watch Promo Video</span>
          </button>

          {/* Android Studio Code & APK Guide */}
          <button
            id="btn-open-code-modal"
            onClick={onOpenProjectCode}
            className="flex items-center gap-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white border border-slate-600 active:scale-95 transition"
          >
            <Code2 className="h-4 w-4 text-[#D4AF37]" />
            <span>Native Code & APK</span>
          </button>

          {/* View Toggle (Device Frame vs Flat Full View) */}
          <button
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="flex items-center gap-1 rounded-xl bg-slate-700/70 hover:bg-slate-700 px-2.5 py-1.5 text-xs text-slate-300 transition"
            title={isFullWidth ? 'Show Phone Frame' : 'Expand View'}
          >
            {isFullWidth ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{isFullWidth ? 'Phone Frame' : 'Full Screen'}</span>
          </button>

          {/* Reset App Data */}
          <button
            onClick={onResetData}
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition"
            title="Reset register to default sample data"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Android Device Frame OR Expanded Mode */}
      <div className={`w-full flex justify-center items-center transition-all ${isFullWidth ? 'max-w-4xl' : 'max-w-md'}`}>
        <div
          className={`relative w-full transition-all duration-300 ${
            isFullWidth
              ? 'rounded-2xl border-4 border-slate-700 shadow-2xl overflow-hidden'
              : 'rounded-[46px] p-3 bg-[#0F172A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[4px] border-[#334155]'
          }`}
          style={{ transform: `scale(${deviceScale})` }}
        >
          {/* Physical Phone Buttons on Right Side */}
          {!isFullWidth && (
            <>
              {/* Volume Buttons */}
              <div className="absolute -left-[7px] top-28 w-[3px] h-14 bg-slate-600 rounded-l-sm" />
              <div className="absolute -left-[7px] top-46 w-[3px] h-14 bg-slate-600 rounded-l-sm" />
              {/* Power Button */}
              <div className="absolute -right-[7px] top-36 w-[3px] h-18 bg-amber-500/80 rounded-r-sm" />
            </>
          )}

          {/* Device Screen Chassis */}
          <div className="relative w-full h-[780px] flex flex-col bg-[#FFFDF5] rounded-[36px] overflow-hidden text-slate-800 shadow-inner">
            {/* Top Status Bar (Android Material 3) */}
            <div className="sticky top-0 z-40 flex items-center justify-between px-6 pt-2 pb-1 bg-[#1A237E] text-white select-none">
              <span className="text-xs font-semibold tracking-tight">{currentTime}</span>

              {/* Camera Punch Hole */}
              <div className="h-4 w-4 rounded-full bg-black/90 border border-slate-800 shadow-inner flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-white/90">
                <span className="text-[10px] font-bold">5G</span>
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-medium">98%</span>
                  <Battery className="h-3.5 w-3.5 fill-white" />
                </div>
              </div>
            </div>

            {/* Android TopAppBar (Deep Navy #1A237E) */}
            <div className="sticky top-7 z-30 flex items-center justify-between px-4 py-2.5 bg-[#1A237E] text-white shadow-md border-b border-[#283593]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF37] text-slate-950 font-black text-xs shadow-xs">
                  CGL
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-wide leading-tight">SSC CGL Register</h2>
                  <p className="text-[10px] text-blue-200/80 leading-none">
                    Exam Prep Tracker • On-Device
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Completion badge */}
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-[#D4AF37]">
                  <Sparkles className="h-3 w-3" />
                  <span>{completedCount}/{totalCount} Done</span>
                </div>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto bg-[#FFFDF5] relative">
              {children}
            </main>

            {/* Bottom Android Navigation Bar (Deep Navy with Gold Accents) */}
            <nav className="sticky bottom-0 z-40 bg-[#1A237E] border-t border-[#283593]/80 px-2 py-1 shadow-lg">
              <div className="grid grid-cols-3 gap-1">
                {/* Tab 1: Dashboard */}
                <button
                  id="tab-btn-dashboard"
                  onClick={() => onSelectTab('Dashboard')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                    currentTab === 'Dashboard'
                      ? 'text-[#D4AF37] bg-white/10 font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Home className={`h-5 w-5 ${currentTab === 'Dashboard' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[11px] mt-0.5">Dashboard</span>
                </button>

                {/* Tab 2: Syllabus */}
                <button
                  id="tab-btn-syllabus"
                  onClick={() => onSelectTab('Syllabus')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                    currentTab === 'Syllabus'
                      ? 'text-[#D4AF37] bg-white/10 font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CheckSquare className={`h-5 w-5 ${currentTab === 'Syllabus' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[11px] mt-0.5">Syllabus</span>
                </button>

                {/* Tab 3: Mock Tests */}
                <button
                  id="tab-btn-mock-tests"
                  onClick={() => onSelectTab('Mock Tests')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                    currentTab === 'Mock Tests'
                      ? 'text-[#D4AF37] bg-white/10 font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className={`h-5 w-5 ${currentTab === 'Mock Tests' ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[11px] mt-0.5">Mock Tests</span>
                </button>
              </div>

              {/* Android Gesture Navigation Bar Pill */}
              <div className="flex justify-center pt-1.5 pb-0.5">
                <div className="h-1 w-32 rounded-full bg-white/40" />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
