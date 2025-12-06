// Quiz Engine Module - Hệ thống quiz và kiểm tra
export class QuizEngine {
  constructor() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.currentQuestionIndex = 0;
  }
  
  // Tạo quiz từ dữ liệu
  createQuiz(type, data, options = {}) {
    this.currentQuiz = {
      type,
      questions: [],
      score: 0,
      totalQuestions: 0,
      currentIndex: 0,
      options
    };
    
    switch (type) {
      case 'stroke-order':
        this.createStrokeOrderQuiz(data, options);
        break;
      case 'character-recognition':
        this.createCharacterRecognitionQuiz(data, options);
        break;
      case 'hanviet-input':
        this.createHanVietInputQuiz(data, options);
        break;
      case 'liushu-classification':
        this.createLiushuClassificationQuiz(data, options);
        break;
      case 'radical-identification':
        this.createRadicalIdentificationQuiz(data, options);
        break;
      default:
        console.error('Unknown quiz type:', type);
    }
    
    return this.currentQuiz;
  }
  
  // Quiz: Vẽ chữ theo thứ tự nét
  createStrokeOrderQuiz(characters, options = {}) {
    const questions = characters.map(char => ({
      type: 'stroke-order',
      question: `Vẽ chữ "${char.hanzi}" theo đúng thứ tự nét`,
      character: char.hanzi,
      answer: char,
      userAnswer: null,
      correct: false
    }));
    
    this.currentQuiz.questions = this.shuffleArray(questions).slice(0, options.count || 10);
    this.currentQuiz.totalQuestions = this.currentQuiz.questions.length;
  }
  
  // Quiz: Nhận diện chữ Hán → Viết âm Hán Việt
  createCharacterRecognitionQuiz(characters, options = {}) {
    const questions = characters.map(char => ({
      type: 'character-recognition',
      question: `Chữ "${char.hanzi}" đọc là gì?`,
      character: char.hanzi,
      answer: char.hanViet,
      options: this.generateOptions(char, characters, 'hanViet'),
      userAnswer: null,
      correct: false
    }));
    
    this.currentQuiz.questions = this.shuffleArray(questions).slice(0, options.count || 10);
    this.currentQuiz.totalQuestions = this.currentQuiz.questions.length;
  }
  
  // Quiz: Cho âm Hán Việt → Vẽ chữ
  createHanVietInputQuiz(characters, options = {}) {
    const questions = characters.map(char => ({
      type: 'hanviet-input',
      question: `Vẽ chữ có âm Hán Việt "${char.hanViet}"`,
      hint: char.meaning,
      answer: char.hanzi,
      userAnswer: null,
      correct: false
    }));
    
    this.currentQuiz.questions = this.shuffleArray(questions).slice(0, options.count || 10);
    this.currentQuiz.totalQuestions = this.currentQuiz.questions.length;
  }
  
  // Quiz: Phân loại Lục thư
  createLiushuClassificationQuiz(characters, options = {}) {
    const questions = characters
      .filter(char => char.liushuType)
      .map(char => ({
        type: 'liushu-classification',
        question: `Chữ "${char.hanzi}" thuộc loại Lục thư nào?`,
        character: char.hanzi,
        answer: char.liushuType,
        options: ['tượng hình', 'chỉ sự', 'hội ý', 'hình thanh', 'chuyển chú', 'giả tá'],
        userAnswer: null,
        correct: false
      }));
    
    this.currentQuiz.questions = this.shuffleArray(questions).slice(0, options.count || 10);
    this.currentQuiz.totalQuestions = this.currentQuiz.questions.length;
  }
  
  // Quiz: Nhận diện bộ thủ
  createRadicalIdentificationQuiz(characters, options = {}) {
    const questions = characters
      .filter(char => char.radical)
      .map(char => ({
        type: 'radical-identification',
        question: `Chữ "${char.hanzi}" có bộ thủ nào?`,
        character: char.hanzi,
        answer: char.radical,
        options: this.generateRadicalOptions(char, options.radicals || []),
        userAnswer: null,
        correct: false
      }));
    
    this.currentQuiz.questions = this.shuffleArray(questions).slice(0, options.count || 10);
    this.currentQuiz.totalQuestions = this.currentQuiz.questions.length;
  }
  
  // Tạo các lựa chọn cho câu hỏi
  generateOptions(correctChar, allChars, field) {
    const correct = correctChar[field];
    const wrong = allChars
      .filter(c => c[field] !== correct)
      .map(c => c[field])
      .filter((v, i, a) => a.indexOf(v) === i) // unique
      .slice(0, 3);
    
    const options = [correct, ...wrong];
    return this.shuffleArray(options);
  }
  
  generateRadicalOptions(char, radicals) {
    const correct = char.radical;
    const wrong = radicals
      .filter(r => r.radical !== correct)
      .map(r => r.radical)
      .slice(0, 3);
    
    const options = [correct, ...wrong];
    return this.shuffleArray(options);
  }
  
  // Xáo trộn mảng
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Trả lời câu hỏi
  submitAnswer(answer) {
    if (!this.currentQuiz) return null;
    
    const question = this.currentQuiz.questions[this.currentQuiz.currentIndex];
    question.userAnswer = answer;
    
    // Kiểm tra đúng/sai
    if (question.type === 'stroke-order') {
      // Được xử lý bởi Hanzi Writer
      return null;
    } else {
      question.correct = this.checkAnswer(question.answer, answer);
      if (question.correct) {
        this.currentQuiz.score++;
      }
    }
    
    return question.correct;
  }
  
  checkAnswer(correct, user) {
    if (typeof correct === 'string' && typeof user === 'string') {
      return correct.toLowerCase().trim() === user.toLowerCase().trim();
    }
    return correct === user;
  }
  
  // Chuyển câu hỏi tiếp theo
  nextQuestion() {
    if (!this.currentQuiz) return null;
    
    if (this.currentQuiz.currentIndex < this.currentQuiz.questions.length - 1) {
      this.currentQuiz.currentIndex++;
      return this.currentQuiz.questions[this.currentQuiz.currentIndex];
    }
    
    return null; // Quiz hoàn thành
  }
  
  // Lấy câu hỏi hiện tại
  getCurrentQuestion() {
    if (!this.currentQuiz) return null;
    return this.currentQuiz.questions[this.currentQuiz.currentIndex];
  }
  
  // Lấy kết quả quiz
  getResults() {
    if (!this.currentQuiz) return null;
    
    return {
      score: this.currentQuiz.score,
      total: this.currentQuiz.totalQuestions,
      percentage: Math.round((this.currentQuiz.score / this.currentQuiz.totalQuestions) * 100),
      questions: this.currentQuiz.questions
    };
  }
  
  // Reset quiz
  reset() {
    this.currentQuiz = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.currentQuestionIndex = 0;
  }
}

