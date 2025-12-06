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
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    // Wait for canvas to be visible
    const checkVisibility = () => {
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('Canvas not visible yet, retrying...');
        setTimeout(checkVisibility, 100);
        return;
      }
      
      // Responsive canvas với devicePixelRatio
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.min(rect.width, 400);
      const displayHeight = displayWidth; // Square
      
      // Set canvas internal size
      this.canvas.width = displayWidth * dpr;
      this.canvas.height = displayHeight * dpr;
      this.ctx.scale(dpr, dpr);
      
      // Set canvas display size
      this.canvas.style.width = displayWidth + 'px';
      this.canvas.style.height = displayHeight + 'px';
      
      console.log('Canvas initialized:', {
        width: this.canvas.width,
        height: this.canvas.height,
        displayWidth,
        displayHeight,
        dpr
      });
      
      // Initialize trace overlay canvas
      if (this.traceCanvas && this.traceCtx) {
        this.traceCanvas.width = displayWidth * dpr;
        this.traceCanvas.height = displayHeight * dpr;
        this.traceCtx.scale(dpr, dpr);
        this.traceCanvas.style.width = displayWidth + 'px';
        this.traceCanvas.style.height = displayHeight + 'px';
      }
      
      // Clear canvas
      this.ctx.clearRect(0, 0, displayWidth, displayHeight);
      if (this.traceCtx) {
        this.traceCtx.clearRect(0, 0, displayWidth, displayHeight);
      }
      
      if (this.options.showGrid) {
        this.drawGrid();
      }
    };
    
    // Check immediately and retry if needed
    setTimeout(checkVisibility, 50);
  }
  
  drawGrid() {
    if (!this.canvas || !this.ctx) return;
    
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
  
  // Hiển thị outline để tô - Luôn dùng fallback để đảm bảo hoạt động
  showTraceOutline() {
    if (!this.targetCharacter) {
      console.warn('No character to trace');
      return;
    }
    
    console.log('Showing trace outline for:', this.targetCharacter);
    
    // Clear main canvas (user drawing)
    this.clear();
    
    // Always use alternative method for reliability
    // Hanzi Writer's showOutline can be unreliable
    this.showOutlineAlternative();
    
    // Also try Hanzi Writer if available (as backup)
    if (this.hanziWriter) {
      try {
        // Try to show outline via Hanzi Writer
        if (typeof this.hanziWriter.showOutline === 'function') {
          this.hanziWriter.showOutline({
            onComplete: () => {
              console.log('Hanzi Writer outline shown');
            },
            onError: (err) => {
              console.warn('Hanzi Writer outline failed, using fallback:', err);
            }
          });
        }
      } catch (error) {
        console.warn('Hanzi Writer error:', error);
      }
    }
  }
  
  // Alternative method to show outline - Vẽ outline rõ ràng trên trace canvas
  showOutlineAlternative() {
    console.log('Using alternative outline method for:', this.targetCharacter);
    if (!this.targetCharacter) return;
    
    // Always use trace overlay canvas for outline
    if (!this.traceCanvas || !this.traceCtx) {
      console.warn('Trace canvas not available, using main canvas');
      this.drawOutlineOnMainCanvas();
      return;
    }
    
    // Clear trace canvas first
    const traceSize = this.traceCanvas.width / (window.devicePixelRatio || 1);
    this.traceCtx.clearRect(0, 0, traceSize, traceSize);
    
    const centerX = traceSize / 2;
    const centerY = traceSize / 2;
    const fontSize = traceSize * 0.55;
    
    this.traceCtx.save();
    
    // Try to use a Chinese font, fallback to Arial
    this.traceCtx.font = `bold ${fontSize}px "Microsoft YaHei", "SimSun", "STKaiti", "KaiTi", Arial, sans-serif`;
    this.traceCtx.textAlign = 'center';
    this.traceCtx.textBaseline = 'middle';
    
    // Draw multiple strokes to create outline effect
    // Stroke 1: Outer stroke (thick, darker)
    this.traceCtx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
    this.traceCtx.lineWidth = 8;
    this.traceCtx.lineJoin = 'round';
    this.traceCtx.lineCap = 'round';
    this.traceCtx.strokeText(this.targetCharacter, centerX, centerY);
    
    // Stroke 2: Inner stroke (medium)
    this.traceCtx.strokeStyle = 'rgba(139, 69, 19, 0.6)';
    this.traceCtx.lineWidth = 5;
    this.traceCtx.strokeText(this.targetCharacter, centerX, centerY);
    
    // Fill: Light fill for visibility
    this.traceCtx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    this.traceCtx.fillText(this.targetCharacter, centerX, centerY);
    
    this.traceCtx.restore();
    
    // Show trace overlay
    this.traceCanvas.classList.add('active');
    this.traceCanvas.style.opacity = '1';
    
    // Redraw grid on main canvas
    if (this.options.showGrid) {
      this.drawGrid();
    }
    
    console.log('Alternative outline drawn on trace canvas - should be visible now');
  }
  
  // Draw outline on main canvas if trace canvas not available
  drawOutlineOnMainCanvas() {
    if (!this.targetCharacter || !this.ctx) return;
    
    const size = this.canvas.width / (window.devicePixelRatio || 1);
    const centerX = size / 2;
    const centerY = size / 2;
    const fontSize = size * 0.55;
    
    this.ctx.save();
    this.ctx.font = `bold ${fontSize}px "Microsoft YaHei", "SimSun", Arial, sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Draw outline
    this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.7)';
    this.ctx.lineWidth = 6;
    this.ctx.lineJoin = 'round';
    this.ctx.strokeText(this.targetCharacter, centerX, centerY);
    
    // Draw fill
    this.ctx.fillStyle = 'rgba(139, 69, 19, 0.25)';
    this.ctx.fillText(this.targetCharacter, centerX, centerY);
    
    this.ctx.restore();
    
    if (this.options.showGrid) {
      this.drawGrid();
    }
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
    if (!this.canvas || !this.ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.width / dpr;
    const height = this.canvas.height / dpr;
    
    // Clear main canvas (user drawing)
    this.ctx.clearRect(0, 0, width, height);
    this.allStrokes = [];
    this.currentStroke = [];
    
    // Don't clear trace canvas - keep outline visible
    // Only clear trace canvas when switching modes
    
    // Redraw grid
    if (this.options.showGrid) {
      this.drawGrid();
    }
  }
  
  // Clear everything including trace
  clearAll() {
    this.clear();
    if (this.traceCanvas && this.traceCtx) {
      const dpr = window.devicePixelRatio || 1;
      const width = this.traceCanvas.width / dpr;
      const height = this.traceCanvas.height / dpr;
      this.traceCtx.clearRect(0, 0, width, height);
      this.traceCanvas.classList.remove('active');
      this.traceCanvas.style.opacity = '0';
    }
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

