import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Smartphone,
  CheckCircle,
  Award,
  Clock,
  Download,
  Share2,
} from 'lucide-react';

interface PromotionalVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab?: (tab: 'Dashboard' | 'Syllabus' | 'Mock Tests') => void;
}

interface VideoScene {
  startSec: number;
  endSec: number;
  title: string;
  subtitle: string;
  audioVoiceover: string;
}

const SCENES: VideoScene[] = [
  {
    startSec: 0,
    endSec: 5,
    title: 'Scene 1: Preparation Overview',
    subtitle: 'Tired of messy notebooks for your SSC CGL prep? Meet your new digital study partner.',
    audioVoiceover: 'Tired of messy notebooks for your SSC CGL preparation? Meet your new digital study partner.',
  },
  {
    startSec: 5,
    endSec: 15,
    title: 'Scene 2: Syllabus Mastery',
    subtitle: 'Track every topic across Math, English, GK, and Reasoning. One tap and you are done.',
    audioVoiceover: 'Track every topic across Math, English, GK, and Reasoning. One tap and you are done.',
  },
  {
    startSec: 15,
    endSec: 25,
    title: 'Scene 3: Mock Test Tracker',
    subtitle: 'Log your mock scores instantly. Watch your progress grow and stay motivated every single day.',
    audioVoiceover: 'Log your mock scores instantly. Watch your progress grow and stay motivated every single day.',
  },
  {
    startSec: 25,
    endSec: 30,
    title: 'Scene 4: Target & Success',
    subtitle: 'SSC CGL Register. Organized. Simple. Success. Download now and start tracking!',
    audioVoiceover: 'SSC CGL Register. Organized. Simple. Success. Download now and start tracking!',
  },
];

export const PromotionalVideoPlayer: React.FC<PromotionalVideoPlayerProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenSceneRef = useRef<number>(-1);

  const TOTAL_DURATION = 30; // 30 seconds

  // Identify active scene
  const currentSceneIndex = SCENES.findIndex(
    (s) => currentTime >= s.startSec && currentTime < s.endSec
  );
  const activeScene = SCENES[currentSceneIndex >= 0 ? currentSceneIndex : SCENES.length - 1];

  // Speech synthesis voice-over
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  };

  useEffect(() => {
    if (isPlaying && currentSceneIndex !== -1 && currentSceneIndex !== lastSpokenSceneRef.current) {
      lastSpokenSceneRef.current = currentSceneIndex;
      speakText(SCENES[currentSceneIndex].audioVoiceover);
    }
  }, [isPlaying, currentSceneIndex, isMuted]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      lastSpokenSceneRef.current = -1;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // Main playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = null;
      return;
    }

    const step = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          return TOTAL_DURATION;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  if (!isOpen) return null;

  const handlePlayToggle = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      lastSpokenSceneRef.current = -1;
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    lastSpokenSceneRef.current = -1;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    lastSpokenSceneRef.current = -1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-white">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-800/90 border-b border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4AF37] text-slate-950 font-black">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">SSC CGL Register — Official 30s Promo Video</h3>
              <p className="text-xs text-slate-400">
                Interactive Animated Video Showcase • Generated from exact app storyboard
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-[#0B1120] to-[#1A237E]/40 flex items-center justify-center p-4 sm:p-6 min-h-[360px] sm:min-h-[420px] overflow-hidden">
          {/* Animated Background Ambience */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1A237E]/40 rounded-full blur-3xl pointer-events-none" />

          {/* Device Showcase Viewport */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[380px] sm:h-[400px] rounded-[32px] bg-[#FFFDF5] text-slate-800 shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col">
            {/* Simulated Android Status Bar */}
            <div className="bg-[#1A237E] text-white px-4 py-1.5 flex items-center justify-between text-[10px] font-bold">
              <span>10:58</span>
              <div className="flex items-center gap-1 text-[#D4AF37]">
                <span>SSC CGL REGISTER</span>
              </div>
              <span>5G 98%</span>
            </div>

            {/* Simulated App Content based on Active Scene */}
            <div className="flex-1 p-4 flex flex-col relative overflow-hidden bg-[#FFFDF5]">
              {/* SCENE 1: 0s - 5s -> Dashboard Intro & Animated Progress Ring */}
              {currentTime < 5 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                  <span className="text-xs font-bold text-[#1A237E] uppercase tracking-widest mb-1">
                    SSC CGL Preparation Tracker
                  </span>
                  <div className="relative my-3">
                    <div className="w-32 h-32 rounded-full border-8 border-slate-200 flex items-center justify-center relative">
                      <div
                        className="absolute inset-0 rounded-full border-8 border-[#D4AF37] transition-all duration-300"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${Math.min(
                            100,
                            50 + Math.sin((currentTime / 5) * Math.PI * 0.9) * 50
                          )}% 0%, 100% 100%, 0% 100%)`,
                        }}
                      />
                      <div className="text-center">
                        <div className="text-3xl font-black text-[#1A237E]">
                          {Math.min(45, Math.round((currentTime / 5) * 45))}%
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-xl p-3 border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
                    Math: 60% • English: 30% • GK: 15% • Reasoning: 80%
                  </div>
                </div>
              )}

              {/* SCENE 2: 5s - 15s -> Syllabus Checklist & Tapping */}
              {currentTime >= 5 && currentTime < 15 && (
                <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                    <span className="text-xs font-bold text-slate-800">Syllabus • Quantitative Aptitude</span>
                    <span className="text-xs font-black text-[#1A237E]">10/14 Topics</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                      <CheckCircle className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="line-through text-slate-500 font-medium">Number System</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                      <CheckCircle className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="line-through text-slate-500 font-medium">Percentage & Ratio</span>
                    </div>

                    {/* Animated Tap on Algebra & Geometry */}
                    <div
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-all duration-300 ${
                        currentTime >= 8 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center text-white ${
                          currentTime >= 8 ? 'bg-[#D4AF37]' : 'border border-slate-300'
                        }`}
                      >
                        {currentTime >= 8 && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <span className={currentTime >= 8 ? 'line-through text-slate-500' : 'font-bold text-slate-800'}>
                        Algebra & Equations {currentTime >= 8 ? '✓' : ''}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-all duration-300 ${
                        currentTime >= 11 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center text-white ${
                          currentTime >= 11 ? 'bg-[#D4AF37]' : 'border border-slate-300'
                        }`}
                      >
                        {currentTime >= 11 && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <span className={currentTime >= 11 ? 'line-through text-slate-500' : 'font-bold text-slate-800'}>
                        Geometry & Trigonometry {currentTime >= 11 ? '✓' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Simulated Tap Cursor */}
                  {currentTime >= 7 && currentTime <= 12 && (
                    <div
                      className="absolute w-8 h-8 rounded-full bg-blue-600/40 border-2 border-blue-400 pointer-events-none animate-ping"
                      style={{
                        top: currentTime < 10 ? '58%' : '76%',
                        left: '48%',
                      }}
                    />
                  )}
                </div>
              )}

              {/* SCENE 3: 15s - 25s -> Mock Test Logging */}
              {currentTime >= 15 && currentTime < 25 && (
                <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                    <span className="text-xs font-bold text-slate-800">Mock Tests • Tier 1 & 2</span>
                    <span className="text-xs font-bold text-blue-700">Recent: 158/200</span>
                  </div>

                  {/* Simulated Dialog popup at 17s */}
                  {currentTime >= 17 && currentTime < 22 ? (
                    <div className="rounded-xl bg-white p-3 border-2 border-[#1A237E] shadow-xl text-left animate-in zoom-in duration-200">
                      <div className="text-[11px] font-bold text-[#1A237E] uppercase">Log New Score</div>
                      <div className="mt-2 text-xs font-bold text-slate-800">Tier 1 (Prelims) — 200 Marks</div>
                      <div className="mt-2 p-2 bg-slate-100 rounded-lg text-sm font-black text-slate-900 border border-slate-300">
                        Score: 150 / 200 (75%)
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 italic">"Good attempt in Quant and English"</div>
                      <button className="mt-2 w-full py-1 bg-[#1A237E] text-white font-bold text-xs rounded-lg">
                        ✓ Saved to Room Database
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="rounded-xl bg-white p-2.5 border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                            Tier 1 (Prelims)
                          </span>
                          <div className="text-sm font-black text-[#1A237E] mt-1">158/200 • 79%</div>
                        </div>
                        <Award className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                            Tier 2 (Mains)
                          </span>
                          <div className="text-sm font-black text-[#1A237E] mt-1">285/390 • 73%</div>
                        </div>
                        <Award className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCENE 4: 25s - 30s -> Target Countdown & CTA */}
              {currentTime >= 25 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-[#1A237E] text-[#D4AF37] flex items-center justify-center text-xl font-black shadow-lg mb-2">
                    CGL
                  </div>
                  <h4 className="text-base font-black text-[#1A237E]">SSC CGL Register</h4>
                  <p className="text-xs text-slate-600 font-medium">Exam Prep Tracker</p>

                  <div className="my-3 grid grid-cols-3 gap-1.5 w-full">
                    <div className="bg-[#1A237E] text-white p-1.5 rounded-lg">
                      <div className="text-base font-black">45</div>
                      <div className="text-[9px] text-blue-200">Days Left</div>
                    </div>
                    <div className="bg-[#1A237E] text-white p-1.5 rounded-lg">
                      <div className="text-base font-black">100%</div>
                      <div className="text-[9px] text-blue-200">Offline</div>
                    </div>
                    <div className="bg-[#D4AF37] text-slate-950 p-1.5 rounded-lg font-black">
                      <div className="text-base font-black">0</div>
                      <div className="text-[9px]">Server Cost</div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Organized. Simple. Success.
                  </span>
                </div>
              )}
            </div>

            {/* Simulated Navigation Bar */}
            <div className="bg-[#1A237E] py-1.5 px-4 flex justify-around text-white/70 text-[9px] font-semibold border-t border-slate-700">
              <span className={currentTime < 5 || currentTime >= 25 ? 'text-[#D4AF37] font-bold' : ''}>
                Dashboard
              </span>
              <span className={currentTime >= 5 && currentTime < 15 ? 'text-[#D4AF37] font-bold' : ''}>
                Syllabus
              </span>
              <span className={currentTime >= 15 && currentTime < 25 ? 'text-[#D4AF37] font-bold' : ''}>
                Mock Tests
              </span>
            </div>
          </div>
        </div>

        {/* Video Subtitles Banner */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
              {activeScene.title}
            </span>
            <p className="text-xs font-medium text-slate-200">"{activeScene.subtitle}"</p>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-red-400" /> : <Volume2 className="h-3.5 w-3.5 text-green-400" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice-Over ON'}</span>
          </button>
        </div>

        {/* Playback Controls & Timeline Scrubber */}
        <div className="p-4 sm:px-6 sm:py-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 w-10">
              0:{Math.floor(currentTime).toString().padStart(2, '0')}
            </span>
            <input
              type="range"
              min="0"
              max={TOTAL_DURATION}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-[#D4AF37] h-1.5 rounded-lg bg-slate-700 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-400 w-10">0:30</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayToggle}
                className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-bold text-slate-950 hover:bg-[#C59F2D] active:scale-95 transition"
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-slate-950" /> : <Play className="h-4 w-4 fill-slate-950" />}
                <span>{isPlaying ? 'Pause Video' : 'Play Showcase'}</span>
              </button>

              <button
                onClick={handleRestart}
                className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restart</span>
              </button>
            </div>

            {/* Scene Selection Pills */}
            <div className="hidden sm:flex items-center gap-1">
              {SCENES.map((scene, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentTime(scene.startSec);
                    lastSpokenSceneRef.current = -1;
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                    currentSceneIndex === i
                      ? 'bg-[#1A237E] text-white border border-[#3949AB]'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Scene {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
