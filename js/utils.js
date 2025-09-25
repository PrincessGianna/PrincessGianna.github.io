/**
 * 工具函数库
 * 包含项目中常用的辅助函数和工具方法
 */

// ===============================
// DOM 操作工具
// ===============================

/**
 * 查询单个元素
 */
const $ = (selector, context = document) => {
  return context.querySelector(selector);
};

/**
 * 查询多个元素
 */
const $$ = (selector, context = document) => {
  return Array.from(context.querySelectorAll(selector));
};

/**
 * 创建元素
 */
const createElement = (tag, className = '', attributes = {}) => {
  const element = document.createElement(tag);
  if (className) element.className = className;

  Object.keys(attributes).forEach(key => {
    if (key === 'textContent') {
      element.textContent = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });

  return element;
};

/**
 * 添加类名
 */
const addClass = (element, className) => {
  if (element && className) {
    element.classList.add(className);
  }
};

/**
 * 移除类名
 */
const removeClass = (element, className) => {
  if (element && className) {
    element.classList.remove(className);
  }
};

/**
 * 切换类名
 */
const toggleClass = (element, className) => {
  if (element && className) {
    element.classList.toggle(className);
  }
};

/**
 * 检查是否包含类名
 */
const hasClass = (element, className) => {
  return element && className && element.classList.contains(className);
};

/**
 * 获取元素位置信息
 */
const getElementPosition = (element) => {
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom + window.pageYOffset,
    right: rect.right + window.pageXOffset
  };
};

/**
 * 检查元素是否在视口中
 */
const isElementInViewport = (element, threshold = 0) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.bottom >= threshold &&
    rect.right >= threshold &&
    rect.top <= windowHeight - threshold &&
    rect.left <= windowWidth - threshold
  );
};

// ===============================
// 事件处理工具
// ===============================

/**
 * 添加事件监听器
 */
const addEventListener = (element, event, handler, options = {}) => {
  if (!element || !event || !handler) return;

  if (typeof element === 'string') {
    element = $(element);
  }

  if (element) {
    element.addEventListener(event, handler, options);
  }
};

/**
 * 移除事件监听器
 */
const removeEventListener = (element, event, handler, options = {}) => {
  if (!element || !event || !handler) return;

  if (typeof element === 'string') {
    element = $(element);
  }

  if (element) {
    element.removeEventListener(event, handler, options);
  }
};

/**
 * 委托事件监听
 */
const delegate = (parent, selector, event, handler) => {
  if (typeof parent === 'string') {
    parent = $(parent);
  }

  if (!parent) return;

  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e);
    }
  });
};

/**
 * 防抖函数
 */
const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
};

/**
 * 节流函数
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===============================
// 动画工具
// ===============================

/**
 * 缓动函数
 */
const easing = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + (--t) * t * t * t * t,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

/**
 * 数字动画
 */
const animateNumber = (start, end, duration, callback, easingFunc = easing.easeOutQuart) => {
  const startTime = performance.now();
  const range = end - start;

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunc(progress);
    const current = start + (range * easedProgress);

    callback(current, progress === 1);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

/**
 * 滚动到指定位置
 */
const scrollTo = (target, duration = 1000, offset = 0) => {
  let targetPosition;

  if (typeof target === 'number') {
    targetPosition = target;
  } else if (typeof target === 'string') {
    const element = $(target);
    targetPosition = element ? getElementPosition(element).top : 0;
  } else if (target && target.nodeType) {
    targetPosition = getElementPosition(target).top;
  } else {
    return;
  }

  targetPosition += offset;

  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing.easeInOutQuart(progress);

    window.scrollTo(0, startPosition + (distance * easedProgress));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

// ===============================
// 数学和计算工具
// ===============================

/**
 * 限制数值范围
 */
const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 线性插值
 */
const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

/**
 * 映射数值范围
 */
const map = (value, start1, stop1, start2, stop2) => {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

/**
 * 随机整数
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 随机浮点数
 */
const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * 角度转弧度
 */
const degToRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * 弧度转角度
 */
const radToDeg = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * 计算两点距离
 */
const distance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

// ===============================
// 设备检测
// ===============================

/**
 * 检测设备类型
 */
const device = {
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  isTablet: () => {
    return /iPad|Android(?=.*Tablet)|Tablet/i.test(navigator.userAgent);
  },

  isDesktop: () => {
    return !device.isMobile() && !device.isTablet();
  },

  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  getViewportSize: () => {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    };
  },

  isRetina: () => {
    return window.devicePixelRatio > 1;
  }
};

// ===============================
// 本地存储工具
// ===============================

/**
 * 本地存储操作
 */
const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  },

  exists: (key) => {
    return localStorage.getItem(key) !== null;
  }
};

// ===============================
// 时间和日期工具
// ===============================

/**
 * 格式化日期
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 延迟执行
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ===============================
// 字符串工具
// ===============================

/**
 * 生成随机ID
 */
const generateId = (prefix = 'id', length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix + '_';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 转义HTML
 */
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * 截断文本
 */
const truncateText = (text, maxLength, suffix = '...') => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// ===============================
// 加载和资源工具
// ===============================

/**
 * 加载图片
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 预加载图片
 */
const preloadImages = (urls) => {
  return Promise.all(urls.map(url => loadImage(url)));
};

/**
 * 懒加载图片
 */
const lazyLoadImage = (img, src, placeholder = '') => {
  if (!img) return;

  if (placeholder) {
    img.src = placeholder;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage(src).then(() => {
          img.src = src;
          addClass(img, 'loaded');
        }).catch(() => {
          console.warn('Failed to load image:', src);
        });
        observer.unobserve(img);
      }
    });
  });

  observer.observe(img);
};

// ===============================
// 性能优化工具
// ===============================

/**
 * 请求动画帧封装
 */
const raf = (callback) => {
  return requestAnimationFrame(callback);
};

/**
 * 取消动画帧
 */
const cancelRaf = (id) => {
  cancelAnimationFrame(id);
};

/**
 * 空闲时执行
 */
const onIdle = (callback, timeout = 5000) => {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 0);
  }
};

/**
 * 性能测量
 */
const measure = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// ===============================
// 导出工具函数
// ===============================
window.utils = {
  // DOM 操作
  $,
  $$,
  createElement,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  getElementPosition,
  isElementInViewport,

  // 事件处理
  addEventListener,
  removeEventListener,
  delegate,
  debounce,
  throttle,

  // 动画
  easing,
  animateNumber,
  scrollTo,

  // 数学计算
  clamp,
  lerp,
  map,
  randomInt,
  randomFloat,
  degToRad,
  radToDeg,
  distance,

  // 设备检测
  device,

  // 存储
  storage,

  // 时间日期
  formatDate,
  delay,

  // 字符串
  generateId,
  escapeHtml,
  truncateText,

  // 资源加载
  loadImage,
  preloadImages,
  lazyLoadImage,

  // 性能优化
  raf,
  cancelRaf,
  onIdle,
  measure
};