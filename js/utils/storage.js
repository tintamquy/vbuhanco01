// Storage Utility - Wrapper cho localStorage với error handling
export class Storage {
  constructor(prefix = 'hanco_') {
    this.prefix = prefix;
    this.isAvailable = this.checkAvailability();
  }
  
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  getKey(key) {
    return this.prefix + key;
  }
  
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      console.warn('localStorage không khả dụng');
      return defaultValue;
    }
    
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.error('Lỗi đọc localStorage:', e);
      return defaultValue;
    }
  }
  
  set(key, value) {
    if (!this.isAvailable) {
      console.warn('localStorage không khả dụng');
      return false;
    }
    
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Lỗi ghi localStorage:', e);
      // Nếu hết dung lượng, xóa một số item cũ
      if (e.name === 'QuotaExceededError') {
        this.clearOldItems();
        try {
          localStorage.setItem(this.getKey(key), JSON.stringify(value));
          return true;
        } catch (e2) {
          console.error('Vẫn lỗi sau khi dọn dẹp:', e2);
          return false;
        }
      }
      return false;
    }
  }
  
  remove(key) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (e) {
      console.error('Lỗi xóa localStorage:', e);
      return false;
    }
  }
  
  clear() {
    if (!this.isAvailable) return false;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (e) {
      console.error('Lỗi xóa localStorage:', e);
      return false;
    }
  }
  
  clearOldItems() {
    // Xóa các item cũ nhất (có thể implement logic phức tạp hơn)
    const keys = Object.keys(localStorage);
    const prefixedKeys = keys.filter(k => k.startsWith(this.prefix));
    
    // Xóa 50% item cũ nhất
    const toRemove = Math.floor(prefixedKeys.length / 2);
    for (let i = 0; i < toRemove; i++) {
      localStorage.removeItem(prefixedKeys[i]);
    }
  }
  
  getAll() {
    if (!this.isAvailable) return {};
    
    const result = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(this.prefix, '');
        try {
          result[cleanKey] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error(`Lỗi parse key ${key}:`, e);
        }
      }
    });
    
    return result;
  }
}

