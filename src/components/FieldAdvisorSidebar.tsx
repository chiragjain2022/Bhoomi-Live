import React, { useState } from 'react';
import { PRESET_PROFILES, FarmProfile } from '../services/agronomyEngine';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';
import {
  MapPin,
  FileText,
  Sparkles,
  Layers,
  Droplet,
  Sun,
  ShieldCheck,
  Check,
  Compass,
  Navigation,
  Loader2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface FieldAdvisorSidebarProps {
  language: SupportedLanguage;
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  activeProfile: FarmProfile;
  onOpenOcr: () => void;
  onApplyGpsProfile?: (profile: FarmProfile) => void;
}

export const FieldAdvisorSidebar: React.FC<FieldAdvisorSidebarProps> = ({
  language,
  activeProfileId,
  onSelectProfile,
  activeProfile,
  onOpenOcr,
  onApplyGpsProfile,
}) => {
  const t = TRANSLATIONS[language];
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Real GPS Geolocation & Earth Engine Profiling
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError(language === 'hi' ? 'जीपीएस इस ब्राउज़र में उपलब्ध नहीं है।' : 'Geolocation not supported.');
      return;
    }

    setGpsError(null);
    setIsLocatingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const res = await fetch('/api/geospatial-context', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          });

          const data = await res.json();
          if (data.success && data.profile) {
            if (onApplyGpsProfile) {
              onApplyGpsProfile(data.profile);
            }
          }
        } catch (err) {
          console.warn('GPS context fetch failed', err);
          setGpsError(language === 'hi' ? 'स्थान डेटा लोड नहीं हो सका।' : 'Could not fetch satellite baseline.');
        } finally {
          setIsLocatingGps(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsError(language === 'hi' ? 'कृपया लोकेशन अनुमति दें।' : 'Location permission denied.');
        setIsLocatingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Agronomist Identity Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-100 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/images/bhoomi_mitra_agronomist_1792333572202.jpg"
            alt="Dr. Ramesh Sharma - Senior Field Agronomist"
            className="w-14 h-14 rounded-xl object-cover border border-emerald-500/40 shadow-sm shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-semibold text-sm text-stone-100 flex items-center gap-1.5">
              <span>भूमि मित्र (Bhoomi Mitra)</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">वरिष्ठ कृषि वैज्ञानिक व मृदा सलाहकार</p>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-emerald-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini Live Multimodal 2.0 सक्रिय</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Farm Region & Soil Baseline */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.regionalContext}</span>
          </h4>
          <span className="text-[11px] text-stone-400 font-mono">
            {activeProfile.baseline.district}, {activeProfile.baseline.state}
          </span>
        </div>

        {/* GPS Auto-Locate Button */}
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isLocatingGps}
          className="w-full mb-3 py-2 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {isLocatingGps ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>उपग्रह व जीपीएस खोज रहे हैं...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>मेरा खेत खोजें (वर्तमान GPS ऑटो-डिटेक्ट)</span>
            </>
          )}
        </button>

        {gpsError && (
          <div className="mb-2.5 p-2 rounded-lg bg-amber-950/60 border border-amber-800/60 text-[11px] text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Region Presets Selector */}
        <div className="space-y-1.5 mb-3">
          {Object.entries(PRESET_PROFILES).map(([key, prof]) => {
            const isSelected = activeProfileId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectProfile(key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 font-medium'
                    : 'bg-stone-850/60 border border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="truncate font-medium">{prof.nameHi}</div>
                  <div className="text-[10px] text-stone-400 truncate">{prof.descriptionHi}</div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Soil Baseline Data Display */}
        <div className="border-t border-stone-800/80 pt-2.5 text-xs text-stone-400 space-y-1.5">
          <div className="flex justify-between">
            <span>मिट्टी का प्रकार:</span>
            <span className="text-stone-200 font-medium">{activeProfile.baseline.predominantTexture}</span>
          </div>
          <div className="flex justify-between">
            <span>सामान्य pH मान:</span>
            <span className="text-emerald-400 font-mono font-medium">{activeProfile.baseline.pH}</span>
          </div>
          <div className="flex justify-between">
            <span>जैविक कार्बन (OC):</span>
            <span className="text-amber-400 font-mono">{activeProfile.baseline.organicCarbonPct}%</span>
          </div>
          <div className="flex justify-between">
            <span>उपग्रह नमी (Sentinel-2):</span>
            <span className="text-sky-400 font-medium">{activeProfile.telemetry.soilMoistureStatus}</span>
          </div>
        </div>

        {/* Mandi & Crop Economics */}
        <div className="mt-3 pt-2.5 border-t border-stone-800/80 bg-stone-950/50 -mx-4 -mb-4 p-3 rounded-b-2xl">
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
            <span className="flex items-center gap-1 font-semibold text-stone-300">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>मंडी भाव व बुवाई</span>
            </span>
            <span className="text-emerald-400 font-bold font-mono">
              ₹{activeProfile.mandi.mandiPriceInrQuintal}/क्विंटल
            </span>
          </div>
          <div className="text-[11px] text-stone-400 truncate">
            फसल: <span className="text-white font-medium">{activeProfile.mandi.recommendedCrop}</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            समय: {activeProfile.mandi.sowingWindow} ({activeProfile.mandi.currentSeason} सीजन)
          </div>
        </div>
      </div>

      {/* 3. Simple 3-Step Soil Triage Guide */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-stone-200 shadow-sm overflow-hidden">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.soilCheckGuide}</span>
        </h4>

        <div className="relative mb-3 rounded-xl overflow-hidden border border-stone-800">
          <img
            src="/src/assets/images/indian_soil_inspection_1792333573310.jpg"
            alt="Hand Soil Inspection"
            className="w-full h-28 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex items-end p-2.5">
            <span className="text-[11px] font-medium text-stone-200">
              हाथ से मिट्टी व पत्ती जांचने की विधि
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-stone-300">
          <div className="p-2 rounded-xl bg-stone-850/60 border border-stone-800">
            <div className="font-medium text-emerald-400 mb-0.5">{t.testRibbonTitle}</div>
            <div className="text-[11px] text-stone-400 leading-relaxed">{t.testRibbonDesc}</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-850/60 border border-stone-800">
            <div className="font-medium text-amber-400 mb-0.5">{t.testWaterTitle}</div>
            <div className="text-[11px] text-stone-400 leading-relaxed">{t.testWaterDesc}</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-850/60 border border-stone-800">
            <div className="font-medium text-sky-400 mb-0.5">{t.testLeafTitle}</div>
            <div className="text-[11px] text-stone-400 leading-relaxed">{t.testLeafDesc}</div>
          </div>
        </div>

        {/* Paper Soil Health Card OCR Trigger */}
        <button
          type="button"
          onClick={onOpenOcr}
          className="mt-3 w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>{t.uploadSoilCard}</span>
        </button>
      </div>
    </div>
  );
};
