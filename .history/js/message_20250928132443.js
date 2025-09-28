document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  //   核心元素获取
  // ===============================
  const envelope = document.getElementById("love-envelope");
  const modal = document.getElementById("love-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");

  // 翻页相关元素
  const flipbook = document.getElementById("love-flipbook");
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const pageIndicator = document.getElementById("page-indicator");

  // ===============================
  //   翻页系统变量
  // ===============================
  let currentPage = 1;
  const totalPages = 3;
  let isAnimating = false;

  // 动画控制变量
  let animationTimeouts = [];
  let isHandwritingActive = false;

  // ===============================
  //   工具函数
  // ===============================
  
  // 清除所有动画定时器
  function stopAllAnimations() {
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];
    isHandwritingActive = false;
  }

  // 获取指定页面的元素
  function getPageElement(pageNumber) {
    return flipbook.querySelector(`.page:nth-child(${pageNumber})`);
  }

  // 获取当前页面的手写行
  function getCurrentPageLines(pageNumber = currentPage) {
    const pageElement = getPageElement(pageNumber);
    if (!pageElement) return [];
    
    const lovePage = pageElement.querySelector('.love-page');
    if (!lovePage) return [];
    
    return lovePage.querySelectorAll(".handwriting-line");
  }

  // ===============================
  //   翻页系统核心函数
  // ===============================
  
  // 初始化翻页系统
  function initializeFlipbook() {
    console.log("初始化纯CSS翻页系统");
    
    // 初始化页面状态
    for (let i = 1; i <= totalPages; i++) {
      const page = getPageElement(i);
      const lovePage = page?.querySelector('.love-page');
      
      if (page && lovePage) {
        // 移除所有状态类
        page.classList.remove('current', 'next', 'prev', 'flipping-next', 'flipping-prev');
        lovePage.classList.remove('active');
        
        // 设置初始状态
        if (i === 1) {
          page.classList.add('current');
          lovePage.classList.add('active');
        } else if (i === 2) {
          page.classList.add('next');
        } else {
          page.classList.add('prev');
        }
        
        // 初始化文本内容
        initializePageContent(i);
      }
    }
    
    // 更新控制器状态
    updatePageIndicator();
    updateNavigationButtons();
    
    // 开始第一页的打字动画
    setTimeout(() => {
      startHandwritingAnimation(1);
    }, 500);
  }

  // 翻页到指定页面
  function goToPage(targetPage) {
    if (isAnimating || targetPage < 1 || targetPage > totalPages || targetPage === currentPage) {
      return;
    }
    
    console.log(`翻页: ${currentPage} -> ${targetPage}`);
    isAnimating = true;
    stopAllAnimations();
    
    const isNext = targetPage > currentPage;
    const currentPageElement = getPageElement(currentPage);
    const targetPageElement = getPageElement(targetPage);
    
    if (!currentPageElement || !targetPageElement) {
      isAnimating = false;
      return;
    }
    
    // 开始翻页动画
    if (isNext) {
      currentPageElement.classList.add('flipping-next');
    } else {
      currentPageElement.classList.add('flipping-prev');
    }
    
    // 动画完成后更新状态
    setTimeout(() => {
      // 移除动画类
      currentPageElement.classList.remove('flipping-next', 'flipping-prev');
      
      // 更新所有页面状态
      updateAllPageStates(targetPage);
      
      // 更新当前页面
      currentPage = targetPage;
      updatePageIndicator();
      updateNavigationButtons();
      
      isAnimating = false;
      
      // 开始新页面的打字动画
      setTimeout(() => {
        startHandwritingAnimation(currentPage);
      }, 200);
      
    }, 800); // 与CSS动画时间匹配
  }

  // 更新所有页面的状态
  function updateAllPageStates(newCurrentPage) {
    for (let i = 1; i <= totalPages; i++) {
      const page = getPageElement(i);
      const lovePage = page?.querySelector('.love-page');
      
      if (page && lovePage) {
        // 清除所有状态类
        page.classList.remove('current', 'next', 'prev');
        lovePage.classList.remove('active');
        
        // 设置新状态
        if (i === newCurrentPage) {
          page.classList.add('current');
          lovePage.classList.add('active');
        } else if (i > newCurrentPage) {
          page.classList.add('next');
        } else {
          page.classList.add('prev');
        }
      }
    }
  }

  // 更新页面指示器
  function updatePageIndicator() {
    if (pageIndicator) {
      pageIndicator.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
    }
  }

  // 更新导航按钮
  function updateNavigationButtons() {
    if (prevButton) {
      prevButton.disabled = currentPage <= 1 || isAnimating;
    }
    if (nextButton) {
      nextButton.disabled = currentPage >= totalPages || isAnimating;
    }
  }

  // ===============================
  //   打字机效果系统
  // ===============================
  
  // 初始化页面内容
  function initializePageContent(pageNumber) {
    const handwritingLines = getCurrentPageLines(pageNumber);
    
    handwritingLines.forEach((line) => {
      // 保存原始文本
      if (!line.dataset.originalText) {
        line.dataset.originalText = line.textContent;
      }
      
      // 清空显示文本，保持布局
      line.textContent = "";
      line.style.opacity = "0";
      line.style.transform = "translateY(15px) scale(0.95)";
      line.style.filter = "blur(1px)";
      line.style.transition = "none";
      
      // 为空行添加特殊样式
      if (!line.dataset.originalText.trim()) {
        line.style.height = "1.2em";
        line.style.borderBottom = "none";
      }
    });
  }

  // 重置手写动画
  function resetHandwritingAnimation() {
    stopAllAnimations();

    // 重置所有页面的手写行
    for (let i = 1; i <= totalPages; i++) {
      const handwritingLines = getCurrentPageLines(i);
      handwritingLines.forEach((line) => {
        line.textContent = "";
        line.style.opacity = "0";
        line.style.transform = "translateY(15px) scale(0.95)";
        line.style.filter = "blur(1px)";
        line.style.transition = "none";
        line.style.color = "";
        line.style.height = "";
        line.classList.remove("handwriting-shake");
      });
    }
  }

  // 开始手写动画
  function startHandwritingAnimation(pageNumber = currentPage) {
    if (isHandwritingActive) {
      return;
    }
    
    console.log(`开始页面 ${pageNumber} 的打字动画`);
    isHandwritingActive = true;
    
    const handwritingLines = getCurrentPageLines(pageNumber);
    if (handwritingLines.length === 0) {
      isHandwritingActive = false;
      return;
    }

    // 重置当前页面的所有行
    handwritingLines.forEach((line) => {
      line.textContent = "";
      line.style.opacity = "0";
      line.style.transform = "translateY(15px) scale(0.95)";
      line.style.filter = "blur(1px)";
      line.style.transition = "none";
    });

    let currentLineIndex = 0;

    function animateNextLine() {
      if (!isHandwritingActive || currentLineIndex >= handwritingLines.length) {
        return;
      }

      const line = handwritingLines[currentLineIndex];
      const originalText = line.dataset.originalText || "";

      // 如果是空行，直接跳过到下一行
      if (!originalText.trim()) {
        line.style.height = "1.2em";
        line.style.opacity = "0.3";
        currentLineIndex++;
        
        const timeout = setTimeout(() => {
          animateNextLine();
        }, 200);
        animationTimeouts.push(timeout);
        return;
      }

      // 开始行的入场动画
      line.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      line.style.opacity = "1";
      line.style.transform = "translateY(0) scale(1)";
      line.style.filter = "blur(0)";

      // 开始打字效果
      let charIndex = 0;
      
      function typeCharacter() {
        if (!isHandwritingActive || charIndex >= originalText.length) {
          // 当前行完成，继续下一行
          currentLineIndex++;
          const timeout = setTimeout(() => {
            animateNextLine();
          }, getLineDelay());
          animationTimeouts.push(timeout);
          return;
        }

        const currentText = originalText.substring(0, charIndex + 1);
        line.textContent = currentText;

        // 添加轻微抖动效果
        if (Math.random() < 0.1) {
          line.classList.add("handwriting-shake");
          const timeout = setTimeout(() => {
            line.classList.remove("handwriting-shake");
          }, 100);
          animationTimeouts.push(timeout);
        }

        charIndex++;
        const timeout = setTimeout(typeCharacter, getTypingSpeed());
        animationTimeouts.push(timeout);
      }

      // 延迟开始打字
      const timeout = setTimeout(typeCharacter, 300);
      animationTimeouts.push(timeout);
    }

    // 开始动画
    animateNextLine();
  }

  // 获取打字速度
  function getTypingSpeed() {
    const baseSpeed = 50; // 基础速度
    return baseSpeed + Math.random() * 30 - 15; // 添加随机性
  }

  // 获取行间延迟
  function getLineDelay() {
    return 300 + Math.random() * 200;
  }

  // ===============================
  //   事件监听器
  // ===============================
  
  // 信封点击事件
  envelope.addEventListener("click", function () {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    
    // 初始化翻页系统
    setTimeout(() => {
      initializeFlipbook();
    }, 100);
  });

  // 关闭模态框
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    stopAllAnimations();
    currentPage = 1;
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  // 翻页按钮事件
  if (prevButton) {
    prevButton.addEventListener("click", function () {
      goToPage(currentPage - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      goToPage(currentPage + 1);
    });
  }

  // 键盘导航
  document.addEventListener("keydown", function (e) {
    if (modal.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPage(currentPage - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToPage(currentPage + 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    }
  });

  // ===============================
  //   信封悬停效果增强
  // ===============================
  envelope.addEventListener("mouseenter", function () {
    const hearts = document.querySelectorAll(".floating-heart");
    hearts.forEach((heart, index) => {
      const timeout = setTimeout(() => {
        heart.style.animation = "heartFloat 2s ease-in-out infinite";
      }, index * 100);
      animationTimeouts.push(timeout);
    });
  });

  // ===============================
  //   初始化
  // ===============================
  
  // 页面加载完成后初始化
  setTimeout(() => {
    console.log("Message页面初始化完成");
    
    // 初始化所有页面内容
    for (let i = 1; i <= totalPages; i++) {
      initializePageContent(i);
    }
    
    // 添加签名动画
    const signatures = document.querySelectorAll(".signature");
    signatures.forEach(signature => {
      setInterval(() => {
        signature.style.transform = "scale(1.1)";
        signature.style.color = "#ff6b9d";
        setTimeout(() => {
          signature.style.transform = "scale(1)";
          signature.style.color = "#e74c3c";
        }, 200);
      }, 3000);
    });
    
  }, 100);
});