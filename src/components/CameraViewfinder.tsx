import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  Zap,
  CircleDot,
  Upload,
  Power,
  ImageIcon,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../services/translations';

export type GuidedTest = 'ribbon' | 'water' | 'leaf';

interface CameraViewfinderProps {
  isActive: boolean;
  activeTest: GuidedTest;
  language: SupportedLanguage;
  onFrameCaptured?: (base64Jpeg: string) => void;
  onActiveTestChange: (test: GuidedTest) => void;
  onToggleCamera?: () => void;
  isProcessing?: boolean;
}

const SAMPLE_PREVIEWS: Record<
  GuidedTest,
  { label: string; labelHi: string; desc: string; descHi: string; gradient: string }
> = {
  ribbon: {
    label: '1. Ribbon & Texture Triage',
    labelHi: '1. मिट्टी का रोल (रिबन टेस्ट)',
    desc: 'Pick up moist soil and squeeze between thumb and index finger.',
    descHi: 'मुट्ठी भर नम मिट्टी लें और अंगूठे से दबाकर रोल बनाएं।',
    gradient: 'from-[#382314] via-[#24150B] to-[#120A05]',
  },
  water: {
    label: '2. Water Infiltration Rate',
    labelHi: '2. पानी सोखने का परीक्षण',
    desc: 'Splash water and time how fast moisture penetrates the surface.',
    descHi: 'थोड़ा पानी डालकर देखें कितनी देर में मिट्टी सोखती है।',
    gradient: 'from-[#143236] via-[#0E2024] to-[#061012]',
  },
  leaf: {
    label: '3. Adjacent Crop Leaf Scan',
    labelHi: '3. पास की पत्ती दिखाएं',
    desc: 'Align crop leaves to check for Nitrogen chlorosis or yellowing.',
    descHi: 'पौधे की पत्ती दिखाएं (पीलापन या पोषक तत्वों की कमी जांचने हेतु)।',
    gradient: 'from-[#193818] via-[#102410] to-[#081208]',
  },
};

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  isActive,
  activeTest,
  language,
  onFrameCaptured,
  onActiveTestChange,
  onToggleCamera,
}) => {
  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [infiltrationTimer, setInfiltrationTimer] = useState<number>(0);
  const [isTimingWater, setIsTimingWater] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isStreamPlaying, setIsStreamPlaying] = useState<boolean>(false);

  // Multi-tier Camera Starter
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      let stream: MediaStream | null = null;

      // Tier 1: Prefer ideal constraints
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });
      } catch (tier1Err) {
        console.warn('Tier 1 camera constraints failed, attempting fallback to generic video...', tier1Err);
        // Tier 2: Generic video fallback
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } catch (tier2Err) {
          console.warn('Tier 2 camera fallback failed:', tier2Err);
          throw tier2Err;
        }
      }

      if (stream) {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
            setIsStreamPlaying(true);
            setUploadedImage(null);
          } catch (playErr) {
            console.warn('video.play() rejected:', playErr);
          }
        }
      }
    } catch (err: unknown) {
      console.warn('Camera access unavailable:', err);
      setCameraError('Camera access unavailable. You can upload a photo or use the sample tests.');
      setIsStreamPlaying(false);
    }
  }, [facingMode]);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
    setIsStreamPlaying(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive, startCamera, stopCamera]);

  // Periodic Frame Downsampler (1 FPS 480p)
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (isActive && isStreamPlaying && videoRef.current && videoRef.current.readyState >= 2) {
        canvas.width = 480;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 480, 360);
          const base64 = canvas.toDataURL('image/jpeg', 0.65);
          if (onFrameCaptured) {
            onFrameCaptured(base64);
          }
        }
      } else if (uploadedImage) {
        if (onFrameCaptured) {
          onFrameCaptured(uploadedImage);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isStreamPlaying, uploadedImage, onFrameCaptured]);

  // Infiltration Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimingWater) {
      timer = setInterval(() => {
        setInfiltrationTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimingWater]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities() as { torch?: boolean };
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
          });
          setTorchOn(!torchOn);
        }
      } catch (e) {
        console.warn('Torch toggle failed', e);
      }
    }
  };

  // Flip Camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle Local Photo Upload / Mobile Camera Capture
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedImage(base64);
        setCameraError(null);
        if (onFrameCaptured) {
          onFrameCaptured(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sample = SAMPLE_PREVIEWS[activeTest];
  const isVisualFeedActive = (isActive && isStreamPlaying) || !!uploadedImage;

  return (
    <div className="relative w-full min-h-[360px] sm:min-h-[400px] bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-900/60 select-none flex flex-col justify-between">
      {/* Hidden 1 FPS downsampling canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden File Input for Native Camera / Library */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* 1. Real Video Stream Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isStreamPlaying && !uploadedImage ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
        }`}
      />

      {/* 2. Uploaded Photo View (if active) */}
      {uploadedImage && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-0">
          <img src={uploadedImage} alt="Uploaded field sample" className="w-full h-full object-contain" />
          <button
            onClick={() => setUploadedImage(null)}
            className="absolute top-3 right-3 z-20 px-3 py-1 bg-black/80 hover:bg-black text-white rounded-full text-xs font-bold border border-white/30 transition shadow-lg pointer-events-auto"
          >
            Clear Photo
          </button>
        </div>
      )}

      {/* ==============================================================================
          CASE A: CAMERA IS PAUSED / PREVIEW MODE (Clean layout with NO overlaps)
         ============================================================================== */}
      {!isVisualFeedActive ? (
        <div className={`relative z-10 w-full h-full min-h-[360px] sm:min-h-[400px] flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b ${sample.gradient} text-white`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-emerald-500/40 text-xs font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{t.cameraRunning ? 'Camera Ready' : 'Preview Mode'}</span>
            </div>

            <button
              onClick={() => {
                if (onToggleCamera) onToggleCamera();
                else startCamera();
              }}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition shadow"
              title={t.turnOnCamera}
            >
              <Power className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Center Card with Clear Spacing */}
          <div className="my-auto flex flex-col items-center text-center max-w-sm mx-auto py-2">
            <div className="w-14 h-14 rounded-2xl bg-[#1B4332] border border-[#52B788] flex items-center justify-center mb-3 shadow-lg">
              <Camera className="w-7 h-7 text-[#FFB703]" />
            </div>

            <h4 className="text-base sm:text-lg font-black text-[#FFD166]">
              {language === 'hi' ? sample.labelHi : sample.label}
            </h4>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xs leading-relaxed font-medium">
              {language === 'hi' ? sample.descHi : sample.desc}
            </p>

            {/* Action Buttons (Separated, No Overlap) */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  if (onToggleCamera) onToggleCamera();
                  else startCamera();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FFB703] hover:bg-[#FFAA00] text-black font-black text-xs sm:text-sm rounded-xl shadow-lg transition active:scale-95"
              >
                <Power className="w-4 h-4" />
                <span>{t.turnOnCamera}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-black/50 hover:bg-black/70 text-white font-black text-xs sm:text-sm rounded-xl border border-white/30 shadow-lg transition active:scale-95"
              >
                <Upload className="w-4 h-4 text-[#FFB703]" />
                <span>{t.uploadPhoto}</span>
              </button>
            </div>

            {cameraError && (
              <p className="mt-2 text-[11px] text-amber-300 font-semibold max-w-xs">
                {cameraError}
              </p>
            )}
          </div>

          {/* Bottom Test Selector Bar */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 self-center shadow-lg">
            <button
              onClick={() => onActiveTestChange('ribbon')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTest === 'ribbon'
                  ? 'bg-[#FFB703] text-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>1. Ribbon</span>
            </button>

            <button
              onClick={() => onActiveTestChange('water')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTest === 'water'
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>2. Water</span>
            </button>

            <button
              onClick={() => onActiveTestChange('leaf')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTest === 'leaf'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>3. Leaf</span>
            </button>
          </div>
        </div>
      ) : (
        /* ==============================================================================
           CASE B: CAMERA STREAM IS ACTIVE (Overlays rendered cleanly over live video)
           ============================================================================== */
        <div className="relative z-10 w-full h-full min-h-[360px] sm:min-h-[400px] flex flex-col justify-between p-3.5 pointer-events-none">
          {/* Top Bar with Live Tag and Camera Controls */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full border border-emerald-500/50 text-white text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FFB703] animate-ping" />
              <span className="text-[#FFB703] font-black">
                {isStreamPlaying ? '1 FPS @ 480p' : 'Photo Active'}
              </span>
              <span className="opacity-40">|</span>
              <span className="truncate max-w-[140px] text-emerald-300">
                {activeTest === 'ribbon' ? 'Ribbon Test' : activeTest === 'water' ? 'Infiltration' : 'Leaf Scan'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (onToggleCamera) onToggleCamera();
                  else stopCamera();
                }}
                className="p-2 rounded-full bg-emerald-600 border border-emerald-400 text-white hover:bg-emerald-700 transition shadow"
                title={t.turnOffCamera}
              >
                <Power className="w-4 h-4" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition"
                title={t.uploadPhoto}
              >
                <ImageIcon className="w-4 h-4 text-[#FFB703]" />
              </button>

              <button
                onClick={toggleTorch}
                className={`p-2 rounded-full backdrop-blur-md border transition ${
                  torchOn ? 'bg-[#FFB703] text-black border-[#FFB703]' : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                }`}
                title="Toggle Torch"
              >
                <Zap className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFacingMode}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition"
                title="Flip Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Target Reticle */}
          <div className="my-auto flex flex-col items-center justify-center py-2">
            {activeTest === 'ribbon' && (
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-[#FFB703] flex items-center justify-center animate-pulse bg-[#FFB703]/10">
                  <div className="w-18 h-7 rounded-full border border-emerald-400 bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-white px-2">
                    Soil Ribbon
                  </div>
                </div>
                <span className="mt-2 text-[11px] font-black bg-black/80 px-3 py-1 rounded-full text-[#FFB703] border border-[#FFB703]/50 shadow">
                  Squeeze soil ball & roll ribbon
                </span>
              </div>
            )}

            {activeTest === 'water' && (
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-cyan-500/10">
                  <div className="w-12 h-12 rounded-full border border-amber-300 bg-amber-400/20 flex items-center justify-center text-[9px] font-black text-amber-300">
                    Coin Ref
                  </div>
                  <div className="absolute inset-2 rounded-full border border-dashed border-cyan-300 animate-spin" />
                </div>
                <div className="mt-2 pointer-events-auto">
                  <button
                    onClick={() => {
                      if (isTimingWater) setIsTimingWater(false);
                      else {
                        setInfiltrationTimer(0);
                        setIsTimingWater(true);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-black shadow-md transition ${
                      isTimingWater ? 'bg-rose-600 text-white animate-pulse' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    {isTimingWater ? `Timing: ${infiltrationTimer}s (Tap to Stop)` : 'Pour Water & Start Timer'}
                  </button>
                </div>
              </div>
            )}

            {activeTest === 'leaf' && (
              <div className="flex flex-col items-center">
                <div className="w-36 h-28 sm:w-44 sm:h-36 rounded-2xl border-2 border-dashed border-emerald-400 flex items-center justify-center bg-emerald-500/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="mt-2 text-[11px] font-black bg-black/80 px-3 py-1 rounded-full text-emerald-300 border border-emerald-500/50 shadow">
                  Align crop leaf for chlorosis detection
                </span>
              </div>
            )}
          </div>

          {/* Bottom Test Selector Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-center shadow-lg">
            <button
              onClick={() => onActiveTestChange('ribbon')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTest === 'ribbon' ? 'bg-[#FFB703] text-black shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>1. Ribbon</span>
            </button>

            <button
              onClick={() => onActiveTestChange('water')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTest === 'water' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>2. Water</span>
            </button>

            <button
              onClick={() => onActiveTestChange('leaf')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTest === 'leaf' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>3. Leaf</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
