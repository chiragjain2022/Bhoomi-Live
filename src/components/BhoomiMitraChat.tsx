import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Sprout,
  Check,
  AlertTriangle,
  Bell,
  Share2,
  CheckCircle,
  Clock,
  Layers,
  Copy,
  Plus,
  Minus,
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS, INDIAN_LANGUAGES } from '../services/translations';
import { AmendmentDosage, FarmProfile } from '../services/agronomyEngine';
import { voiceController } from '../services/audioManager';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  imageBase64?: string;
  prescription?: AmendmentDosage | null;
  timestamp: string;
}

interface BhoomiMitraChatProps {
  language: SupportedLanguage;
  activeProfile: FarmProfile;
  isMuted: boolean;
  onOpenLiveCamera: () => void;
  attachedPhoto: string | null;
  onClearAttachedPhoto: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const BhoomiMitraChat: React.FC<BhoomiMitraChatProps> = ({
  language,
  activeProfile,
  isMuted,
  onOpenLiveCamera,
  attachedPhoto,
  onClearAttachedPhoto,
  messages,
  setMessages,
}) => {
  const t = TRANSLATIONS[language];
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);
  const [subscribedPubSubMap, setSubscribedPubSubMap] = useState<Record<string, boolean>>({});
  const [acresMap, setAcresMap] = useState<Record<string, number>>({});
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Toggle voice playback speed
  const toggleSpeechRate = () => {
    const nextRate = speechRate === 0.95 ? 0.8 : speechRate === 0.8 ? 1.15 : 0.95;
    setSpeechRate(nextRate);
    voiceController.setSpeechRate(nextRate);
  };

  // Change acreage for a prescription card
  const handleUpdateAcres = (msgId: string, delta: number) => {
    setAcresMap((prev) => {
      const current = prev[msgId] || 1.0;
      const updated = Math.max(0.25, Math.min(20, Math.round((current + delta) * 4) / 4));
      return { ...prev, [msgId]: updated };
    });
  };

  const handleSetExactAcres = (msgId: string, val: number) => {
    setAcresMap((prev) => ({ ...prev, [msgId]: val }));
  };

  // Share or copy prescription to clipboard / WhatsApp
  const handleSharePrescription = async (msg: ChatMessage) => {
    if (!msg.prescription) return;
    const acres = acresMap[msg.id] || 1.0;
    const u = Math.round(msg.prescription.fertilizerDosageKgAcre.urea * acres);
    const d = Math.round(msg.prescription.fertilizerDosageKgAcre.dap * acres);
    const m = Math.round(msg.prescription.fertilizerDosageKgAcre.mop * acres);
    const z = Math.round(msg.prescription.fertilizerDosageKgAcre.zincSulfate * acres * 10) / 10;
    const f = Math.round(msg.prescription.fertilizerDosageKgAcre.fymTons * acres * 10) / 10;

    const summary = `🌾 भूमि मित्र (Bhoomi Mitra) - मृदा सिफारिश पर्ची
📍 क्षेत्र: ${activeProfile.baseline.district}, ${activeProfile.baseline.state}
🌱 अनुशंसित फसल: ${msg.prescription.recommendedCrop}
📏 रकबा: ${acres} एकड़

खाद की सटीक मात्रा:
• यूरिया: ${u} किग्रा
• डीएपी: ${d} किग्रा
• पोटाश (MOP): ${m} किग्रा
• जिंक सल्फेट: ${z} किग्रा
• सड़ी गोबर खाद: ${f} टन

सिफारिश: बुवाई पर डीएपी+पोटाश तथा पहली सिंचाई पर यूरिया+जिंक का संतुलित प्रयोग करें।`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'भूमि मित्र मृदा पर्ची',
          text: summary,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedMsgId(msg.id);
      setTimeout(() => setCopiedMsgId(null), 2500);
    } catch {
      // ignore
    }
  };

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Synchronize active voice playing status with singleton voiceController
  useEffect(() => {
    voiceController.setListener((isPlaying) => {
      if (!isPlaying) {
        setActiveSpeakingMsgId(null);
      }
    });
    return () => {
      voiceController.stop();
    };
  }, []);

  // Set up Speech Recognition for voice queries
  const startVoiceInput = () => {
    voiceController.stop();
    setActiveSpeakingMsgId(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        language === 'hi'
          ? 'आपके ब्राउज़र में आवाज पहचान समर्थित नहीं है। कृपया लिखकर पूछें।'
          : 'Speech recognition is not supported in this browser. Please type your query.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMeta = INDIAN_LANGUAGES.find((l) => l.code === language);
      recognition.lang = langMeta ? langMeta.speechCode : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          // Auto send spoken query
          handleSendMessage(transcript, true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition', err);
      setIsRecording(false);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Toggle voice playback for a specific assistant message
  const handleToggleVoicePlayback = (msgId: string, text: string) => {
    if (activeSpeakingMsgId === msgId) {
      voiceController.stop();
      setActiveSpeakingMsgId(null);
    } else {
      setActiveSpeakingMsgId(msgId);
      voiceController.speak(text, language);
    }
  };

  // Send message to Gemini Live Chat API
  const handleSendMessage = async (textToSend?: string, wasSpoken: boolean = false) => {
    const text = (textToSend ?? inputText).trim();
    const photo = attachedPhoto;

    if (!text && !photo) return;

    // Stop existing audio
    voiceController.stop();
    setActiveSpeakingMsgId(null);

    const userMessageId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: text || (language === 'hi' ? 'खेत की यह फोटो देखें और सलाह दें' : 'Please check this farm photo and advise'),
      imageBase64: photo || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    onClearAttachedPhoto();
    setIsLoading(true);

    try {
      // Build history payload
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          imageBase64: photo,
          language,
          profileId: activeProfile.id,
          baseline: activeProfile.baseline,
          telemetry: activeProfile.telemetry,
          mandi: activeProfile.mandi,
        }),
      });

      const data = await res.json();
      const replyText =
        data.text ||
        (language === 'hi'
          ? 'नमस्ते किसान भाई, आपकी फसल और मिट्टी की जांच पूरी हुई।'
          : 'Field observation assessed successfully.');

      const assistantMessageId = `asst_${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMessageId,
        sender: 'assistant',
        text: replyText,
        prescription: data.prescription || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If user spoke the query, automatically speak the response back aloud
      if (wasSpoken && !isMuted) {
        setActiveSpeakingMsgId(assistantMessageId);
        voiceController.speak(replyText, language);
      }
    } catch (err) {
      console.warn('Chat error', err);
      const fallbackReply =
        language === 'hi'
          ? 'किसान भाई, आपके क्षेत्र के अनुसार पहली सिंचाई पर संतुलित मात्रा में यूरिया (30 किग्रा/एकड़) और जिंक सल्फेट (10 किग्रा/एकड़) दें।'
          : 'Farmer brother, for your soil and crop, apply balanced urea and zinc sulfate at first irrigation.';

      const fallbackMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to WhatsApp / SMS alert via Cloud Pub/Sub
  const handleSubscribeAlert = async (msgId: string) => {
    try {
      await fetch('/api/subscribe-pubsub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '+91-9876543210',
          district: activeProfile.baseline.district,
          channel: 'WhatsApp & SMS',
        }),
      });
      setSubscribedPubSubMap((prev) => ({ ...prev, [msgId]: true }));
    } catch {
      setSubscribedPubSubMap((prev) => ({ ...prev, [msgId]: true }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-920 text-stone-100 relative overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 pb-36">
        {/* Welcome Greeting Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <img
              src="/src/assets/images/bhoomi_mitra_agronomist_1792333572202.jpg"
              alt="Bhoomi Mitra Agronomist"
              className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/40 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <h2 className="text-base font-bold text-white tracking-tight">
                {t.greetingTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                {t.greetingSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="mt-4 pt-3 border-t border-stone-800/80">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
              अक्सर पूछे जाने वाले सवाल (क्लिक करें):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {t.quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt, false)}
                  className="text-left text-xs bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700/70 rounded-xl px-3 py-1.5 transition-colors leading-snug"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Stream */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeakingThis = activeSpeakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl mx-auto w-full`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-3xl px-4 py-3.5 shadow-sm ${
                  isUser
                    ? 'bg-emerald-800 text-white rounded-br-xs'
                    : 'bg-stone-900 border border-stone-800 text-stone-100 rounded-bl-xs'
                }`}
              >
                {/* User Attached Photo */}
                {msg.imageBase64 && (
                  <div className="mb-2.5 rounded-2xl overflow-hidden border border-emerald-600/40 max-w-xs">
                    <img
                      src={msg.imageBase64}
                      alt="Field Upload"
                      className="w-full max-h-56 object-cover"
                    />
                  </div>
                )}

                {/* Message Body */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Assistant Prescription Card (Rendered neatly inline without overlapping) */}
                {!isUser && msg.prescription && (() => {
                  const acres = acresMap[msg.id] || 1.0;
                  const u = Math.round(msg.prescription.fertilizerDosageKgAcre.urea * acres);
                  const d = Math.round(msg.prescription.fertilizerDosageKgAcre.dap * acres);
                  const m = Math.round(msg.prescription.fertilizerDosageKgAcre.mop * acres);
                  const z = Math.round(msg.prescription.fertilizerDosageKgAcre.zincSulfate * acres * 10) / 10;
                  const f = Math.round(msg.prescription.fertilizerDosageKgAcre.fymTons * acres * 10) / 10;

                  return (
                    <div className="mt-4 pt-3 border-t border-stone-800 bg-stone-950/70 rounded-2xl p-3.5 text-xs text-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <Sprout className="w-4 h-4" />
                          <span>{t.actionCardTitle}</span>
                        </div>
                        <span className="text-[11px] text-amber-400 font-mono">
                          {activeProfile.baseline.district}
                        </span>
                      </div>

                      {/* Interactive Acre Multiplier */}
                      <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-medium">खेत का रकबा (Land Area):</span>
                          <span className="text-xs font-bold text-emerald-300">
                            {acres} एकड़ (Acres)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateAcres(msg.id, -0.5)}
                            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-750 flex items-center justify-center text-stone-300 border border-stone-700 transition-colors"
                            title="कम करें"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          {[0.5, 1, 2, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleSetExactAcres(msg.id, val)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                acres === val
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-800 text-stone-400 hover:text-white'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleUpdateAcres(msg.id, 0.5)}
                            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-750 flex items-center justify-center text-stone-300 border border-stone-700 transition-colors"
                            title="बढ़ाएं"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Crop & Fertility Level */}
                      <div className="grid grid-cols-2 gap-2 bg-stone-900/90 p-2.5 rounded-xl border border-stone-800">
                        <div>
                          <span className="text-[10px] text-stone-400 block">अनुशंसित फसल:</span>
                          <span className="font-semibold text-white">
                            {msg.prescription.recommendedCrop}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">मिट्टी उर्वरता स्तर:</span>
                          <span className="font-semibold text-emerald-400">
                            {msg.prescription.soilHealthVerdict.fertilityRating}
                          </span>
                        </div>
                      </div>

                      {/* Scaled Exact Fertilizer Numbers */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-stone-300">
                            {acres} एकड़ के लिए कुल खाद (किलोग्राम):
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">ICAR STCR गणना</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                            <span className="text-[10px] text-stone-400 block">यूरिया</span>
                            <span className="font-bold text-white text-sm">
                              {u} <span className="text-[10px] font-normal text-stone-400">kg</span>
                            </span>
                          </div>
                          <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                            <span className="text-[10px] text-stone-400 block">डीएपी</span>
                            <span className="font-bold text-white text-sm">
                              {d} <span className="text-[10px] font-normal text-stone-400">kg</span>
                            </span>
                          </div>
                          <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                            <span className="text-[10px] text-stone-400 block">पोटाश (MOP)</span>
                            <span className="font-bold text-white text-sm">
                              {m} <span className="text-[10px] font-normal text-stone-400">kg</span>
                            </span>
                          </div>
                          <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                            <span className="text-[10px] text-stone-400 block">जिंक सल्फेट</span>
                            <span className="font-bold text-amber-400 text-sm">
                              {z} <span className="text-[10px] font-normal text-stone-400">kg</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Organic & Irrigation advice */}
                      <div className="text-[11px] text-stone-300 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
                        <span className="font-semibold text-amber-400 block mb-0.5">
                          जैविक व समयबद्ध सिफारिश:
                        </span>
                        <p>
                          {f} टन सड़ी गोबर खाद या कम्पोस्ट मिलाएं।{' '}
                          {msg.prescription.applicationSchedule?.[0]?.instructionHi ||
                            msg.prescription.organicAmendments?.[0]?.recipeHi}
                        </p>
                      </div>

                      {/* Action Buttons: WhatsApp Alert & Share Prescription */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSubscribeAlert(msg.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                            subscribedPubSubMap[msg.id]
                              ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm'
                          }`}
                        >
                          {subscribedPubSubMap[msg.id] ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{t.subscribedSuccess}</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5" />
                              <span>{t.subscribeAlerts}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSharePrescription(msg)}
                          className="py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 transition-colors"
                          title="दुकानदार या व्हाट्सएप पर शेयर करें"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300 font-bold">पर्ची कॉपी हो गई!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>पर्ची शेयर / कॉपी करें</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Footer Bar of Message */}
                <div className="flex items-center justify-between gap-3 mt-2 text-[10px] text-stone-400">
                  <span>{msg.timestamp}</span>

                  {/* Audio Listen / Stop button for assistant messages */}
                  {!isUser && (
                    <div className="flex items-center gap-1.5">
                      {/* Speed control pill */}
                      <button
                        type="button"
                        onClick={toggleSpeechRate}
                        className="px-2 py-0.5 rounded-md bg-stone-800 hover:bg-stone-750 text-[10px] text-stone-300 font-mono transition-colors border border-stone-700/60"
                        title="आवाज की गति (Speed)"
                      >
                        {speechRate}x
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleVoicePlayback(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                          isSpeakingThis
                            ? 'bg-amber-500/20 text-amber-400 font-semibold'
                            : 'bg-stone-800/80 hover:bg-stone-750 text-stone-300'
                        }`}
                        title={isSpeakingThis ? t.stopVoice : t.listenAudio}
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t.stopVoice}</span>
                            <span className="flex gap-0.5 ml-1">
                              <span className="w-1 h-3 bg-amber-400 animate-pulse"></span>
                              <span className="w-1 h-2 bg-amber-400 animate-pulse delay-75"></span>
                              <span className="w-1 h-3.5 bg-amber-400 animate-pulse delay-150"></span>
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t.listenAudio}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-2xl mx-auto w-full">
            <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-600/40 flex items-center justify-center text-emerald-300 text-xs shrink-0">
              <Sprout className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl px-4 py-3 text-xs text-stone-300 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <span>भूमि मित्र विचार कर रहे हैं...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Input Bar (Thumb Zone) */}
      <div className="fixed sm:absolute bottom-0 left-0 right-0 z-30 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 p-3 sm:p-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {/* Photo Preview Attachment Strip with 1-Tap Triage Chips */}
          {attachedPhoto && (
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-2.5 animate-in slide-in-from-bottom-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={attachedPhoto}
                    alt="Field preview"
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500/50 shadow-sm shrink-0"
                  />
                  <div>
                    <span className="text-xs text-stone-100 font-semibold block">{t.photoAttached}</span>
                    <span className="text-[11px] text-emerald-400">फोटो जांचने के लिए नीचे प्रश्न चुनें या भेजें:</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClearAttachedPhoto}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  title={t.removePhoto}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Triage Chips for Photo */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  { label: '🌿 पीली पत्तियां', query: 'इस पत्ती के पीलेपन का कारण और उपचार बताएं' },
                  { label: '💧 मिट्टी की नमी', query: 'इस मिट्टी की बनावट और नमी जांचकर सिंचाई सलाह दें' },
                  { label: '🐛 कीट व रोग प्रकोप', query: 'इस फसल में लगे कीट या बीमारी की पहचान और दवा बताएं' },
                  { label: '🧪 सही खाद मात्रा', query: 'इस फसल के लिए सही खाद और स्प्रे का समय बताएं' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.query, false)}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700/80 shrink-0 text-[11px] transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice Listening Active Waveform Banner */}
          {isRecording && (
            <div className="flex items-center justify-between bg-amber-950/80 border border-amber-600/60 rounded-2xl px-4 py-2 text-xs text-amber-200 animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400 animate-ping" />
                <span className="font-medium">{t.voiceListening}</span>
              </div>
              <button
                type="button"
                onClick={stopVoiceInput}
                className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs"
              >
                रोकें
              </button>
            </div>
          )}

          {/* Input Controls Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Live Camera Button */}
            <button
              type="button"
              onClick={onOpenLiveCamera}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all active:scale-95 shrink-0 ${
                attachedPhoto
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/30'
                  : 'bg-stone-900 hover:bg-stone-850 border-stone-750 text-stone-300'
              }`}
              title={t.attachPhoto}
              aria-label="Open Camera"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 min-w-0 h-12 bg-stone-900 border border-stone-750 hover:border-stone-600 focus:border-emerald-500 focus:outline-hidden text-stone-100 placeholder-stone-500 rounded-2xl px-4 text-sm sm:text-base transition-colors"
            />

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={isRecording ? stopVoiceInput : startVoiceInput}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-95 shrink-0 shadow-md ${
                isRecording
                  ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/40 animate-pulse'
                  : 'bg-stone-850 hover:bg-stone-750 border border-stone-700 text-stone-200'
              }`}
              title={isRecording ? t.stopVoice : t.voiceInput}
              aria-label="Voice Input"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !attachedPhoto)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white transition-all active:scale-95 shrink-0 shadow-lg shadow-emerald-900/30"
              title={t.send}
              aria-label="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
