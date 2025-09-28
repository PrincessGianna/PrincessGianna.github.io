// 全局音乐管理器
class MusicManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.volume = 0.5;
    this.init();
  }

  init() {
    console.log("MusicManager: 开始初始化...");

    // 清理任何可能存在的旧的音乐控制按钮
    this.cleanupOldMusicControls();

    // 检查是否已经有音频实例在localStorage中
    const savedTime = localStorage.getItem("musicCurrentTime");
    const savedVolume = localStorage.getItem("musicVolume");
    const isPlaying = localStorage.getItem("musicIsPlaying") === "true";

    console.log("MusicManager: 本地存储状态 -", {
      savedTime,
      savedVolume,
      isPlaying,
    });

    if (savedTime) {
      this.currentTime = parseFloat(savedTime);
    }
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
    }

    this.createAudioElement();

    // 优先恢复之前的播放状态，如果没有播放状态则尝试自动播放
    if (isPlaying) {
      console.log("MusicManager: 恢复播放状态...");
      setTimeout(() => {
        this.play();
      }, 100);
    } else {
      // 如果之前没有播放状态，尝试自动播放音乐
      console.log("MusicManager: 尝试自动播放音乐...");
      setTimeout(() => {
        this.play();
      }, 500);
    }

    // 监听页面卸载事件，保存音乐状态
    window.addEventListener("beforeunload", () => {
      console.log("MusicManager: 页面卸载，保存状态...");
      this.saveState();
    });

    // 监听页面可见性变化
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        console.log("MusicManager: 页面隐藏，保存状态...");
        this.saveState();
      } else {
        console.log("MusicManager: 页面显示，检查音乐状态...");
        // 页面显示时检查音乐是否应该播放
        const shouldPlay = localStorage.getItem("musicIsPlaying") === "true";
        if (shouldPlay && this.audio && this.audio.paused) {
          this.play();
        }
      }
    });
  }

  // 清理旧的音乐控制按钮和相关样式
  cleanupOldMusicControls() {
    // 删除任何可能存在的音乐控制按钮
    const oldButtons = document.querySelectorAll('#music-control-btn, .music-control-btn, [id*="music-btn"], [class*="music-btn"]');
    oldButtons.forEach(btn => {
      console.log("MusicManager: 移除旧的音乐控制按钮", btn);
      btn.remove();
    });

    // 删除相关的动画样式
    const oldStyles = document.querySelectorAll('#music-btn-animations, [id*="music-btn"], style[id*="music"]');
    oldStyles.forEach(style => {
      console.log("MusicManager: 移除旧的音乐按钮样式", style);
      style.remove();
    });

    // 删除可能存在的音乐播放器容器
    const oldPlayers = document.querySelectorAll('.music-player, #music-player');
    oldPlayers.forEach(player => {
      console.log("MusicManager: 移除旧的音乐播放器容器", player);
      player.remove();
    });
  }

  createAudioElement() {
    console.log("MusicManager: 创建音频元素...");

    // 检查是否已经存在音频元素
    const existingAudio = document.getElementById("background-music");
    if (existingAudio) {
      console.log("MusicManager: 发现已存在的音频元素，复用...");
      this.audio = existingAudio;

      // 更新音频设置
      this.audio.volume = this.volume;

      // 如果音频元素已就绪且有保存的时间，恢复播放位置
      if (this.currentTime > 0) {
        const restoreTime = () => {
          if (this.audio.readyState >= 1) {
            console.log("MusicManager: 恢复播放时间到", this.currentTime);
            this.audio.currentTime = this.currentTime;
          } else {
            // 如果音频还没准备好，等待一下再尝试
            setTimeout(restoreTime, 100);
          }
        };
        restoreTime();
      }

      return;
    }

    // 创建新的音频元素
    this.audio = document.createElement("audio");
    this.audio.id = "background-music";
    this.audio.src = this.getAudioPath();
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = "auto";

    console.log("MusicManager: 音频源路径 -", this.audio.src);

    // 设置音频时间
    this.audio.addEventListener("loadedmetadata", () => {
      console.log("MusicManager: 音频元数据加载完成");
      if (this.currentTime > 0) {
        console.log("MusicManager: 恢复播放时间到", this.currentTime);
        this.audio.currentTime = this.currentTime;
      }
    });

    // 监听时间更新，但减少保存频率以提高性能
    let lastSaveTime = 0;
    this.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.audio.currentTime;

      // 每2秒保存一次状态
      const now = Date.now();
      if (now - lastSaveTime > 2000) {
        this.saveState();
        lastSaveTime = now;
      }
    });

    // 添加错误处理
    this.audio.addEventListener("error", (e) => {
      console.error("MusicManager: 音频加载错误:", e);
      console.error("MusicManager: 错误代码:", this.audio.error?.code);
      console.error("MusicManager: 错误信息:", this.audio.error?.message);
    });

    this.audio.addEventListener("canplay", () => {
      console.log("MusicManager: 音频可以播放");
    });

    this.audio.addEventListener("loadstart", () => {
      console.log("MusicManager: 开始加载音频");
    });

    // 添加到页面
    document.body.appendChild(this.audio);
  }

  getAudioPath() {
    // 根据当前页面路径确定音频文件路径
    const currentPath = window.location.pathname;
    if (currentPath.includes("/pages/")) {
      return "../assets/audio/jiuyuedi-yujiaoyun.mp3";
    } else {
      return "assets/audio/jiuyuedi-yujiaoyun.mp3";
    }
  }

  async play() {
    if (!this.audio) {
      console.log("MusicManager: 音频元素不存在，无法播放");
      return;
    }

    console.log("MusicManager: 尝试播放音频...");

    try {
      await this.audio.play();
      this.isPlaying = true;
      localStorage.setItem("musicIsPlaying", "true");
      console.log("MusicManager: 音频播放成功");
    } catch (error) {
      console.log("MusicManager: 音频自动播放被阻止，添加用户交互监听器:", error);

      // 如果自动播放被阻止，添加用户交互监听器
      this.addUserInteractionListeners();
    }
  }

  // 添加用户交互监听器，在用户首次交互时播放音乐
  addUserInteractionListeners() {
    const startMusicOnInteraction = async (event) => {
      console.log("MusicManager: 检测到用户交互，尝试播放音乐", event.type);

      try {
        await this.audio.play();
        this.isPlaying = true;
        localStorage.setItem("musicIsPlaying", "true");
        console.log("MusicManager: 用户交互后音频播放成功");

        // 移除监听器，避免重复触发
        this.removeUserInteractionListeners();
      } catch (error) {
        console.log("MusicManager: 用户交互后播放仍然失败:", error);
      }
    };

    // 监听各种用户交互事件，包括移动端专用事件
    const events = [
      'click', 'touchstart', 'touchend', 'touchmove',
      'keydown', 'scroll', 'mousemove', 'mousedown',
      'gesturestart', 'gesturechange', 'gestureend'
    ];

    events.forEach(event => {
      document.addEventListener(event, startMusicOnInteraction, {
        once: true, // 只触发一次
        passive: true
      });
    });

    // 移动端特殊处理：监听页面滚动
    window.addEventListener('scroll', startMusicOnInteraction, {
      once: true,
      passive: true
    });

    // 移动端特殊处理：监听触摸事件
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', startMusicOnInteraction, {
        once: true,
        passive: true
      });
    }

    // 保存监听器引用以便后续移除
    this.userInteractionHandler = startMusicOnInteraction;
    this.userInteractionEvents = events;

    console.log("MusicManager: 已添加用户交互监听器（包含移动端优化）");
  }

  // 移除用户交互监听器
  removeUserInteractionListeners() {
    if (this.userInteractionHandler && this.userInteractionEvents) {
      this.userInteractionEvents.forEach(event => {
        document.removeEventListener(event, this.userInteractionHandler);
      });

      // 移除window上的监听器
      window.removeEventListener('scroll', this.userInteractionHandler);

      this.userInteractionHandler = null;
      this.userInteractionEvents = null;

      console.log("MusicManager: 已移除用户交互监听器");
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      localStorage.setItem("musicIsPlaying", "false");
      console.log("MusicManager: 音频已暂停");
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    localStorage.setItem("musicVolume", this.volume.toString());
  }

  saveState() {
    if (this.audio) {
      const state = {
        currentTime: this.audio.currentTime,
        isPlaying: this.isPlaying,
        volume: this.volume,
      };

      console.log("MusicManager: 保存状态 -", state);

      localStorage.setItem("musicCurrentTime", state.currentTime.toString());
      localStorage.setItem("musicIsPlaying", state.isPlaying.toString());
      localStorage.setItem("musicVolume", state.volume.toString());
    }
  }

  async togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }
}

// 全局音乐管理器实例
let globalMusicManager = null;

// 初始化音乐管理器
function initMusicManager() {
  console.log("initMusicManager: 开始初始化...");

  // 首先清理任何可能存在的旧按钮
  cleanupAllMusicControls();

  // 检查是否已经有全局实例
  if (window.globalMusicManager) {
    console.log("initMusicManager: 发现已存在的全局音乐管理器");
    globalMusicManager = window.globalMusicManager;

    // 重新检查音频元素状态
    if (globalMusicManager.audio) {
      console.log(
        "initMusicManager: 音频元素已存在，当前时间:",
        globalMusicManager.audio.currentTime
      );
    }

    // 页面切换时，检查是否需要继续播放
    const shouldPlay = localStorage.getItem("musicIsPlaying") === "true";
    if (shouldPlay && globalMusicManager.audio && globalMusicManager.audio.paused) {
      console.log("initMusicManager: 页面切换，恢复音乐播放");
      setTimeout(() => {
        globalMusicManager.play();
      }, 100);
    }

    return;
  }

  // 创建新的音乐管理器实例
  if (!globalMusicManager) {
    console.log("initMusicManager: 创建新的音乐管理器实例");
    globalMusicManager = new MusicManager();
    // 将实例保存到 window 对象，使其在页面间共享
    window.globalMusicManager = globalMusicManager;
  }
}

// 全局清理函数，确保清理所有可能的音乐控制元素
function cleanupAllMusicControls() {
  // 删除任何可能存在的音乐控制按钮
  const selectors = [
    '#music-control-btn',
    '.music-control-btn',
    '[id*="music-btn"]',
    '[class*="music-btn"]',
    '.music-player',
    '#music-player',
    '.player-container',
    '.control-btn'
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      console.log("全局清理: 移除音乐控制元素", element);
      element.remove();
    });
  });

  // 删除相关的动画样式
  const styleSelectors = [
    '#music-btn-animations',
    '[id*="music-btn"]',
    'style[id*="music"]'
  ];

  styleSelectors.forEach(selector => {
    const styles = document.querySelectorAll(selector);
    styles.forEach(style => {
      console.log("全局清理: 移除音乐相关样式", style);
      style.remove();
    });
  });
}

// 页面加载完成后初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMusicManager);
} else {
  initMusicManager();
}

// 定期清理任何可能出现的音乐控制按钮
setInterval(() => {
  cleanupAllMusicControls();
}, 3000); // 每3秒清理一次

// 导出管理器供其他脚本使用
window.MusicManager = MusicManager;
