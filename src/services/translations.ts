/**
 * All 22 Official Scheduled Regional Languages of India + English (Total: 23 Languages)
 * Under the Eighth Schedule of the Constitution of India.
 */

export type SupportedLanguage =
  | 'hi'  // Hindi (हिन्दी)
  | 'bn'  // Bengali (বাংলা)
  | 'te'  // Telugu (తెలుగు)
  | 'mr'  // Marathi (मराठी)
  | 'ta'  // Tamil (தமிழ்)
  | 'ur'  // Urdu (اردو)
  | 'gu'  // Gujarati (ગુજરાતી)
  | 'kn'  // Kannada (ಕನ್ನಡ)
  | 'or'  // Odia (ଓଡ଼ିଆ)
  | 'ml'  // Malayalam (മലയാളം)
  | 'pa'  // Punjabi (ਪੰਜਾਬੀ)
  | 'as'  // Assamese (অসমীয়া)
  | 'mai' // Maithili (मैथिली)
  | 'sat' // Santali (संथाली)
  | 'ks'  // Kashmiri (कश्मीरी)
  | 'ne'  // Nepali (नेपाली)
  | 'kok' // Konkani (कोंकणी)
  | 'sd'  // Sindhi (सिंधी)
  | 'dgo' // Dogri (डोगरी)
  | 'brx' // Bodo (बोडो)
  | 'mni' // Manipuri (মৈতৈলোন্ / मणिपुरी)
  | 'sa'  // Sanskrit (संस्कृतम्)
  | 'en'; // English

export interface LanguageMeta {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
  speechCode: string;
  stateOrRegion: string;
}

export const INDIAN_LANGUAGES: LanguageMeta[] = [
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', speechCode: 'hi-IN', stateOrRegion: 'All India' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', speechCode: 'bn-IN', stateOrRegion: 'West Bengal, Tripura, Assam' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', speechCode: 'te-IN', stateOrRegion: 'Andhra Pradesh, Telangana' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', speechCode: 'mr-IN', stateOrRegion: 'Maharashtra, Goa' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', speechCode: 'ta-IN', stateOrRegion: 'Tamil Nadu, Puducherry' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', speechCode: 'gu-IN', stateOrRegion: 'Gujarat' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', speechCode: 'ur-IN', stateOrRegion: 'All India, J&K, Telangana' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', speechCode: 'kn-IN', stateOrRegion: 'Karnataka' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia', speechCode: 'or-IN', stateOrRegion: 'Odisha' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam', speechCode: 'ml-IN', stateOrRegion: 'Kerala, Lakshadweep' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', speechCode: 'pa-IN', stateOrRegion: 'Punjab, Haryana, Delhi' },
  { code: 'as', nativeName: 'অসমীয়া', englishName: 'Assamese', speechCode: 'as-IN', stateOrRegion: 'Assam' },
  { code: 'mai', nativeName: 'मैथिली', englishName: 'Maithili', speechCode: 'hi-IN', stateOrRegion: 'Bihar, Jharkhand' },
  { code: 'sat', nativeName: 'संथाली', englishName: 'Santali', speechCode: 'hi-IN', stateOrRegion: 'Jharkhand, West Bengal, Odisha' },
  { code: 'ks', nativeName: 'कश्मीरी', englishName: 'Kashmiri', speechCode: 'ur-IN', stateOrRegion: 'Jammu & Kashmir' },
  { code: 'ne', nativeName: 'नेपाली', englishName: 'Nepali', speechCode: 'ne-NP', stateOrRegion: 'Sikkim, West Bengal, North-East' },
  { code: 'kok', nativeName: 'कोंकणी', englishName: 'Konkani', speechCode: 'mr-IN', stateOrRegion: 'Goa, Karnataka, Maharashtra' },
  { code: 'sd', nativeName: 'सिंधी', englishName: 'Sindhi', speechCode: 'hi-IN', stateOrRegion: 'Gujarat, Rajasthan, Maharashtra' },
  { code: 'dgo', nativeName: 'डोगरी', englishName: 'Dogri', speechCode: 'hi-IN', stateOrRegion: 'Jammu, Himachal Pradesh' },
  { code: 'brx', nativeName: 'बोडो', englishName: 'Bodo', speechCode: 'as-IN', stateOrRegion: 'Assam, Meghalaya' },
  { code: 'mni', nativeName: 'मणिपुरी', englishName: 'Manipuri', speechCode: 'bn-IN', stateOrRegion: 'Manipur, North-East' },
  { code: 'sa', nativeName: 'संस्कृतम्', englishName: 'Sanskrit', speechCode: 'hi-IN', stateOrRegion: 'India' },
  { code: 'en', nativeName: 'English', englishName: 'English', speechCode: 'en-IN', stateOrRegion: 'All India' },
];

export interface Translations {
  appName: string;
  appSubtitle: string;
  assistantName: string;
  assistantSubtitle: string;
  
  // Greeting & Quick Prompts
  greetingTitle: string;
  greetingSubtitle: string;
  quickPrompts: string[];
  
  // Chat & Input
  chatPlaceholder: string;
  askBhoomiMitra: string;
  voiceInput: string;
  voiceListening: string;
  voiceSpeaking: string;
  stopVoice: string;
  listenAudio: string;
  attachPhoto: string;
  photoAttached: string;
  removePhoto: string;
  send: string;
  clearChat: string;
  
  // Side Panels & Context
  regionalContext: string;
  soilCheckGuide: string;
  mandiAdvisory: string;
  selectProfile: string;
  profileADesc: string;
  profileBDesc: string;
  profileCDesc: string;
  profileDDesc: string;
  
  // Physical Triage Guide
  testRibbonTitle: string;
  testRibbonDesc: string;
  testWaterTitle: string;
  testWaterDesc: string;
  testLeafTitle: string;
  testLeafDesc: string;
  
  // Action & Prescription Card
  actionCardTitle: string;
  recommendedCrop: string;
  dosageBreakdown: string;
  scheduleTitle: string;
  organicTitle: string;
  safetyTitle: string;
  labTestWarning: string;
  subscribeAlerts: string;
  subscribedSuccess: string;
  uploadSoilCard: string;
  ocrProcessing: string;
  voiceReadout: string;
  
  // Camera & Media
  cameraTitle: string;
  takePhoto: string;
  flipCamera: string;
  closeCamera: string;
  uploadFromGallery: string;

  // Optional legacy fields for backward compatibility
  simulationTitle?: string;
  turnOnCamera?: string;
  turnOffCamera?: string;
  uploadPhoto?: string;
  cameraRunning?: string;
}

// Base Hindi Template
const BASE_HI: Translations = {
  appName: 'भूमि मित्र (Bhoomi Mitra)',
  appSubtitle: 'आपका एआई कृषि सलाहकार व मृदा विशेषज्ञ',
  assistantName: 'भूमि मित्र',
  assistantSubtitle: 'सटीक सलाह, मिट्टी जांच और फसल समाधान',
  
  greetingTitle: 'राम-राम किसान भाई! मैं "भूमि मित्र" हूँ।',
  greetingSubtitle: 'मिट्टी, खाद, फसल के रोग, कीट, सिंचाई, मंडी भाव या मौसम से जुड़ा कोई भी सवाल पूछें या फोटो दिखाकर जांच करवाएं।',
  quickPrompts: [
    'गेहूं/धान में पत्तियां पीली क्यों हो रही हैं?',
    'यूरिया और डीएपी का सही अनुपात और समय क्या है?',
    'खेत में पानी सोखने की गति और मिट्टी की नमी कैसे जांचें?',
    'आगामी मौसम और सिंचाई की सही सलाह क्या है?',
    'मिट्टी स्वास्थ्य कार्ड की जांच और नमूना कैसे दें?'
  ],
  
  chatPlaceholder: 'अपनी समस्या लिखें या माइक दबाकर बोलें...',
  askBhoomiMitra: 'भूमि मित्र से पूछें',
  voiceInput: 'माइक दबाकर बोलें',
  voiceListening: 'किसान भाई, आपकी बात सुन रहे हैं...',
  voiceSpeaking: 'भूमि मित्र समझा रहे हैं...',
  stopVoice: 'आवाज बंद करें',
  listenAudio: 'आवाज में सुनें',
  attachPhoto: 'खेत/पत्ती की फोटो जोड़ें',
  photoAttached: 'फोटो जोड़ी गई',
  removePhoto: 'फोटो हटाएं',
  send: 'भेजें',
  clearChat: 'नई बातचीत',
  
  regionalContext: 'खेत व क्षेत्र की जानकारी',
  soilCheckGuide: 'सरल 3-स्टेप मिट्टी जांच',
  mandiAdvisory: 'मंडी व फसल चक्र',
  selectProfile: 'खेत का क्षेत्र चुनें:',
  profileADesc: 'हिसार (हरियाणा) - शुष्क जलोढ़ व लवणीय मिट्टी',
  profileBDesc: 'नासिक (महाराष्ट्र) - उपजाऊ काली कपास मिट्टी',
  profileCDesc: 'गुंटूर (आंध्र प्रदेश) - लाल बलुई दोमट मिट्टी',
  profileDDesc: 'जीपीएस स्थान (वर्तमान खेत)',
  
  testRibbonTitle: '1. हाथ में दबाकर रोल बनाएं (रिबन टेस्ट)',
  testRibbonDesc: 'मुट्ठी भर नम मिट्टी लेकर अंगूठे से दबाएं; अगर टूट जाए तो बलुई, अगर पट्टी बने तो चिकनी/दोमट है।',
  testWaterTitle: '2. पानी सोखने की गति (इन्फिल्ट्रेशन)',
  testWaterDesc: 'थोड़ा पानी मिट्टी पर डालें; अगर 30 सेकंड में सोखे तो उत्तम, बहुत धीमा सोखे तो जलभराव का खतरा है।',
  testLeafTitle: '3. निचली व ऊपरी पत्ती की जांच',
  testLeafDesc: 'निचली पत्तियां V-आकार में पीली होना नाइट्रोजन की कमी है; बैगनी रंग फास्फोरस की कमी दर्शाता है।',
  
  actionCardTitle: 'खेत की वैज्ञानिक रिपोर्ट व खाद पर्ची',
  recommendedCrop: 'सर्वाधिक अनुशंसित फसल',
  dosageBreakdown: 'प्रति एकड़ सटीक खाद की मात्रा (किलोग्राम)',
  scheduleTitle: 'खाद देने का सही समय व तरीका',
  organicTitle: 'देसी व जैविक उपचार (जीवामृत / कम्पोस्ट)',
  safetyTitle: 'सुरक्षा व पर्यावरण चेतावनी',
  labTestWarning: 'असामान्य लवणता/पीएच! कृपया KVK प्रयोगशाला में मिट्टी का नमूना दें।',
  subscribeAlerts: 'व्हाट्सएप / SMS मौसम व सिंचाई सूचना पाएं',
  subscribedSuccess: 'सफलतापूर्वक अलर्ट शुरू हो गया! (Cloud Pub/Sub)',
  uploadSoilCard: 'कागजी मृदा स्वास्थ्य कार्ड की फोटो अपलोड करें',
  ocrProcessing: 'मृदा कार्ड से डेटा निकाला जा रहा है...',
  voiceReadout: 'पर्ची बोलकर सुनाएं',
  
  cameraTitle: 'खेत या पत्ती की लाइव फोटो लें',
  takePhoto: 'फोटो खींचें',
  flipCamera: 'कैमरा बदलें',
  closeCamera: 'बंद करें',
  uploadFromGallery: 'गैलरी से चुनें',
};

// Full dictionary for all 23 languages
export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  hi: BASE_HI,

  bn: {
    ...BASE_HI,
    appName: 'ভূমি মিত্র (Bhoomi Mitra)',
    appSubtitle: 'আপনার এআই কৃষি উপদেষ্টা ও মৃত্তিকা বিশেষজ্ঞ',
    assistantName: 'ভূমি মিত্র',
    assistantSubtitle: 'সঠিক পরামর্শ, মাটি পরীক্ষা ও ফসলের সমাধান',
    greetingTitle: 'নমস্কার কৃষক বন্ধু! আমি "ভূমি মিত্র"।',
    greetingSubtitle: 'মাটি, সার, ফসলের রোগ, পোকা-মাকড়, সেচ বা বাজার দর নিয়ে যে কোনো প্রশ্ন জিজ্ঞেস করুন বা ছবি দেখান।',
    quickPrompts: [
      'ধান/গমের পাতা হলুদ হয়ে যাচ্ছে কেন?',
      'ইউরিয়া এবং ডিএপির সঠিক অনুপাত কত?',
      'মাটির আর্দ্রতা এবং জল নিষ্কাশন কীভাবে পরীক্ষা করবেন?',
      'বর্তমান আবহাওয়া ও সেচের সঠিক পরামর্শ কী?',
      'মৃত্তিকা স্বাস্থ্য কার্ড কীভাবে পরীক্ষা করবেন?'
    ],
    chatPlaceholder: 'আপনার প্রশ্ন লিখুন বা মাইকে কথা বলুন...',
    askBhoomiMitra: 'ভূমি মিত্রকে জিজ্ঞেস করুন',
    voiceInput: 'কথা বলুন',
    voiceListening: 'শুনছি, বলুন...',
    voiceSpeaking: 'ভূমি মিত্র উত্তর দিচ্ছেন...',
    stopVoice: 'থামুন',
    listenAudio: 'শুনুন',
    attachPhoto: 'মাটি/পাতার ছবি যোগ করুন',
    photoAttached: 'ছবি যুক্ত হয়েছে',
    removePhoto: 'ছবি মুছুন',
    send: 'পাঠান',
    clearChat: 'নতুন আলাপ',
    actionCardTitle: 'কৃষি রিপোর্ট ও সারের তালিকা',
    recommendedCrop: 'সুপারিশকৃত ফসল',
    dosageBreakdown: 'একর প্রতি সারের সঠিক মাত্রা (কেজি)',
    scheduleTitle: 'সার প্রয়োগের সময়সূচি',
    organicTitle: 'জৈব ও দেশীয় চিকিৎসা (জীবা মৃত)',
    safetyTitle: 'নিরাপত্তা ও সতর্কতা',
    subscribeAlerts: 'হোয়াটসঅ্যাপ / SMS সতর্কতা পান',
    subscribedSuccess: 'সফলভাবে সতর্কতা চালু হয়েছে!',
    uploadSoilCard: 'মৃত্তিকা স্বাস্থ্য কার্ডের ছবি দিন',
    cameraTitle: 'মাটি বা পাতার লাইভ ছবি তুলুন',
    takePhoto: 'ছবি তুলুন',
    flipCamera: 'ক্যামেরা ঘুরান',
    closeCamera: 'বন্ধ করুন',
    uploadFromGallery: 'গ্যালারি থেকে নিন',
  },

  te: {
    ...BASE_HI,
    appName: 'భూమి మిత్ర (Bhoomi Mitra)',
    appSubtitle: 'మీ డిజిటల్ వ్యవసాయ సలహాదారు & నేల నిపుణుడు',
    assistantName: 'భూమి మిత్ర',
    assistantSubtitle: 'ఖచ్చితమైన సలహా, నేల పరీక్ష మరియు పంట పరిష్కారం',
    greetingTitle: 'నమస్కారం రైతు సోదరా! నేను "భూమి మిత్ర".',
    greetingSubtitle: 'మీ నేల, ఎరువులు, పంట తెగుళ్లు, కీటకాలు, నీటిపారుదల లేదా మార్కెట్ ధరల గురించి ఏదైనా అడగండి లేదా ఫోటో చూపించండి.',
    quickPrompts: [
      'వరి/గోధుమ ఆకులు ఎందుకు పసుపు రంగులోకి మారుతున్నాయి?',
      'యూరియా మరియు డిఎపి సరైన మోతాదు ఎంత?',
      'నేలలో తేమను ఎలా పరీక్షించాలి?',
      'ప్రస్తుత వాతావరణం మరియు సాగు సలహా ఏమిటి?',
      'సాయిల్ హెల్త్ కార్డును ఎలా తనిఖీ చేయాలి?'
    ],
    chatPlaceholder: 'మీ ప్రశ్నను ఇక్కడ రాయండి లేదా మైక్ ద్వారా మాట్లాడండి...',
    askBhoomiMitra: 'భూమి మిత్రను అడగండి',
    voiceInput: 'మాట్లాడండి',
    voiceListening: 'వింటున్నాము, చెప్పండి...',
    voiceSpeaking: 'భూమి మిత్ర సమాధానం ఇస్తున్నారు...',
    stopVoice: 'వాయిస్ ఆపండి',
    listenAudio: 'వాయిస్ వినండి',
    attachPhoto: 'నేల/ఆకు ఫోటో జతచేయండి',
    photoAttached: 'ఫోటో జతచేయబడింది',
    removePhoto: 'ఫోటో తొలగించు',
    send: 'పంపు',
    clearChat: 'కొత్త చాట్',
    actionCardTitle: 'శాస్త్రీయ వ్యవసాయ నివేదిక & ఎరువుల చీటీ',
    recommendedCrop: 'సిఫార్సు చేయబడిన పంట',
    dosageBreakdown: 'ఎకరానికి ఎరువుల మోతాదు (కిలోలు)',
    scheduleTitle: 'ఎరువులు వేసే సమయం',
    organicTitle: 'సేంద్రీయ & జీవామృతం సూచనలు',
    safetyTitle: 'భద్రతా సూచనలు',
    subscribeAlerts: 'వాట్సాప్ / SMS అలర్ట్‌లు పొందండి',
    subscribedSuccess: 'అలర్ట్‌లు విజయవంతంగా సక్రియం చేయబడ్డాయి!',
    uploadSoilCard: 'సాయిల్ హెల్త్ కార్డు ఫోటో అప్‌లోడ్ చేయండి',
    cameraTitle: 'లైవ్ ఫోటో తీయండి',
    takePhoto: 'ఫోటో తీయండి',
    flipCamera: 'కెమెరా మార్చండి',
    closeCamera: 'మూసివేయి',
    uploadFromGallery: 'గ్యాలరీ నుండి ఎంచుకోండి',
  },

  mr: {
    ...BASE_HI,
    appName: 'भूमी मित्र (Bhoomi Mitra)',
    appSubtitle: 'तुमचा एआय शेती सल्लागार व मृदा तज्ञ',
    assistantName: 'भूमी मित्र',
    assistantSubtitle: 'अचूक सल्ला, माती तपासणी व पीक संरक्षण',
    greetingTitle: 'राम राम शेतकरी मित्रा! मी "भूमी मित्र" आहे.',
    greetingSubtitle: 'माती, खते, पिकावरील रोग, कीटक, पाणी व्यवस्थापन किंवा बाजारभावाबाबत काहीही विचारा किंवा फोटो दाखवा.',
    quickPrompts: [
      'पिकाची पाने पिवळी का पडत आहेत?',
      'युरिया आणि डीएपी खतांचे योग्य प्रमाण काय?',
      'शेतात पाणी मुरण्याचा वेग आणि ओलावा कसा तपासावा?',
      'हवामान अंदाज व सिंचनाचा योग्य सल्ला काय?',
      'माती आरोग्य पत्रिकेची तपासणी कशी करावी?'
    ],
    chatPlaceholder: 'तुमचा प्रश्न लिहा किंवा माईक दाबून बोला...',
    askBhoomiMitra: 'भूमी मित्राला विचारा',
    voiceInput: 'माईक दाबून बोला',
    voiceListening: 'शेतकरी मित्रा, मी ऐकत आहे...',
    voiceSpeaking: 'भूमी मित्र बोलत आहेत...',
    stopVoice: 'आवाज थांबवा',
    listenAudio: 'आवाजात ऐका',
    attachPhoto: 'माती/पानाचा फोटो जोडा',
    photoAttached: 'फोटो जोडला गेला',
    removePhoto: 'फोटो काढा',
    send: 'पाठवा',
    clearChat: 'नवीन संभाषण',
    actionCardTitle: 'शेताचा वैज्ञानिक अहवाल व खत शिफारस',
    recommendedCrop: 'शिफारस केलेले पीक',
    dosageBreakdown: 'प्रति एकर खतांचे प्रमाण (किलो)',
    scheduleTitle: 'खते देण्याची योग्य वेळ व पद्धत',
    organicTitle: 'सेंद्रिय व जैविक उपाय (जीवामृत)',
    safetyTitle: 'सुरक्षा व पर्यावरण सूचना',
    subscribeAlerts: 'व्हॉट्सअॅप / SMS सूचना मिळवा',
    subscribedSuccess: 'अलर्ट सुरू झाले आहेत!',
    uploadSoilCard: 'माती आरोग्य पत्रिकेचा फोटो अपलोड करा',
    cameraTitle: 'माती किंवा पानाचा थेट फोटो घ्या',
    takePhoto: 'फोटो काढा',
    flipCamera: 'कॅमेरा बदला',
    closeCamera: 'बंद करा',
    uploadFromGallery: 'गॅलरीतून निवडा',
  },

  ta: {
    ...BASE_HI,
    appName: 'பூமி மித்ரா (Bhoomi Mitra)',
    appSubtitle: 'உங்கள் ஏஐ வேளாண் ஆலோசகர் மற்றும் மண் நிபுணர்',
    assistantName: 'பூமி மித்ரா',
    assistantSubtitle: 'துல்லியமான ஆலோசனை, மண் பரிசோதனை & பயிர் தீர்வுகள்',
    greetingTitle: 'வணக்கம் விவசாய நண்பரே! நான் "பூமி மித்ரா".',
    greetingSubtitle: 'மண் வளம், உரங்கள், பயிர் நோய்கள், பூச்சிகள், பாசனம் அல்லது சந்தை விலை குறித்து எதையும் கேட்கலாம் அல்லது புகைப்படம் காட்டலாம்.',
    quickPrompts: [
      'பயிரில் இலைகள் ஏன் மஞ்சளாக மாறுகின்றன?',
      'யூரியா மற்றும் டிஏபி சரியான அளவு என்ன?',
      'மண்ணில் ஈரப்பதத்தை எவ்வாறு பரிசோதிப்பது?',
      'வானிலை மற்றும் பாசனத்திற்கான சரியான ஆலோசனை என்ன?',
      'மண் சுகாதார அட்டையை எவ்வாறு சரிபார்ப்பது?'
    ],
    chatPlaceholder: 'உங்கள் கேள்வியை எழுதுங்கள் அல்லது பேசவும்...',
    askBhoomiMitra: 'பூமி மித்ராவிடம் கேளுங்கள்',
    voiceInput: 'பேச கிளிக் செய்யவும்',
    voiceListening: 'கேட்கிறேன், சொல்லுங்கள்...',
    voiceSpeaking: 'பூமி மித்ரா பேசுகிறார்...',
    stopVoice: 'குரலை நிறுத்து',
    listenAudio: 'குரலில் கேளுங்கள்',
    attachPhoto: 'மண்/இலை படம் இணைக்கவும்',
    photoAttached: 'படம் இணைக்கப்பட்டது',
    removePhoto: 'படத்தை நீக்கு',
    send: 'அனுப்பு',
    clearChat: 'புதிய உரையாடல்',
    actionCardTitle: 'வேளாண் அறிக்கை & உர பரிந்துரை',
    recommendedCrop: 'பரிந்துரைக்கப்பட்ட பயிர்',
    dosageBreakdown: 'ஏக்கருக்கு உர அளவு (கிலோ)',
    scheduleTitle: 'உரமிடும் கால அட்டவணை',
    organicTitle: 'இயற்கை உரம் & ஜீவாமிர்தம்',
    safetyTitle: 'பாதுகாப்பு எச்சரிக்கை',
    subscribeAlerts: 'வாட்ஸ்அப் / SMS அறிவிப்புகளைப் பெறுக',
    subscribedSuccess: 'அறிவிப்புகள் தொடங்கப்பட்டன!',
    uploadSoilCard: 'மண் அட்டை புகைப்படத்தை பதிவேற்றவும்',
    cameraTitle: 'நேரடி புகைப்படம் எடுக்கவும்',
    takePhoto: 'படம் எடு',
    flipCamera: 'கேமரா மாற்று',
    closeCamera: 'மூடு',
    uploadFromGallery: 'கேலரியில் இருந்து தேர்வு செய்',
  },

  gu: {
    ...BASE_HI,
    appName: 'ભૂમિ મિત્ર (Bhoomi Mitra)',
    appSubtitle: 'તમારા ખેતી સલાહકાર અને જમીન નિષ્ણાત',
    assistantName: 'ભૂમિ મિત્ર',
    assistantSubtitle: 'સચોટ સલાહ, માટી ચકાસણી અને પાક ઉકેલ',
    greetingTitle: 'નમસ્તે ખેડૂત મિત્ર! હું "ભૂમિ મિત્ર" છું.',
    greetingSubtitle: 'જમીન, ખાતર, પાકના રોગ, જીવાત, સિંચાઈ અથવા બજારભાવ વિશે કંઈપણ પૂછો અથવા ફોટો બતાવો.',
    quickPrompts: [
      'ઘઉં/ડાંગરના પાન પીળા કેમ પડી રહ્યા છે?',
      'યુરિયા અને ડીએપીનું સાચું પ્રમાણ કેટલું?',
      'જમીનમાં ભેજ કેવી રીતે તપાસવો?',
      'હાલનું હવામાન અને પિયત સલાહ શું છે?',
      'સોઇલ હેલ્થ કાર્ડ કેવી રીતે ચકાસવું?'
    ],
    chatPlaceholder: 'તમારો પ્રશ્ન લખો અથવા માઇક દબાવીને બોલો...',
    askBhoomiMitra: 'ભૂમિ મિત્રને પૂછો',
    voiceInput: 'બોલીને પૂછો',
    voiceListening: 'સાંભળી રહ્યા છીએ...',
    voiceSpeaking: 'ભૂમિ મિત્ર બોલી રહ્યા છે...',
    stopVoice: 'અવાજ બંધ કરો',
    listenAudio: 'સાંભળો',
    attachPhoto: 'જમીન/પાનનો ફોટો ઉમેરો',
    photoAttached: 'ફોટો જોડાયો',
    removePhoto: 'ફોટો હટાવો',
    send: 'મોકલો',
    clearChat: 'નવી વાતચીત',
    actionCardTitle: 'વૈજ્ઞાનિક રિપોર્ટ અને ખાતરની ભલામણ',
    recommendedCrop: 'ભલામણ કરેલ પાક',
    dosageBreakdown: 'એકર દીઠ ખાતરનું પ્રમાણ (કિલો)',
    scheduleTitle: 'ખાતર આપવાનો સમય',
    organicTitle: 'દેશી અને જૈવિક ઉપચાર (જીવામૃત)',
    safetyTitle: 'સુરક્ષા ચેતવણી',
    subscribeAlerts: 'વોટ્સએપ / SMS એલર્ટ મેળવો',
    subscribedSuccess: 'એલર્ટ શરૂ થઈ ગયું છે!',
    uploadSoilCard: 'સોઇલ હેલ્થ કાર્ડ અપલોડ કરો',
    cameraTitle: 'લાઈવ ફોટો લો',
    takePhoto: 'ફોટો લો',
    flipCamera: 'કેમેરો બદલો',
    closeCamera: 'બંધ કરો',
    uploadFromGallery: 'ગેલેરીમાંથી પસંદ કરો',
  },

  ur: {
    ...BASE_HI,
    appName: 'بھومی مِتر (Bhoomi Mitra)',
    appSubtitle: 'آپ کا زرعی مشیر اور مٹی کا ماہر',
    assistantName: 'بھومی مِتر',
    assistantSubtitle: 'درست مشورہ، مٹی کی جانچ اور فصل کا حل',
    greetingTitle: 'سلام کسان بھائی! میں "بھومی مِتر" ہوں۔',
    greetingSubtitle: 'اپنی مٹی، کھاد، فصل کی بیماریوں، کیڑوں، آبپاشی یا منڈی کے نرخوں کے بارے میں کچھ بھی پوچھیں یا تصویر دکھائیں۔',
    quickPrompts: [
      'گندم یا دھان کے پتے پیلے کیوں ہو رہے ہیں؟',
      'یوریا اور ڈی اے پی کی درست مقدار کیا ہے؟',
      'مٹی میں نمی اور پانی جذب کرنے کی رفتار کیسے جانچیں؟',
      'موسم اور آبپاشی کا درست مشورہ کیا ہے؟',
      'سوائل ہیلتھ کارڈ کی تصدیق کیسے کریں؟'
    ],
    chatPlaceholder: 'اپنا سوال لکھیں یا مائیک دبا کر بولیں...',
    askBhoomiMitra: 'بھومی مِتر سے پوچھیں',
    voiceInput: 'بول کر پوچھیں',
    voiceListening: 'سن رہے ہیں، بتائیے...',
    voiceSpeaking: 'بھومی مِتر بتا رہے ہیں...',
    stopVoice: 'آواز بند کریں',
    listenAudio: 'سنیں',
    attachPhoto: 'مٹی یا پتے کی تصویر جوڑیں',
    photoAttached: 'تصویر منسلک ہے',
    removePhoto: 'تصویر ہٹائیں',
    send: 'بھیجیں',
    clearChat: 'نئی گفتگو',
    actionCardTitle: 'زرعی رپورٹ اور کھاد کی سفارش',
    recommendedCrop: 'تجویز کردہ فصل',
    dosageBreakdown: 'فی ایکڑ کھاد کی مقدار (کلوگرام)',
    scheduleTitle: 'کھاد دینے کا صحیح وقت',
    organicTitle: 'دیسی اور نامیاتی علاج (جیو امرت)',
    safetyTitle: 'حفاظتی انتباہ',
    subscribeAlerts: 'واٹس ایپ / SMS الرٹ حاصل کریں',
    subscribedSuccess: 'الرٹس کامیابی سے فعال ہو گئے!',
    uploadSoilCard: 'سوائل ہیلتھ کارڈ کی تصویر اپ لوڈ کریں',
    cameraTitle: 'کیمرے سے تصویر لیں',
    takePhoto: 'تصویر لیں',
    flipCamera: 'کیمرہ بدلیں',
    closeCamera: 'بند کریں',
    uploadFromGallery: 'گیلری سے منتخب کریں',
  },

  kn: {
    ...BASE_HI,
    appName: 'ಭೂಮಿ ಮಿತ್ರ (Bhoomi Mitra)',
    appSubtitle: 'ನಿಮ್ಮ ಎಐ ಕೃಷಿ ಸಲಹೆಗಾರ ಮತ್ತು ಮಣ್ಣಿನ ತಜ್ಞ',
    assistantName: 'ಭೂಮಿ ಮಿತ್ರ',
    assistantSubtitle: 'ನಿಖರ ಸಲಹೆ, ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಬೆಳೆ ಪರಿಹಾರ',
    greetingTitle: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು "ಭೂಮಿ ಮಿತ್ರ".',
    greetingSubtitle: 'ನಿಮ್ಮ ಮಣ್ಣು, ಗೊಬ್ಬರ, ಬೆಳೆ ರೋಗಗಳು, ಕೀಟಗಳು, ನೀರಾವರಿ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ ಅಥವಾ ಫೋಟೋ ತೋರಿಸಿ.',
    quickPrompts: [
      'ಬೆಳೆಯ ಎಲೆಗಳು ಏಕೆ ಹಳದಿಯಾಗುತ್ತಿವೆ?',
      'ಯೂರಿಯಾ ಮತ್ತು ಡಿಎಪಿ ಸರಿಯಾದ ಪ್ರಮಾಣ ಎಷ್ಟು?',
      'ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವನ್ನು ಹೇಗೆ ಪರೀಕ್ಷಿಸುವುದು?',
      'ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಮತ್ತು ನೀರಾವರಿ ಸಲಹೆ ಏನು?',
      'ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಹೇಗೆ ಪರಿಶೀಲಿಸುವುದು?'
    ],
    chatPlaceholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...',
    askBhoomiMitra: 'ಭೂಮಿ ಮಿತ್ರರನ್ನು ಕೇಳಿ',
    voiceInput: 'ಮಾತನಾಡಿ',
    voiceListening: 'ಕೇಳುತ್ತಿದ್ದೇವೆ, ಹೇಳಿ...',
    voiceSpeaking: 'ಭೂಮಿ ಮಿತ್ರ ಮಾತನಾಡುತ್ತಿದ್ದಾರೆ...',
    stopVoice: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    listenAudio: 'ಧ್ವನಿ ಆಲಿಸಿ',
    attachPhoto: 'ಮಣ್ಣು/ಎಲೆಯ ಫೋಟೋ ಲಗತ್ತಿಸಿ',
    photoAttached: 'ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ',
    removePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    send: 'ಕಳುಹಿಸಿ',
    clearChat: 'ಹೊಸ ಸಂಭಾಷಣೆ',
    actionCardTitle: 'ಕೃಷಿ ವರದಿ ಮತ್ತು ರಸಗೊಬ್ಬರ ಚೀಟಿ',
    recommendedCrop: 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ',
    dosageBreakdown: 'ಪ್ರತಿ ಎಕರೆಗೆ ಗೊಬ್ಬರದ ಪ್ರಮಾಣ (ಕೆಜಿ)',
    scheduleTitle: 'ಗೊಬ್ಬರ ನೀಡುವ ಸಮಯ',
    organicTitle: 'ಸಾವಯವ ಪರಿಹಾರ (ಜೀವಾಮೃತ)',
    safetyTitle: 'ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ',
    subscribeAlerts: 'ವಾಟ್ಸಾಪ್ / SMS ಎಚ್ಚರಿಕೆ ಪಡೆಯಿರಿ',
    subscribedSuccess: 'ಎಚ್ಚರಿಕೆಗಳು ಸಕ್ರಿಯಗೊಂಡಿವೆ!',
    uploadSoilCard: 'ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    cameraTitle: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    takePhoto: 'ಕ್ಯಾಪ್ಚರ್ ಮಾಡಿ',
    flipCamera: 'ಕ್ಯಾಮೆರಾ ಬದಲಾಯಿಸಿ',
    closeCamera: 'ಮುಚ್ಚಿ',
    uploadFromGallery: 'ಗ್ಯಾಲರಿಯಿಂದ ಆರಿಸಿ',
  },

  or: {
    ...BASE_HI,
    appName: 'ଭୂମି ମିତ୍ର (Bhoomi Mitra)',
    appSubtitle: 'ଆପଣଙ୍କ ଏଆଇ କୃଷି ପରାମର୍ଶଦାତା ଓ ମୃତ୍ତିକା ବିଶେଷଜ୍ଞ',
    assistantName: 'ଭୂମି ମିତ୍ର',
    assistantSubtitle: 'ସଠିକ୍ ପରାମର୍ଶ, ମାଟି ପରୀକ୍ଷା ଓ ଫସଲ ସମାଧାନ',
    greetingTitle: 'ନମସ୍କାର କୃଷକ ଭାଇ! ମୁଁ "ଭୂମି ମିତ୍ର"।',
    greetingSubtitle: 'ଆପଣଙ୍କ ମାଟି, ସାର, ଫସଲ ରୋଗ, କୀଟ, ଜଳସେଚନ କିମ୍ବା ମଣ୍ଡି ଦର ବିଷୟରେ ଯାହା କିଛି ପଚାରନ୍ତୁ ବା ଫଟୋ ଦେଖାନ୍ତୁ।',
    quickPrompts: [
      'ଧାନ/ଗହମ ପତ୍ର କାହିଁକି ହଳଦିଆ ପଡୁଛି?',
      'ୟୁରିଆ ଏବଂ ଡିଏପିର ସଠିକ୍ ପରିମାଣ କେତେ?',
      'ମାଟିରେ ଆର୍ଦ୍ରତା କିପରି ଯାଞ୍ଚ କରିବେ?',
      'ପାଣିପାଗ ଓ ଜଳସେଚନ ପରାମର୍ଶ କ’ଣ?',
      'ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ଼ କିପରି ପଢିବେ?'
    ],
    chatPlaceholder: 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ ବା ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ...',
    askBhoomiMitra: 'ଭୂମି ମିତ୍ରଙ୍କୁ ପଚାରନ୍ତୁ',
    voiceInput: 'କୁହନ୍ତୁ',
    voiceListening: 'ଶୁଣୁଛୁ, କୁହନ୍ତୁ...',
    voiceSpeaking: 'ଭୂମି ମିତ୍ର ଉତ୍ତର ଦେଉଛନ୍ତି...',
    stopVoice: 'ଭଏସ୍ ବନ୍ଦ କରନ୍ତୁ',
    listenAudio: 'ଶୁଣନ୍ତୁ',
    attachPhoto: 'ମାଟି/ପତ୍ର ଫଟୋ ଯୋଡ଼ନ୍ତୁ',
    photoAttached: 'ଫଟୋ ଯୋଡ଼ାଗଲା',
    removePhoto: 'ଫଟୋ ହଟାନ୍ତୁ',
    send: 'ପଠାନ୍ତୁ',
    clearChat: 'ନୂଆ କଥାବାର୍ତ୍ତା',
    actionCardTitle: 'କୃଷି ରିପୋର୍ଟ ଓ ସାର ପ୍ରେସକ୍ରିପସନ୍',
    recommendedCrop: 'ଅନୁମୋଦିତ ଫସଲ',
    dosageBreakdown: 'ଏକର ପିଛା ସାରର ପରିମାଣ (କେଜି)',
    scheduleTitle: 'ସାର ପ୍ରୟୋଗ ସମୟ',
    organicTitle: 'ଜୈବିକ ଉପଚାର (ଜୀବାମୃତ)',
    safetyTitle: 'ସୁରକ୍ଷା ସୂଚନା',
    subscribeAlerts: 'ହ୍ୱାଟ୍ସଆପ୍ / SMS ସୂଚନା ପାଆନ୍ତୁ',
    subscribedSuccess: 'ସଫଳତାର ସହ ଆଲର୍ଟ ଚାଲୁ ହେଲା!',
    uploadSoilCard: 'ମୃତ୍ତିକା କାର୍ଡ଼ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    cameraTitle: 'ଫଟୋ ଉଠାନ୍ତୁ',
    takePhoto: 'ଫଟୋ ଉଠାନ୍ତୁ',
    flipCamera: 'କ୍ୟାମେରା ବଦଳାନ୍ତୁ',
    closeCamera: 'ବନ୍ଦ କରନ୍ତୁ',
    uploadFromGallery: 'ଗ୍ୟାଲେରୀରୁ ବାଛନ୍ତୁ',
  },

  ml: {
    ...BASE_HI,
    appName: 'ഭൂമി മിത്ര (Bhoomi Mitra)',
    appSubtitle: 'നിങ്ങളുടെ എഐ കാർഷിക ഉപദേശകനും മണ്ണ് വിദഗ്ദ്ധനും',
    assistantName: 'ഭൂമി മിത്ര',
    assistantSubtitle: 'കൃത്യമായ ഉപദേശം, മണ്ണ് പരിശോധന & വിള സംരക്ഷണം',
    greetingTitle: 'നമസ്കാരം കർഷക സുഹൃത്തേ! ഞാൻ "ഭൂമി മിത്ര".',
    greetingSubtitle: 'മണ്ണ്, വളം, കീടങ്ങൾ, രോഗങ്ങൾ, ജലസേചനം അല്ലെങ്കിൽ വിളവില എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കാം അല്ലെങ്കിൽ ഫോട്ടോ കാണിക്കാം.',
    quickPrompts: [
      'വിളകളിൽ ഇലകൾ മഞ്ഞനിറമാകുന്നത് എന്തുകൊണ്ട്?',
      'യൂറിയയും ഡിഎപിയും ഉപയോഗിക്കേണ്ട കൃത്യമായ അളവ് എത്ര?',
      'മണ്ണിലെ ഈർപ്പം എങ്ങനെ പരിശോധിക്കാം?',
      'കാലാവസ്ഥയും ജലസേചന നിർദ്ദേശങ്ങളും എന്തൊക്കെ?',
      'സോയിൽ ഹെൽത്ത് കാർഡ് എങ്ങനെ പരിശോധിക്കാം?'
    ],
    chatPlaceholder: 'നിങ്ങളുടെ സംശയം ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...',
    askBhoomiMitra: 'ഭൂമി മിത്രയോട് ചോദിക്കുക',
    voiceInput: 'സംസാരിക്കുക',
    voiceListening: 'കേൾക്കുന്നു, പറയൂ...',
    voiceSpeaking: 'ഭൂമി മിത്ര സംസാരിക്കുന്നു...',
    stopVoice: 'ശബ്ദം നിർത്തുക',
    listenAudio: 'ശബ്ദം കേൾക്കുക',
    attachPhoto: 'ഫോട്ടോ ചേർക്കുക',
    photoAttached: 'ഫോട്ടോ ചേർത്തു',
    removePhoto: 'നീക്കം ചെയ്യുക',
    send: 'അയക്കുക',
    clearChat: 'പുതിയ സംഭാഷണം',
    actionCardTitle: 'കാർഷിക റിപ്പോർട്ടും വള നിർദ്ദേശവും',
    recommendedCrop: 'ശുപാർശ ചെയ്യുന്ന വിള',
    dosageBreakdown: 'ഏക്കറിന് വളത്തിന്റെ അളവ് (കിലോ)',
    scheduleTitle: 'വളപ്രയോഗ സമയം',
    organicTitle: 'ജൈവ പരിഹാരങ്ങൾ (ജീവാമൃതം)',
    safetyTitle: 'സുരക്ഷാ നിർദ്ദേശം',
    subscribeAlerts: 'വാട്ട്‌സ്ആപ്പ് / SMS സന്ദേശങ്ങൾ നേടൂ',
    subscribedSuccess: 'സന്ദേശങ്ങൾ ആരംഭിച്ചു!',
    uploadSoilCard: 'സോയിൽ ഹെൽത്ത് കാർഡ് അപ്‌ലോഡ് ചെയ്യുക',
    cameraTitle: 'ഫോട്ടോ എടുക്കുക',
    takePhoto: 'പകർത്തുക',
    flipCamera: 'ക്യാമറ മാറ്റുക',
    closeCamera: 'അടയ്ക്കുക',
    uploadFromGallery: 'ഗ്യാലറിയിൽ നിന്ന് എടുക്കുക',
  },

  pa: {
    ...BASE_HI,
    appName: 'ਭੂਮੀ ਮਿੱਤਰ (Bhoomi Mitra)',
    appSubtitle: 'ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ',
    assistantName: 'ਭੂਮੀ ਮਿੱਤਰ',
    assistantSubtitle: 'ਮਿੱਟੀ ਪਰਖ, ਖਾਦ ਪ੍ਰਬੰਧਨ ਅਤੇ ਫ਼ਸਲ ਹੱਲ',
    greetingTitle: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ "ਭੂਮੀ ਮਿੱਤਰ" ਹਾਂ।',
    greetingSubtitle: 'ਮਿੱਟੀ, ਖਾਦ, ਫ਼ਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਕੀੜੇ, ਸਿੰਚਾਈ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਫੋਟੋ ਦਿਖਾਓ।',
    quickPrompts: [
      'ਕਣਕ/ਝੋਨੇ ਦੇ ਪੱਤੇ ਪੀਲੇ ਕਿਉਂ ਪੈ ਰਹੇ ਹਨ?',
      'ਯੂਰੀਆ ਅਤੇ ਡੀਏਪੀ ਦੀ ਸਹੀ ਮਾਤਰਾ ਤੇ ਸਮਾਂ ਕੀ ਹੈ?',
      'ਜ਼ਮੀਨ ਵਿੱਚ ਪਾਣੀ ਜੀਰਨ ਦੀ ਗਤੀ ਕਿਵੇਂ ਜਾਂਚੀਏ?',
      'ਮੌਸਮ ਅਤੇ ਸਿੰਚਾਈ ਦੀ ਸਹੀ ਸਲਾਹ ਕੀ ਹੈ?',
      'ਸੋਇਲ ਹੈਲਥ ਕਾਰਡ ਦੀ ਜਾਂਚ ਕਿਵੇਂ ਕਰਵਾਈਏ?'
    ],
    chatPlaceholder: 'ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ...',
    askBhoomiMitra: 'ਭੂਮੀ ਮਿੱਤਰ ਨੂੰ ਪੁੱਛੋ',
    voiceInput: 'ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ',
    voiceListening: 'ਕਿਸਾਨ ਵੀਰੋ, ਤੁਹਾਡੀ ਗੱਲ ਸੁਣ ਰਹੇ ਹਾਂ...',
    voiceSpeaking: 'ਭੂਮੀ ਮਿੱਤਰ ਸਮਝਾ ਰਹੇ ਹਨ...',
    stopVoice: 'ਆਵਾਜ਼ ਬੰਦ ਕਰੋ',
    listenAudio: 'ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ',
    attachPhoto: 'ਖੇਤ/ਪੱਤੇ ਦੀ ਫੋਟੋ ਜੋੜੋ',
    photoAttached: 'ਫੋਟੋ ਸ਼ਾਮਲ ਕੀਤੀ ਗਈ',
    removePhoto: 'ਫੋਟੋ ਹਟਾਓ',
    send: 'ਭੇਜੋ',
    clearChat: 'ਨਵੀਂ ਗੱਲਬਾਤ',
    actionCardTitle: 'ਖੇਤ ਦੀ ਵਿਗਿਆਨਕ ਰਿਪੋਰਟ ਤੇ ਖਾਦ ਪਰਚੀ',
    recommendedCrop: 'ਸਭ ਤੋਂ ਢੁਕਵੀਂ ਫ਼ਸਲ',
    dosageBreakdown: 'ਪ੍ਰਤੀ ਏਕੜ ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ (ਕਿਲੋ)',
    scheduleTitle: 'ਖਾਦ ਪਾਉਣ ਦਾ ਸਹੀ ਸਮਾਂ',
    organicTitle: 'ਦੇਸੀ ਤੇ ਜੈਵਿਕ ਉਪਚਾਰ (ਜੀਵਾਮ੍ਰਿਤ)',
    safetyTitle: 'ਸੁਰੱਖਿਆ ਤੇ ਵਾਤਾਵਰਣ ਚਿਤਾਵਨੀ',
    subscribeAlerts: 'ਵਟਸਐਪ / SMS ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ',
    subscribedSuccess: 'ਅਲਰਟ ਸ਼ੁਰੂ ਹੋ ਗਿਆ ਹੈ!',
    uploadSoilCard: 'ਸੋਇਲ ਹੈਲਥ ਕਾਰਡ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
    cameraTitle: 'ਖੇਤ ਜਾਂ ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚੋ',
    takePhoto: 'ਫੋਟੋ ਲਓ',
    flipCamera: 'ਕੈਮਰਾ ਬਦਲੋ',
    closeCamera: 'ਬੰਦ ਕਰੋ',
    uploadFromGallery: 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ',
  },

  as: {
    ...BASE_HI,
    appName: 'ভূমি মিত্ৰ (Bhoomi Mitra)',
    appSubtitle: 'আপোনাৰ এআই কৃষি উপদেষ্টা আৰু মৃত্তিকা বিশেষজ্ঞ',
    assistantName: 'ভূমি মিত্ৰ',
    assistantSubtitle: 'সঠিক পৰামৰ্শ, মাটি পৰীক্ষা আৰু শস্য সমাধান',
    greetingTitle: 'নমস্কাৰ কৃষক ভাই! মই "ভূমি মিত্ৰ"।',
    greetingSubtitle: 'মাটি, সাৰ, শস্যৰ বেমাৰ, কীট-পতংগ বা বজাৰ মূল্যৰ বিষয়ে যিকোনো কথা সোধক বা ফটো দেখুৱাওক।',
    quickPrompts: [
      'ধানৰ পাত হালধীয়া কিয় হৈছে?',
      'ইউৰিয়া আৰু ডিএপিৰ সঠিক পৰিমাণ কিমান?',
      'মাটিৰ আৰ্দ্ৰতা কেনেকৈ পৰীক্ষা কৰিব?',
      'বতৰ আৰু জলসিঞ্চনৰ পৰামৰ্শ কি?',
      'মৃত্তিকা স্বাস্থ্য কাৰ্ড কেনেকৈ চাম?'
    ],
    chatPlaceholder: 'আপোনাৰ প্ৰশ্ন লিখক বা মাইক ব্যৱহাৰ কৰক...',
    askBhoomiMitra: 'ভূমি মিত্ৰক সোধক',
    voiceInput: 'কথা কওক',
    voiceListening: 'শুনি আছো, কওক...',
    voiceSpeaking: 'ভূমি মিত্ৰই উত্তৰ দিছে...',
    stopVoice: 'ৰখাওক',
    listenAudio: 'শুনক',
    attachPhoto: 'ফটো সংলগ্ন কৰক',
    photoAttached: 'ফটো সংলগ্ন হ’ল',
    removePhoto: 'ফটো আঁতৰাওক',
    send: 'প্ৰেৰণ কৰক',
    clearChat: 'নতুন বাৰ্তালাপ',
    actionCardTitle: 'কৃষি প্ৰতিবেদন আৰু সাৰৰ পৰামৰ্শ',
    recommendedCrop: 'উপযুক্ত শস্য',
    dosageBreakdown: 'প্ৰতি একৰত সাৰৰ মাত্ৰা (কেজি)',
    scheduleTitle: 'সাৰ প্ৰয়োগৰ সময়',
    organicTitle: 'জৈৱিক উপায় (জীৱামৃত)',
    safetyTitle: 'সুৰক্ষা সতৰ্কতা',
    subscribeAlerts: 'হোৱাটছএপ / SMS এলাৰ্ট লওক',
    subscribedSuccess: 'এলাৰ্ট সফলভাৱে আৰম্ভ হ’ল!',
    uploadSoilCard: 'মৃত্তিকা কাৰ্ড আপলোড কৰক',
    cameraTitle: 'ফটো তোলক',
    takePhoto: 'ফটো তোলক',
    flipCamera: 'কেমেৰা সলনি কৰক',
    closeCamera: 'বন্ধ কৰক',
    uploadFromGallery: 'গেলেৰীৰ পৰা বাছক',
  },

  mai: {
    ...BASE_HI,
    appName: 'भूमि मित्र (Bhoomi Mitra)',
    appSubtitle: 'अहाँक एआई कृषि सलाहकार आ माटि विशेषज्ञ',
    assistantName: 'भूमि मित्र',
    assistantSubtitle: 'सटीक सलाह, माटि जांच आ फसल समाधान',
    greetingTitle: 'प्रणाम किसान भाई! हम "भूमि मित्र" छी।',
    greetingSubtitle: 'माटि, खाद, फसलक बीमारी, कीड़ा, पटवन या मंडी भावक संबंध में कोनो बात पूछू या फोटो देखाउ।',
    quickPrompts: [
      'गेहूं/धानक पात पीयर कियैक भऽ रहल अछि?',
      'यूरिया आ डीएपीक सही मात्रा कतेक होय?',
      'खेत में माटिक नमी कोना जांचल जाय?',
      'मौसम आ सिंचाईक सही सलाह की अछि?',
      'माटि स्वास्थ्य कार्ड कोना देखल जाय?'
    ],
    chatPlaceholder: 'अपन प्रश्न लिखू या माइक दबा कऽ बाजू...',
    askBhoomiMitra: 'भूमि मित्र सँ पूछू',
    voiceInput: 'बाजू',
    voiceListening: 'सुनि रहल छी...',
    voiceSpeaking: 'भूमि मित्र कहि रहल छथि...',
    stopVoice: 'आवाज रोकु',
    listenAudio: 'आवाज सुनू',
    attachPhoto: 'फोटो जोड़ू',
    photoAttached: 'फोटो जुड़ल',
    removePhoto: 'फोटो हटाउ',
    send: 'पठाउ',
    clearChat: 'नव बातचीत',
    actionCardTitle: 'वैज्ञानिक रिपोर्ट आ खादक पर्ची',
    recommendedCrop: 'अनुशंसित फसल',
    dosageBreakdown: 'प्रति एकड़ खादक मात्रा (किलो)',
    scheduleTitle: 'खाद देबाक सही समय',
    organicTitle: 'जैविक उपचार (जीवामृत)',
    safetyTitle: 'सुरक्षा सूचना',
    subscribeAlerts: 'व्हाट्सएप / SMS अलर्ट पाबू',
    subscribedSuccess: 'अलर्ट शुरू भऽ गेल!',
    uploadSoilCard: 'माटि कार्ड अपलोड करू',
    cameraTitle: 'फोटो खींचू',
    takePhoto: 'फोटो खींचू',
    flipCamera: 'कैमरा बदलू',
    closeCamera: 'बंद करू',
    uploadFromGallery: 'गैलरी सँ चुनू',
  },

  sat: {
    ...BASE_HI,
    appName: 'ᱵᱷᱩᱢᱤ ᱢᱤᱛᱨᱚ (Bhoomi Mitra)',
    appSubtitle: 'ᱟᱢᱟᱜ ᱮ.ᱟᱭᱤ. ᱪᱟᱥ ᱟᱨ ᱦᱟᱥᱟ ᱥᱟᱞᱟᱦᱟᱠᱟᱨ',
    greetingTitle: 'ᱡᱚᱦᱟᱨ ᱠᱤᱥᱟᱱ ᱵᱚᱭᱦᱟ! ᱤᱧ ᱫᱚ "ᱵᱷᱩᱢᱤ ᱢᱤᱛᱨᱚ" ᱠᱟᱱᱟᱹᱧ᱾',
    greetingSubtitle: 'ᱦᱟᱥᱟ, ᱥᱟᱨ, ᱨᱩᱣᱟᱹ-ᱦᱟᱹᱥᱩ, ᱫᱟᱜ ᱟᱨ ᱪᱟᱥ ᱵᱟᱵᱚᱛ ᱡᱟᱦᱟᱱᱟᱜ ᱠᱩᱞᱤ ᱢᱮ ᱥᱮ ᱯᱷᱚᱴᱚ ᱩᱫᱩᱜ ᱢᱮ᱾',
    chatPlaceholder: 'ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ ᱚᱞ ᱢᱮ ᱥᱮ ᱢᱟᱭᱤᱠ ᱛᱮ ᱨᱚᱲ ᱢᱮ...',
    voiceInput: 'ᱨᱚᱲ ᱢᱮ',
    send: 'ᱠᱩᱞ ᱢᱮ',
    clearChat: 'ᱱᱟᱣᱟ ᱜᱟᱞᱢᱟᱨᱟᱣ',
  },

  ks: {
    ...BASE_HI,
    appName: 'بھومی مِتر (Bhoomi Mitra)',
    appSubtitle: 'تُہُند ای آی زراعت مشیر تہٕ زمینُک ماہر',
    greetingTitle: 'سلام باجیو! بہٕ چھُس "بھومی مِتر"۔',
    greetingSubtitle: 'زمین، کھاد، بیمارین تہٕ فصلی مسلن متعلق کینٛہہ تہٕ پرژھیو یا فوٹو ہاوِو۔',
    chatPlaceholder: 'پَنُن سوال لؠکھیو یا مائیک دبٲوِتھ ونیو...',
    voiceInput: 'کَتھ کٔرِو',
    send: 'سوزِو',
    clearChat: 'نٔو کَتھ باتھ',
  },

  ne: {
    ...BASE_HI,
    appName: 'भूमि मित्र (Bhoomi Mitra)',
    appSubtitle: 'तपाईंको एआई कृषि सल्लाहकार तथा माटो विज्ञ',
    greetingTitle: 'नमस्ते किसान दाजुभाइ! म "भूमि मित्र" हुँ।',
    greetingSubtitle: 'माटो, मल, बालीको रोग, कीरा, सिँचाइ वा बजार भाउ सम्बन्धी कुनै पनि प्रश्न सोध्नुहोस् वा फोटो देखाउनुहोस्।',
    quickPrompts: [
      'बालीको पात किन पहेंलो भइरहेको छ?',
      'युरिया र डीएपीको सही मात्रा कति हो?',
      'माटोमा चिस्यान कसरी जाँच्ने?',
      'मौसम तथा सिँचाइको उचित सल्लाह के छ?',
      'माटो स्वास्थ्य कार्ड कसरी बुझ्ने?'
    ],
    chatPlaceholder: 'आफ्नो प्रश्न लेख्नुहोस् वा माइक थिची बोल्नुहोस्...',
    voiceInput: 'बोल्नुहोस्',
    send: 'पठाउनुहोस्',
    clearChat: 'नयाँ कुराकानी',
  },

  kok: {
    ...BASE_HI,
    appName: 'भूमी मित्र (Bhoomi Mitra)',
    appSubtitle: 'तुमचो एआय शेतकाम सल्लागार आनी माती तज्ञ',
    greetingTitle: 'देव बरे करूं शेतकार भावांनो! हांव "भूमी मित्र".',
    greetingSubtitle: 'माती, सारां, पिकांचे रोग, किडी वा उदका विशीं कांयय विचारात वा फोटो दाखयात.',
    chatPlaceholder: 'तुमचो प्रश्न बरयात वा उलययात...',
    voiceInput: 'उलययात',
    send: 'धाडात',
    clearChat: 'नवी उಲವ್ಣಿ',
  },

  sd: {
    ...BASE_HI,
    appName: 'ڀومي مِتر (Bhoomi Mitra)',
    appSubtitle: 'توهان جو زرعي صلاحڪار ۽ زمين جو ماهر',
    greetingTitle: 'سلام هاري ڀاءُ! مان "ڀومي مِتر" آهيان.',
    greetingSubtitle: 'زمين، ڀاڻ، فصلن جي بيمارين يا پاڻي بابت ڪجھ به پڇو يا فوٽو ڏيکاريو.',
    chatPlaceholder: 'پنهنجو سوال لکو يا ڳالهايو...',
    voiceInput: 'ڳالهايو',
    send: 'موڪليو',
    clearChat: 'نئين گفتگو',
  },

  dgo: {
    ...BASE_HI,
    appName: 'भूमि मित्र (Bhoomi Mitra)',
    appSubtitle: 'तुंदा एआई खेती सलाहकार ते मिट्टी माहिर',
    greetingTitle: 'नमस्ते किसान भरो! मैं "भूमि मित्र" आं।',
    greetingSubtitle: 'मिट्टी, खाद, फसल दे रोग, कीड़े या मौसम बारे किश बी पुच्छो जां फोटो दस्सियै गल्ल करो।',
    chatPlaceholder: 'अप्ना सवाल लिक्खो जां माइक दबाई बोल्लो...',
    voiceInput: 'बोल्लो',
    send: 'भेजो',
    clearChat: 'नमीं गल्लबात',
  },

  brx: {
    ...BASE_HI,
    appName: 'भुमि मित्व (Bhoomi Mitra)',
    appSubtitle: 'नोंथांनि ए.आइ. आबादगिरि आरो हा बिगियानगिरि',
    greetingTitle: 'खुलुमबाय आबादगिरि आदा! आं "भुमि मित्व"।',
    greetingSubtitle: 'हा, सार, फसलनि बेमार, दै आरो आबादनि सोमॉन्दै जेबो सोंनो हागोन।',
    chatPlaceholder: 'नोंथांनि सोंनायखौ लिर एबा बुं...',
    voiceInput: 'बुं',
    send: 'थिनहर',
    clearChat: 'गोदान सावरायनाय',
  },

  mni: {
    ...BASE_HI,
    appName: 'ভুমি মিত্র (Bhoomi Mitra)',
    appSubtitle: 'নহাক্কী এ.আই. লৌউ-শিংউগী পাউতাকপীবা অমসুং লৈবাক্কী এক্সপার্ট',
    greetingTitle: 'খুরুমজরি লৌমী ইচিল-ইনাও! ঐহাক "ভুমি মিত্র" নি।',
    greetingSubtitle: 'লৈবাক, হার, পাম্বীগী লাইনা, ঈশিং বা পোত্থোক্কী মরমদা মরী লৈনবা ৱাহং হংবিয়ু।',
    chatPlaceholder: 'ৱাহং ইবীয়ু নত্রগা ৱা ঙাংবীয়ু...',
    voiceInput: 'ৱা ঙাংবীয়ু',
    send: 'থাবীয়ু',
    clearChat: 'অনৌবা ৱারী',
  },

  sa: {
    ...BASE_HI,
    appName: 'भूमि मित्रम् (Bhoomi Mitra)',
    appSubtitle: 'भवतः कृषिशास्त्रज्ञः मृत्तिकाविशेषज्ञश्च',
    greetingTitle: 'नमो नमः कृषक बन्धो! अहम् "भूमि मित्रम्" अस्मि।',
    greetingSubtitle: 'मृत्तिका, उर्वरकम्, सस्यरोगाः, जलसेचनम् च विषये किमपि पृच्छतु अथवा चित्रं प्रदर्शयतु।',
    quickPrompts: [
      'सस्यस्य पत्राणि पीतानि किमर्थं भवन्ति?',
      'यूरिया तथा डीएपी इत्यनयोः उचितं प्रमाणं किम्?',
      'क्षेत्रे आर्द्रता कथं परीक्षेत?',
      'ऋतु अनुकूलं जलसेचनं कथं करणीयम्?',
      'मृत्तिका स्वास्थ्य पत्रिकाम् कथं परीक्षेत?'
    ],
    chatPlaceholder: 'निज प्रश्नं लिखतु अथवा वदतु...',
    voiceInput: 'वदतु',
    send: 'प्रेषयतु',
    clearChat: 'नूतन संभाषणम्',
  },

  en: {
    ...BASE_HI,
    appName: 'Bhoomi Mitra',
    appSubtitle: 'Your Real-Time AI Field Agronomist',
    assistantName: 'Bhoomi Mitra',
    assistantSubtitle: 'Accurate field diagnostics, soil testing, and crop solutions',
    greetingTitle: 'Namaste Farmer! I am "Bhoomi Mitra".',
    greetingSubtitle: 'Ask me anything about your soil, crops, fertilizers, pests, irrigation, mandi prices, or weather, or show me a photo from your field.',
    quickPrompts: [
      'Why are crop leaves turning yellow?',
      'What is the correct Urea and DAP dosage ratio?',
      'How to test soil moisture and water infiltration rate?',
      'What is the current weather and irrigation advisory?',
      'How do I read and verify my Soil Health Card?'
    ],
    chatPlaceholder: 'Type your question or tap mic to speak...',
    askBhoomiMitra: 'Ask Bhoomi Mitra',
    voiceInput: 'Tap to speak',
    voiceListening: 'Listening to you...',
    voiceSpeaking: 'Bhoomi Mitra is speaking...',
    stopVoice: 'Stop Voice',
    listenAudio: 'Listen to Voice',
    attachPhoto: 'Attach Soil/Crop Photo',
    photoAttached: 'Photo attached',
    removePhoto: 'Remove photo',
    send: 'Send',
    clearChat: 'New Chat',
    regionalContext: 'Farm & Regional Footprint',
    soilCheckGuide: 'Simple 3-Step Soil Triage',
    mandiAdvisory: 'Mandi & Cropping Calendar',
    selectProfile: 'Select Farm Region:',
    actionCardTitle: 'Scientific Agronomic Report & Dosage Card',
    recommendedCrop: 'Most Recommended Crop',
    dosageBreakdown: 'Exact Fertilizer Dosage Per Acre (kg)',
    scheduleTitle: 'Application Timing & Technique',
    organicTitle: 'Organic & Bio-Amendments (FYM / Jeevamrut)',
    safetyTitle: 'Environmental & Safety Caution',
    subscribeAlerts: 'Subscribe to WhatsApp/SMS Advisory Alerts',
    subscribedSuccess: 'Successfully subscribed to alerts!',
    uploadSoilCard: 'Upload Paper Soil Health Card Photo',
    cameraTitle: 'Take Soil or Leaf Photo',
    takePhoto: 'Capture Photo',
    flipCamera: 'Switch Camera',
    closeCamera: 'Close',
    uploadFromGallery: 'Choose from Gallery',
  },
};
