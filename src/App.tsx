/**
 * BhoomiLive (भूमि-लाइव) / Bhoomi Mitra (भूमि मित्र)
 * Real-Time Multimodal Field Agronomist & Chatbot
 * Google Cloud AI Builders Cup
 */

import React, { useState } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { BhoomiMitraChat, ChatMessage } from './components/BhoomiMitraChat';
import { FieldAdvisorSidebar } from './components/FieldAdvisorSidebar';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { SoilCardOCRModal } from './components/SoilCardOCRModal';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { SupportedLanguage, TRANSLATIONS, INDIAN_LANGUAGES } from './services/translations';
import { PRESET_PROFILES, FarmProfile } from './services/agronomyEngine';
import { voiceController } from './services/audioManager';
import { Compass, X, MapPin, Globe } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('hi');
  const t = TRANSLATIONS[language];

  // Active Regional Farm Profile
  const [activeProfileId, setActiveProfileId] = useState<string>('profile_a');
  const [activeProfile, setActiveProfile] = useState<FarmProfile>(PRESET_PROFILES.profile_a);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals & Drawers
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Photo attached to next chat message
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Update profile when preset selection changes
  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    if (PRESET_PROFILES[id]) {
      setActiveProfile(PRESET_PROFILES[id]);
    }
    setIsMobileDrawerOpen(false);
  };

  // When GPS detects the farm location
  const handleApplyGpsProfile = (profile: FarmProfile) => {
    setActiveProfile(profile);
    setActiveProfileId(profile.id);
    setIsMobileDrawerOpen(false);

    const gpsMsg: ChatMessage = {
      id: `gps_${Date.now()}`,
      sender: 'assistant',
      text:
        language === 'hi'
          ? `📍 आपके खेत का स्थान मिल गया!\n• क्षेत्र: ${profile.baseline.district}, ${profile.baseline.state}\n• मिट्टी: ${profile.baseline.predominantTexture} (सामान्य pH: ${profile.baseline.pH})\n• उपग्रह नमी (Sentinel-2): ${profile.telemetry.soilMoistureStatus}\n• अनुशंसित फसल: ${profile.mandi.recommendedCrop}\nअब आप अपनी फसल या मिट्टी से संबंधित कोई भी सवाल पूछ सकते हैं।`
          : `📍 Farm footprint located via GPS!\n• Region: ${profile.baseline.district}, ${profile.baseline.state}\n• Soil Texture: ${profile.baseline.predominantTexture} (pH: ${profile.baseline.pH})\n• Satellite Moisture: ${profile.telemetry.soilMoistureStatus}\n• Recommended Crop: ${profile.mandi.recommendedCrop}\nYou can now ask tailored field questions.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, gpsMsg]);
  };

  // Toggle Voice Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    voiceController.setMuted(nextMuted);
  };

  // Reset / Clear Chat
  const handleResetChat = () => {
    voiceController.stop();
    setMessages([]);
    setAttachedPhoto(null);
  };

  // When a photo is captured from the camera or gallery
  const handlePhotoCaptured = (base64Image: string) => {
    setAttachedPhoto(base64Image);
  };

  // When paper Soil Health Card OCR is applied
  const handleApplyExtractedSoilCard = (extracted: any) => {
    setActiveProfile((prev) => ({
      ...prev,
      baseline: {
        ...prev.baseline,
        pH: extracted.pH || prev.baseline.pH,
        ecDsPerM: extracted.ec || prev.baseline.ecDsPerM,
        organicCarbonPct: extracted.organicCarbon || prev.baseline.organicCarbonPct,
        availableN: extracted.nitrogenKgHa || prev.baseline.availableN,
        availableP: extracted.phosphorusKgHa || prev.baseline.availableP,
        availableK: extracted.potassiumKgHa || prev.baseline.availableK,
        zincPpm: extracted.zincPpm || prev.baseline.zincPpm,
      },
    }));

    // Add notification message in chat
    const ocrSummaryMsg: ChatMessage = {
      id: `ocr_${Date.now()}`,
      sender: 'assistant',
      text:
        language === 'hi'
          ? `मृदा स्वास्थ्य कार्ड सफलतापूर्वक लोड किया गया!\n• pH: ${extracted.pH} | EC: ${extracted.ec} dS/m\n• जैविक कार्बन: ${extracted.organicCarbon}%\n• नाइट्रोजन: ${extracted.nitrogenKgHa} kg/ha | फास्फोरस: ${extracted.phosphorusKgHa} kg/ha\nअब आप इस आधार पर अपनी फसल के लिए सटीक खाद मात्रा पूछ सकते हैं।`
          : `Soil Health Card metrics loaded!\n• pH: ${extracted.pH} | EC: ${extracted.ec} dS/m\n• Organic Carbon: ${extracted.organicCarbon}%\n• Nitrogen: ${extracted.nitrogenKgHa} kg/ha | Phosphorus: ${extracted.phosphorusKgHa} kg/ha\nYou can now ask for tailored fertilizer recommendations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, ocrSummaryMsg]);
    setIsOcrModalOpen(false);
  };

  const activeLangName = INDIAN_LANGUAGES.find((l) => l.code === language)?.nativeName || 'हिन्दी';

  return (
    <div className="flex flex-col h-screen w-full bg-stone-950 text-stone-100 font-sans antialiased overflow-hidden">
      {/* 1. Clean Top Navigation Bar */}
      <TopNavbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetChat={handleResetChat}
        activeRegionName={`${activeProfile.baseline.district}, ${activeProfile.baseline.state}`}
      />

      {/* 2. Main Responsive Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-2 sm:p-4 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column (Desktop Field Advisor Desk) */}
          <aside className="hidden lg:block lg:col-span-4 h-full overflow-y-auto pr-1">
            <FieldAdvisorSidebar
              language={language}
              activeProfileId={activeProfileId}
              onSelectProfile={handleSelectProfile}
              activeProfile={activeProfile}
              onOpenOcr={() => setIsOcrModalOpen(true)}
              onApplyGpsProfile={handleApplyGpsProfile}
            />
          </aside>

          {/* Right Column (Primary Mobile-First Chatbot & Voice Assistant) */}
          <section className="col-span-1 lg:col-span-8 h-full bg-stone-900/60 border border-stone-850 rounded-3xl overflow-hidden shadow-xl flex flex-col relative">
            {/* Mobile quick banner to open farm context/guide drawer */}
            <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800 text-xs text-stone-300">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400 truncate max-w-[170px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{activeProfile.nameHi}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-emerald-300 bg-stone-850 hover:bg-stone-800 px-2 py-1 rounded-lg border border-stone-750 transition-colors"
                  title="भाषा बदलें"
                >
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>{activeLangName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-stone-200 bg-stone-800 hover:bg-stone-750 px-2.5 py-1 rounded-lg border border-stone-700 transition-colors"
                >
                  <Compass className="w-3 h-3 text-amber-400" />
                  <span>खेत व जांच</span>
                </button>
              </div>
            </div>

            {/* Chatbot Engine Component */}
            <div className="flex-1 overflow-hidden relative">
              <BhoomiMitraChat
                language={language}
                activeProfile={activeProfile}
                isMuted={isMuted}
                onOpenLiveCamera={() => setIsCameraModalOpen(true)}
                attachedPhoto={attachedPhoto}
                onClearAttachedPhoto={() => setAttachedPhoto(null)}
                messages={messages}
                setMessages={setMessages}
              />
            </div>
          </section>
        </div>
      </main>

      {/* 3. Mobile Farm Context & Soil Check Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-xs lg:hidden animate-in fade-in duration-150">
          <div className="bg-stone-900 border-t border-stone-800 rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="text-sm font-bold text-white">खेत व मिट्टी जांच निर्देश</h3>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-white bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <FieldAdvisorSidebar
              language={language}
              activeProfileId={activeProfileId}
              onSelectProfile={handleSelectProfile}
              activeProfile={activeProfile}
              onOpenOcr={() => {
                setIsMobileDrawerOpen(false);
                setIsOcrModalOpen(true);
              }}
              onApplyGpsProfile={handleApplyGpsProfile}
            />
          </div>
        </div>
      )}

      {/* 4. Bug-Free Live Camera & Photo Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handlePhotoCaptured}
        language={language}
      />

      {/* 5. Paper Soil Health Card OCR Modal */}
      <SoilCardOCRModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        language={language}
        onApplyExtractedBaseline={handleApplyExtractedSoilCard}
      />

      {/* 6. All 23 Indian Languages Selection Modal */}
      <LanguageSelectModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />
    </div>
  );
}
