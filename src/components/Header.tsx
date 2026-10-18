import React from 'react';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';
import { Wifi, WifiOff, Download, Sliders, Globe } from 'lucide-react';
import { usePWAInstall } from '../services/usePWAInstall';

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  networkLatencyMs: number;
  isOnline: boolean;
  currentStage: 1 | 2 | 3 | 4;
  onOpenSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  networkLatencyMs,
  isOnline,
  currentStage,
  onOpenSimulation,
}) => {
  const t = TRANSLATIONS[language];
  const { isInstallable, install } = usePWAInstall();

  // Network quality color
  const getLatencyColor = () => {
    if (!isOnline) return 'bg-rose-500 text-white';
    if (networkLatencyMs < 400) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    if (networkLatencyMs < 1500) return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#111A16] border-b border-[#2D6A4F]/50 px-3 py-2.5 sm:px-4 sm:py-3 text-white">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Brand / Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#52B788] p-1.5 flex items-center justify-center shadow-lg border border-[#74C69D]/40">
            <img src="/icon.svg" alt="BhoomiLive" className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                BhoomiLive
              </h1>
              <span className="text-xs font-black text-[#FFB703] bg-[#FFB703]/10 px-1.5 py-0.5 rounded border border-[#FFB703]/30">
                भूमि-लाइव
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-300/80 hidden xs:block leading-tight font-medium">
              Google Cloud AI Builders Cup
            </p>
          </div>
        </div>

        {/* Right Controls: Language Toggle, Latency, Demo Switcher, PWA Install */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Multilingual Voice-First Switcher */}
          <div className="relative flex items-center bg-[#1B4332] border border-[#2D6A4F] rounded-xl p-0.5 shadow-inner">
            <Globe className="w-3.5 h-3.5 text-[#FFB703] ml-1.5 mr-1 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white text-xs font-bold py-1 pr-2 pl-0.5 outline-none cursor-pointer"
            >
              <option value="hi" className="bg-[#111A16] text-white">हिंदी (Hindi)</option>
              <option value="mr" className="bg-[#111A16] text-white">मराठी (Marathi)</option>
              <option value="pa" className="bg-[#111A16] text-white">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="en" className="bg-[#111A16] text-white">English</option>
            </select>
          </div>

          {/* Network Latency Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getLatencyColor()}`}
            title={`WebSocket & Cloud Run Latency: ${networkLatencyMs}ms`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? `${networkLatencyMs}ms` : 'Offline'}</span>
          </div>

          {/* PWA Install Button if available */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FFB703] hover:bg-[#FFAA00] text-black font-black text-xs rounded-xl shadow transition"
              title="Install App to Home Screen"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Install</span>
            </button>
          )}

          {/* Demo Profiles Drawer Toggle */}
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-emerald-200 border border-[#52B788]/60 font-black text-xs rounded-xl shadow transition"
            title="Switch Demo Farm Profiles"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FFB703]" />
            <span className="hidden xs:inline">Demo Soils</span>
          </button>
        </div>
      </div>

      {/* 4-Stage Diagnostic Pipeline Bar */}
      <div className="flex items-center justify-between gap-1 max-w-5xl mx-auto mt-2 pt-2 border-t border-emerald-950 text-[10px] sm:text-xs font-bold text-gray-400">
        <div className={`flex items-center gap-1 ${currentStage >= 1 ? 'text-[#FFB703]' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${currentStage >= 1 ? 'bg-[#FFB703] text-black' : 'bg-gray-800 text-gray-400'}`}>1</span>
          <span className="truncate max-w-[80px] sm:max-w-none">Geospatial</span>
        </div>
        <div className="h-0.5 w-3 sm:w-8 bg-gray-800" />
        <div className={`flex items-center gap-1 ${currentStage >= 2 ? 'text-[#FFB703]' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${currentStage >= 2 ? 'bg-[#FFB703] text-black' : 'bg-gray-800 text-gray-400'}`}>2</span>
          <span className="truncate max-w-[80px] sm:max-w-none">Live Stream</span>
        </div>
        <div className="h-0.5 w-3 sm:w-8 bg-gray-800" />
        <div className={`flex items-center gap-1 ${currentStage >= 3 ? 'text-[#FFB703]' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${currentStage >= 3 ? 'bg-[#FFB703] text-black' : 'bg-gray-800 text-gray-400'}`}>3</span>
          <span className="truncate max-w-[80px] sm:max-w-none">Voice Triage</span>
        </div>
        <div className="h-0.5 w-3 sm:w-8 bg-gray-800" />
        <div className={`flex items-center gap-1 ${currentStage >= 4 ? 'text-[#FFB703]' : ''}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${currentStage >= 4 ? 'bg-[#FFB703] text-black' : 'bg-gray-800 text-gray-400'}`}>4</span>
          <span className="truncate max-w-[80px] sm:max-w-none">Action Card</span>
        </div>
      </div>
    </header>
  );
};
