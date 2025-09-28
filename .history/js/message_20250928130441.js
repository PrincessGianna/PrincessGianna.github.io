// 信封交互逻辑 - 增强版本，支持翻页
document.addEventListener("DOMContentLoaded", function () {
  const envelope = document.getElementById("love-envelope");
  const modal = document.getElementById("love-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");

  // 翻页控制元素
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const currentPageSpan = document.querySelector(".current-page");
  const totalPagesSpan = document.querySelector(".total-pages");
  const lovePages = document.querySelectorAll(".love-page");
  const lovePagesContainer = document.querySelector(".love-pages");

  // 翻页状态
  let currentPage = 1;
  const totalPages = lovePages.length;
  let isFlipping = false;

  // 保存原始滚动位置的变量
  let originalScrollPosition = 0;

  // 信封点击事件
  envelope.addEventListener("click", function () {
    // 保存当前滚动位置
    originalScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // 添加打开动画
    envelope.classList.add("opening");

    // 延迟显示弹窗
    setTimeout(() => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "17px"; // 补偿滚动条宽度，防止页面跳动

      // 智能居中：确保模态框在最佳观看位置
      setTimeout(() => {
        const modalContainer = modal.querySelector(".modal-container");
        const modalRect = modalContainer
          ? modalContainer.getBoundingClientRect()
          : modal.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // 检查模态框内容是否在视窗的最佳位置
        const modalTop = modalRect.top;
        const modalBottom = modalRect.bottom;
        const modalHeight = modalRect.height;

        // 如果模态框内容不在视窗的理想位置，平滑滚动调整
        if (
          modalTop < 50 ||
          modalBottom > viewportHeight - 50 ||
          modalHeight > viewportHeight
        ) {
          const currentScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let targetScroll;

          if (modalHeight > viewportHeight - 100) {
            // 如果模态框很高，滚动到顶部，留一点margin
            targetScroll = currentScroll + modalTop - 50;
          } else {
            // 否则居中显示
            const modalCenter = currentScroll + modalTop + modalHeight / 2;
            targetScroll = modalCenter - viewportHeight / 2;
          }

          // 平滑滚动到目标位置
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: "smooth",
          });
        }
      }, 150); // 稍微延迟以确保模态框完全渲染

      // 开始手写动画
      startHandwritingAnimation();

      // 初始化翻页控制
      initializePagination();
    }, 600);
  });

  // 关闭弹窗事件
  function closeModal() {
    modal.classList.remove("active");
    envelope.classList.remove("opening");
    document.body.style.overflow = "";
    document.body.style.paddingRight = ""; // 移除滚动条补偿

    // 恢复到原始滚动位置
    window.scrollTo({
      top: originalScrollPosition,
      behavior: "smooth",
    });

    // 重置手写动画和翻页状态
    resetHandwritingAnimation();
    resetPagination();
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  // ESC键关闭弹窗
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // 全局变量追踪动画状态
  let isAnimating = false;
  let animationTimeouts = [];
  let animationIntervals = [];

  // 手写动画控制 - 逐字打字机效果（支持当前页面）
  function startHandwritingAnimation(pageNumber = currentPage) {
    // 如果正在动画中，先停止
    if (isAnimating) {
      stopAllAnimations();
    }

    isAnimating = true;

    // 获取当前页面的手写行
    const currentPageElement = document.querySelector(
      `.love-page[data-page="${pageNumber}"]`
    );
    if (!currentPageElement) return;

    const handwritingLines =
      currentPageElement.querySelectorAll(".handwriting-line");

    // 重置当前页面所有行的状态
    handwritingLines.forEach((line) => {
      line.style.opacity = "1";
      line.style.transform = "translateY(0) scale(1)";
      line.style.filter = "blur(0)";

      // 保存原始文本并清空显示
      if (!line.dataset.originalText) {
        line.dataset.originalText = line.textContent;
      }
      line.textContent = "";
    });

    // 逐行逐字打字效果
    let totalDelay = 800; // 初始延迟

    handwritingLines.forEach((line, lineIndex) => {
      const originalText = line.dataset.originalText || "";

      // 如果是空行，跳过
      if (!originalText.trim()) {
        line.style.height = "32px"; // 保持行高
        return;
      }

      const timeout = setTimeout(() => {
        // 逐字显示
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (!isAnimating) {
            clearInterval(typeInterval);
            return;
          }

          if (charIndex < originalText.length) {
            line.textContent = originalText.substring(0, charIndex + 1);
            charIndex++;

            // 添加光标效果（临时）
            if (charIndex < originalText.length) {
              line.textContent += "|";
              const cursorTimeout = setTimeout(() => {
                if (line.textContent.endsWith("|")) {
                  line.textContent = line.textContent.slice(0, -1);
                }
              }, 50);
              animationTimeouts.push(cursorTimeout);
            }
          } else {
            clearInterval(typeInterval);

            // 从intervals数组中移除
            const index = animationIntervals.indexOf(typeInterval);
            if (index > -1) {
              animationIntervals.splice(index, 1);
            }

            // 完成后添加轻微的晃动效果
            if (!line.classList.contains("signature")) {
              const effectTimeout = setTimeout(() => {
                if (!isAnimating) return;
                line.style.transition = "transform 0.3s ease";
                line.style.transform = "translateY(-1px) scale(1.01)";
                const resetTimeout = setTimeout(() => {
                  if (isAnimating) {
                    line.style.transform = "translateY(0) scale(1)";
                  }
                }, 200);
                animationTimeouts.push(resetTimeout);
              }, 300);
              animationTimeouts.push(effectTimeout);
            } else {
              // 签名特殊效果
              const signatureTimeout = setTimeout(() => {
                if (!isAnimating) return;
                line.style.transition = "all 0.5s ease";
                line.style.color = "#ff6b9d";
                line.style.transform = "scale(1.05)";
                const signatureResetTimeout = setTimeout(() => {
                  if (isAnimating) {
                    line.style.color = "#e74c3c";
                    line.style.transform = "scale(1)";
                  }
                }, 400);
                animationTimeouts.push(signatureResetTimeout);
              }, 500);
              animationTimeouts.push(signatureTimeout);
            }
          }
        }, getTypingSpeed(originalText, lineIndex));

        animationIntervals.push(typeInterval);
      }, totalDelay);

      animationTimeouts.push(timeout);

      // 计算下一行的延迟时间
      totalDelay +=
        originalText.length * getTypingSpeed(originalText, lineIndex) + 200;
    });

    // 动画完成后重置状态
    const finalTimeout = setTimeout(() => {
      isAnimating = false;
    }, totalDelay + 2000);
    animationTimeouts.push(finalTimeout);
  }

  // 停止所有动画
  function stopAllAnimations() {
    isAnimating = false;

    // 清除所有定时器
    animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    animationIntervals.forEach((interval) => clearInterval(interval));

    // 重置数组
    animationTimeouts = [];
    animationIntervals = [];
  }

  // 根据文本内容和位置计算打字速度
  function getTypingSpeed(text, lineIndex) {
    // 基础速度
    let baseSpeed = 80;

    // 日期和标题稍快
    if (lineIndex === 0 || lineIndex === 1) {
      baseSpeed = 60;
    }

    // 签名稍慢，更有仪式感
    if (text.includes("爱你的") || text.includes("❤")) {
      baseSpeed = 120;
    }

    // 标点符号后稍微停顿
    if (text.includes("。") || text.includes("！") || text.includes("？")) {
      baseSpeed += 20;
    }

    // 添加一些随机性，模拟真实手写
    return baseSpeed + Math.random() * 30 - 15;
  }

  function resetHandwritingAnimation() {
    // 停止所有动画
    stopAllAnimations();

    // 重置所有页面的手写行
    lovePages.forEach((page) => {
      const handwritingLines = page.querySelectorAll(".handwriting-line");
      handwritingLines.forEach((line) => {
        // 恢复原始文本但先清空
        line.textContent = "";

        // 重置所有样式到初始状态
        line.style.opacity = "0";
        line.style.transform = "translateY(15px) scale(0.95)";
        line.style.filter = "blur(1px)";
        line.style.transition = "none";
        line.style.color = "";
        line.style.height = "";

        // 确保移除任何可能残留的类
        line.classList.remove("handwriting-shake");
      });
    });
  }

  // 信封悬停效果增强
  envelope.addEventListener("mouseenter", function () {
    const hearts = document.querySelectorAll(".floating-heart");
    hearts.forEach((heart, index) => {
      heart.style.animationDuration = "2s";
      heart.style.transform = `translateY(-${15 + index * 8}px) rotate(${
        index * 15
      }deg) scale(1.2)`;
    });

    // 信封轻微上浮
    envelope.style.transform = "translateY(-8px) scale(1.05)";
    envelope.style.boxShadow = "0 15px 35px rgba(255, 107, 157, 0.3)";
  });

  envelope.addEventListener("mouseleave", function () {
    const hearts = document.querySelectorAll(".floating-heart");
    hearts.forEach((heart) => {
      heart.style.animationDuration = "6s";
      heart.style.transform = "";
    });

    // 信封恢复原位
    envelope.style.transform = "";
    envelope.style.boxShadow = "";
  });

  // 添加触摸设备支持
  let touchStartY = 0;
  let touchEndY = 0;

  modal.addEventListener("touchstart", function (e) {
    touchStartY = e.changedTouches[0].screenY;
  });

  modal.addEventListener("touchend", function (e) {
    touchEndY = e.changedTouches[0].screenY;

    // 向下滑动关闭弹窗
    const swipeThreshold = 100;
    const diff = touchEndY - touchStartY;

    if (diff > swipeThreshold) {
      closeModal();
    }
  });

  // 添加打字机效果（可选）
  function typewriterEffect(element, text, speed = 50) {
    element.textContent = "";
    element.style.opacity = "1";

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  // 添加纸张翻页音效（如果需要的话）
  function playPageTurnSound() {
    // 可以在这里添加音效播放逻辑
    console.log("Page turn sound...");
  }

  // 信封入场动画
  function initEnvelopeAnimation() {
    envelope.style.opacity = "0";
    envelope.style.transform = "translateY(50px) scale(0.8)";
    envelope.style.transition = "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    setTimeout(() => {
      envelope.style.opacity = "1";
      envelope.style.transform = "translateY(0) scale(1)";
    }, 800);
  }

  // 添加信封呼吸动画
  function addBreathingAnimation() {
    setInterval(() => {
      if (!modal.classList.contains("active")) {
        envelope.style.transform = "scale(1.02)";
        setTimeout(() => {
          envelope.style.transform = "scale(1)";
        }, 1000);
      }
    }, 4000);
  }

  // 初始化
  initEnvelopeAnimation();
  addBreathingAnimation();

  // ===============================
  // 翻页功能实现
  // ===============================

  // 初始化翻页控制
  function initializePagination() {
    // 设置总页数
    totalPagesSpan.textContent = totalPages;
    currentPageSpan.textContent = currentPage;

    // 更新按钮状态
    updateNavigationButtons();

    // 绑定翻页事件
    prevBtn.addEventListener("click", goToPreviousPage);
    nextBtn.addEventListener("click", goToNextPage);

    // 键盘导航
    document.addEventListener("keydown", handleKeyboardNavigation);
  }

  // 更新导航按钮状态
  function updateNavigationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    currentPageSpan.textContent = currentPage;
  }

  // 翻到上一页
  function goToPreviousPage() {
    if (currentPage > 1 && !isFlipping) {
      flipToPage(currentPage - 1);
    }
  }

  // 翻到下一页
  function goToNextPage() {
    if (currentPage < totalPages && !isFlipping) {
      flipToPage(currentPage + 1);
    }
  }

  // 翻页核心函数 - 增强真实感
  function flipToPage(targetPage) {
    if (isFlipping || targetPage === currentPage) return;

    isFlipping = true;
    lovePagesContainer.classList.add("flipping");

    const currentPageElement = document.querySelector(
      `.love-page[data-page="${currentPage}"]`
    );
    const targetPageElement = document.querySelector(
      `.love-page[data-page="${targetPage}"]`
    );

    if (!currentPageElement || !targetPageElement) {
      isFlipping = false;
      return;
    }

    // 停止当前页面的动画
    stopAllAnimations();

    // 添加触觉反馈（如果支持）
    addHapticFeedback();

    // 预加载翻页音效
    const flipDirection = targetPage > currentPage ? "forward" : "backward";
    playRealisticPageTurnSound(flipDirection);

    // 翻页动画
    currentPageElement.classList.add("flipping-out");
    targetPageElement.classList.add("flipping-in");

    // 添加页面弯曲效果
    addPageCurlEffect(currentPageElement, targetPageElement, flipDirection);

    setTimeout(() => {
      // 更新页面状态
      currentPageElement.classList.remove("active", "flipping-out");
      targetPageElement.classList.add("active");
      targetPageElement.classList.remove("flipping-in");

      // 更新当前页码
      currentPage = targetPage;
      updateNavigationButtons();

      // 播放页面落下音效
      playPageSettleSound();

      // 开始新页面的手写动画
      setTimeout(() => {
        startHandwritingAnimation(currentPage);
      }, 200);

      // 重置翻页状态
      setTimeout(() => {
        isFlipping = false;
        lovePagesContainer.classList.remove("flipping");
        removePageCurlEffect(currentPageElement, targetPageElement);
      }, 300);
    }, 800); // 增加动画时间以配合新的动画
  }

  // 键盘导航处理
  function handleKeyboardNavigation(e) {
    if (!modal.classList.contains("active")) return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        goToPreviousPage();
        break;
      case "ArrowRight":
        e.preventDefault();
        goToNextPage();
        break;
      case "Home":
        e.preventDefault();
        if (currentPage !== 1) flipToPage(1);
        break;
      case "End":
        e.preventDefault();
        if (currentPage !== totalPages) flipToPage(totalPages);
        break;
    }
  }

  // 重置翻页状态
  function resetPagination() {
    // 停止翻页动画
    isFlipping = false;
    lovePagesContainer.classList.remove("flipping");

    // 重置到第一页
    lovePages.forEach((page, index) => {
      page.classList.remove("active", "flipping-out", "flipping-in");
      if (index === 0) {
        page.classList.add("active");
      }
    });

    currentPage = 1;
    updateNavigationButtons();
  }

  // 添加页面可见性检测，页面切换回来时重新播放动画
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && modal.classList.contains("active")) {
      // 页面重新可见时，重新播放手写动画
      setTimeout(() => {
        startHandwritingAnimation(currentPage);
      }, 500);
    }
  });

  // 为空行添加特殊样式
  function initializeHandwritingLines() {
    lovePages.forEach((page) => {
      const handwritingLines = page.querySelectorAll(".handwriting-line");
      handwritingLines.forEach((line) => {
        if (!line.textContent.trim()) {
          line.style.height = "1.2em";
          line.style.borderBottom = "none";
        }
      });
    });
  }

  // 添加心跳动画给所有签名
  function initializeSignatureAnimations() {
    lovePages.forEach((page) => {
      const signature = page.querySelector(".signature");
      if (signature) {
        setInterval(() => {
          if (page.classList.contains("active") && !isAnimating) {
            signature.style.transform = "scale(1.1)";
            signature.style.color = "#ff6b9d";
            setTimeout(() => {
              signature.style.transform = "scale(1)";
              signature.style.color = "#e74c3c";
            }, 200);
          }
        }, 3000);
      }
    });
  }

  // ===============================
  // 真实翻页效果辅助函数
  // ===============================

  // 触觉反馈
  function addHapticFeedback() {
    if ("vibrate" in navigator) {
      // 轻微的触觉反馈，模拟翻页的感觉
      navigator.vibrate([10, 5, 15]);
    }
  }

  // 真实翻页音效
  function playRealisticPageTurnSound(direction) {
    try {
      // 创建音频上下文（如果支持）
      if (
        typeof AudioContext !== "undefined" ||
        typeof webkitAudioContext !== "undefined"
      ) {
        const audioContext = new (AudioContext || webkitAudioContext)();

        // 生成翻页音效
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 根据翻页方向调整音效
        const baseFreq = direction === "forward" ? 200 : 180;
        oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          baseFreq * 0.5,
          audioContext.currentTime + 0.1
        );

        // 音量包络
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.15
        );

        oscillator.type = "sawtooth";
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      }
    } catch (e) {
      // 如果音频API不支持，静默失败
      console.log("Audio not supported");
    }
  }

  // 页面落下音效
  function playPageSettleSound() {
    try {
      if (
        typeof AudioContext !== "undefined" ||
        typeof webkitAudioContext !== "undefined"
      ) {
        const audioContext = new (AudioContext || webkitAudioContext)();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 轻柔的落下音效
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          100,
          audioContext.currentTime + 0.2
        );

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.05,
          audioContext.currentTime + 0.05
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.2
        );

        oscillator.type = "sine";
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (e) {
      console.log("Audio not supported");
    }
  }

  // 添加页面弯曲效果
  function addPageCurlEffect(currentPage, targetPage, direction) {
    // 为当前页面添加弯曲效果
    if (currentPage) {
      currentPage.style.transformOrigin =
        direction === "forward" ? "left center" : "right center";
    }

    // 为目标页面设置初始状态
    if (targetPage) {
      targetPage.style.transformOrigin =
        direction === "forward" ? "left center" : "right center";
    }
  }

  // 移除页面弯曲效果
  function removePageCurlEffect(currentPage, targetPage) {
    if (currentPage) {
      currentPage.style.transformOrigin = "";
    }
    if (targetPage) {
      targetPage.style.transformOrigin = "";
    }
  }

  // 页面预加载效果
  function preloadPageTransition(targetPage) {
    const targetPageElement = document.querySelector(
      `.love-page[data-page="${targetPage}"]`
    );
    if (targetPageElement) {
      // 预加载目标页面的资源
      targetPageElement.style.willChange = "transform, opacity";

      // 清理预加载状态
      setTimeout(() => {
        targetPageElement.style.willChange = "auto";
      }, 1000);
    }
  }

  // 增强的翻页按钮交互
  function enhanceNavigationButtons() {
    [prevBtn, nextBtn].forEach((btn) => {
      if (!btn) return;

      btn.addEventListener("mousedown", function () {
        this.style.transform = "scale(0.95)";
        addHapticFeedback();
      });

      btn.addEventListener("mouseup", function () {
        this.style.transform = "";
      });

      btn.addEventListener("mouseleave", function () {
        this.style.transform = "";
      });

      // 添加悬停音效
      btn.addEventListener("mouseenter", function () {
        if (!this.disabled) {
          playButtonHoverSound();
        }
      });
    });
  }

  // 按钮悬停音效
  function playButtonHoverSound() {
    try {
      if (
        typeof AudioContext !== "undefined" ||
        typeof webkitAudioContext !== "undefined"
      ) {
        const audioContext = new (AudioContext || webkitAudioContext)();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.02,
          audioContext.currentTime + 0.01
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + 0.05
        );

        oscillator.type = "sine";
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
      }
    } catch (e) {
      console.log("Audio not supported");
    }
  }

  // 初始化所有功能
  initializeHandwritingLines();
  initializeSignatureAnimations();
  enhanceNavigationButtons();
});
