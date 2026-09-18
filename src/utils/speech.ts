// Speech Recognition & Synthesis utility for Uzbek language

// Browser SpeechRecognition interface
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export class SpeechHandler {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback?: (text: string) => void;
  private onStatusCallback?: (status: 'listening' | 'idle' | 'error', message?: string) => void;

  constructor() {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
    const SpeechRecognitionAPI = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      // Try Uzbek language first, fallback automatically
      this.recognition.lang = 'uz-UZ';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStatusCallback?.('listening', '🎤 Tinglayapman...');
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            // interim
            const interim = event.results[i][0].transcript;
            this.onStatusCallback?.('listening', `🎤 ${interim}...`);
          }
        }

        if (finalTranscript.trim()) {
          this.onResultCallback?.(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition xatosi:', event.error);
        this.isListening = false;
        let msg = "Ovozni aniqlab bo'lmadi.";
        if (event.error === 'not-allowed') {
          msg = 'Mikrofondan foydalanishga ruxsat berilmadi.';
        } else if (event.error === 'no-speech') {
          msg = 'Ovoz eshitilmadi. Iltimos qaytadan urinib ko\'ring.';
        }
        this.onStatusCallback?.('error', msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStatusCallback?.('idle');
      };
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    onResult: (text: string) => void,
    onStatus: (status: 'listening' | 'idle' | 'error', message?: string) => void
  ) {
    if (!this.recognition) {
      onStatus('error', "Brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi.");
      return;
    }

    this.onResultCallback = onResult;
    this.onStatusCallback = onStatus;

    try {
      this.recognition.start();
    } catch (e) {
      // Already running
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Reads Uzbek text response using Browser SpeechSynthesis
   */
  public static speak(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Clean emojis and markdown
    const cleanText = text
      .replace(/[✅❌⚠️📄📁✓🤖]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      // Look for Uzbek or Turkic or standard clear voice
      const uzVoice = voices.find(v => v.lang.startsWith('uz') || v.lang.startsWith('tr'));
      if (uzVoice) {
        utterance.voice = uzVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis xatosi:', err);
    }
  }
}
