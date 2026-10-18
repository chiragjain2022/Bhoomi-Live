import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, FileSearch, Sparkles, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-4 border-[#1B4332] text-[#111111] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#1B4332] text-white">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#111111]">
              {language === 'hi' ? 'मृदा स्वास्थ्य कार्ड OCR स्कैनर' : 'Soil Health Card OCR Vision'}
            </h3>
            <p className="text-xs font-semibold text-gray-600">
              {language === 'hi' ? 'कागजी कार्ड की फोटो से सटीक आंकड़े निकालें' : 'Extract verified lab values via Gemini Vision'}
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-3 border-dashed border-[#1B4332]/40 rounded-2xl p-6 flex flex-col items-center justify-center bg-emerald-50/50 hover:bg-emerald-50 transition text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {imagePreview ? (
            <div className="relative w-full max-h-48 rounded-xl overflow-hidden shadow-inner">
              <img src={imagePreview} alt="Soil Card Preview" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-10 h-10 text-[#1B4332] mb-2 animate-bounce" />
              <div className="text-sm font-black text-[#1B4332]">
                {language === 'hi' ? 'कार्ड की फोटो चुनें या कैमरा से खींचें' : 'Tap to upload or photograph card'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Supports JPEG, PNG, WebP</div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        {imagePreview && !ocrResult && (
          <button
            onClick={runOCR}
            disabled={isAnalyzing}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-2xl font-black text-sm shadow-md transition disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.ocrProcessing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#FFB703]" />
                <span>{language === 'hi' ? 'कार्ड का विश्लेषण करें' : 'Extract Parameters via Vision OCR'}</span>
              </>
            )}
          </button>
        )}

        {/* Extracted Values Display */}
        {ocrResult && (
          <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-black text-emerald-800">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{ocrResult.sampleNo || 'SHC Verified'}</span>
              </span>
              <span>{ocrResult.farmerName || 'Farmer Record'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2 bg-white rounded-xl border text-center">
                <div className="text-[10px] text-gray-500 font-bold">pH Level</div>
                <div className="text-base font-black text-[#1B4332]">{ocrResult.pH}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border text-center">
                <div className="text-[10px] text-gray-500 font-bold">EC (dS/m)</div>
                <div className="text-base font-black text-[#1B4332]">{ocrResult.ec}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border text-center">
                <div className="text-[10px] text-gray-500 font-bold">Organic C %</div>
                <div className="text-base font-black text-[#1B4332]">{ocrResult.organicCarbon}%</div>
              </div>
              <div className="p-2 bg-white rounded-xl border text-center">
                <div className="text-[10px] text-gray-500 font-bold">N (kg/ha)</div>
                <div className="text-base font-black text-gray-800">{ocrResult.nitrogenKgHa}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border text-center">
                <div className="text-[10px] text-gray-500 font-bold">P (kg/ha)</div>
                <div className="text-base font-black text-gray-800">{ocrResult.phosphorusKgHa}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border text-center">
                <div className="text-[10px] text-gray-500 font-bold">K (kg/ha)</div>
                <div className="text-base font-black text-gray-800">{ocrResult.potassiumKgHa}</div>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="mt-3 w-full py-3 bg-[#FFB703] hover:bg-[#FFAA00] text-black font-black text-sm rounded-xl shadow transition"
            >
              {language === 'hi' ? 'यह डेटा खाद पर्ची पर लागू करें' : 'Apply Lab Data to Prescription'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
