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

    if (isPlaying) {
      console.log("MusicManager: 尝试播放音乐...");
      this.play();
    } else {
      console.log("MusicManager: 音乐未处于播放状态，尝试自动播放...");
      // 尝试自动播放
      this.play();
    }

    // 监听页面卸载事件，保存音乐状态
    window.addEventListener("beforeunload", () => {
      this.saveState();
    });

    // 监听页面可见性变化
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.saveState();
      }
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
      if (this.currentTime > 0 && this.audio.readyState >= 1) {
        this.audio.currentTime = this.currentTime;
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

    // 监听时间更新
    this.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.audio.currentTime;
      // 每5秒保存一次状态，减少性能影响
      if (Math.floor(this.currentTime) % 5 === 0) {
        this.saveState();
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
      console.log("MusicManager: 音频自动播放被阻止，用户需要手动启动:", error);
      // 如果自动播放被阻止，可以添加一个用户交互提示
      this.addPlayPrompt();
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      localStorage.setItem("musicIsPlaying", "false");
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
      localStorage.setItem(
        "musicCurrentTime",
        this.audio.currentTime.toString()
      );
      localStorage.setItem("musicIsPlaying", this.isPlaying.toString());
      localStorage.setItem("musicVolume", this.volume.toString());
    }
  }

  addPlayPrompt() {
    // 创建一个小的播放提示
    const prompt = document.createElement("div");
    prompt.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      padding: 10px 15px;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      z-index: 10000;
      font-size: 14px;
      color: #333;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    `;
    prompt.innerHTML = "🎵 点击开启背景音乐";

    prompt.addEventListener("click", () => {
      this.play();
      prompt.remove();
    });

    prompt.addEventListener("mouseenter", () => {
      prompt.style.transform = "scale(1.05)";
    });

    prompt.addEventListener("mouseleave", () => {
      prompt.style.transform = "scale(1)";
    });

    document.body.appendChild(prompt);

    // 10秒后自动隐藏提示
    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.style.opacity = "0";
        setTimeout(() => prompt.remove(), 300);
      }
    }, 10000);
  }
}

// 全局音乐管理器实例
let globalMusicManager = null;

// 初始化音乐管理器
function initMusicManager() {
  console.log("initMusicManager: 开始初始化...");
  
  // 检查是否已经有全局实例
  if (window.globalMusicManager) {
    console.log("initMusicManager: 发现已存在的全局音乐管理器");
    globalMusicManager = window.globalMusicManager;
    
    // 重新检查音频元素状态
    if (globalMusicManager.audio) {
      console.log("initMusicManager: 音频元素已存在，当前时间:", globalMusicManager.audio.currentTime);
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

// 页面加载完成后初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMusicManager);
} else {
  initMusicManager();
}

// 导出管理器供其他脚本使用
window.MusicManager = MusicManager;
