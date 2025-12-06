// Main App Controller - Học Hán Cổ
import { CanvasWriter } from './modules/canvas-writer.js';
import { QuizEngine } from './modules/quiz-engine.js';
import { ProgressTracker } from './modules/progress-tracker.js';
import { basicStrokes } from './data/strokes.js';
import { radicals214 } from './data/radicals.js';
import { liushu } from './data/liushu.js';
import { lessons, getAllCharacters } from './data/characters.js';
import { showToast, debounce, isMobile } from './utils/helpers.js';

class HanCoApp {
  constructor() {
    this.currentPage = 'home';
    this.canvasWriter = null;
    this.quizEngine = new QuizEngine();
    this.progressTracker = new ProgressTracker();
    this.currentCharacter = null;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.loadPage(this.currentPage);
    this.setupCanvas();
    this.setupResizeHandler();
    
    // Listen for character completion
    document.addEventListener('characterComplete', (e) => {
      this.handleCharacterComplete(e.detail.character);
    });
  }
  
  setupEventListeners() {
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleSidebar());
    }
    
    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => this.toggleSidebar());
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => this.toggleSidebar());
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
          this.navigateToPage(page);
          this.toggleSidebar();
        }
      });
    });
    
    // Quick start button
    const startLessonBtn = document.querySelector('[data-action="start-lesson"]');
    if (startLessonBtn) {
      startLessonBtn.addEventListener('click', () => {
        this.navigateToPage('lesson1');
      });
    }
    
    // Practice controls
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.hidePracticeSection();
      });
    }
    
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.canvasWriter) {
          this.canvasWriter.clear();
        }
      });
    }
    
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (this.canvasWriter) {
          this.canvasWriter.undo();
        }
      });
    }
    
    const guideBtn = document.getElementById('guide-btn');
    if (guideBtn) {
      guideBtn.addEventListener('click', () => {
        if (this.canvasWriter) {
          this.canvasWriter.toggleGuide();
          guideBtn.classList.toggle('active');
        }
      });
    }
    
    const traceBtn = document.getElementById('trace-btn');
    if (traceBtn) {
      traceBtn.addEventListener('click', () => {
        if (this.canvasWriter) {
          const isTraceMode = this.canvasWriter.toggleTraceMode();
          traceBtn.classList.toggle('active', isTraceMode);
          if (isTraceMode) {
            showToast('Đã bật chế độ tô chữ! Tô theo đường nét mờ để dễ nhớ nhé! 🎨', 'info', 4000);
          } else {
            showToast('Đã tắt chế độ tô chữ', 'info');
          }
        }
      });
    }
    
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => {
        this.startQuiz();
      });
    }
    
    const showStrokeOrderBtn = document.getElementById('show-stroke-order-btn');
    if (showStrokeOrderBtn) {
      showStrokeOrderBtn.addEventListener('click', () => {
        this.showStrokeOrder();
      });
    }
  }
  
  setupCanvas() {
    const canvas = document.getElementById('practice-canvas');
    if (canvas) {
      this.canvasWriter = new CanvasWriter('practice-canvas', {
        showGrid: true,
        smoothing: true
      });
    }
  }
  
  setupResizeHandler() {
    const resizeHandler = debounce(() => {
      if (this.canvasWriter) {
        this.canvasWriter.handleResize();
      }
    }, 250);
    
    window.addEventListener('resize', resizeHandler);
  }
  
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar && overlay) {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    }
  }
  
  navigateToPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageId;
      this.loadPageContent(pageId);
    } else {
      console.warn(`Page ${pageId} not found`);
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });
  }
  
  loadPage(pageId) {
    this.navigateToPage(pageId);
  }
  
  loadPageContent(pageId) {
    switch (pageId) {
      case 'home':
        // Home page already loaded
        break;
      case 'lesson1':
        this.loadLesson1();
        break;
      case 'lesson2':
        this.loadLesson2();
        break;
      case 'lesson3':
        this.loadLesson3();
        break;
      case 'lesson4':
        this.loadLesson4();
        break;
      case 'review':
        this.loadReview();
        break;
      case 'stats':
        this.loadStats();
        break;
    }
  }
  
  // Lesson 1: Các Nét Căn Bản
  loadLesson1() {
    const content = document.getElementById('lesson1-content');
    if (!content) return;
    
    content.innerHTML = '';
    
    const lesson = lessons.lesson1;
    lesson.sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'section';
      sectionDiv.innerHTML = `
        <h3>${section.name}</h3>
        <div class="stroke-list">
          ${section.characters.map(char => this.renderCharacterCard(char)).join('')}
        </div>
      `;
      content.appendChild(sectionDiv);
    });
    
    // Add quiz button
    const quizBtn = document.createElement('button');
    quizBtn.className = 'btn btn-primary';
    quizBtn.textContent = '🎯 Quiz nét căn bản';
    quizBtn.style.marginTop = 'var(--spacing-xl)';
    quizBtn.addEventListener('click', () => {
      this.startStrokeQuiz();
    });
    content.appendChild(quizBtn);
    
    // Attach character click handlers
    this.attachCharacterHandlers();
  }
  
  // Lesson 2: Bút Thuận
  loadLesson2() {
    const content = document.getElementById('lesson2-content');
    if (!content) return;
    
    content.innerHTML = '';
    
    const lesson = lessons.lesson2;
    lesson.rules.forEach(rule => {
      const ruleDiv = document.createElement('div');
      ruleDiv.className = 'card';
      ruleDiv.innerHTML = `
        <div class="card-header">
          <h3>${rule.name}</h3>
          <span class="badge">${rule.hanzi}</span>
        </div>
        <div class="card-body">
          <p>${rule.description}</p>
          <div class="rule-examples">
            <h4>Ví dụ:</h4>
            ${rule.examples.map(ex => `
              <div class="example-item">
                <span class="hanzi-large">${ex.char}</span>
                <span>${ex.hanViet}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      content.appendChild(ruleDiv);
    });
  }
  
  // Lesson 3: 214 Bộ Thủ
  loadLesson3() {
    const content = document.getElementById('lesson3-content');
    if (!content) return;
    
    content.innerHTML = '';
    
    // Group by stroke count
    const groups = {};
    radicals214.forEach(radical => {
      if (!groups[radical.strokes]) {
        groups[radical.strokes] = [];
      }
      groups[radical.strokes].push(radical);
    });
    
    Object.keys(groups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(strokeCount => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'radical-group';
      groupDiv.innerHTML = `
        <h3>${strokeCount} nét (${groups[strokeCount].length} bộ)</h3>
        <div class="radical-list">
          ${groups[strokeCount].map(radical => this.renderRadicalCard(radical)).join('')}
        </div>
      `;
      content.appendChild(groupDiv);
    });
  }
  
  // Lesson 4: Lục Thư
  loadLesson4() {
    const content = document.getElementById('lesson4-content');
    if (!content) return;
    
    content.innerHTML = '';
    
    liushu.forEach(type => {
      const typeDiv = document.createElement('div');
      typeDiv.className = 'card';
      typeDiv.innerHTML = `
        <div class="card-header">
          <h3>${type.name} (${type.hanzi})</h3>
        </div>
        <div class="card-body">
          <p><strong>Mô tả:</strong> ${type.description}</p>
          <p>${type.explanation}</p>
          <div class="liushu-examples">
            <h4>Ví dụ:</h4>
            ${type.examples.slice(0, 4).map(ex => `
              <div class="example-item">
                <span class="hanzi-large">${ex.char}</span>
                <div>
                  <strong>${ex.hanViet}</strong> - ${ex.meaning}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      content.appendChild(typeDiv);
    });
  }
  
  // Review Page
  loadReview() {
    const content = document.getElementById('review-content');
    if (!content) return;
    
    const reviewChars = this.progressTracker.getReviewCharacters(20);
    
    content.innerHTML = `
      <div class="review-header">
        <h3>Chữ cần ôn tập (${reviewChars.length})</h3>
      </div>
      <div class="character-list">
        ${reviewChars.map(char => this.renderCharacterCard({
          hanzi: char.hanzi,
          hanViet: char.hanViet || '',
          meaning: '',
          mastery: char.mastery
        })).join('')}
      </div>
    `;
    
    this.attachCharacterHandlers();
  }
  
  // Stats Page
  loadStats() {
    const content = document.getElementById('stats-content');
    if (!content) return;
    
    const stats = this.progressTracker.getStats();
    
    content.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.charactersLearned}</div>
          <div class="stat-label">Chữ đã học</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalStrokesPracticed}</div>
          <div class="stat-label">Nét đã luyện</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalQuizzesCompleted}</div>
          <div class="stat-label">Quiz hoàn thành</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.streak}</div>
          <div class="stat-label">Ngày học liên tiếp</div>
        </div>
      </div>
    `;
  }
  
  // Render helpers
  renderCharacterCard(char) {
    return `
      <div class="character-item" data-hanzi="${char.hanzi}">
        <div class="character-header">
          <div class="character-hanzi">${char.hanzi}</div>
          <div class="character-details">
            <h4>${char.hanViet || ''}</h4>
            <div class="character-meta">
              <span>${char.pinyin || ''}</span>
              <span>${char.meaning || ''}</span>
            </div>
          </div>
        </div>
        ${char.compounds ? `
          <div class="character-compounds">
            ${char.compounds.map(c => `<span class="compound-item">${c}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
  
  renderRadicalCard(radical) {
    return `
      <div class="radical-item" data-radical-id="${radical.id}">
        <div class="radical-char">${radical.radical}</div>
        <div class="radical-info">
          <h4>${radical.hanViet}</h4>
          <p class="radical-meaning">${radical.meaning}</p>
          <div class="radical-examples">
            ${radical.examples.slice(0, 5).map(ex => `<span class="radical-example">${ex}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  attachCharacterHandlers() {
    const characterItems = document.querySelectorAll('.character-item');
    characterItems.forEach(item => {
      item.addEventListener('click', () => {
        const hanzi = item.dataset.hanzi;
        this.startPractice(hanzi);
      });
    });
  }
  
  startPractice(hanzi) {
    // Find character data
    const allChars = getAllCharacters();
    const char = allChars.find(c => c.hanzi === hanzi) || {
      hanzi,
      hanViet: '',
      pinyin: '',
      meaning: ''
    };
    
    this.currentCharacter = char;
    
    // Update display
    document.getElementById('hanzi-display').textContent = char.hanzi;
    document.getElementById('hanviet-display').textContent = char.hanViet || '';
    document.getElementById('pinyin-display').textContent = char.pinyin || '';
    document.getElementById('meaning-display').textContent = char.meaning || '';
    document.getElementById('practice-title').textContent = `Luyện viết: ${char.hanzi}`;
    
    // Load character in canvas
    if (this.canvasWriter) {
      this.canvasWriter.loadCharacter(hanzi, { showGuide: false, traceMode: false });
    }
    
    // Reset trace button state
    const traceBtn = document.getElementById('trace-btn');
    if (traceBtn) {
      traceBtn.classList.remove('active');
    }
    
    // Show practice section
    const practiceSection = document.getElementById('practice-section');
    if (practiceSection) {
      practiceSection.style.display = 'block';
      setTimeout(() => {
        practiceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    
    // Hide current page
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
      currentPage.classList.remove('active');
    }
    
    // Show helpful tip
    showToast('💡 Mẹo: Bấm nút "Tô chữ" để xem đường nét mờ và tô theo!', 'info', 5000);
  }
  
  hidePracticeSection() {
    const practiceSection = document.getElementById('practice-section');
    if (practiceSection) {
      practiceSection.style.display = 'none';
    }
    
    // Show current page
    const currentPage = document.getElementById(`page-${this.currentPage}`);
    if (currentPage) {
      currentPage.classList.add('active');
    }
  }
  
  startQuiz() {
    if (!this.currentCharacter) {
      showToast('Vui lòng chọn chữ để luyện tập', 'warning');
      return;
    }
    
    if (this.canvasWriter) {
      this.canvasWriter.startQuiz(
        (strokeData) => {
          showToast('Sai nét! Hãy thử lại', 'error');
        },
        (strokeData, index) => {
          showToast(`Đúng! Nét ${index}`, 'success');
        },
        (summaryData) => {
          showToast('Hoàn thành! Xuất sắc!', 'success');
          if (this.currentCharacter) {
            this.progressTracker.markCharacterLearned(this.currentCharacter.hanzi, {
              mastery: 100
            });
          }
        }
      );
    }
  }
  
  showStrokeOrder() {
    if (!this.currentCharacter) return;
    
    if (this.canvasWriter) {
      this.canvasWriter.loadCharacter(this.currentCharacter.hanzi, { showGuide: true });
      const guideBtn = document.getElementById('guide-btn');
      if (guideBtn) {
        guideBtn.classList.add('active');
      }
      showToast('Đã hiển thị hướng dẫn thứ tự nét! ✨', 'info', 3000);
    }
  }
  
  startStrokeQuiz() {
    const allChars = getAllCharacters();
    const quiz = this.quizEngine.createQuiz('stroke-order', allChars.slice(0, 10), { count: 5 });
    
    if (quiz && quiz.questions.length > 0) {
      const firstQuestion = quiz.questions[0];
      this.startPractice(firstQuestion.character);
      showToast('Bắt đầu quiz! Vẽ chữ theo thứ tự nét', 'info');
    }
  }
  
  handleCharacterComplete(character) {
    const celebration = document.getElementById('celebration');
    if (celebration) {
      celebration.style.display = 'block';
      setTimeout(() => {
        celebration.style.display = 'none';
      }, 2000);
    }
    
    if (this.currentCharacter) {
      this.progressTracker.markCharacterLearned(this.currentCharacter.hanzi, {
        mastery: 100
      });
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new HanCoApp();
  });
} else {
  window.app = new HanCoApp();
}

