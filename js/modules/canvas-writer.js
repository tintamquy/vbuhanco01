// Canvas Writer Module - Vẽ chữ Hán với touch optimization
export class CanvasWriter {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas với id "${canvasId}" không tìm thấy`);
      return;
    }
    
    // Get trace overlay canvas
    this.traceCanvas = document.getElementById('trace-overlay-canvas');
    this.traceCtx = this.traceCanvas ? this.traceCanvas.getContext('2d') : null;
    
    this.ctx = this.canvas.getContext('2d');
    
    // Touch optimization - ngăn scroll khi vẽ
    this.canvas.style.touchAction = 'none';
    
    this.options = {
      strokeWidth: 12, // Tăng độ dày nét cho dễ nhìn
      strokeColor: '#2C1810',
      guideColor: 'rgba(139, 69, 19, 0.3)',
      correctColor: '#4CAF50',
      wrongColor: '#F44336',
      showGrid: true,
      smoothing: true,
      showGuide: false,
      traceMode: false, // Chế độ tô chữ
      ...options
    };
    
    this.isDrawing = false;
    this.currentStroke = [];
    this.allStrokes = [];
    this.targetCharacter = null;
    this.hanziWriter = null; // Fix typo
    this.quizMode = false;
    this.currentStrokeIndex = 0;
    this.traceMode = false;
    
    this.initCanvas();
    this.bindEvents();
  }
  
  initCanvas() {
    // Responsive canvas với devicePixelRatio
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    // Set canvas display size
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    // Initialize trace overlay canvas
    if (this.traceCanvas && this.traceCtx) {
      this.traceCanvas.width = rect.width * dpr;
      this.traceCanvas.height = rect.height * dpr;
      this.traceCtx.scale(dpr, dpr);
      this.traceCanvas.style.width = rect.width + 'px';
      this.traceCanvas.style.height = rect.height + 'px';
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    if (this.traceCtx) {
      this.traceCtx.clearRect(0, 0, this.traceCanvas.width / dpr, this.traceCanvas.height / dpr);
    }
    
    if (this.options.showGrid) {
      this.drawGrid();
    }
  }
  
  drawGrid() {
    const size = this.canvas.width / (window.devicePixelRatio || 1);
    const ctx = this.ctx;
    
    ctx.save();
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    
    // Diagonal lines (faint)
    ctx.strokeStyle = '#F0F0F0';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.stroke();
    
    ctx.restore();
  }
  
  bindEvents() {
    // Touch events với passive: false để preventDefault
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleStart(this.getTouchPos(e));
    }, { passive: false });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.handleMove(this.getTouchPos(e));
    }, { passive: false });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.handleEnd();
    }, { passive: false });
    
    // Mouse events (for desktop testing)
    this.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.handleStart(this.getMousePos(e));
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDrawing) {
        e.preventDefault();
        this.handleMove(this.getMousePos(e));
      }
    });
    
    this.canvas.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.handleEnd();
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      if (this.isDrawing) {
        this.handleEnd();
      }
    });
  }
  
  getTouchPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : null);
    if (!touch) return null;
    
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (touch.clientX - rect.left) * (rect.width / (this.canvas.width / dpr)),
      y: (touch.clientY - rect.top) * (rect.height / (this.canvas.height / dpr))
    };
  }
  
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (e.clientX - rect.left) * (rect.width / (this.canvas.width / dpr)),
      y: (e.clientY - rect.top) * (rect.height / (this.canvas.height / dpr))
    };
  }
  
  handleStart(pos) {
    if (!pos) return;
    this.isDrawing = true;
    this.currentStroke = [pos];
    this.drawPoint(pos);
  }
  
  handleMove(pos) {
    if (!this.isDrawing || !pos) return;
    
    this.currentStroke.push(pos);
    this.drawStroke(this.currentStroke);
  }
  
  handleEnd() {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    
    // Smooth stroke nếu bật
    if (this.options.smoothing && this.currentStroke.length > 2) {
      this.currentStroke = this.smoothStroke(this.currentStroke);
    }
    
    // Lưu stroke
    this.allStrokes.push([...this.currentStroke]);
    
    // Check stroke nếu đang ở quiz mode
    if (this.quizMode && this.hanziWriter) {
      // Hanzi Writer sẽ tự động check
    }
    
    this.currentStroke = [];
  }
  
  drawPoint(pos) {
    const ctx = this.ctx;
    ctx.fillStyle = this.options.strokeColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.options.strokeWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawStroke(stroke) {
    if (stroke.length < 2) return;
    
    const ctx = this.ctx;
    ctx.strokeStyle = this.options.strokeColor;
    ctx.lineWidth = this.options.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    
    ctx.stroke();
  }
  
  smoothStroke(stroke) {
    // Simple averaging smoothing
    if (stroke.length < 3) return stroke;
    
    const smoothed = [stroke[0]];
    
    for (let i = 1; i < stroke.length - 1; i++) {
      smoothed.push({
        x: (stroke[i - 1].x + stroke[i].x + stroke[i + 1].x) / 3,
        y: (stroke[i - 1].y + stroke[i].y + stroke[i + 1].y) / 3
      });
    }
    
    smoothed.push(stroke[stroke.length - 1]);
    return smoothed;
  }
  
  loadCharacter(hanzi, options = {}) {
    this.targetCharacter = hanzi;
    this.quizMode = options.quizMode || false;
    this.traceMode = options.traceMode || false;
    
    // Clear canvas
    this.clear();
    
    // Load Hanzi Writer
    if (typeof HanziWriter !== 'undefined') {
      const rect = this.canvas.getBoundingClientRect();
      
      // Destroy existing instance if any
      if (this.hanziWriter) {
        try {
          if (this.hanziWriter.destroy) {
            this.hanziWriter.destroy();
          }
        } catch (e) {
          console.warn('Error destroying hanzi writer:', e);
        }
        this.hanziWriter = null;
      }
      
      // Wait a bit for canvas to be ready
      setTimeout(() => {
        try {
          this.hanziWriter = HanziWriter.create(this.canvas, hanzi, {
            width: rect.width,
            height: rect.height,
            padding: 20,
            showOutline: false, // Don't show by default
            showCharacter: false,
            strokeColor: this.options.guideColor,
            outlineColor: 'rgba(139, 69, 19, 0.6)', // Rõ hơn cho trace
            radicalColor: this.options.guideColor,
            strokeWidth: 3,
            strokeAnimationSpeed: 2
          });
          
          console.log('Hanzi Writer created for:', hanzi);
          
          // Nếu trace mode, hiển thị outline ngay
          if (this.traceMode && this.hanziWriter) {
            setTimeout(() => {
              this.showTraceOutline();
            }, 100);
          }
        } catch (error) {
          console.error('Error creating Hanzi Writer:', error);
          // Fallback: draw simple outline
          this.drawSimpleOutline(hanzi);
        }
      }, 50);
      
      return this.hanziWriter;
    } else {
      console.warn('Hanzi Writer chưa được load, sử dụng fallback');
      // Fallback: draw simple outline
      this.drawSimpleOutline(hanzi);
      return null;
    }
  }
  
  // Fallback: Vẽ outline đơn giản nếu Hanzi Writer không hoạt động
  drawSimpleOutline(hanzi) {
    const ctx = this.ctx;
    const size = this.canvas.width / (window.devicePixelRatio || 1);
    const centerX = size / 2;
    const centerY = size / 2;
    const fontSize = size * 0.6;
    
    ctx.save();
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(139, 69, 19, 0.15)';
    ctx.fillText(hanzi, centerX, centerY);
    ctx.restore();
    
    console.log('Drew simple outline for:', hanzi);
  }
  
  // Xem thứ tự nét với animation
  animateStrokeOrder(speed = 1, onComplete) {
    if (!this.hanziWriter) {
      console.warn('Hanzi Writer chưa được load');
      return;
    }
    
    // Clear user strokes
    this.clear();
    
    // Animate stroke order
    this.hanziWriter.animateCharacter({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }
  
  // Hiển thị outline để tô
  showTraceOutline() {
    if (!this.targetCharacter) {
      console.warn('No character to trace');
      return;
    }
    
    // Clear canvas first
    this.clear();
    
    if (this.hanziWriter) {
      try {
        // Method 1: Try showOutline
        if (typeof this.hanziWriter.showOutline === 'function') {
          this.hanziWriter.showOutline({
            onComplete: () => {
              console.log('Outline shown via showOutline');
              if (this.options.showGrid) {
                this.drawGrid();
              }
            },
            onError: (err) => {
              console.warn('showOutline error, trying alternative:', err);
              this.showOutlineAlternative();
            }
          });
        } else {
          // Method 2: Try setOptions and show
          this.hanziWriter.setOptions({
            showOutline: true,
            outlineColor: 'rgba(139, 69, 19, 0.6)'
          });
          
          // Try to trigger outline display
          if (typeof this.hanziWriter.show === 'function') {
            this.hanziWriter.show();
          }
          
          // Redraw grid
          if (this.options.showGrid) {
            this.drawGrid();
          }
        }
      } catch (error) {
        console.error('Error showing outline:', error);
        this.showOutlineAlternative();
      }
    } else {
      // Fallback
      this.showOutlineAlternative();
    }
  }
  
  // Alternative method to show outline
  showOutlineAlternative() {
    console.log('Using alternative outline method');
    if (!this.targetCharacter) return;
    
    // Draw on trace overlay canvas instead of main canvas
    const ctx = this.traceCtx || this.ctx;
    const canvas = this.traceCanvas || this.canvas;
    const size = canvas.width / (window.devicePixelRatio || 1);
    const centerX = size / 2;
    const centerY = size / 2;
    const fontSize = size * 0.5;
    
    ctx.save();
    ctx.font = `bold ${fontSize}px "Microsoft YaHei", "SimSun", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw outline (stroke) - darker for visibility
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeText(this.targetCharacter, centerX, centerY);
    
    // Draw fill (lighter)
    ctx.fillStyle = 'rgba(139, 69, 19, 0.25)';
    ctx.fillText(this.targetCharacter, centerX, centerY);
    
    ctx.restore();
    
    // Show trace overlay
    if (this.traceCanvas) {
      this.traceCanvas.classList.add('active');
    }
    
    // Redraw grid on main canvas
    if (this.options.showGrid) {
      this.drawGrid();
    }
    
    console.log('Alternative outline drawn on trace canvas');
  }
  
  // Bật/tắt chế độ tô chữ
  toggleTraceMode() {
    this.traceMode = !this.traceMode;
    
    if (this.targetCharacter) {
      if (this.traceMode) {
        // Bật trace mode - hiển thị outline
        this.loadCharacter(this.targetCharacter, { traceMode: true });
      } else {
        // Tắt trace mode - chỉ clear và reload
        this.clear();
        this.loadCharacter(this.targetCharacter, { traceMode: false });
      }
    }
    
    return this.traceMode;
  }
  
  startQuiz(onMistake, onCorrectStroke, onComplete) {
    this.clear();
    this.quizMode = true;
    this.currentStrokeIndex = 0;
    
    if (this.hanziWriter) {
      this.hanziWriter.quiz({
        onMistake: (strokeData) => {
          this.showFeedback(false);
          if (onMistake) onMistake(strokeData);
        },
        onCorrectStroke: (strokeData) => {
          this.showFeedback(true);
          this.currentStrokeIndex++;
          if (onCorrectStroke) onCorrectStroke(strokeData, this.currentStrokeIndex);
        },
        onComplete: (summaryData) => {
          this.showCompletionCelebration();
          this.quizMode = false;
          if (onComplete) onComplete(summaryData);
        }
      });
    }
  }
  
  showFeedback(isCorrect) {
    const rect = this.canvas.getBoundingClientRect();
    const size = this.canvas.width / (window.devicePixelRatio || 1);
    const color = isCorrect ? this.options.correctColor : this.options.wrongColor;
    
    // Visual feedback - border flash
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 6;
    this.ctx.strokeRect(5, 5, size - 10, size - 10);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(isCorrect ? 50 : 100);
    }
    
    // Reset sau 300ms
    setTimeout(() => {
      this.initCanvas();
      this.redrawStrokes();
    }, 300);
  }
  
  showCompletionCelebration() {
    // Trigger celebration event
    const event = new CustomEvent('characterComplete', {
      detail: { character: this.targetCharacter }
    });
    document.dispatchEvent(event);
  }
  
  toggleGuide() {
    this.options.showGuide = !this.options.showGuide;
    if (this.hanziWriter) {
      this.hanziWriter.setOptions({
        showOutline: this.options.showGuide
      });
      if (this.options.showGuide) {
        this.hanziWriter.showOutline();
      }
    }
    this.clear();
    this.redrawStrokes();
  }
  
  clear() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    this.allStrokes = [];
    this.currentStroke = [];
    this.initCanvas();
  }
  
  redrawStrokes() {
    this.allStrokes.forEach(stroke => {
      if (stroke.length > 0) {
        this.drawStroke(stroke);
      }
    });
  }
  
  undo() {
    if (this.allStrokes.length > 0) {
      this.allStrokes.pop();
      this.clear();
      this.redrawStrokes();
    }
  }
  
  getStrokeCount() {
    return this.allStrokes.length;
  }
  
  // Resize handler
  handleResize() {
    this.initCanvas();
    if (this.hanziWriter) {
      const rect = this.canvas.getBoundingClientRect();
      this.hanziWriter.setDimensions(rect.width, rect.height);
    }
    this.redrawStrokes();
  }
}

