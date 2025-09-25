/**
 * 高级动画控制器
 * 负责页面中的复杂动画效果和交互动画
 */

// 动画系统配置
const animationConfig = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800
  },
  easing: {
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  delay: {
    stagger: 100,
    sequence: 200
  }
};

// 动画状态管理
const animationState = {
  isReducedMotion: false,
  activeAnimations: new Set(),
  intersectionObserver: null,
  timelineObserver: null
};

// ===============================
// 动画系统初始化
// ===============================

/**
 * 初始化动画系统
 */
function initializeAnimationSystem() {
  // 检查用户运动偏好
  checkMotionPreference();

  // 初始化 Intersection Observer
  initializeIntersectionObserver();

  // 初始化时间线动画观察器
  initializeTimelineObserver();

  // 初始化页面加载动画
  initializePageLoadAnimations();

  // 初始化交互动画
  initializeInteractionAnimations();

  // 初始化背景动画
  initializeBackgroundAnimations();

  console.log('Animation system initialized');
}

/**
 * 检查用户运动偏好
 */
function checkMotionPreference() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  animationState.isReducedMotion = mediaQuery.matches;

  mediaQuery.addEventListener('change', (e) => {
    animationState.isReducedMotion = e.matches;
    if (e.matches) {
      disableAnimations();
    } else {
      enableAnimations();
    }
  });
}

/**
 * 禁用动画
 */
function disableAnimations() {
  document.body.classList.add('reduce-motion');
  // 停止所有活动动画
  animationState.activeAnimations.forEach(animation => {
    if (animation.cancel) animation.cancel();
  });
  animationState.activeAnimations.clear();
}

/**
 * 启用动画
 */
function enableAnimations() {
  document.body.classList.remove('reduce-motion');
}

// ===============================
// 滚动触发动画
// ===============================

/**
 * 初始化 Intersection Observer
 */
function initializeIntersectionObserver() {
  if (!window.IntersectionObserver) return;

  animationState.intersectionObserver = new IntersectionObserver(
    handleIntersection,
    {
      threshold: [0.1, 0.3, 0.5],
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // 观察所有动画元素
  const animatedElements = utils.$$(`
    .fade-in-up, .fade-in-down, .slide-in-left, .slide-in-right,
    .scale-in, .rotate-in, .timeline-item, .gallery-item,
    .stat-card, .message-card, .tag-item
  `);

  animatedElements.forEach(element => {
    animationState.intersectionObserver.observe(element);
  });
}

/**
 * 处理元素进入视口
 */
function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
      const element = entry.target;
      const delay = parseInt(element.dataset.delay) || 0;

      setTimeout(() => {
        triggerElementAnimation(element);
      }, delay);

      // 停止观察已动画的元素
      animationState.intersectionObserver.unobserve(element);
    }
  });
}

/**
 * 触发元素动画
 */
function triggerElementAnimation(element) {
  if (animationState.isReducedMotion) {
    utils.addClass(element, 'animate');
    return;
  }

  // 检查元素类型并应用相应动画
  if (utils.hasClass(element, 'timeline-item')) {
    animateTimelineItem(element);
  } else if (utils.hasClass(element, 'gallery-item')) {
    animateGalleryItem(element);
  } else if (utils.hasClass(element, 'stat-card')) {
    animateStatCard(element);
  } else if (utils.hasClass(element, 'message-card')) {
    animateMessageCard(element);
  } else if (utils.hasClass(element, 'tag-item')) {
    animateTagItem(element);
  } else {
    // 通用动画
    utils.addClass(element, 'animate');
  }
}

// ===============================
// 页面加载动画
// ===============================

/**
 * 初始化页面加载动画
 */
function initializePageLoadAnimations() {
  // 文字逐行显示动画
  animateTextReveal();

  // 按钮弹入动画
  animateHeroButton();

  // 导航栏滑入动画
  animateNavbar();

  // 生日横幅淡入动画
  animateBirthdayBanner();
}

/**
 * 文字逐行显示动画
 */
function animateTextReveal() {
  const textBlocks = utils.$$('.text-block');

  textBlocks.forEach((block, index) => {
    const delay = index * animationConfig.delay.stagger;

    setTimeout(() => {
      if (!animationState.isReducedMotion) {
        utils.addClass(block, 'text-reveal');
      }
      utils.addClass(block, 'animate');
    }, delay);
  });
}

/**
 * 按钮弹入动画
 */
function animateHeroButton() {
  const heroButton = utils.$('.hero-button-container');
  if (!heroButton) return;

  setTimeout(() => {
    if (!animationState.isReducedMotion) {
      utils.addClass(heroButton, 'button-bounce-in');
    }
    utils.addClass(heroButton, 'animate');
  }, 1000);
}

/**
 * 生日横幅淡入
 */
function animateBirthdayBanner() {
  const banner = utils.$('.birthday-banner');
  if (!banner) return;

  const raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : (cb) => setTimeout(cb, 0);

  raf(() => {
    utils.addClass(banner, 'animate');
  });
}

/**
 * 导航栏滑入动画
 */
function animateNavbar() {
  const navbar = utils.$('.navbar');
  if (!navbar) return;

  utils.addClass(navbar, 'slide-in-down');

  setTimeout(() => {
    utils.addClass(navbar, 'animate');
  }, 200);
}

// ===============================
// 特定元素动画
// ===============================

/**
 * 时间线项目动画
 */
function animateTimelineItem(element) {
  const isLeft = utils.hasClass(element, 'timeline-left');
  const animationClass = isLeft ? 'slide-in-left' : 'slide-in-right';

  utils.addClass(element, animationClass);
  utils.addClass(element, 'animate');

  // 动画完成后添加悬浮效果
  setTimeout(() => {
    utils.addClass(element, 'hover-lift');
  }, animationConfig.duration.slow);
}

/**
 * 画廊项目动画
 */
function animateGalleryItem(element) {
  utils.addClass(element, 'scale-in');
  utils.addClass(element, 'show');

  // 图片懒加载动画
  const img = element.querySelector('img');
  if (img && !img.complete) {
    utils.addClass(img, 'image-lazy-load');

    img.addEventListener('load', () => {
      utils.addClass(img, 'loaded');
    });
  }
}

/**
 * 统计卡片动画
 */
function animateStatCard(element) {
  utils.addClass(element, 'fade-in-up');
  utils.addClass(element, 'show');

  // 数字计数动画
  const numberElement = element.querySelector('.stat-number');
  if (numberElement) {
    setTimeout(() => {
      animateCounter(numberElement);
    }, 300);
  }
}

/**
 * 留言卡片动画
 */
function animateMessageCard(element) {
  utils.addClass(element, 'rotate-in');
  utils.addClass(element, 'show');

  // 添加悬浮交互效果
  setTimeout(() => {
    element.addEventListener('mouseenter', () => {
      if (!animationState.isReducedMotion) {
        utils.addClass(element, 'hover-tilt');
      }
    });

    element.addEventListener('mouseleave', () => {
      utils.removeClass(element, 'hover-tilt');
    });
  }, animationConfig.duration.slow);
}

/**
 * 标签项目动画
 */
function animateTagItem(element) {
  utils.addClass(element, 'tag-fly-in');
  utils.addClass(element, 'show');

  // 添加浮动动画
  setTimeout(() => {
    if (!animationState.isReducedMotion) {
      utils.addClass(element, 'tag-float');
    }
  }, animationConfig.duration.slow);
}

// ===============================
// 计数器动画
// ===============================

/**
 * 数字计数动画
 */
function animateCounter(element) {
  const target = element.dataset.target;
  const duration = 2000;

  if (target === '∞') {
    element.textContent = '∞';
    utils.addClass(element, 'counter');
    return;
  }

  const targetValue = parseInt(target);
  if (isNaN(targetValue)) return;

  utils.addClass(element, 'counter');

  utils.animateNumber(0, targetValue, duration, (current, isComplete) => {
    element.textContent = Math.floor(current);

    if (isComplete) {
      utils.addClass(element, 'counting');
    }
  }, utils.easing.easeOutQuart);
}

// ===============================
// 时间线特殊动画
// ===============================

/**
 * 初始化时间线观察器
 */
function initializeTimelineObserver() {
  const timelineLine = utils.$('.timeline-line');
  if (!timelineLine) return;

  // 时间线绘制动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        utils.addClass(timelineLine, 'timeline-draw');
        observer.unobserve(timelineLine);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(timelineLine);

  // 时间线标记动画
  animateTimelineMarkers();
}

/**
 * 时间线标记动画
 */
function animateTimelineMarkers() {
  const markers = utils.$$('.timeline-marker');

  markers.forEach((marker, index) => {
    setTimeout(() => {
      utils.addClass(marker, 'scale-in');
      utils.addClass(marker, 'animate');

      // 为未来标记添加脉冲动画
      if (utils.hasClass(marker, 'timeline-marker-future')) {
        utils.addClass(marker, 'pulse');
      }
    }, index * animationConfig.delay.sequence);
  });
}

// ===============================
// 交互动画
// ===============================

/**
 * 初始化交互动画
 */
function initializeInteractionAnimations() {
  // 按钮点击动画
  initializeButtonAnimations();

  // 卡片悬浮动画
  initializeCardAnimations();

  // 导航链接动画
  initializeNavLinkAnimations();

  // 表单动画
  initializeFormAnimations();
}

/**
 * 按钮动画
 */
function initializeButtonAnimations() {
  const buttons = utils.$$('.btn, .hero-button, .control-btn, .view-btn');

  buttons.forEach(button => {
    // 添加波纹效果
    if (!utils.hasClass(button, 'ripple-effect')) {
      utils.addClass(button, 'ripple-effect');
    }

    // 添加弹性点击效果
    utils.addClass(button, 'elastic-click');

    // 悬浮发光效果
    button.addEventListener('mouseenter', () => {
      if (!animationState.isReducedMotion) {
        utils.addClass(button, 'hover-glow');
      }
    });

    button.addEventListener('mouseleave', () => {
      utils.removeClass(button, 'hover-glow');
    });
  });
}

/**
 * 卡片动画
 */
function initializeCardAnimations() {
  const cards = utils.$$('.timeline-card, .gallery-card, .stat-card, .message-card');

  cards.forEach(card => {
    utils.addClass(card, 'hover-lift');

    // 磁性悬浮效果
    card.addEventListener('mousemove', (e) => {
      if (animationState.isReducedMotion) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;

      card.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * 导航链接动画
 */
function initializeNavLinkAnimations() {
  const navLinks = utils.$$('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (!animationState.isReducedMotion) {
        link.style.transform = 'translateY(-2px)';
      }
    });

    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });

    link.addEventListener('click', () => {
      // 点击动画
      utils.addClass(link, 'elastic-click');

      setTimeout(() => {
        utils.removeClass(link, 'elastic-click');
      }, 150);
    });
  });
}

/**
 * 表单动画
 */
function initializeFormAnimations() {
  const inputs = utils.$$('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      utils.addClass(input.parentElement, 'focused');
    });

    input.addEventListener('blur', () => {
      utils.removeClass(input.parentElement, 'focused');
    });
  });

  // 模态框动画
  initializeModalAnimations();
}

/**
 * 模态框动画
 */
function initializeModalAnimations() {
  const modals = utils.$$('.modal');

  modals.forEach(modal => {
    const content = modal.querySelector('.modal-content');

    // 监听显示/隐藏状态变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isShowing = utils.hasClass(modal, 'show');

          if (isShowing) {
            utils.addClass(content, 'modal-enter');
            utils.removeClass(content, 'modal-exit');
          } else {
            utils.addClass(content, 'modal-exit');
            utils.removeClass(content, 'modal-enter');
          }
        }
      });
    });

    observer.observe(modal, { attributes: true });
  });
}

// ===============================
// 背景动画
// ===============================

/**
 * 初始化背景动画
 */
function initializeBackgroundAnimations() {
  // 粒子系统
  initializeParticleSystem();

  // 几何图案动画
  initializeGeometricShapes();

  // 视差滚动效果
  initializeParallaxEffect();
}

/**
 * 粒子系统
 */
function initializeParticleSystem() {
  const particleContainer = utils.$('.background-particles');
  if (!particleContainer || animationState.isReducedMotion) return;

  const particleCount = utils.device.isMobile() ? 10 : 20;

  for (let i = 0; i < particleCount; i++) {
    createParticle(particleContainer, i);
  }
}

/**
 * 创建单个粒子
 */
function createParticle(container, index) {
  const particle = utils.createElement('div', 'particle');

  // 随机粒子类型
  const types = ['', 'heart', 'star'];
  const type = types[Math.floor(Math.random() * types.length)];
  if (type) utils.addClass(particle, type);

  // 随机属性
  const startX = Math.random() * 100;
  const animationDuration = utils.randomFloat(3, 8);
  const animationDelay = utils.randomFloat(0, 5);
  const size = utils.randomFloat(0.5, 1.5);

  particle.style.cssText = `
    left: ${startX}%;
    animation-duration: ${animationDuration}s;
    animation-delay: ${animationDelay}s;
    transform: scale(${size});
    opacity: ${utils.randomFloat(0.3, 0.8)};
  `;

  container.appendChild(particle);

  // 粒子回收和重新创建
  setTimeout(() => {
    particle.remove();
    createParticle(container, index);
  }, (animationDuration + animationDelay) * 1000);
}

/**
 * 几何图案动画
 */
function initializeGeometricShapes() {
  const shapesContainer = utils.$('.geometric-shapes');
  if (!shapesContainer || animationState.isReducedMotion) return;

  const shapes = ['circle', 'triangle', 'square'];
  const shapeCount = 5;

  for (let i = 0; i < shapeCount; i++) {
    const shape = utils.createElement('div', 'geometric-shape');
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];

    utils.addClass(shape, shapeType);

    const size = utils.randomInt(20, 60);
    const startX = Math.random() * 100;
    const animationDuration = utils.randomFloat(15, 25);
    const animationDelay = utils.randomFloat(0, 10);

    shape.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      animation-duration: ${animationDuration}s;
      animation-delay: ${animationDelay}s;
    `;

    shapesContainer.appendChild(shape);
  }
}

/**
 * 视差滚动效果
 */
function initializeParallaxEffect() {
  if (animationState.isReducedMotion) return;

  const parallaxElements = utils.$$('.parallax');

  window.addEventListener('scroll', utils.throttle(() => {
    const scrollY = window.pageYOffset;

    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }, 16));
}

// ===============================
// 页面切换动画
// ===============================

/**
 * 页面退出动画
 */
function animatePageExit(callback) {
  if (animationState.isReducedMotion) {
    if (callback) callback();
    return;
  }

  document.body.classList.add('page-exit');

  setTimeout(() => {
    if (callback) callback();
  }, animationConfig.duration.normal);
}

/**
 * 页面进入动画
 */
function animatePageEnter() {
  if (animationState.isReducedMotion) return;

  document.body.classList.remove('page-exit');
  document.body.classList.add('page-enter');

  setTimeout(() => {
    document.body.classList.remove('page-enter');
  }, animationConfig.duration.slow);
}

// ===============================
// 性能优化
// ===============================

/**
 * 清理动画资源
 */
function cleanupAnimations() {
  // 停止所有活动动画
  animationState.activeAnimations.forEach(animation => {
    if (animation.cancel) animation.cancel();
  });
  animationState.activeAnimations.clear();

  // 断开观察器
  if (animationState.intersectionObserver) {
    animationState.intersectionObserver.disconnect();
  }

  if (animationState.timelineObserver) {
    animationState.timelineObserver.disconnect();
  }
}

/**
 * 注册动画
 */
function registerAnimation(animation) {
  animationState.activeAnimations.add(animation);

  // 动画完成后自动清理
  if (animation.finished) {
    animation.finished.then(() => {
      animationState.activeAnimations.delete(animation);
    });
  }
}

// ===============================
// 导出动画接口
// ===============================

/**
 * 创建自定义动画
 */
function createCustomAnimation(element, keyframes, options = {}) {
  if (!element || animationState.isReducedMotion) return null;

  const defaultOptions = {
    duration: animationConfig.duration.normal,
    easing: animationConfig.easing.smooth,
    fill: 'forwards'
  };

  const animationOptions = { ...defaultOptions, ...options };
  const animation = element.animate(keyframes, animationOptions);

  registerAnimation(animation);
  return animation;
}

/**
 * 脉冲动画
 */
function pulseAnimation(element, options = {}) {
  const keyframes = [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(1.1)', opacity: 0.7 },
    { transform: 'scale(1)', opacity: 1 }
  ];

  return createCustomAnimation(element, keyframes, {
    duration: 1000,
    iterations: Infinity,
    ...options
  });
}

/**
 * 震动动画
 */
function shakeAnimation(element, options = {}) {
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)' }
  ];

  return createCustomAnimation(element, keyframes, {
    duration: 500,
    ...options
  });
}

// ===============================
// 页面可见性处理
// ===============================

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange() {
  if (document.hidden) {
    // 页面隐藏时暂停动画
    animationState.activeAnimations.forEach(animation => {
      if (animation.pause) animation.pause();
    });
  } else {
    // 页面显示时恢复动画
    animationState.activeAnimations.forEach(animation => {
      if (animation.play) animation.play();
    });
  }
}

// 监听页面可见性变化
document.addEventListener('visibilitychange', handleVisibilityChange);

// 页面卸载时清理资源
window.addEventListener('beforeunload', cleanupAnimations);

// ===============================
// 自动初始化
// ===============================

// 当DOM加载完成时自动初始化动画系统
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnimationSystem);
} else {
  initializeAnimationSystem();
}

// ===============================
// 全局动画接口
// ===============================
window.animations = {
  // 核心功能
  initializeAnimationSystem,
  triggerElementAnimation,
  animatePageExit,
  animatePageEnter,

  // 自定义动画
  createCustomAnimation,
  pulseAnimation,
  shakeAnimation,

  // 状态管理
  animationState,
  animationConfig,

  // 清理功能
  cleanupAnimations,
  registerAnimation,

  // 实用工具
  checkMotionPreference,
  disableAnimations,
  enableAnimations
};
