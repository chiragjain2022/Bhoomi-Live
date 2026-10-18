import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, X, Check, Upload, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  language: SupportedLanguage;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  // Stop current active media stream
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start camera with multi-stage fallback
  const startCamera = async (mode: 'environment' | 'user') => {
    stopStream();
    setCameraError(null);
    setIsInitializing(true);

    try {
      let stream: MediaStream | null = null;
      try {
        // Preferred high-res environment camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (e1) {
        // Fallback to generic video
        console.warn('Environment constraint failed, trying generic video stream', e1);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (stream) {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch((err) => console.warn('Video play warning', err));
        }
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        language === 'hi'
          ? 'कैमरा लाइव स्ट्रीम उपलब्ध नहीं है। कृपया नीचे "डिवाइस कैमरा या गैलरी से चुनें" बटन का उपयोग करें।'
          : 'Live camera stream not accessible. Please use the "Choose from Device/Camera" button below.'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedPreview(null);
      startCamera(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  // Flip front/back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Capture frame from live video
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(dataUrl);
      stopStream();
    }
  };

  // Fallback: device native camera or file selector
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setCapturedPreview(base64);
          stopStream();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedPreview) {
      onCapture(capturedPreview);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera(facingMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-stone-100">{t.cameraTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport or Preview */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {capturedPreview ? (
            <img
              src={capturedPreview}
              alt="Captured Field Sample"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {isInitializing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-stone-300 text-sm">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>कैमरा शुरू हो रहा है...</span>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-900/95 text-stone-300">
                  <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
                  <p className="text-sm font-medium mb-4">{cameraError}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-sm transition-colors shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t.uploadFromGallery}</span>
                  </button>
                </div>
              )}

              {/* Viewfinder Reticle Guide */}
              {!cameraError && !isInitializing && (
                <div className="pointer-events-none absolute inset-8 border border-white/30 rounded-2xl flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
                    <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
                  </div>
                  <div className="text-center text-xs text-white/80 bg-black/40 px-3 py-1 rounded-full self-center backdrop-blur-xs">
                    मिट्टी या पत्ती को केंद्र में रखें
                  </div>
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
                    <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Controls */}
        <div className="p-5 bg-stone-950 flex items-center justify-between gap-3">
          {capturedPreview ? (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>पुनः फोटो लें</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>सलाह हेतु जोड़ें</span>
              </button>
            </>
          ) : (
            <>
              {/* Device file / camera upload trigger */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title={t.uploadFromGallery}
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              {/* Shutter capture button */}
              <button
                type="button"
                onClick={handleSnap}
                disabled={Boolean(cameraError) || isInitializing}
                className="w-16 h-16 rounded-full bg-white hover:bg-stone-100 flex items-center justify-center p-1.5 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xl"
                aria-label={t.takePhoto}
              >
                <div className="w-full h-full rounded-full border-2 border-black flex items-center justify-center bg-stone-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-600"></div>
                </div>
              </button>

              {/* Toggle front/back camera */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title={t.flipCamera}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
