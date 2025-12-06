// Helper Functions - Các hàm tiện ích
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format số với dấu phẩy
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format thời gian (phút) thành chuỗi
export function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} giờ`;
  }
  return `${hours} giờ ${mins} phút`;
}

// Format ngày tháng
export function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Tính số ngày giữa 2 ngày
export function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = typeof date1 === 'string' ? new Date(date1) : date1;
  const secondDate = typeof date2 === 'string' ? new Date(date2) : date2;
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// Tạo ID ngẫu nhiên
export function generateId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Kiểm tra xem có phải mobile không
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Kiểm tra xem có phải touch device không
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Scroll mượt đến element
export function scrollToElement(element, offset = 0) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Hiển thị toast notification
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove sau duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback cho browser cũ
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (e) {
    console.error('Lỗi copy:', e);
    return false;
  }
}

// Lazy load images
export function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Escape HTML
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Parse URL parameters
export function getUrlParams() {
  const params = {};
  const urlParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

// Set URL parameter
export function setUrlParam(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url);
}

