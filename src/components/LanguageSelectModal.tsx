import React, { useState } from 'react';
import { SupportedLanguage, INDIAN_LANGUAGES, LanguageMeta } from '../services/translations';
import { Search, X, Check, Globe } from 'lucide-react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = INDIAN_LANGUAGES.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.nativeName.toLowerCase().includes(q) ||
      lang.englishName.toLowerCase().includes(q) ||
      lang.stateOrRegion.toLowerCase().includes(q)
    );
  });

  const popularCodes: SupportedLanguage[] = ['hi', 'en', 'mr', 'pa', 'te', 'bn', 'ta', 'gu'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">अपनी भाषा चुनें (Choose Language)</h3>
              <p className="text-xs text-stone-400">भारत की 22 आधिकारिक क्षेत्रीय भाषाएं + English</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-750 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 sm:p-4 border-b border-stone-800/80 bg-stone-920">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="भाषा खोजें... (Search Hindi, Tamil, Telugu, Marathi, etc.)"
              className="w-full h-11 pl-10 pr-4 bg-stone-850 border border-stone-750 focus:border-emerald-500 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs bg-stone-750 px-1.5 py-0.5 rounded"
              >
                हटाएं
              </button>
            )}
          </div>

          {/* Quick Popular Chips */}
          {!searchQuery && (
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[11px] text-stone-400 shrink-0 font-medium">लोकप्रिय:</span>
              {popularCodes.map((code) => {
                const meta = INDIAN_LANGUAGES.find((l) => l.code === code);
                if (!meta) return null;
                const isSelected = currentLanguage === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onSelectLanguage(code);
                      onClose();
                    }}
                    className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors text-xs ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700/60'
                    }`}
                  >
                    {meta.nativeName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-stone-800/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredLanguages.map((lang: LanguageMeta) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-200 ring-1 ring-emerald-500/40 shadow-sm'
                      : 'bg-stone-850/60 hover:bg-stone-800 border-stone-800 hover:border-stone-700 text-stone-200'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-sm text-white tracking-wide">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs text-stone-400">({lang.englishName})</span>
                    </div>
                    <div className="text-[11px] text-stone-400/80 truncate mt-0.5">
                      {lang.stateOrRegion}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-stone-400 text-sm">
              कोई भाषा नहीं मिली ("{searchQuery}")
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-800 bg-stone-950/60 text-center">
          <p className="text-[11px] text-stone-400">
            चयनित भाषा में भूमि मित्र बोलकर और लिखकर जवाब देंगे।
          </p>
        </div>
      </div>
    </div>
  );
};
