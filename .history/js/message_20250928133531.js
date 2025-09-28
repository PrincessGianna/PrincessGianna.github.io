// 信封交互逻辑 - 带翻页功能的版本
document.addEventListener("DOMContentLoaded", function () {
  const envelope = document.getElementById("love-envelope");
  const modal = document.getElementById("love-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  
  // 翻页相关元素
  const flipbook = $("#flipbook");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const currentPageSpan = document.getElementById("current-page");
  const totalPagesSpan = document.getElementById("total-pages");
  
  // 翻页书相关变量
  let totalPages = 3;
  let currentPage = 1;
  let isFlipbookInitialized = false;

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

      // 初始化翻页书
      initializeFlipbook();
      
      // 开始手写动画
      setTimeout(() => {
        startHandwritingAnimation();
      }, 300);
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

    // 重置翻页书
    resetFlipbook();
    
    // 重置手写动画
    resetHandwritingAnimation();
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

  // 手写动画控制 - 逐字打字机效果
  function startHandwritingAnimation() {
    // 如果正在动画中，先停止
    if (isAnimating) {
      stopAllAnimations();
    }

    isAnimating = true;

    // 获取当前页面的手写行
    const currentPageElement = flipbook.find('.turn-page').eq(currentPage - 1);
    const handwritingLines = currentPageElement.find('.handwriting-line');

    // 重置当前页面所有行的状态
    handwritingLines.each(function(index, line) {
      $(line).css({
        opacity: "1",
        transform: "translateY(0) scale(1)",
        filter: "blur(0)"
      });

      // 保存原始文本并清空显示
      if (!line.dataset.originalText) {
        line.dataset.originalText = line.textContent;
      }
      line.textContent = "";
    });

    // 逐行逐字打字效果
    let totalDelay = 800; // 初始延迟

    handwritingLines.each(function(lineIndex, line) {
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
            if (!$(line).hasClass("signature")) {
              const effectTimeout = setTimeout(() => {
                if (!isAnimating) return;
                $(line).css({
                  transition: "transform 0.3s ease",
                  transform: "translateY(-1px) scale(1.01)"
                });
                const resetTimeout = setTimeout(() => {
                  if (isAnimating) {
                    $(line).css("transform", "translateY(0) scale(1)");
                  }
                }, 200);
                animationTimeouts.push(resetTimeout);
              }, 300);
              animationTimeouts.push(effectTimeout);
            } else {
              // 签名特殊效果
              const signatureTimeout = setTimeout(() => {
                if (!isAnimating) return;
                $(line).css({
                  transition: "all 0.5s ease",
                  color: "#ff6b9d",
                  transform: "scale(1.05)"
                });
                const signatureResetTimeout = setTimeout(() => {
                  if (isAnimating) {
                    $(line).css({
                      color: "#e74c3c",
                      transform: "scale(1)"
                    });
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

  // 添加页面可见性检测，页面切换回来时重新播放动画
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && modal.classList.contains("active")) {
      // 页面重新可见时，重新播放手写动画
      setTimeout(() => {
        startHandwritingAnimation();
      }, 500);
    }
  });

  // 为空行添加特殊样式
  handwritingLines.forEach((line) => {
    if (!line.textContent.trim()) {
      line.style.height = "1.2em";
      line.style.borderBottom = "none";
    }
  });

  // 添加心跳动画给签名
  const signature = document.querySelector(".signature");
  if (signature) {
    setInterval(() => {
      signature.style.transform = "scale(1.1)";
      signature.style.color = "#ff6b9d";
      setTimeout(() => {
        signature.style.transform = "scale(1)";
        signature.style.color = "#e74c3c";
      }, 200);
    }, 3000);
  }
});
