import React from 'react';
import { SatelliteTelemetry, SoilBaseline, MandiCropContext } from '../services/agronomyEngine';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';
import { Droplet, Sun, Sprout, ShieldCheck, Activity, MapPin } from 'lucide-react';

interface TelemetryPillsProps {
  telemetry: SatelliteTelemetry;
  baseline: SoilBaseline;
  mandi: MandiCropContext;
  language: SupportedLanguage;
  roundedCoords?: { lat: number; lng: number; stSnapToGridPrecision: string };
  isSimulated?: boolean;
}

export const TelemetryPills: React.FC<TelemetryPillsProps> = ({
  telemetry,
  baseline,
  mandi,
  language,
  roundedCoords,
}) => {
  const t = TRANSLATIONS[language];

  // Traffic light helpers
  const getNdviStatus = (ndvi: number) => {
    if (ndvi > 0.5) return { color: 'bg-[#1B4332] text-[#74C69D] border-[#2D6A4F]', label: 'High Vigor (स्वस्थ)' };
    if (ndvi > 0.3) return { color: 'bg-[#43381B] text-[#FFB703] border-[#78590C]', label: 'Moderate (मध्यम)' };
    return { color: 'bg-[#431B1B] text-[#FF7575] border-[#7A2828]', label: 'Stressed (तनाव)' };
  };

  const getMoistureStatus = (ndwi: number) => {
    if (ndwi > 0.05) return { color: 'bg-[#123B44] text-[#64DFDF] border-[#1D606E]', label: 'Moist (नम)' };
    if (ndwi > -0.1) return { color: 'bg-[#43381B] text-[#FFD166] border-[#78590C]', label: 'Moderate (सामान्य)' };
    return { color: 'bg-[#4A2016] text-[#FF8C66] border-[#803827]', label: 'Dry Stress (शुष्क तनाव)' };
  };

  const ndviInfo = getNdviStatus(telemetry.ndvi);
  const moistureInfo = getMoistureStatus(telemetry.ndwi);

  return (
    <div className="w-full bg-[#111A16]/95 backdrop-blur-md border-b border-[#2D6A4F]/40 p-2.5 sm:p-3 text-white transition-all">
      {/* Location & Geospatial Privacy Shield Tag */}
      <div className="flex items-center justify-between gap-2 pb-2 text-xs font-semibold text-emerald-200 border-b border-emerald-900/40">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#FFB703] shrink-0" />
          <span className="font-bold text-white truncate">
            {baseline.district}, {baseline.state}
          </span>
          {roundedCoords && (
            <span className="text-[11px] text-emerald-400/80 hidden sm:inline">
              ({roundedCoords.lat}°N, {roundedCoords.lng}°E)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-[#1B4332] px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-emerald-300 border border-[#2D6A4F] shrink-0">
          <ShieldCheck className="w-3 h-3 text-[#FFB703]" />
          <span>1km Privacy Grid</span>
        </div>
      </div>

      {/* Satellite & BigQuery Live Telemetry Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-2 pb-0.5">
        {/* Pill 1: NDVI (Copernicus Sentinel-2) */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shrink-0 text-xs font-bold ${ndviInfo.color}`}>
          <Sprout className="w-4 h-4 shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-80 leading-none">NDVI Vigor</div>
            <div className="text-sm font-black tracking-tight leading-tight">{telemetry.ndvi.toFixed(2)}</div>
          </div>
        </div>

        {/* Pill 2: NDWI Canopy Moisture */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shrink-0 text-xs font-bold ${moistureInfo.color}`}>
          <Droplet className="w-4 h-4 shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-80 leading-none">Moisture Stress</div>
            <div className="text-sm font-black tracking-tight leading-tight">{telemetry.ndwi.toFixed(2)}</div>
          </div>
        </div>

        {/* Pill 3: Landsat Surface Temp */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-900/60 bg-amber-950/40 text-amber-300 shrink-0 text-xs font-bold">
          <Sun className="w-4 h-4 text-[#FFB703] shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-80 leading-none">Surface Temp</div>
            <div className="text-sm font-black tracking-tight leading-tight">{telemetry.landSurfaceTempC}°C</div>
          </div>
        </div>

        {/* Pill 4: Soil Health Card Baseline (BigQuery) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-800 bg-emerald-950/60 text-emerald-200 shrink-0 text-xs font-bold">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-80 leading-none">Soil pH & EC</div>
            <div className="text-sm font-black tracking-tight leading-tight">
              pH {baseline.pH} | {baseline.ecDsPerM} dS/m
            </div>
          </div>
        </div>

        {/* Pill 5: Recommended Sowing Crop */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#FFB703]/40 bg-[#FFB703]/10 text-[#FFD166] shrink-0 text-xs font-bold">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#FFB703] leading-none">Season / Mandi</div>
            <div className="text-sm font-black tracking-tight leading-tight truncate max-w-[140px]">
              {mandi.recommendedCrop.split(' ')[0]} (₹{mandi.mandiPriceInrQuintal}/Q)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
