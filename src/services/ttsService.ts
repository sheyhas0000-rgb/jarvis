import { SupportedLanguage } from '../types';

export class TTSService {
  private static activeUtterance: SpeechSynthesisUtterance | null = null;

  static isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static stop(): void {
    if (this.isAvailable()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('TTSService.stop error:', e);
      }
    }
  }

  static isSpeaking(): boolean {
    if (this.isAvailable()) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }

  /**
   * Cleans text from emojis, markdown symbols, and technical formatting for clean speech
   */
  private static sanitizeTextForSpeech(rawText: string): string {
    return rawText
      // Remove URLs
      .replace(/https?:\/\/\S+/gi, '')
      // Remove file paths
      .replace(/C:\\\S+/gi, '')
      // Remove markdown headings, bold, bullet points
      .replace(/[*_#`~]+/g, '')
      .replace(/[•\-\+]\s+/g, ', ')
      // Remove technical windows commands or protocol hints
      .replace(/start\s+[a-z0-9_.:\-]+/gi, '')
      // Remove common emojis
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Speaks the provided text using Web Speech API in the selected language
   */
  static speak(text: string, language: SupportedLanguage, enabled: boolean = true): void {
    if (!enabled || !this.isAvailable()) return;

    this.stop();

    const cleanText = this.sanitizeTextForSpeech(text);
    if (!cleanText) return;

    // Truncate overly long text so speech synthesis is responsive
    const speechSlice = cleanText.length > 250 ? cleanText.slice(0, 250) + '...' : cleanText;

    try {
      const utterance = new SpeechSynthesisUtterance(speechSlice);

      if (language === 'en') {
        utterance.lang = 'en-US';
      } else if (language === 'ru') {
        utterance.lang = 'ru-RU';
      } else {
        utterance.lang = 'uz-UZ';
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetLangPrefix = utterance.lang.slice(0, 2);
      const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLangPrefix));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      this.activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTSService.speak error:', err);
    }
  }
}
