// Stroke Recognition Module - Nhận diện nét vẽ
export class StrokeRecognition {
  constructor() {
    this.tolerance = 0.3; // Độ lệch cho phép
  }
  
  // So sánh stroke vẽ với stroke mẫu
  compareStrokes(userStroke, templateStroke) {
    // Normalize strokes về cùng kích thước
    const normalizedUser = this.normalizeStroke(userStroke);
    const normalizedTemplate = this.normalizeStroke(templateStroke);
    
    // Tính độ tương đồng
    const similarity = this.calculateSimilarity(normalizedUser, normalizedTemplate);
    
    return similarity >= (1 - this.tolerance);
  }
  
  // Chuẩn hóa stroke về kích thước và vị trí chuẩn
  normalizeStroke(stroke) {
    if (stroke.length === 0) return [];
    
    // Tìm bounding box
    let minX = stroke[0].x;
    let maxX = stroke[0].x;
    let minY = stroke[0].y;
    let maxY = stroke[0].y;
    
    stroke.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
    
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;
    const size = Math.max(width, height) || 1;
    
    // Normalize về [0, 1]
    return stroke.map(point => ({
      x: (point.x - minX) / size,
      y: (point.y - minY) / size
    }));
  }
  
  // Tính độ tương đồng giữa 2 stroke
  calculateSimilarity(stroke1, stroke2) {
    if (stroke1.length === 0 || stroke2.length === 0) return 0;
    
    // Resample để có cùng số điểm
    const resampled1 = this.resample(stroke1, 50);
    const resampled2 = this.resample(stroke2, 50);
    
    // Tính tổng khoảng cách
    let totalDistance = 0;
    for (let i = 0; i < resampled1.length; i++) {
      const dx = resampled1[i].x - resampled2[i].x;
      const dy = resampled1[i].y - resampled2[i].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    
    // Chuyển đổi thành similarity (0-1)
    const avgDistance = totalDistance / resampled1.length;
    return Math.max(0, 1 - avgDistance);
  }
  
  // Resample stroke về số điểm cố định
  resample(stroke, numPoints) {
    if (stroke.length === 0) return [];
    if (stroke.length === 1) {
      return Array(numPoints).fill(stroke[0]);
    }
    
    // Tính tổng chiều dài
    let totalLength = 0;
    const lengths = [];
    for (let i = 1; i < stroke.length; i++) {
      const dx = stroke[i].x - stroke[i - 1].x;
      const dy = stroke[i].y - stroke[i - 1].y;
      const length = Math.sqrt(dx * dx + dy * dy);
      lengths.push(length);
      totalLength += length;
    }
    
    if (totalLength === 0) {
      return Array(numPoints).fill(stroke[0]);
    }
    
    // Resample
    const resampled = [stroke[0]];
    const interval = totalLength / (numPoints - 1);
    let currentLength = 0;
    let currentIndex = 0;
    
    for (let i = 1; i < numPoints - 1; i++) {
      const targetLength = i * interval;
      
      while (currentLength < targetLength && currentIndex < lengths.length - 1) {
        currentLength += lengths[currentIndex];
        currentIndex++;
      }
      
      if (currentIndex < stroke.length - 1) {
        const t = (targetLength - (currentLength - lengths[currentIndex - 1])) / lengths[currentIndex - 1];
        const x = stroke[currentIndex - 1].x + t * (stroke[currentIndex].x - stroke[currentIndex - 1].x);
        const y = stroke[currentIndex - 1].y + t * (stroke[currentIndex].y - stroke[currentIndex - 1].y);
        resampled.push({ x, y });
      }
    }
    
    resampled.push(stroke[stroke.length - 1]);
    return resampled;
  }
  
  // Nhận diện loại nét (căn bản)
  recognizeStrokeType(stroke) {
    if (stroke.length < 2) return null;
    
    const normalized = this.normalizeStroke(stroke);
    const start = normalized[0];
    const end = normalized[normalized.length - 1];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Nét ngang
    if (Math.abs(dy) < 0.2 && Math.abs(dx) > 0.5) {
      return 'héng'; // 一
    }
    
    // Nét sổ
    if (Math.abs(dx) < 0.2 && Math.abs(dy) > 0.5) {
      return 'shù'; // 丨
    }
    
    // Nét phẩy
    if (angle < -30 && angle > -150) {
      return 'piě'; // 丿
    }
    
    // Nét mác
    if (angle > 30 && angle < 150) {
      return 'nà'; // ㇏
    }
    
    // Nét điểm
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.3) {
      return 'diǎn'; // ㇀
    }
    
    return 'unknown';
  }
}

