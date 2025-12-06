// Main App Controller - Học Hán Cổ
import { CanvasWriter } from './modules/canvas-writer.js';
import { QuizEngine } from './modules/quiz-engine.js';
import { ProgressTracker } from './modules/progress-tracker.js';
import { AudioReader } from './modules/audio-reader.js';
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
    this.audioReader = new AudioReader();
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
    
    // Practice mode buttons
    const modeFreeBtn = document.getElementById('mode-free-btn');
    const modeTraceBtn = document.getElementById('mode-trace-btn');
    const modeQuizBtn = document.getElementById('mode-quiz-btn');
    
    if (modeFreeBtn) {
      modeFreeBtn.addEventListener('click', () => this.switchPracticeMode('free'));
    }
    
    if (modeTraceBtn) {
      modeTraceBtn.addEventListener('click', () => this.switchPracticeMode('trace'));
    }
    
    if (modeQuizBtn) {
      modeQuizBtn.addEventListener('click', () => this.switchPracticeMode('quiz'));
    }
    
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => {
        this.startQuiz();
      });
    }
    
    const animateStrokeBtn = document.getElementById('animate-stroke-btn');
    if (animateStrokeBtn) {
      animateStrokeBtn.addEventListener('click', () => {
        this.animateStrokeOrder();
      });
    }
    
    // Audio buttons
    const speakHanVietBtn = document.getElementById('speak-hanviet-btn');
    if (speakHanVietBtn) {
      speakHanVietBtn.addEventListener('click', () => {
        if (this.currentCharacter && this.currentCharacter.hanViet) {
          this.audioReader.speakHanViet(this.currentCharacter.hanViet);
        }
      });
    }
    
    const speakPinyinBtn = document.getElementById('speak-pinyin-btn');
    if (speakPinyinBtn) {
      speakPinyinBtn.addEventListener('click', () => {
        if (this.currentCharacter && this.currentCharacter.pinyin) {
          this.audioReader.speakPinyin(this.currentCharacter.pinyin);
        }
      });
    }
    
    const speakMeaningBtn = document.getElementById('speak-meaning-btn');
    if (speakMeaningBtn) {
      speakMeaningBtn.addEventListener('click', () => {
        if (this.currentCharacter && this.currentCharacter.meaning) {
          this.audioReader.speakVietnamese(this.currentCharacter.meaning);
        }
      });
    }
    
    const speakAllBtn = document.getElementById('speak-all-btn');
    if (speakAllBtn) {
      speakAllBtn.addEventListener('click', () => {
        if (this.currentCharacter) {
          this.audioReader.speakCharacter(this.currentCharacter);
        }
      });
    }
  }
  
  setupCanvas() {
    // Don't setup canvas immediately - wait until practice section is shown
    // Canvas will be initialized when startPractice is called
    console.log('Canvas setup deferred until practice section is shown');
  }
  
  initCanvas() {
    const canvas = document.getElementById('practice-canvas');
    if (canvas && !this.canvasWriter) {
      console.log('Initializing canvas writer...');
      this.canvasWriter = new CanvasWriter('practice-canvas', {
        showGrid: true,
        smoothing: true
      });
      console.log('Canvas writer initialized:', this.canvasWriter);
    } else if (this.canvasWriter) {
      console.log('Canvas writer already initialized');
    } else {
      console.warn('Canvas element not found');
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
    
    // Initialize canvas if not already done
    if (!this.canvasWriter) {
      this.initCanvas();
    }
    
    // Wait for canvas to be ready and visible
    setTimeout(() => {
      if (this.canvasWriter) {
        this.canvasWriter.loadCharacter(hanzi, { showGuide: false, traceMode: false });
        // Update canvas label
        const canvasLabel = document.getElementById('canvas-label');
        if (canvasLabel) {
          canvasLabel.textContent = 'Vẽ chữ ở đây';
        }
      } else {
        console.error('Canvas writer failed to initialize');
        showToast('Lỗi khởi tạo canvas. Vui lòng reload trang.', 'error');
      }
    }, 200);
    
    // Reset trace button state
    const traceBtn = document.getElementById('trace-btn');
    if (traceBtn) {
      traceBtn.classList.remove('active');
    }
    
    // Auto read character info
    setTimeout(() => {
      if (this.audioReader && char.hanViet) {
        this.audioReader.speakCharacter(char);
      }
    }, 800);
    
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
  
  animateStrokeOrder() {
    if (!this.currentCharacter) {
      showToast('Vui lòng chọn chữ để xem thứ tự nét', 'warning');
      return;
    }
    
    if (this.canvasWriter) {
      // Load character first
      this.canvasWriter.loadCharacter(this.currentCharacter.hanzi, { showGuide: false });
      
      // Wait a bit then animate
      setTimeout(() => {
        this.canvasWriter.animateStrokeOrder(1, () => {
          showToast('Đã xem xong thứ tự nét! Bây giờ bạn có thể viết theo! ✨', 'success', 4000);
        });
      }, 300);
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
  
  // Switch practice mode
  switchPracticeMode(mode) {
    // Update button states
    const modeButtons = document.querySelectorAll('.btn-mode');
    modeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update tips
    const tips = document.querySelectorAll('.tip-card');
    tips.forEach(tip => tip.style.display = 'none');
    const activeTip = document.getElementById(`tip-${mode}`);
    if (activeTip) {
      activeTip.style.display = 'block';
    }
    
    // Update canvas label
    const canvasLabel = document.getElementById('canvas-label');
    const canvasContainer = document.querySelector('.canvas-container');
    
    if (!this.currentCharacter) {
      showToast('Vui lòng chọn chữ để luyện tập', 'warning');
      return;
    }
    
    if (!this.canvasWriter) {
      showToast('Đang khởi tạo canvas...', 'info');
      setTimeout(() => this.switchPracticeMode(mode), 500);
      return;
    }
    
    switch(mode) {
      case 'free':
        // Free mode - clear and ready to draw
        if (this.canvasWriter) {
          this.canvasWriter.clearAll(); // Clear trace too
          this.canvasWriter.loadCharacter(this.currentCharacter.hanzi, { traceMode: false });
          
          // Hide trace canvas
          const traceCanvas = document.getElementById('trace-overlay-canvas');
          if (traceCanvas) {
            traceCanvas.classList.remove('active');
            traceCanvas.style.opacity = '0';
          }
        }
        if (canvasLabel) {
          canvasLabel.textContent = 'Vẽ chữ tự do ở đây';
          canvasLabel.style.opacity = '0.5';
        }
        if (canvasContainer) canvasContainer.classList.remove('has-content');
        showToast('Chế độ Tự do: Vẽ chữ tự do trên canvas', 'info', 3000);
        break;
        
      case 'trace':
        // Trace mode - show outline
        if (this.canvasWriter) {
          // Clear everything first
          this.canvasWriter.clearAll();
          
          // Load character
          this.canvasWriter.loadCharacter(this.currentCharacter.hanzi, { traceMode: true });
          
          // Show outline after a delay to ensure canvas is ready
          setTimeout(() => {
            if (this.canvasWriter) {
              console.log('Showing trace outline...');
              this.canvasWriter.showTraceOutline();
              
              // Ensure trace canvas is visible
              const traceCanvas = document.getElementById('trace-overlay-canvas');
              if (traceCanvas) {
                traceCanvas.classList.add('active');
                traceCanvas.style.opacity = '1';
                traceCanvas.style.display = 'block';
                console.log('Trace canvas activated');
              }
            }
          }, 500);
        }
        if (canvasLabel) {
          canvasLabel.textContent = 'Tô theo đường nét mờ';
          canvasLabel.style.opacity = '0.3';
        }
        if (canvasContainer) canvasContainer.classList.add('has-content');
        showToast('✨ Chế độ Tô chữ: Tô theo đường nét mờ để luyện tập! 🎨', 'success', 5000);
        break;
        
      case 'quiz':
        // Quiz mode
        this.startQuiz();
        if (canvasLabel) canvasLabel.textContent = 'Vẽ theo thứ tự nét';
        if (canvasContainer) canvasContainer.classList.add('has-content');
        showToast('Chế độ Quiz: Vẽ chữ theo đúng thứ tự nét!', 'info', 3000);
        break;
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

