/**
 * 主要功能控制器
 * 负责导航、页面初始化和全局功能
 */

// 全局变量
let currentPage = "";
let isLoading = false;
let musicPlayer = null;

// DOM元素缓存
const elements = {
  navbar: null,
  navMenu: null,
  navToggle: null,
  navLinks: null,
  loadingScreen: null,
  heroButton: null,
  musicPlayer: null,
  musicControls: {},
};

// ===============================
// 页面初始化
// ===============================

/**
 * 页面加载完成后初始化
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

/**
 * 应用初始化
 */
function initializeApp() {
  // 缓存DOM元素
  cacheElements();

  // 初始化导航
  initializeNavigation();

  // 音乐播放器已替换为全局音乐管理器
  // initializeMusicPlayer();

  // 初始化页面特定功能
  initializePageFeatures();

  // 初始化全局事件监听器
  initializeGlobalListeners();

  // 隐藏加载界面
  hideLoadingScreen();

  // 启动页面动画
  startPageAnimations();
}

/**
 * 缓存DOM元素
 */
function cacheElements() {
  elements.navbar = utils.$(".navbar");
  elements.navMenu = utils.$("#nav-menu");
  elements.navToggle = utils.$("#nav-toggle");
  elements.navLinks = utils.$$(".nav-link");
  elements.loadingScreen = utils.$("#loading-screen");
  elements.heroButton = utils.$("#hero-button");
  elements.musicPlayer = utils.$(".music-player");

  // 音乐播放器控件
  elements.musicControls = {
    playPause: utils.$("#play-pause-btn"),
    prev: utils.$("#prev-btn"),
    next: utils.$("#next-btn"),
    progressBar: utils.$(".progress-bar"),
    progressFill: utils.$("#progress-fill"),
    progressHandle: utils.$("#progress-handle"),
    currentTime: utils.$(".current-time"),
    totalTime: utils.$(".total-time"),
    songTitle: utils.$(".song-title"),
    songArtist: utils.$(".song-artist"),
  };
}

// ===============================
// 导航功能
// ===============================

/**
 * 初始化导航功能
 */
function initializeNavigation() {
  if (!elements.navToggle || !elements.navMenu) return;

  // 移动端菜单切换
  elements.navToggle.addEventListener("click", toggleMobileMenu);

  // 导航链接点击事件
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", handleNavLinkClick);
  });

  // 滚动时导航栏效果
  window.addEventListener("scroll", utils.throttle(handleNavbarScroll, 100));

  // 点击空白处关闭移动菜单
  document.addEventListener("click", (e) => {
    if (!elements.navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // 设置当前页面导航状态
  setActiveNavLink();
}

/**
 * 切换移动端菜单
 */
function toggleMobileMenu() {
  if (!elements.navMenu || !elements.navToggle) return;

  const isOpen = utils.hasClass(elements.navMenu, "active");

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * 打开移动端菜单
 */
function openMobileMenu() {
  utils.addClass(elements.navMenu, "active");
  utils.addClass(elements.navToggle, "active");
  document.body.style.overflow = "hidden";
}

/**
 * 关闭移动端菜单
 */
function closeMobileMenu() {
  utils.removeClass(elements.navMenu, "active");
  utils.removeClass(elements.navToggle, "active");
  document.body.style.overflow = "";
}

/**
 * 处理导航链接点击
 */
function handleNavLinkClick(e) {
  const link = e.currentTarget;
  const href = link.getAttribute("href");

  // 如果是当前页面的锚点链接
  if (href.startsWith("#")) {
    e.preventDefault();
    const target = utils.$(href);
    if (target) {
      utils.scrollTo(target, 1000, -70);
      closeMobileMenu();
    }
    return;
  }

  // 关闭移动菜单
  closeMobileMenu();

  // 更新活动链接
  updateActiveNavLink(link);
}

/**
 * 处理导航栏滚动效果
 */
function handleNavbarScroll() {
  if (!elements.navbar) return;

  const scrollY = window.pageYOffset;

  if (scrollY > 100) {
    utils.addClass(elements.navbar, "scrolled");
  } else {
    utils.removeClass(elements.navbar, "scrolled");
  }
}

/**
 * 设置当前页面的活动导航链接
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;

  elements.navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    utils.removeClass(link, "active");

    if (
      currentPath.includes(linkPath) ||
      (currentPath.endsWith("/") && linkPath === "index.html") ||
      (currentPath.endsWith("index.html") && linkPath === "index.html")
    ) {
      utils.addClass(link, "active");
    }
  });
}

/**
 * 更新活动导航链接
 */
function updateActiveNavLink(activeLink) {
  elements.navLinks.forEach((link) => {
    utils.removeClass(link, "active");
  });
  utils.addClass(activeLink, "active");
}

// ===============================
// 音乐播放器功能
// ===============================

/**
 * 初始化音乐播放器
 */
function initializeMusicPlayer() {
  if (!elements.musicPlayer) return;

  // 音乐播放器数据
  musicPlayer = {
    isPlaying: false,
    currentTime: 0,
    duration: 225, // 3:45 in seconds
    currentSong: 0,
    songs: [
      {
        title: "Beautiful Love Song",
        artist: "Romantic Artist",
        duration: 225,
      },
      { title: "Our Special Moment", artist: "Sweet Melody", duration: 198 },
      { title: "Forever Together", artist: "Love Harmony", duration: 210 },
    ],
  };

  // 绑定播放器控件事件
  bindMusicPlayerEvents();

  // 更新播放器显示
  updateMusicPlayerDisplay();

  // 启动进度更新
  startProgressUpdate();
}

/**
 * 绑定音乐播放器事件
 */
function bindMusicPlayerEvents() {
  const { playPause, prev, next, progressBar } = elements.musicControls;

  if (playPause) {
    playPause.addEventListener("click", togglePlayPause);
  }

  if (prev) {
    prev.addEventListener("click", playPreviousSong);
  }

  if (next) {
    next.addEventListener("click", playNextSong);
  }

  if (progressBar) {
    progressBar.addEventListener("click", seekToPosition);
  }
}

/**
 * 切换播放/暂停
 */
function togglePlayPause() {
  if (!musicPlayer) return;

  musicPlayer.isPlaying = !musicPlayer.isPlaying;
  updatePlayButtonIcon();

  if (musicPlayer.isPlaying) {
    console.log("Playing music...");
  } else {
    console.log("Music paused");
  }
}

/**
 * 播放上一首
 */
function playPreviousSong() {
  if (!musicPlayer) return;

  musicPlayer.currentSong =
    (musicPlayer.currentSong - 1 + musicPlayer.songs.length) %
    musicPlayer.songs.length;
  musicPlayer.currentTime = 0;
  updateMusicPlayerDisplay();
  console.log(
    "Playing previous song:",
    musicPlayer.songs[musicPlayer.currentSong].title
  );
}

/**
 * 播放下一首
 */
function playNextSong() {
  if (!musicPlayer) return;

  musicPlayer.currentSong =
    (musicPlayer.currentSong + 1) % musicPlayer.songs.length;
  musicPlayer.currentTime = 0;
  updateMusicPlayerDisplay();
  console.log(
    "Playing next song:",
    musicPlayer.songs[musicPlayer.currentSong].title
  );
}

/**
 * 拖拽进度条
 */
function seekToPosition(e) {
  if (!musicPlayer || !elements.musicControls.progressBar) return;

  const rect = elements.musicControls.progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percentage = clickX / rect.width;

  musicPlayer.currentTime = percentage * musicPlayer.duration;
  updateProgressDisplay();
}

/**
 * 更新播放按钮图标
 */
function updatePlayButtonIcon() {
  const playIcon = utils.$(".play-icon");
  const pauseIcon = utils.$(".pause-icon");

  if (musicPlayer.isPlaying) {
    if (playIcon) playIcon.style.display = "none";
    if (pauseIcon) pauseIcon.style.display = "block";
  } else {
    if (playIcon) playIcon.style.display = "block";
    if (pauseIcon) pauseIcon.style.display = "none";
  }
}

/**
 * 更新音乐播放器显示
 */
function updateMusicPlayerDisplay() {
  if (!musicPlayer) return;

  const currentSong = musicPlayer.songs[musicPlayer.currentSong];
  const { songTitle, songArtist, totalTime } = elements.musicControls;

  if (songTitle) songTitle.textContent = currentSong.title;
  if (songArtist) songArtist.textContent = currentSong.artist;
  if (totalTime) totalTime.textContent = formatTime(currentSong.duration);

  musicPlayer.duration = currentSong.duration;
  updateProgressDisplay();
}

/**
 * 更新进度显示
 */
function updateProgressDisplay() {
  if (!musicPlayer) return;

  const { progressFill, progressHandle, currentTime } = elements.musicControls;
  const percentage = (musicPlayer.currentTime / musicPlayer.duration) * 100;

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }

  if (progressHandle) {
    progressHandle.style.left = `${percentage}%`;
  }

  if (currentTime) {
    currentTime.textContent = formatTime(musicPlayer.currentTime);
  }
}

/**
 * 启动进度更新
 */
function startProgressUpdate() {
  setInterval(() => {
    if (musicPlayer && musicPlayer.isPlaying) {
      musicPlayer.currentTime += 1;

      if (musicPlayer.currentTime >= musicPlayer.duration) {
        playNextSong();
      }

      updateProgressDisplay();
    }
  }, 1000);
}

/**
 * 格式化时间显示
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// ===============================
// 页面特定功能初始化
// ===============================

/**
 * 初始化页面特定功能
 */
function initializePageFeatures() {
  const currentPath = window.location.pathname;

  if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
    initializeHomePage();
  } else if (currentPath.includes("about.html")) {
    initializeAboutPage();
  } else if (currentPath.includes("impression.html")) {
    initializeImpressionPage();
  } else if (currentPath.includes("message.html")) {
    initializeMessagePage();
  }
}

/**
 * 初始化首页功能
 */
function initializeHomePage() {
  if (elements.heroButton) {
    elements.heroButton.addEventListener("click", handleHeroButtonClick);
  }

  // 初始化背景粒子效果
  initializeParticles();
}

/**
 * 初始化关于页面功能
 */
function initializeAboutPage() {
  // 这里可以添加时间线特定的功能
  console.log("About page initialized");
}

/**
 * 初始化印象页面功能
 */
function initializeImpressionPage() {
  initializeTagCloud();
}

/**
 * 初始化留言页面功能
 */
function initializeMessagePage() {
  initializeStatCounters();
}

/**
 * 处理首页按钮点击
 */
function handleHeroButtonClick() {
  // 添加点击动画效果
  utils.addClass(elements.heroButton, "clicked");

  setTimeout(() => {
    utils.removeClass(elements.heroButton, "clicked");
  }, 300);

  // 跳转到关于页面
  const aboutLink = utils.$('a[href*="about.html"]');
  if (aboutLink) {
    window.location.href = aboutLink.href;
  }
}

/**
 * 初始化背景粒子
 */
function initializeParticles() {
  const particlesContainer = utils.$(".background-particles");
  if (!particlesContainer) return;

  // 创建粒子
  for (let i = 0; i < 20; i++) {
    const particle = utils.createElement("div", "particle");

    // 随机粒子类型
    const types = ["", "heart", "star"];
    const type = types[Math.floor(Math.random() * types.length)];
    if (type) utils.addClass(particle, type);

    // 随机位置和动画延迟
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 5 + "s";
    particle.style.animationDuration = Math.random() * 3 + 2 + "s";

    particlesContainer.appendChild(particle);
  }
}

/**
 * 初始化标签云
 */
function initializeTagCloud() {
  const tagItems = utils.$$(".tag-item");

  tagItems.forEach((tag, index) => {
    // 只添加悬浮动画，不需要点击事件
    tag.addEventListener("mouseenter", () => {
      utils.addClass(tag, "hover");
    });

    tag.addEventListener("mouseleave", () => {
      utils.removeClass(tag, "hover");
    });
  });
}

/**
 * 标签点击功能已移除
 * 现在标签仅用于展示，不需要交互功能
 */

/**
 * 初始化统计计数器
 */
function initializeStatCounters() {
  const statCards = utils.$$(".stat-card");

  statCards.forEach((card, index) => {
    const numberElement = card.querySelector(".stat-number");
    const targetValue = numberElement.dataset.target;

    // 延迟启动计数动画
    setTimeout(() => {
      if (targetValue === "∞") {
        numberElement.textContent = "∞";
      } else {
        utils.animateNumber(
          0,
          parseInt(targetValue),
          2000,
          (current, isComplete) => {
            numberElement.textContent = Math.floor(current);
            if (isComplete) {
              utils.addClass(numberElement, "counting");
            }
          }
        );
      }
    }, index * 200);
  });
}

// ===============================
// 全局事件监听器
// ===============================

/**
 * 初始化全局事件监听器
 */
function initializeGlobalListeners() {
  // 键盘事件
  document.addEventListener("keydown", handleKeyDown);

  // 滚动事件
  window.addEventListener("scroll", utils.throttle(handleScroll, 100));

  // 窗口大小变化
  window.addEventListener("resize", utils.debounce(handleResize, 250));

  // 页面可见性变化
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

/**
 * 处理键盘事件
 */
function handleKeyDown(e) {
  // ESC键关闭模态框
  if (e.key === "Escape") {
    const modals = utils.$$(".modal.show");
    modals.forEach((modal) => {
      utils.removeClass(modal, "show");
    });
  }

  // 空格键控制音乐播放（当没有输入框聚焦时）
  if (e.key === " " && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
    e.preventDefault();
    togglePlayPause();
  }
}

/**
 * 处理滚动事件
 */
function handleScroll() {
  // 这里可以添加滚动相关的动画触发
  // 例如：检查元素是否进入视口，触发动画
}

/**
 * 处理窗口大小变化
 */
function handleResize() {
  // 更新粒子位置等响应式相关的处理
  console.log("Window resized");
}

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange() {
  if (document.hidden) {
    // 页面隐藏时暂停音乐
    if (musicPlayer && musicPlayer.isPlaying) {
      togglePlayPause();
    }
  }
}

// ===============================
// 加载和动画控制
// ===============================

/**
 * 隐藏加载界面
 */
function hideLoadingScreen() {
  if (!elements.loadingScreen) return;

  setTimeout(() => {
    utils.addClass(elements.loadingScreen, "hide");

    setTimeout(() => {
      elements.loadingScreen.style.display = "none";
    }, 500);
  }, 1000);
}

/**
 * 启动页面动画
 */
function startPageAnimations() {
  // 添加页面进入动画
  document.body.classList.add("page-enter");

  // 启动滚动动画观察器
  initializeScrollAnimations();
}

/**
 * 初始化滚动动画
 */
function initializeScrollAnimations() {
  const animatedElements = utils.$$(
    ".fade-in-up, .slide-in-left, .slide-in-right, .scale-in"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          utils.addClass(entry.target, "animate");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// ===============================
// 导出全局接口
// ===============================
window.app = {
  elements,
  musicPlayer,
  togglePlayPause,
  openMobileMenu,
  closeMobileMenu,
  initializeScrollAnimations,
};
