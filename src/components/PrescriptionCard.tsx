import React, { useState } from 'react';
import { AmendmentDosage } from '../services/agronomyEngine';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';
import {
  FileText,
  Volume2,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Upload,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PrescriptionCardProps {
  prescription: AmendmentDosage;
  language: SupportedLanguage;
  onPlayVoiceReadout: () => void;
  isVoicePlaying?: boolean;
  onOpenSoilCardOCR: () => void;
  onSubscribePubSub: (phone: string) => Promise<boolean>;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  language,
  onPlayVoiceReadout,
  isVoicePlaying,
  onOpenSoilCardOCR,
  onSubscribePubSub,
}) => {
  const t = TRANSLATIONS[language];
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState<boolean>(true);
  const [isOrganicExpanded, setIsOrganicExpanded] = useState<boolean>(false);

  const handleSubscribe = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert(language === 'hi' ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSubscribing(true);
    const success = await onSubscribePubSub(phoneNumber);
    if (success) {
      setIsSubscribed(true);
    }
    setIsSubscribing(false);
  };

  const { fertilizerDosageKgAcre: dosage, soilHealthVerdict: verdict } = prescription;

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-[#1B4332] text-[#111111] space-y-5 animate-in fade-in duration-300">
      {/* Top Header & Voice Readout Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#1B4332] text-white">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              {t.actionCardTitle}
            </h2>
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-1">
            {language === 'hi'
              ? verdict.summaryHi
              : language === 'mr'
              ? verdict.summaryMr
              : language === 'pa'
              ? verdict.summaryPa
              : verdict.summaryEn}
          </p>
        </div>

        {/* Big Spoken Audio Playback Button (Zero-Literacy Support) */}
        <button
          onClick={onPlayVoiceReadout}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-base font-extrabold shadow-md transition-all active:scale-95 shrink-0 ${
            isVoicePlaying
              ? 'bg-rose-600 text-white border-2 border-rose-800 animate-pulse'
              : 'bg-[#1B4332] text-white hover:bg-[#2D6A4F]'
          }`}
          title={isVoicePlaying ? t.stopVoice : t.voiceReadout}
        >
          <Volume2 className={`w-5 h-5 ${isVoicePlaying ? 'animate-bounce' : ''}`} />
          <span>{isVoicePlaying ? t.stopVoice : t.voiceReadout}</span>
        </button>
      </div>

      {/* Target Recommended Crop Banner */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
        <div>
          <div className="text-xs font-bold text-[#FFB703] uppercase tracking-wider">
            {t.recommendedCrop}
          </div>
          <div className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">
            {prescription.recommendedCrop}
          </div>
        </div>
        <div className="bg-[#FFB703] text-[#111111] px-3.5 py-1.5 rounded-xl font-black text-sm shadow">
          {verdict.fertilityRating} Soil Health
        </div>
      </div>

      {/* Deterministic Fertilizer Dosage Breakdown (kg / Acre) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-lg font-black text-[#111111] flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-[#1B4332]" />
            <span>{t.dosageBreakdown}</span>
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
            ICAR STCR Calibrated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Urea Card */}
          <div className="bg-[#F8F9FA] border-2 border-[#1B4332]/20 rounded-2xl p-3.5 flex flex-col justify-between hover:border-[#1B4332] transition">
            <div className="text-xs font-bold text-gray-600">Urea (यूरिया 46% N)</div>
            <div className="text-2xl font-black text-[#1B4332] mt-1">{dosage.urea} <span className="text-sm font-bold text-gray-500">kg</span></div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-1">Split in 3 doses</div>
          </div>

          {/* DAP Card */}
          <div className="bg-[#F8F9FA] border-2 border-[#1B4332]/20 rounded-2xl p-3.5 flex flex-col justify-between hover:border-[#1B4332] transition">
            <div className="text-xs font-bold text-gray-600">DAP (18:46:0)</div>
            <div className="text-2xl font-black text-[#1B4332] mt-1">{dosage.dap} <span className="text-sm font-bold text-gray-500">kg</span></div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-1">Basal at sowing</div>
          </div>

          {/* MOP (Potash) Card */}
          <div className="bg-[#F8F9FA] border-2 border-[#1B4332]/20 rounded-2xl p-3.5 flex flex-col justify-between hover:border-[#1B4332] transition">
            <div className="text-xs font-bold text-gray-600">MOP (पोटाश 60% K)</div>
            <div className="text-2xl font-black text-[#1B4332] mt-1">{dosage.mop} <span className="text-sm font-bold text-gray-500">kg</span></div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-1">Basal at sowing</div>
          </div>

          {/* Zinc Sulfate / Gypsum / Lime */}
          <div className="bg-[#FFF9EB] border-2 border-[#FFB703]/50 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="text-xs font-bold text-gray-700">
              {dosage.gypsum > 0 ? 'Gypsum (जिप्सम)' : dosage.lime > 0 ? 'Agri Lime (चूना)' : 'Zinc SO4 (जिंक)'}
            </div>
            <div className="text-2xl font-black text-[#996500] mt-1">
              {dosage.gypsum > 0 ? dosage.gypsum : dosage.lime > 0 ? dosage.lime : dosage.zincSulfate}{' '}
              <span className="text-sm font-bold text-gray-500">kg</span>
            </div>
            <div className="text-[11px] font-semibold text-[#805500] mt-1">
              {dosage.gypsum > 0 ? 'Salinity corrector' : 'Micronutrient boost'}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Alerts / Lab Warnings */}
      {prescription.safetyAlerts.length > 0 && (
        <div className="space-y-2">
          {prescription.safetyAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl flex items-start gap-3 text-sm font-bold border-2 ${
                alert.type === 'danger'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : alert.type === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              {alert.type === 'danger' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              )}
              <div>{language === 'hi' ? alert.messageHi : alert.messageEn}</div>
            </div>
          ))}
        </div>
      )}

      {/* Application Timing & Split Schedule Accordion */}
      <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left font-black text-base text-[#111111]"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1B4332]" />
            <span>{t.scheduleTitle}</span>
          </div>
          {isScheduleExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isScheduleExpanded && (
          <div className="p-4 space-y-3 bg-white">
            {prescription.applicationSchedule.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-2.5 border-b border-gray-100 last:border-none last:pb-0">
                <span className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <div className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                    {item.timing} • {item.stage}
                  </div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">
                    {language === 'hi' ? item.instructionHi : item.instructionEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Organic & Biological Regenerative Remedies Accordion */}
      <div className="border-2 border-emerald-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsOrganicExpanded(!isOrganicExpanded)}
          className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 transition text-left font-black text-base text-emerald-950"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>{t.organicTitle}</span>
          </div>
          {isOrganicExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isOrganicExpanded && (
          <div className="p-4 space-y-3 bg-white">
            {prescription.organicAmendments.map((item, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-sm font-black text-emerald-900">{item.title}</div>
                <div className="text-xs font-bold text-gray-700 mt-1 leading-relaxed">
                  {language === 'hi' ? item.recipeHi : item.recipe}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cloud Pub/Sub WhatsApp/SMS Alert Subscription & Paper OCR Upload */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        {/* Upload Paper Soil Card Button */}
        <button
          onClick={onOpenSoilCardOCR}
          className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-800 font-extrabold text-sm transition"
        >
          <Upload className="w-4 h-4 text-[#1B4332]" />
          <span>{t.uploadSoilCard}</span>
        </button>

        {/* WhatsApp/SMS Pub/Sub Box */}
        <div className="flex-1 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-amber-950 mb-1.5">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>{t.subscribeAlerts}</span>
          </div>

          {isSubscribed ? (
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 p-2 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.subscribedSuccess}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="tel"
                placeholder="+91-9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-white border border-amber-400 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFB703]"
              />
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="px-3.5 py-1.5 bg-[#FFB703] hover:bg-[#FFAA00] text-black rounded-xl font-black text-xs shrink-0 shadow transition"
              >
                {isSubscribing ? '...' : 'Subscribe'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
