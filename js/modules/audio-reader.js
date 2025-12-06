// Audio Reader Module - Đọc chữ Hán thành tiếng
export class AudioReader {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    this.currentUtterance = null;
  }
  
  // Đọc âm Hán Việt
  speakHanViet(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech Synthesis không được hỗ trợ');
      return false;
    }
    
    // Dừng đọc trước đó nếu có
    this.stop();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    utterance.onend = () => {
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };
    
    utterance.onerror = (error) => {
      console.error('Lỗi đọc:', error);
      if (options.onError) options.onError(error);
    };
    
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }
  
  // Đọc Pinyin
  speakPinyin(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech Synthesis không được hỗ trợ');
      return false;
    }
    
    this.stop();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN'; // Tiếng Trung
    utterance.rate = options.rate || 0.8;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    utterance.onend = () => {
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };
    
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }
  
  // Đọc nghĩa tiếng Việt
  speakVietnamese(text, options = {}) {
    return this.speakHanViet(text, options);
  }
  
  // Dừng đọc
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }
  
  // Kiểm tra đang đọc
  isSpeaking() {
    return this.synth.speaking;
  }
  
  // Đọc đầy đủ thông tin chữ
  speakCharacter(charData) {
    if (!charData) return;
    
    const parts = [];
    
    if (charData.hanzi) {
      parts.push(`Chữ ${charData.hanzi}`);
    }
    
    if (charData.hanViet) {
      parts.push(`âm Hán Việt là ${charData.hanViet}`);
    }
    
    if (charData.pinyin) {
      parts.push(`pinyin là ${charData.pinyin}`);
    }
    
    if (charData.meaning) {
      parts.push(`nghĩa là ${charData.meaning}`);
    }
    
    const fullText = parts.join(', ');
    return this.speakHanViet(fullText, {
      rate: 0.85,
      onEnd: () => {
        console.log('Đã đọc xong');
      }
    });
  }
}

