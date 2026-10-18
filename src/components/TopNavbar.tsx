import React from 'react';
import { SupportedLanguage, INDIAN_LANGUAGES } from '../services/translations';
import { Sprout, Volume2, VolumeX, RotateCcw, Globe } from 'lucide-react';

interface TopNavbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenLanguageModal?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetChat: () => void;
  activeRegionName: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  language,
  onLanguageChange,
  onOpenLanguageModal,
  isMuted,
  onToggleMute,
  onResetChat,
  activeRegionName,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-emerald-300 shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base tracking-tight text-white">भूमि मित्र</span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">Bhoomi Mitra</span>
            </div>
            <p className="text-[11px] text-emerald-400/90 leading-none mt-0.5">
              {activeRegionName || 'खेत सलाहकार'}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation / Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio Mute / Unmute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${
              isMuted
                ? 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-stone-200'
                : 'bg-emerald-950/70 border-emerald-700/60 text-emerald-400 hover:bg-emerald-900/70'
            }`}
            title={isMuted ? 'ध्वनि चालू करें' : 'ध्वनि बंद करें'}
            aria-label="Toggle voice audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Switcher Button (All 23 Indian Languages) */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 bg-stone-800/90 hover:bg-stone-750 border border-stone-700 hover:border-emerald-500/60 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 transition-colors shadow-xs"
            title="अपनी क्षेत्रीय भाषा चुनें (23 भाषाएं)"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-300">
              {INDIAN_LANGUAGES.find((l) => l.code === language)?.nativeName || 'हिन्दी'}
            </span>
          </button>

          {/* New Chat Reset Button */}
          <button
            type="button"
            onClick={onResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700/80 transition-colors"
            title="नई बातचीत शुरू करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">नई बातचीत</span>
          </button>
        </div>
      </div>
    </header>
  );
};
