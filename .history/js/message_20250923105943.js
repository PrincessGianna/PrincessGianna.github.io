// 信封交互逻辑
document.addEventListener("DOMContentLoaded", function () {
  const envelope = document.getElementById("love-envelope");
  const modal = document.getElementById("love-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const navButtons = document.querySelectorAll(".love-nav-btn");
  const pages = document.querySelectorAll(".love-page");

  let currentPage = 0;

  // 信封点击事件
  envelope.addEventListener("click", function () {
    // 添加打开动画
    envelope.classList.add("opening");

    // 延迟显示弹窗
    setTimeout(() => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }, 300);
  });

  // 关闭弹窗事件
  function closeModal() {
    modal.classList.remove("active");
    envelope.classList.remove("opening");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  // ESC键关闭弹窗
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // 导航按钮切换页面
  navButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      // 更新活跃状态
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // 切换页面
      pages.forEach((p) => p.classList.remove("active"));
      pages[index].classList.add("active");

      currentPage = index;
    });
  });

  // 键盘导航
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("active")) return;

    if (e.key === "ArrowLeft" && currentPage > 0) {
      navButtons[currentPage - 1].click();
    } else if (e.key === "ArrowRight" && currentPage < navButtons.length - 1) {
      navButtons[currentPage + 1].click();
    }
  });

  // 信封悬停效果增强
  envelope.addEventListener("mouseenter", function () {
    const hearts = document.querySelectorAll(".floating-heart");
    hearts.forEach((heart, index) => {
      heart.style.animationDuration = "3s";
      heart.style.transform = `translateY(-${10 + index * 5}px) rotate(${
        index * 10
      }deg)`;
    });
  });

  envelope.addEventListener("mouseleave", function () {
    const hearts = document.querySelectorAll(".floating-heart");
    hearts.forEach((heart) => {
      heart.style.animationDuration = "6s";
      heart.style.transform = "";
    });
  });

  // 添加触摸设备支持
  let touchStartY = 0;
  let touchEndY = 0;

  modal.addEventListener("touchstart", function (e) {
    touchStartY = e.changedTouches[0].screenY;
  });

  modal.addEventListener("touchend", function (e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && currentPage < navButtons.length - 1) {
        // 向上滑动，下一页
        navButtons[currentPage + 1].click();
      } else if (diff < 0 && currentPage > 0) {
        // 向下滑动，上一页
        navButtons[currentPage - 1].click();
      }
    }
  }

  // 页面切换动画增强
  function switchPage(newIndex) {
    const currentPageEl = pages[currentPage];
    const newPageEl = pages[newIndex];

    if (newIndex > currentPage) {
      // 向前切换
      newPageEl.style.transform = "translateX(30px)";
      currentPageEl.style.transform = "translateX(-30px)";
    } else {
      // 向后切换
      newPageEl.style.transform = "translateX(-30px)";
      currentPageEl.style.transform = "translateX(30px)";
    }

    setTimeout(() => {
      currentPageEl.classList.remove("active");
      newPageEl.classList.add("active");

      // 重置变换
      setTimeout(() => {
        newPageEl.style.transform = "";
        currentPageEl.style.transform = "";
      }, 100);
    }, 200);
  }

  // 自动播放功能（可选）
  let autoPlayInterval;
  let isAutoPlaying = false;

  function startAutoPlay() {
    if (isAutoPlaying) return;

    isAutoPlaying = true;
    autoPlayInterval = setInterval(() => {
      const nextPage = (currentPage + 1) % navButtons.length;
      navButtons[nextPage].click();
    }, 10000); // 10秒切换一次
  }

  function stopAutoPlay() {
    if (!isAutoPlaying) return;

    isAutoPlaying = false;
    clearInterval(autoPlayInterval);
  }

  // 鼠标进入弹窗停止自动播放，离开恢复
  modal.addEventListener("mouseenter", stopAutoPlay);
  modal.addEventListener("mouseleave", () => {
    if (modal.classList.contains("active")) {
      startAutoPlay();
    }
  });

  // 弹窗打开时开始自动播放
  envelope.addEventListener("click", () => {
    setTimeout(startAutoPlay, 5000); // 5秒后开始自动播放
  });

  // 弹窗关闭时停止自动播放
  function enhancedCloseModal() {
    stopAutoPlay();
    closeModal();
  }

  modalClose.addEventListener("click", enhancedCloseModal);
  modalBackdrop.addEventListener("click", enhancedCloseModal);

  // 添加页面指示器
  function createPageIndicators() {
    const indicatorContainer = document.createElement("div");
    indicatorContainer.className = "page-indicators";
    indicatorContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;
        `;

    pages.forEach((_, index) => {
      const indicator = document.createElement("div");
      indicator.className = "page-indicator";
      indicator.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 182, 193, 0.4);
                transition: all 0.3s ease;
                cursor: pointer;
            `;

      if (index === 0) {
        indicator.style.background = "rgba(255, 107, 157, 0.8)";
        indicator.style.transform = "scale(1.2)";
      }

      indicator.addEventListener("click", () => {
        navButtons[index].click();
      });

      indicatorContainer.appendChild(indicator);
    });

    document.querySelector(".love-pages").appendChild(indicatorContainer);

    // 更新指示器状态
    navButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const indicators = document.querySelectorAll(".page-indicator");
        indicators.forEach((ind, i) => {
          if (i === index) {
            ind.style.background = "rgba(255, 107, 157, 0.8)";
            ind.style.transform = "scale(1.2)";
          } else {
            ind.style.background = "rgba(255, 182, 193, 0.4)";
            ind.style.transform = "scale(1)";
          }
        });
      });
    });
  }

  // 初始化页面指示器
  createPageIndicators();

  // 添加进入动画
  setTimeout(() => {
    envelope.style.opacity = "1";
    envelope.style.transform = "translateY(0)";
  }, 500);

  // 初始状态
  envelope.style.opacity = "0";
  envelope.style.transform = "translateY(30px)";
  envelope.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
});
