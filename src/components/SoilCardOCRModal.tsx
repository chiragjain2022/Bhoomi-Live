import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, FileSearch, Sparkles, Loader2, Camera } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';

interface SoilCardOCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onApplyExtractedBaseline: (extracted: {
    pH: number;
    ec: number;
    organicCarbon: number;
    nitrogenKgHa: number;
    phosphorusKgHa: number;
    potassiumKgHa: number;
    zincPpm: number;
    farmerName?: string;
    sampleNo?: string;
  }) => void;
}

export const SoilCardOCRModal: React.FC<SoilCardOCRModalProps> = ({
  isOpen,
  onClose,
  language,
  onApplyExtractedBaseline,
}) => {
  const t = TRANSLATIONS[language];
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<{
    farmerName?: string;
    sampleNo?: string;
    pH: number;
    ec: number;
    organicCarbon: number;
    nitrogenKgHa: number;
    phosphorusKgHa: number;
    potassiumKgHa: number;
    zincPpm: number;
    labName?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setOcrResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runOCR = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ocr-soil-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePreview }),
      });
      const data = await res.json();
      if (data.success && data.extracted) {
        setOcrResult(data.extracted);
      }
    } catch (err) {
      console.error('OCR failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (ocrResult) {
      onApplyExtractedBaseline(ocrResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {language === 'hi' ? 'मृदा स्वास्थ्य कार्ड OCR स्कैनर' : 'Soil Health Card OCR Vision'}
              </h3>
              <p className="text-xs text-stone-400">
                {language === 'hi'
                  ? 'सरकारी कार्ड की फोटो से पोषक तत्व आंकड़े निकालें'
                  : 'Extract verified lab metrics via Gemini Vision'}
              </p>
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-stone-700 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-stone-850/50 hover:bg-stone-850 transition-colors text-center group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="relative w-full max-h-52 rounded-xl overflow-hidden shadow-inner border border-stone-700">
                <img src={imagePreview} alt="Soil Card Preview" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-stone-800 group-hover:bg-emerald-950 border border-stone-700 group-hover:border-emerald-500 flex items-center justify-center text-stone-400 group-hover:text-emerald-400 mb-2.5 transition-colors">
                  <Upload className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-stone-200 group-hover:text-white">
                  {language === 'hi' ? 'कार्ड की फोटो चुनें या अपलोड करें' : 'Tap to upload or snap card photo'}
                </div>
                <div className="text-xs text-stone-500 mt-1">JPEG, PNG, WebP समर्थित</div>
              </div>
            )}
          </div>

          {/* Change photo button if uploaded */}
          {imagePreview && (
            <div className="flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-stone-400 hover:text-stone-200 underline"
              >
                दूसरी फोटो चुनें
              </button>
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setOcrResult(null);
                }}
                className="text-amber-400 hover:text-amber-300"
              >
                हटाएं
              </button>
            </div>
          )}

          {/* Analyze Action Button */}
          {imagePreview && !ocrResult && (
            <button
              type="button"
              onClick={runOCR}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950/40 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.ocrProcessing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{language === 'hi' ? 'कार्ड का विश्लेषण करें' : 'Extract Parameters via Vision OCR'}</span>
                </>
              )}
            </button>
          )}

          {/* Extracted Values Display */}
          {ocrResult && (
            <div className="space-y-3 bg-stone-950/80 p-4 rounded-2xl border border-stone-800 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 border-b border-stone-850 pb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{ocrResult.sampleNo || 'SHC Verified'}</span>
                </span>
                <span className="text-stone-300">{ocrResult.farmerName || 'Farmer Record'}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-medium">pH Level</div>
                  <div className="text-base font-bold text-emerald-400">{ocrResult.pH}</div>
                </div>
                <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-medium">EC (dS/m)</div>
                  <div className="text-base font-bold text-stone-200">{ocrResult.ec}</div>
                </div>
                <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-medium">Organic C %</div>
                  <div className="text-base font-bold text-amber-400">{ocrResult.organicCarbon}%</div>
                </div>
                <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-medium">N (kg/ha)</div>
                  <div className="text-base font-bold text-stone-200">{ocrResult.nitrogenKgHa}</div>
                </div>
                <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-medium">P (kg/ha)</div>
                  <div className="text-base font-bold text-stone-200">{ocrResult.phosphorusKgHa}</div>
                </div>
                <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-medium">K (kg/ha)</div>
                  <div className="text-base font-bold text-stone-200">{ocrResult.potassiumKgHa}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApply}
                className="mt-3 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                {language === 'hi' ? 'यह डेटा खाद पर्ची पर लागू करें' : 'Apply Lab Data to Prescription'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
