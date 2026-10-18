/**
 * Singleton Audio Voice Controller for Bhoomi Mitra
 * Strictly guarantees that at most ONE voice/audio source plays at any time.
 * Prevents overlapping voices, race conditions, and lingering browser speech synthesis.
 */
import { INDIAN_LANGUAGES } from './translations';
class VoiceController {
  private currentAudio: HTMLAudioElement | null = null;
  private currentSpeechToken: number = 0;
  private isMuted: boolean = false;
  private onStateChange: ((isPlaying: boolean) => void) | null = null;

  public setListener(listener: (isPlaying: boolean) => void) {
    this.onStateChange = listener;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    this.currentSpeechToken += 1;

    // 1. Stop HTML5 audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
      } catch (err) {
        console.warn('[VoiceController] Error stopping audio element', err);
      }
      this.currentAudio = null;
    }

    // 2. Stop Web Speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('[VoiceController] Error cancelling speechSynthesis', err);
      }
    }

    if (this.onStateChange) {
      this.onStateChange(false);
    }
  }

  public async speak(text: string, language: string = 'hi'): Promise<void> {
    if (this.isMuted || !text.trim()) {
      return;
    }

    // Always stop any active voice before starting new speech
    this.stop();
    const token = this.currentSpeechToken;

    if (this.onStateChange) {
      this.onStateChange(true);
    }

    // Clean text (remove markdown symbols for smoother speech)
    const cleanText = text
      .replace(/[*_#`~[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 450);

    try {
      // 1. Attempt Gemini TTS from server
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, language }),
      });
      const data = await res.json();

      // Check if user clicked stop or started another query while fetching
      if (this.currentSpeechToken !== token) {
        return;
      }

      if (data.success && data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        this.currentAudio = audio;

        audio.onended = () => {
          if (this.currentSpeechToken === token) {
            this.currentAudio = null;
            if (this.onStateChange) this.onStateChange(false);
          }
        };

        audio.onerror = () => {
          if (this.currentSpeechToken === token) {
            this.currentAudio = null;
            this.fallbackBrowserSpeech(cleanText, language, token);
          }
        };

        await audio.play();
        return;
      }
    } catch {
      // Fall through to browser speech synthesis
    }

    // Fallback: Browser Web Speech API
    if (this.currentSpeechToken === token) {
      this.fallbackBrowserSpeech(cleanText, language, token);
    }
  }

  private fallbackBrowserSpeech(text: string, language: string, token: number) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (this.onStateChange) this.onStateChange(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Dynamically select appropriate regional BCP 47 code for all 23 Indian languages
      const langMatch = INDIAN_LANGUAGES.find((l) => l.code === language);
      utterance.lang = langMatch ? langMatch.speechCode : 'hi-IN';

      utterance.onend = () => {
        if (this.currentSpeechToken === token && this.onStateChange) {
          this.onStateChange(false);
        }
      };

      utterance.onerror = () => {
        if (this.currentSpeechToken === token && this.onStateChange) {
          this.onStateChange(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (this.onStateChange) this.onStateChange(false);
    }
  }
}

export const voiceController = new VoiceController();
