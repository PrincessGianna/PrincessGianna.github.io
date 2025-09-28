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
    // 检查是否已经有音频实例在localStorage中
    const savedTime = localStorage.getItem('musicCurrentTime');
    const savedVolume = localStorage.getItem('musicVolume');
    const isPlaying = localStorage.getItem('musicIsPlaying') === 'true';

    if (savedTime) {
      this.currentTime = parseFloat(savedTime);
    }
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
    }

    this.createAudioElement();
    
    if (isPlaying) {
      this.play();
    }

    // 监听页面卸载事件，保存音乐状态
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveState();
      }
    });
  }

  createAudioElement() {
    // 如果已经存在音频元素，先移除
    const existingAudio = document.getElementById('background-music');
    if (existingAudio) {
      existingAudio.remove();
    }

    // 创建新的音频元素
    this.audio = document.createElement('audio');
    this.audio.id = 'background-music';
    this.audio.src = this.getAudioPath();
    this.audio.loop = true;
    this.audio.volume = this.volume;
    this.audio.preload = 'auto';
    
    // 设置音频时间
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.currentTime > 0) {
        this.audio.currentTime = this.currentTime;
      }
    });

    // 监听时间更新
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
    });

    // 添加到页面
    document.body.appendChild(this.audio);
  }

  getAudioPath() {
    // 根据当前页面路径确定音频文件路径
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
      return '../assets/audio/九月底-余佳运#hnD1f.mp3';
    } else {
      return 'assets/audio/九月底-余佳运#hnD1f.mp3';
    }
  }

  async play() {
    if (!this.audio) return;
    
    try {
      await this.audio.play();
      this.isPlaying = true;
      localStorage.setItem('musicIsPlaying', 'true');
    } catch (error) {
      console.log('音频自动播放被阻止，用户需要手动启动:', error);
      // 如果自动播放被阻止，可以添加一个用户交互提示
      this.addPlayPrompt();
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      localStorage.setItem('musicIsPlaying', 'false');
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    localStorage.setItem('musicVolume', this.volume.toString());
  }

  saveState() {
    if (this.audio) {
      localStorage.setItem('musicCurrentTime', this.audio.currentTime.toString());
      localStorage.setItem('musicIsPlaying', this.isPlaying.toString());
      localStorage.setItem('musicVolume', this.volume.toString());
    }
  }

  addPlayPrompt() {
    // 创建一个小的播放提示
    const prompt = document.createElement('div');
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
    prompt.innerHTML = '🎵 点击开启背景音乐';
    
    prompt.addEventListener('click', () => {
      this.play();
      prompt.remove();
    });

    prompt.addEventListener('mouseenter', () => {
      prompt.style.transform = 'scale(1.05)';
    });

    prompt.addEventListener('mouseleave', () => {
      prompt.style.transform = 'scale(1)';
    });

    document.body.appendChild(prompt);

    // 10秒后自动隐藏提示
    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.style.opacity = '0';
        setTimeout(() => prompt.remove(), 300);
      }
    }, 10000);
  }
}

// 全局音乐管理器实例
let globalMusicManager = null;

// 初始化音乐管理器
function initMusicManager() {
  if (!globalMusicManager) {
    globalMusicManager = new MusicManager();
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusicManager);
} else {
  initMusicManager();
}

// 导出管理器供其他脚本使用
window.MusicManager = MusicManager;
window.globalMusicManager = globalMusicManager;
