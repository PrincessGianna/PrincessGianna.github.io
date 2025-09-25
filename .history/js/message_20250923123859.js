// 信封交互逻辑 - 简化版本
document.addEventListener("DOMContentLoaded", function () {
  const envelope = document.getElementById("love-envelope");
  const modal = document.getElementById("love-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const handwritingLines = document.querySelectorAll(".handwriting-line");

  // 信封点击事件
  envelope.addEventListener("click", function () {
    // 添加打开动画
    envelope.classList.add("opening");

    // 延迟显示弹窗
    setTimeout(() => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // 开始手写动画
      startHandwritingAnimation();
    }, 600);
  });

  // 关闭弹窗事件
  function closeModal() {
    modal.classList.remove("active");
    envelope.classList.remove("opening");
    document.body.style.overflow = "";

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

  // 手写动画控制
  function startHandwritingAnimation() {
    // 重置所有行的状态
    handwritingLines.forEach((line) => {
      line.style.opacity = "0";
      line.style.transform = "translateY(15px) scale(0.95)";
      line.style.filter = "blur(1px)";
    });

    // 为每行添加动画延迟
    handwritingLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.transition = "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        line.style.opacity = "1";
        line.style.transform = "translateY(0) scale(1)";
        line.style.filter = "blur(0)";

        // 添加轻微的晃动效果
        if (line.textContent.trim() && !line.classList.contains("signature")) {
          setTimeout(() => {
            line.style.transform = "translateY(-2px) scale(1.02)";
            setTimeout(() => {
              line.style.transform = "translateY(0) scale(1)";
            }, 200);
          }, 600);
        }
      }, index * 300 + 500); // 每行延迟300ms，首行延迟500ms
    });
  }

  function resetHandwritingAnimation() {
    handwritingLines.forEach((line) => {
      line.style.opacity = "0";
      line.style.transform = "translateY(15px) scale(0.95)";
      line.style.filter = "blur(1px)";
      line.style.transition = "none";
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
