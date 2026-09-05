import React, { useState } from 'react';
import { X, Copy, Check, Download, Smartphone, Terminal, FileCode, Layers, ShieldCheck, ExternalLink } from 'lucide-react';
import { ANDROID_SOURCE_FILES } from '../data/initialData';

interface AndroidProjectViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectViewerModal: React.FC<AndroidProjectViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<keyof typeof ANDROID_SOURCE_FILES>('MainActivity.kt');
  const [activeTab, setActiveTab] = useState<'guide' | 'code'>('guide');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = ANDROID_SOURCE_FILES[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Create a plain-text bundle or individual file downloads
    const content = Object.entries(ANDROID_SOURCE_FILES)
      .map(([name, code]) => `// ======================================\n// FILE: ${name}\n// ======================================\n\n${code}\n\n`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SSCCGLRegister_Android_Source.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A237E] text-[#D4AF37] border border-[#3949AB]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                SSC CGL Register — Native Android Project & APK Guide
              </h3>
              <p className="text-xs text-slate-400">
                Package: <code className="text-amber-300">com.sscprep.cglregister</code> • MinSDK 24 • TargetSDK 34
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-800/40 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'guide'
                  ? 'bg-[#1A237E] text-white border border-[#3949AB]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              APK Build & Installation Guide
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'code'
                  ? 'bg-[#1A237E] text-white border border-[#3949AB]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              View Kotlin & Compose Source Code
            </button>
          </div>

          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-600 transition"
          >
            <Download className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Download All Code</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'guide' ? (
            <div className="flex flex-col gap-6 text-sm text-slate-300">
              {/* Ready-to-Install APK Card */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-800/90 to-emerald-950/80 p-5 border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      APK Ready in Project Files
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">
                    NIWAS.apk (Signed & Verified)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Generated and signed directly in the project directory. Ready to install on Android phones (Android 5.0 to 15+).
                  </p>
                </div>
                <a
                  id="modal-btn-download-apk"
                  href="./NIWAS.apk"
                  download="NIWAS.apk"
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg transition active:scale-95 whitespace-nowrap"
                >
                  <Download className="h-4 w-4" />
                  <span>Download NIWAS APK</span>
                </a>
              </div>

              {/* Architecture Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase mb-1">
                    <Layers className="h-4 w-4" />
                    <span>Tech Stack</span>
                  </div>
                  <div className="text-white font-bold">Kotlin + Jetpack Compose</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Modern declarative Android UI with Material Design 3.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Storage Engine</span>
                  </div>
                  <div className="text-white font-bold">Room Database (SQLite)</div>
                  <p className="text-xs text-slate-400 mt-1">
                    100% on-device persistent storage. Zero backend required.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase mb-1">
                    <Smartphone className="h-4 w-4" />
                    <span>Android Target</span>
                  </div>
                  <div className="text-white font-bold">MinSDK 24 • TargetSDK 34</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Runs on Android 7.0 Nougat all the way to Android 14+.
                  </p>
                </div>
              </div>

              {/* Step-by-Step Guide */}
              <div className="rounded-2xl bg-slate-800/40 p-5 border border-slate-700">
                <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#D4AF37]" />
                  How to Build the Signed / Debug APK (Takes 2 Minutes)
                </h4>

                <ol className="space-y-4 text-xs text-slate-300 list-decimal list-inside">
                  <li className="pl-1">
                    <span className="font-bold text-white">Create New Project in Android Studio:</span>
                    <p className="pl-5 text-slate-400 mt-0.5">
                      Select <code className="text-amber-300">"Empty Compose Activity"</code>. Name it <code className="text-amber-300">SSC CGL Register</code>, package <code className="text-amber-300">com.sscprep.cglregister</code>, MinSDK <code className="text-amber-300">24</code>.
                    </p>
                  </li>

                  <li className="pl-1">
                    <span className="font-bold text-white">Paste Room & Navigation Dependencies:</span>
                    <p className="pl-5 text-slate-400 mt-0.5">
                      Copy the <code className="text-amber-300">build.gradle.kts</code> from the code tab below. Sync project with Gradle files.
                    </p>
                  </li>

                  <li className="pl-1">
                    <span className="font-bold text-white">Add Data & UI Files:</span>
                    <p className="pl-5 text-slate-400 mt-0.5">
                      Create <code className="text-amber-300">data/Data.kt</code> for the Room Entities and Database callback (pre-populates all 46 Math, English, GK, and Reasoning topics).
                    </p>
                  </li>

                  <li className="pl-1">
                    <span className="font-bold text-white">Build the APK file:</span>
                    <div className="pl-5 mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
                      <div># In Android Studio Menu:</div>
                      <div>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</div>
                      <div className="text-slate-400"># Output APK location:</div>
                      <div className="text-amber-200">app/build/outputs/apk/debug/app-debug.apk</div>
                    </div>
                  </li>

                  <li className="pl-1">
                    <span className="font-bold text-white">Install on your Android Phone:</span>
                    <p className="pl-5 text-slate-400 mt-0.5">
                      Transfer <code className="text-amber-300">app-debug.apk</code> to your phone via USB cable or Google Drive. Tap it in your File Manager and select <code className="text-emerald-400">"Install"</code>.
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* File Selector */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(ANDROID_SOURCE_FILES) as (keyof typeof ANDROID_SOURCE_FILES)[]).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => setSelectedFile(fileName)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition ${
                        selectedFile === fileName
                          ? 'bg-[#1A237E] text-white border border-[#3949AB]'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fileName}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition border border-slate-700"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-300" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Viewer */}
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre">
                  {currentCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
