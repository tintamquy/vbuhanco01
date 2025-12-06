// Progress Tracker Module - Theo dõi tiến độ học tập
import { Storage } from '../utils/storage.js';

export class ProgressTracker {
  constructor() {
    this.storage = new Storage();
    this.storageKey = 'hanco_progress';
    this.progress = this.loadProgress();
  }
  
  // Load tiến độ từ localStorage
  loadProgress() {
    const saved = this.storage.get(this.storageKey);
    if (saved) {
      return saved;
    }
    
    // Khởi tạo progress mặc định
    return {
      lessons: {},
      characters: {},
      strokes: {},
      radicals: {},
      quizzes: {},
      stats: {
        totalCharactersLearned: 0,
        totalStrokesPracticed: 0,
        totalQuizzesCompleted: 0,
        totalTimeSpent: 0, // minutes
        streak: 0, // days
        lastStudyDate: null
      }
    };
  }
  
  // Lưu tiến độ
  saveProgress() {
    this.storage.set(this.storageKey, this.progress);
  }
  
  // Đánh dấu bài học đã học
  markLessonComplete(lessonId) {
    if (!this.progress.lessons[lessonId]) {
      this.progress.lessons[lessonId] = {
        completed: true,
        completedAt: new Date().toISOString(),
        score: 0
      };
      this.saveProgress();
    }
  }
  
  // Cập nhật tiến độ bài học
  updateLessonProgress(lessonId, data) {
    if (!this.progress.lessons[lessonId]) {
      this.progress.lessons[lessonId] = {
        completed: false,
        progress: 0
      };
    }
    
    Object.assign(this.progress.lessons[lessonId], data);
    this.saveProgress();
  }
  
  // Đánh dấu chữ đã học
  markCharacterLearned(hanzi, data = {}) {
    if (!this.progress.characters[hanzi]) {
      this.progress.characters[hanzi] = {
        learned: true,
        learnedAt: new Date().toISOString(),
        practiceCount: 0,
        lastPracticed: null,
        mastery: 0 // 0-100
      };
      this.progress.stats.totalCharactersLearned++;
    }
    
    this.progress.characters[hanzi].practiceCount++;
    this.progress.characters[hanzi].lastPracticed = new Date().toISOString();
    Object.assign(this.progress.characters[hanzi], data);
    
    this.saveProgress();
  }
  
  // Cập nhật độ thành thạo chữ
  updateCharacterMastery(hanzi, mastery) {
    if (!this.progress.characters[hanzi]) {
      this.markCharacterLearned(hanzi);
    }
    
    this.progress.characters[hanzi].mastery = Math.min(100, Math.max(0, mastery));
    this.saveProgress();
  }
  
  // Đánh dấu nét đã luyện
  markStrokePracticed(strokeId) {
    if (!this.progress.strokes[strokeId]) {
      this.progress.strokes[strokeId] = {
        practiced: true,
        practiceCount: 0,
        lastPracticed: null
      };
    }
    
    this.progress.strokes[strokeId].practiceCount++;
    this.progress.strokes[strokeId].lastPracticed = new Date().toISOString();
    this.progress.stats.totalStrokesPracticed++;
    this.saveProgress();
  }
  
  // Đánh dấu bộ thủ đã học
  markRadicalLearned(radicalId) {
    if (!this.progress.radicals[radicalId]) {
      this.progress.radicals[radicalId] = {
        learned: true,
        learnedAt: new Date().toISOString()
      };
    }
    this.saveProgress();
  }
  
  // Lưu kết quả quiz
  saveQuizResult(quizId, result) {
    if (!this.progress.quizzes[quizId]) {
      this.progress.quizzes[quizId] = [];
    }
    
    this.progress.quizzes[quizId].push({
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      completedAt: new Date().toISOString()
    });
    
    this.progress.stats.totalQuizzesCompleted++;
    this.saveProgress();
  }
  
  // Cập nhật thời gian học
  updateStudyTime(minutes) {
    this.progress.stats.totalTimeSpent += minutes;
    this.updateStreak();
    this.saveProgress();
  }
  
  // Cập nhật streak (số ngày học liên tiếp)
  updateStreak() {
    const today = new Date().toDateString();
    const lastDate = this.progress.stats.lastStudyDate;
    
    if (!lastDate) {
      this.progress.stats.streak = 1;
    } else {
      const lastDateStr = new Date(lastDate).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (today === lastDateStr) {
        // Đã học hôm nay, giữ nguyên streak
        return;
      } else if (lastDateStr === yesterday) {
        // Học hôm qua, tăng streak
        this.progress.stats.streak++;
      } else {
        // Bỏ lỡ ngày, reset streak
        this.progress.stats.streak = 1;
      }
    }
    
    this.progress.stats.lastStudyDate = new Date().toISOString();
  }
  
  // Lấy tiến độ bài học
  getLessonProgress(lessonId) {
    return this.progress.lessons[lessonId] || null;
  }
  
  // Lấy tiến độ chữ
  getCharacterProgress(hanzi) {
    return this.progress.characters[hanzi] || null;
  }
  
  // Lấy thống kê tổng quan
  getStats() {
    return {
      ...this.progress.stats,
      lessonsCompleted: Object.keys(this.progress.lessons).filter(
        id => this.progress.lessons[id].completed
      ).length,
      charactersLearned: Object.keys(this.progress.characters).length,
      strokesPracticed: Object.keys(this.progress.strokes).length,
      radicalsLearned: Object.keys(this.progress.radicals).length
    };
  }
  
  // Lấy các chữ cần ôn tập (mastery thấp hoặc chưa luyện lâu)
  getReviewCharacters(limit = 10) {
    const now = Date.now();
    const reviewChars = [];
    
    Object.entries(this.progress.characters).forEach(([hanzi, data]) => {
      const daysSincePractice = data.lastPracticed
        ? (now - new Date(data.lastPracticed).getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;
      
      if (data.mastery < 80 || daysSincePractice > 7) {
        reviewChars.push({
          hanzi,
          ...data,
          daysSincePractice
        });
      }
    });
    
    // Sắp xếp theo độ ưu tiên
    reviewChars.sort((a, b) => {
      if (a.mastery !== b.mastery) return a.mastery - b.mastery;
      return b.daysSincePractice - a.daysSincePractice;
    });
    
    return reviewChars.slice(0, limit);
  }
  
  // Reset toàn bộ tiến độ
  reset() {
    this.progress = {
      lessons: {},
      characters: {},
      strokes: {},
      radicals: {},
      quizzes: {},
      stats: {
        totalCharactersLearned: 0,
        totalStrokesPracticed: 0,
        totalQuizzesCompleted: 0,
        totalTimeSpent: 0,
        streak: 0,
        lastStudyDate: null
      }
    };
    this.saveProgress();
  }
}

