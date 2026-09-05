import React, { useMemo } from 'react';
import {
  Home,
  CheckSquare,
  BarChart3,
  Sparkles,
  Download,
} from 'lucide-react';
import { ScreenTab } from '../types';

interface AndroidEmulatorFrameProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  children: React.ReactNode;
  completedCount: number;
  totalCount: number;
}

export const AndroidEmulatorFrame: React.FC<AndroidEmulatorFrameProps> = ({
  currentTab,
  onSelectTab,
  children,
  completedCount,
  totalCount,
}) => {
  // Hide the download APK button when running inside the Android APK or on mobile
  const isInstalledApp = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.protocol === 'file:' ||
      window.location.hostname === '127.0.0.1' ||
      window.navigator.userAgent.includes('wv') ||
      (window.navigator.userAgent.includes('Android') && !window.location.hostname.includes('run.app'))
    );
  }, []);

  return (
    <div className="flex justify-center h-screen max-h-[100dvh] bg-[#FFFDF5] sm:bg-slate-950 text-slate-800 antialiased overflow-hidden selection:bg-[#D4AF37]/30 selection:text-slate-900">
      {/* Native Mobile Screen Shell - Edge-to-edge on mobile devices */}
      <div className="relative w-full sm:max-w-md h-full max-h-[100dvh] flex flex-col bg-[#FFFDF5] sm:shadow-2xl overflow-hidden">
        {/* Android TopAppBar (Deep Navy #1A237E) */}
        <header className="flex-shrink-0 z-40 flex items-center justify-between px-3.5 py-2.5 bg-[#1A237E] text-white shadow-md border-b border-[#283593]">
          <div className="flex items-center gap-2.5">
            <img
              src="./app-icon.png"
              alt="NIWAS Icon"
              className="h-7 w-7 rounded-lg object-cover border border-[#D4AF37]/60 shadow-xs"
            />
            <div>
              <h1 className="text-sm font-black tracking-wider leading-tight text-white uppercase">
                NIWAS
              </h1>
              <p className="text-[10px] text-blue-200/80 leading-none font-medium">
                Prep Register • On-Device
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Completion Badge */}
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#D4AF37] border border-white/10">
              <Sparkles className="h-3 w-3" />
              <span>{completedCount}/{totalCount} Done</span>
            </div>

            {/* Direct APK Download Icon Button (Shown only in Web Preview) */}
            {!isInstalledApp && (
              <a
                id="btn-direct-apk-download"
                href="./NIWAS.apk"
                download="NIWAS.apk"
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition active:scale-95"
                title="Download NIWAS APK"
              >
                <Download className="h-4 w-4 text-emerald-400" />
              </a>
            )}
          </div>
        </header>

        {/* Scrollable Mobile App Body */}
        <main className="flex-1 overflow-y-auto overscroll-contain bg-[#FFFDF5] relative">
          {children}
        </main>

        {/* Bottom Android Navigation Bar (Deep Navy with Gold Accents - Fixed & Compact) */}
        <nav
          id="bottom-navigation-bar"
          className="flex-shrink-0 sticky bottom-0 z-40 bg-[#1A237E] border-t border-[#283593]/90 px-1.5 py-1 shadow-[0_-4px_14px_rgba(0,0,0,0.25)] select-none"
        >
          <div className="grid grid-cols-3 gap-1">
            {/* Tab 1: Dashboard */}
            <button
              id="tab-btn-dashboard"
              onClick={() => onSelectTab('Dashboard')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all active:scale-95 ${
                currentTab === 'Dashboard'
                  ? 'text-[#D4AF37] bg-white/10 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className={`h-4 w-4 ${currentTab === 'Dashboard' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5 leading-none">Dashboard</span>
            </button>

            {/* Tab 2: Syllabus */}
            <button
              id="tab-btn-syllabus"
              onClick={() => onSelectTab('Syllabus')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all active:scale-95 ${
                currentTab === 'Syllabus'
                  ? 'text-[#D4AF37] bg-white/10 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckSquare className={`h-4 w-4 ${currentTab === 'Syllabus' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5 leading-none">Syllabus</span>
            </button>

            {/* Tab 3: Mock Tests */}
            <button
              id="tab-btn-mock-tests"
              onClick={() => onSelectTab('Mock Tests')}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all active:scale-95 ${
                currentTab === 'Mock Tests'
                  ? 'text-[#D4AF37] bg-white/10 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className={`h-4 w-4 ${currentTab === 'Mock Tests' ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5 leading-none">Mock Tests</span>
            </button>
          </div>

          {/* Android Gesture Navigation Indicator Pill */}
          <div className="flex justify-center pt-1 pb-0.5">
            <div className="h-0.5 w-16 rounded-full bg-white/20" />
          </div>
        </nav>
      </div>
    </div>
  );
};
