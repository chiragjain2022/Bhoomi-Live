import React from 'react';
import { PRESET_PROFILES, FarmProfile } from '../services/agronomyEngine';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';
import { X, Sliders, Database, Satellite, ShieldCheck, Check, Radio } from 'lucide-react';

interface SimulationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProfileId: string;
  onSelectProfile: (profileId: string) => void;
  language: SupportedLanguage;
}

export const SimulationDrawer: React.FC<SimulationDrawerProps> = ({
  isOpen,
  onClose,
  selectedProfileId,
  onSelectProfile,
  language,
}) => {
  const t = TRANSLATIONS[language];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111A16] border-l-2 border-[#2D6A4F] text-white p-5 sm:p-6 overflow-y-auto h-full flex flex-col justify-between shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60 mb-5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#1B4332] text-[#FFB703]">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-white">{t.simulationTitle}</h3>
                <p className="text-xs text-emerald-300/80">Google Cloud AI Builders Cup Showcase</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Selector Cards */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#FFB703]">
              {t.selectProfile}
            </div>

            {Object.values(PRESET_PROFILES).map((prof: FarmProfile) => {
              const isSelected = selectedProfileId === prof.id;
              return (
                <div
                  key={prof.id}
                  onClick={() => onSelectProfile(prof.id)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'bg-[#1B4332] border-[#FFB703] shadow-lg ring-2 ring-[#FFB703]/30'
                      : 'bg-black/40 border-emerald-900/50 hover:border-emerald-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-black text-white">
                      {language === 'hi' ? prof.nameHi : prof.name}
                    </span>
                    {isSelected ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB703] text-black text-[10px] font-black">
                        <Check className="w-3 h-3 stroke-[3]" /> Active
                      </span>
                    ) : (
                      <Radio className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {language === 'hi' ? prof.descriptionHi : prof.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] font-bold">
                    <span className="px-2 py-0.5 bg-black/50 rounded-md text-amber-300 border border-amber-900/40">
                      pH: {prof.baseline.pH}
                    </span>
                    <span className="px-2 py-0.5 bg-black/50 rounded-md text-cyan-300 border border-cyan-900/40">
                      EC: {prof.baseline.ecDsPerM} dS/m
                    </span>
                    <span className="px-2 py-0.5 bg-black/50 rounded-md text-emerald-300 border border-emerald-900/40">
                      NDVI: {prof.telemetry.ndvi}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Live GPS Option */}
            <div
              onClick={() => onSelectProfile('custom_gps')}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                selectedProfileId === 'custom_gps'
                  ? 'bg-[#1B4332] border-[#FFB703] shadow-lg'
                  : 'bg-black/40 border-emerald-900/50 hover:border-emerald-700/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-black text-white">
                  {language === 'hi' ? 'वास्तविक GPS स्थान' : 'Device Real GPS'}
                </span>
                {selectedProfileId === 'custom_gps' && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB703] text-black text-[10px] font-black">
                    <Check className="w-3 h-3 stroke-[3]" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80">
                Queries live `navigator.geolocation` snapped to 1km privacy grid.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture Info Card */}
        <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-emerald-900/60 text-xs text-emerald-300/90 space-y-2">
          <div className="font-extrabold text-[#FFB703] flex items-center gap-1.5">
            <Satellite className="w-4 h-4" />
            <span>Google Cloud Stack Under The Hood</span>
          </div>
          <div className="text-[11px] space-y-1 text-gray-300 leading-normal">
            <div>• <strong>Gemini 3.8 Live API:</strong> 1 FPS 480p WebRTC/WS stream + 16kHz PCM audio.</div>
            <div>• <strong>Earth Engine:</strong> Sentinel-2 Harmonized (NDVI/NDWI) + Landsat 8/9 LST.</div>
            <div>• <strong>BigQuery:</strong> District Soil Health Cards + ST_SnapToGrid privacy.</div>
            <div>• <strong>Cloud Pub/Sub:</strong> Weather & irrigation WhatsApp alerts.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
