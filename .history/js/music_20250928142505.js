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

    // 确保控制按钮显示
    setTimeout(() => {
      this.addPlayPrompt();
    }, 50);

    // 如果之前在播放，尝试继续播放
    if (isPlaying) {
      console.log("MusicManager: 恢复播放状态...");
      setTimeout(() => {
        this.play();
      }, 100); // 稍微延迟确保音频元素就绪
    } else {
      console.log("MusicManager: 音乐未处于播放状态，尝试自动播放...");
      // 尝试自动播放
      setTimeout(() => {
        this.play();
      }, 100);
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
        // 确保按钮显示
        this.addPlayPrompt();
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
      this.updateMusicControlBtn();
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
      console.log("MusicManager: 音频已暂停");
      this.updateMusicControlBtn();
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

  addPlayPrompt() {
    // 检查是否已经存在音乐控制按钮
    if (document.getElementById("music-control-btn")) {
      return;
    }

    // 添加CSS动画样式到页面
    if (!document.getElementById("music-btn-animations")) {
      const style = document.createElement("style");
      style.id = "music-btn-animations";
      style.textContent = `
        @keyframes musicBtnPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 8px 25px rgba(255, 154, 158, 0.4), 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 0 10px 30px rgba(255, 154, 158, 0.5), 0 5px 18px rgba(0, 0, 0, 0.12);
          }
        }
        
        @keyframes musicBtnGlow {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.1);
          }
        }
        
        .music-btn-playing {
          animation: musicBtnPulse 2s ease-in-out infinite, musicBtnGlow 3s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // 创建音乐控制按钮
    const musicControlBtn = document.createElement("div");
    musicControlBtn.id = "music-control-btn";
    musicControlBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
      border-radius: 50%;
      box-shadow: 0 8px 25px rgba(255, 154, 158, 0.4), 0 4px 15px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #fff;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      user-select: none;
      border: 2px solid rgba(255, 255, 255, 0.3);
    `;

    // 设置初始状态
    this.updateMusicControlBtn(musicControlBtn);

    // 点击事件处理
    musicControlBtn.addEventListener("click", () => {
      this.togglePlayPause();
    });

    // 悬停效果
    musicControlBtn.addEventListener("mouseenter", () => {
      musicControlBtn.style.transform = "scale(1.1) translateY(-3px)";
      musicControlBtn.style.boxShadow =
        "0 12px 35px rgba(255, 154, 158, 0.6), 0 6px 20px rgba(0, 0, 0, 0.15)";
    });

    musicControlBtn.addEventListener("mouseleave", () => {
      musicControlBtn.style.transform = "scale(1) translateY(0)";
      musicControlBtn.style.boxShadow =
        "0 8px 25px rgba(255, 154, 158, 0.4), 0 4px 15px rgba(0, 0, 0, 0.1)";
    });

    // 添加点击动画
    musicControlBtn.addEventListener("mousedown", () => {
      musicControlBtn.style.transform = "scale(0.95) translateY(-3px)";
    });

    musicControlBtn.addEventListener("mouseup", () => {
      musicControlBtn.style.transform = "scale(1.1) translateY(-3px)";
    });

    document.body.appendChild(musicControlBtn);
  }

  updateMusicControlBtn(btn = null) {
    const musicControlBtn = btn || document.getElementById("music-control-btn");
    if (!musicControlBtn) return;

    if (this.isPlaying) {
      // 暂停图标
      musicControlBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      `;
      musicControlBtn.style.background =
        "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #ff9a9e 100%)";
      musicControlBtn.classList.add("music-btn-playing");
    } else {
      // 播放图标
      musicControlBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
      musicControlBtn.style.background =
        "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)";
      musicControlBtn.classList.remove("music-btn-playing");
    }
  }

  async togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
    this.updateMusicControlBtn();
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
      console.log(
        "initMusicManager: 音频元素已存在，当前时间:",
        globalMusicManager.audio.currentTime
      );
    }

    // 确保按钮状态正确（页面切换后可能需要重新创建按钮）
    setTimeout(() => {
      globalMusicManager.addPlayPrompt();
      globalMusicManager.updateMusicControlBtn();
    }, 50);

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
