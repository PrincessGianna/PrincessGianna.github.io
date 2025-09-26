/**
 * 画廊功能控制器
 * 负责照片画廊的筛选、模态框、懒加载等功能
 */

// 画廊状态管理
const galleryState = {
  currentFilter: "all",
  currentImageIndex: 0,
  images: [],
  filteredImages: [],
  isModalOpen: false,
  isLoading: false,
  loadedCount: 0,
  totalCount: 0,
  scrollPosition: null,
};

// DOM元素缓存
const galleryElements = {
  filterTabs: null,
  galleryGrid: null,
  galleryItems: null,
  modal: null,
  modalImage: null,
  modalTitle: null,
  modalDate: null,
  modalDescription: null,
  modalClose: null,
  modalPrev: null,
  modalNext: null,
  loadMoreBtn: null,
};

// ===============================
// 画廊初始化
// ===============================

/**
 * 初始化画廊功能
 */
function initializeGallery() {
  // 缓存DOM元素
  cacheGalleryElements();

  // 初始化图片数据
  initializeImageData();

  // 初始化筛选功能
  initializeFilters();

  // 初始化模态框
  initializeModal();

  // 初始化懒加载
  initializeLazyLoading();

  // 初始化加载更多功能
  initializeLoadMore();

  // 初始化键盘导航
  initializeKeyboardNavigation();

  // 初始化触摸手势
  initializeTouchGestures();

  console.log("Gallery initialized");
}

/**
 * 缓存DOM元素
 */
function cacheGalleryElements() {
  galleryElements.filterTabs = utils.$$(".filter-tab");
  galleryElements.galleryGrid = utils.$("#gallery-grid");
  galleryElements.galleryItems = utils.$$(".gallery-item");
  galleryElements.modal = utils.$("#photo-modal");
  galleryElements.modalImage = utils.$("#modal-image");
  galleryElements.modalTitle = utils.$("#modal-title");
  galleryElements.modalDate = utils.$("#modal-date");
  galleryElements.modalDescription = utils.$("#modal-description");
  galleryElements.modalClose = utils.$("#modal-close");
  galleryElements.modalPrev = utils.$("#modal-prev");
  galleryElements.modalNext = utils.$("#modal-next");
  galleryElements.loadMoreBtn = utils.$("#load-more-btn");
  
  // 调试：检查关键元素是否找到
  console.log("🔧 Gallery elements cached:");
  console.log("📷 Modal:", galleryElements.modal);
  console.log("🏷️ Modal title:", galleryElements.modalTitle);
  console.log("📅 Modal date:", galleryElements.modalDate);
  console.log("📝 Modal description:", galleryElements.modalDescription);
  
  // 如果description元素找不到，提供详细信息
  if (!galleryElements.modalDescription) {
    console.error("❌ CRITICAL: modal-description element not found!");
    console.log("🔍 Checking if element exists in DOM:");
    const descElement = document.getElementById("modal-description");
    console.log("📋 Direct getElementById result:", descElement);
    console.log("🔍 Available modal elements:");
    const modal = document.getElementById("photo-modal");
    if (modal) {
      const allElements = modal.querySelectorAll("*");
      allElements.forEach(el => {
        if (el.id) console.log(`  - ${el.tagName.toLowerCase()}#${el.id}`);
      });
    }
  }
}

/**
 * 生成单个图片的HTML
 */
function createImageHTML(imageData, index) {
  return `
    <div class="gallery-item" data-year="${imageData.year}" data-category="${
    imageData.year
  }" data-index="${index}">
      <div class="gallery-card">
        <div class="gallery-image">
          <img 
            src="${imageData.image}" 
            alt="${imageData.title}"
            loading="lazy"
          />
          <div class="image-overlay">
            <div class="overlay-content">
              <div class="image-info">
                <h3 class="image-title">${imageData.title}</h3>
                <p class="image-date">${imageData.date}</p>
              </div>
              <button class="view-btn" onclick="openModal(${index})" data-image="${
    index + 1
  }">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 初始化图片数据
 */
function initializeImageData() {
  // 检查galleryData是否存在
  if (typeof galleryData === "undefined") {
    console.error(
      "Gallery data not found! Make sure gallery_data.js is loaded."
    );
    return;
  }

  // 生成所有图片的HTML
  const galleryHTML = galleryData
    .map((imageData, index) => createImageHTML(imageData, index))
    .join("");

  // 插入到画廊容器中
  if (galleryElements.galleryGrid) {
    galleryElements.galleryGrid.innerHTML = galleryHTML;
  }

  // 重新获取生成的图片元素
  galleryElements.galleryItems =
    galleryElements.galleryGrid.querySelectorAll(".gallery-item");

  // 转换为内部数据格式
  galleryState.images = galleryData.map((data, index) => {
    const element = galleryElements.galleryItems[index];

    const imageData = {
      id: data.id,
      src: data.image,
      alt: data.title,
      title: data.title,
      date: data.date,
      categories: [], // 不使用类别，只使用年份筛选
      year: data.year,
      element: element,
      loaded: false,
      description: data.description,
    };

    // 添加点击事件
    if (element) {
      element.addEventListener("click", () => openModal(index));
      element.style.display = "";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.hidden = false;
      utils.addClass(element, "show");
    }

    console.log(
      "Initialized image:",
      index,
      imageData.title,
      "Year:",
      imageData.year
    );
    return imageData;
  });

  galleryState.filteredImages = [...galleryState.images];
  galleryState.totalCount = galleryState.images.length;

  console.log("Gallery initialized with", galleryState.totalCount, "images");
}

// ===============================
// 筛选功能
// ===============================

/**
 * 初始化筛选功能
 */
function initializeFilters() {
  if (!galleryElements.filterTabs.length) return;

  galleryElements.filterTabs.forEach((tab) => {
    tab.addEventListener("click", handleFilterClick);
  });

  // 更新筛选计数
  updateFilterCounts();

  // 设置初始筛选状态
  applyFilter(galleryState.currentFilter);
}

/**
 * 处理筛选标签点击
 */
function handleFilterClick(e) {
  const tab = e.currentTarget;
  const filter = tab.dataset.filter;

  console.log(
    "Filter clicked:",
    filter,
    "Current filter:",
    galleryState.currentFilter
  );

  if (filter === galleryState.currentFilter) return;

  // 更新活动标签
  updateActiveFilterTab(tab);

  // 应用筛选
  applyFilter(filter);

  // 更新URL（可选）
  updateURLWithFilter(filter);
}

/**
 * 更新活动筛选标签
 */
function updateActiveFilterTab(activeTab) {
  galleryElements.filterTabs.forEach((tab) => {
    utils.removeClass(tab, "active");
  });
  utils.addClass(activeTab, "active");
}

/**
 * 应用筛选
 */
function applyFilter(filter) {
  console.log("Applying filter:", filter);
  galleryState.currentFilter = filter;

  // 筛选图片
  if (filter === "all") {
    galleryState.filteredImages = [...galleryState.images];
  } else {
    galleryState.filteredImages = galleryState.images.filter((image) => {
      console.log(
        "Checking image:",
        image.title,
        "Categories:",
        image.categories,
        "Year:",
        image.year,
        "Filter:",
        filter
      );

      // 检查年份筛选（例如：'2024', '2023'等）
      if (filter.match(/^\d{4}$/)) {
        const matches = image.year === filter;
        console.log("Year filter match:", matches);
        return matches;
      }
      // 检查类别筛选（例如：'travel', 'daily', 'special'）
      const matches = image.categories.includes(filter);
      console.log("Category filter match:", matches);
      return matches;
    });
  }

  console.log(
    "Filtered images:",
    galleryState.filteredImages.length,
    "out of",
    galleryState.images.length
  );

  // 应用筛选动画
  animateFilterTransition();

  // 更新计数
  updateFilterCounts();
}

/**
 * 筛选过渡动画
 */
function animateFilterTransition() {
  const animationDelay = 50;
  const raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : (cb) => setTimeout(cb, 0);

  console.log(
    "Starting filter animation with",
    galleryState.filteredImages.length,
    "filtered images out of",
    galleryState.images.length,
    "total images"
  );

  galleryState.images.forEach((image, index) => {
    const item = image.element;
    if (!item) return;

    const shouldShow = galleryState.filteredImages.some(
      (filteredImage) => filteredImage.id === image.id
    );
    console.log("Image", image.title, "should show:", shouldShow);

    if (shouldShow) {
      // 显示元素
      item.hidden = false;
      item.style.display = "";
      item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";

      raf(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
        utils.addClass(item, "show");
      });
    } else {
      // 隐藏元素
      utils.removeClass(item, "show");
      item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";

      setTimeout(() => {
        if (item.style.opacity === "0") {
          // 确保没有被其他操作改变
          item.style.display = "none";
          item.hidden = true;
        }
      }, 300);
    }
  });

  raf(rearrangeGrid);
}

/**
 * 重新排列网格
 */
function rearrangeGrid() {
  if (!galleryElements.galleryGrid) return;

  // 使用CSS Grid的自动排列功能
  galleryElements.galleryGrid.style.opacity = "0.8";

  setTimeout(() => {
    galleryElements.galleryGrid.style.opacity = "1";
  }, 150);
}

/**
 * 更新筛选计数
 */
function updateFilterCounts() {
  galleryElements.filterTabs.forEach((tab) => {
    const filter = tab.dataset.filter;
    const countElement = tab.querySelector(".tab-count");

    if (countElement) {
      let count = 0;

      if (filter === "all") {
        count = galleryState.images.length;
      } else {
        count = galleryState.images.filter((image) => {
          // 检查年份筛选（例如：'2024', '2023'等）
          if (filter.match(/^\d{4}$/)) {
            return image.year === filter;
          }
          // 检查类别筛选（例如：'travel', 'daily', 'special'）
          return image.categories.includes(filter);
        }).length;
      }

      countElement.textContent = count;
    }
  });
}

/**
 * 更新URL
 */
function updateURLWithFilter(filter) {
  const url = new URL(window.location);
  url.searchParams.set("filter", filter);
  window.history.replaceState({}, "", url);
}

// ===============================
// 模态框功能
// ===============================

/**
 * 初始化模态框
 */
function initializeModal() {
  if (!galleryElements.modal) return;

  // 注意：图片事件绑定已经在bindImageEvents函数中处理
  // 这里只处理模态框的其他功能

  // 绑定关闭模态框事件
  if (galleryElements.modalClose) {
    galleryElements.modalClose.addEventListener("click", closeModal);
  }

  // 绑定导航按钮
  if (galleryElements.modalPrev) {
    galleryElements.modalPrev.addEventListener("click", showPreviousImage);
  }

  if (galleryElements.modalNext) {
    galleryElements.modalNext.addEventListener("click", showNextImage);
  }

  // 点击背景关闭模态框
  galleryElements.modal.addEventListener("click", (e) => {
    if (e.target === galleryElements.modal) {
      closeModal();
    }
  });
}

/**
 * 打开模态框
 */
function openModal(imageIndex) {
  // imageIndex是图片在galleryState.images中的索引
  // 需要在filteredImages中找到对应的索引
  const imageData = galleryState.images[imageIndex];
  if (!imageData) return;

  const filteredIndex = galleryState.filteredImages.findIndex(
    (img) => img.id === imageData.id
  );
  if (filteredIndex === -1) return;

  galleryState.currentImageIndex = filteredIndex;
  galleryState.isModalOpen = true;

  // 保存当前滚动位置
  galleryState.scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  // 显示模态框
  utils.addClass(galleryElements.modal, "show");

  // 加载并显示图片
  loadModalImage();

  // 禁用背景滚动 - 使用业界标准方法
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = "17px"; // 补偿滚动条宽度，防止页面跳动

  // 智能居中：确保模态框在最佳观看位置
  setTimeout(() => {
    const modalContent = galleryElements.modal.querySelector(".modal-content");
    const modalRect = modalContent
      ? modalContent.getBoundingClientRect()
      : galleryElements.modal.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

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

  // 添加模态框打开动画
  if (window.animations) {
    const modalContent = galleryElements.modal.querySelector(".modal-content");
    const modalImage = galleryElements.modal.querySelector(".modal-image");
    const modalInfo = galleryElements.modal.querySelector(".modal-info");

    utils.addClass(modalContent, "modal-enter");

    // 延迟添加图片和信息动画
    setTimeout(() => {
      if (modalImage) utils.addClass(modalImage, "modal-image-enter");
      if (modalInfo) utils.addClass(modalInfo, "modal-info-enter");
    }, 200);
  }
}

/**
 * 关闭模态框
 */
function closeModal() {
  if (!galleryState.isModalOpen) return;

  galleryState.isModalOpen = false;

  // 添加关闭动画
  if (window.animations) {
    const modalContent = galleryElements.modal.querySelector(".modal-content");
    const modalImage = galleryElements.modal.querySelector(".modal-image");
    const modalInfo = galleryElements.modal.querySelector(".modal-info");

    utils.addClass(modalContent, "modal-exit");
    utils.removeClass(modalContent, "modal-enter");

    setTimeout(() => {
      utils.removeClass(galleryElements.modal, "show");
      utils.removeClass(modalContent, "modal-exit");
      if (modalImage) utils.removeClass(modalImage, "modal-image-enter");
      if (modalInfo) utils.removeClass(modalInfo, "modal-info-enter");
    }, 400);
  } else {
    utils.removeClass(galleryElements.modal, "show");
  }

  // 恢复背景滚动 - 业界标准方法
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";

  // 恢复滚动位置
  if (typeof galleryState.scrollPosition === "number") {
    window.scrollTo(0, galleryState.scrollPosition);
    galleryState.scrollPosition = null;
  }
}

/**
 * 加载模态框图片
 */
function loadModalImage() {
  const currentImage =
    galleryState.filteredImages[galleryState.currentImageIndex];
  if (!currentImage) return;

  // 显示加载状态
  if (galleryElements.modalImage) {
    galleryElements.modalImage.style.opacity = "0.5";
  }

  // 预加载图片
  const img = new Image();
  img.onload = () => {
    // 更新模态框内容
    updateModalContent(currentImage);

    // 恢复图片显示
    if (galleryElements.modalImage) {
      galleryElements.modalImage.style.opacity = "1";
    }
  };

  img.onerror = () => {
    console.error("Failed to load image:", currentImage.src);
    if (galleryElements.modalImage) {
      galleryElements.modalImage.style.opacity = "1";
    }
  };

  img.src = currentImage.src;
}

/**
 * 更新模态框内容
 */
function updateModalContent(image) {
  console.log("🔍 Updating modal content for image:", image);
  console.log("📝 Description value:", image.description);
  console.log("🎯 Modal description element:", galleryElements.modalDescription);
  
  if (galleryElements.modalImage) {
    galleryElements.modalImage.src = image.src;
    galleryElements.modalImage.alt = image.alt;
  }

  if (galleryElements.modalTitle) {
    galleryElements.modalTitle.textContent = image.title;
    console.log("✅ Title updated:", image.title);
  }

  if (galleryElements.modalDate) {
    galleryElements.modalDate.textContent = image.date;
    console.log("✅ Date updated:", image.date);
  }

  if (galleryElements.modalDescription) {
    galleryElements.modalDescription.textContent = image.description;
    console.log("✅ Description updated:", image.description);
    console.log("📏 Description element display:", window.getComputedStyle(galleryElements.modalDescription).display);
    console.log("🔍 Description element visibility:", window.getComputedStyle(galleryElements.modalDescription).visibility);
    console.log("💫 Description element opacity:", window.getComputedStyle(galleryElements.modalDescription).opacity);
  } else {
    console.error("❌ Modal description element not found!");
  }

  // 更新导航按钮状态
  updateModalNavigation();
}

/**
 * 更新模态框导航
 */
function updateModalNavigation() {
  const isFirst = galleryState.currentImageIndex === 0;
  const isLast =
    galleryState.currentImageIndex === galleryState.filteredImages.length - 1;

  if (galleryElements.modalPrev) {
    galleryElements.modalPrev.style.opacity = isFirst ? "0.5" : "1";
    galleryElements.modalPrev.style.pointerEvents = isFirst ? "none" : "auto";
  }

  if (galleryElements.modalNext) {
    galleryElements.modalNext.style.opacity = isLast ? "0.5" : "1";
    galleryElements.modalNext.style.pointerEvents = isLast ? "none" : "auto";
  }
}

/**
 * 显示上一张图片
 */
function showPreviousImage() {
  if (galleryState.currentImageIndex > 0) {
    galleryState.currentImageIndex--;
    loadModalImage();
  }
}

/**
 * 显示下一张图片
 */
function showNextImage() {
  if (galleryState.currentImageIndex < galleryState.filteredImages.length - 1) {
    galleryState.currentImageIndex++;
    loadModalImage();
  }
}

// ===============================
// 懒加载功能
// ===============================

/**
 * 初始化懒加载
 */
function initializeLazyLoading() {
  if (!window.IntersectionObserver) {
    // 降级处理：直接加载所有图片
    galleryState.images.forEach((image) => {
      loadGalleryImage(image);
    });
    return;
  }

  const lazyLoadObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const imageData = galleryState.images.find(
            (img) => img.element === item
          );

          if (imageData && !imageData.loaded) {
            loadGalleryImage(imageData);
            lazyLoadObserver.unobserve(item);
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  // 观察所有画廊项目
  galleryState.images.forEach((image) => {
    lazyLoadObserver.observe(image.element);
  });
}

/**
 * 加载单张图片
 */
function loadGalleryImage(imageData) {
  const img = imageData.element.querySelector("img");
  if (!img || imageData.loaded) return;

  // 添加加载状态
  utils.addClass(img, "image-lazy-load");

  // 创建新的图片元素进行预加载
  const newImg = new Image();

  newImg.onload = () => {
    // 更新图片源
    img.src = newImg.src;

    // 添加加载完成状态
    utils.addClass(img, "loaded");
    utils.removeClass(img, "image-lazy-load");

    // 更新加载状态
    imageData.loaded = true;
    galleryState.loadedCount++;

    // 触发显示动画
    setTimeout(() => {
      utils.addClass(imageData.element, "show");
    }, 100);

    // 更新加载进度
    updateLoadingProgress();
  };

  newImg.onerror = () => {
    console.error("Failed to load image:", imageData.src);
    utils.removeClass(img, "image-lazy-load");
  };

  newImg.src = imageData.src;
}

/**
 * 更新加载进度
 */
function updateLoadingProgress() {
  const progress = (galleryState.loadedCount / galleryState.totalCount) * 100;

  // 这里可以更新进度条或其他加载指示器
  console.log(`Loading progress: ${Math.round(progress)}%`);

  if (galleryState.loadedCount === galleryState.totalCount) {
    console.log("All images loaded");
    onAllImagesLoaded();
  }
}

/**
 * 所有图片加载完成后的回调
 */
function onAllImagesLoaded() {
  // 启动画廊动画
  if (window.animations) {
    galleryState.images.forEach((image, index) => {
      setTimeout(() => {
        utils.addClass(image.element, "gallery-loaded");
      }, index * 50);
    });
  }

  // 显示加载更多按钮
  if (galleryElements.loadMoreBtn) {
    utils.addClass(galleryElements.loadMoreBtn, "show");
  }
}

// ===============================
// 加载更多功能
// ===============================

/**
 * 初始化加载更多功能
 */
function initializeLoadMore() {
  if (!galleryElements.loadMoreBtn) return;

  galleryElements.loadMoreBtn.addEventListener("click", handleLoadMore);
}

/**
 * 处理加载更多
 */
function handleLoadMore() {
  if (galleryState.isLoading) return;

  galleryState.isLoading = true;

  // 显示加载状态
  const spinner = galleryElements.loadMoreBtn.querySelector(".load-spinner");
  const text = galleryElements.loadMoreBtn.querySelector(".load-text");

  if (spinner) spinner.style.display = "block";
  if (text) text.textContent = "加载中...";

  // 模拟异步加载
  setTimeout(() => {
    loadMoreImages();
  }, 1500);
}

/**
 * 加载更多图片
 */
function loadMoreImages() {
  // 这里可以从服务器获取更多图片
  // 现在只是模拟添加一些示例图片

  const newImages = generateMoreImages(6);

  newImages.forEach((imageData, index) => {
    setTimeout(() => {
      addImageToGallery(imageData);
    }, index * 100);
  });

  // 重置加载状态
  setTimeout(() => {
    galleryState.isLoading = false;

    const spinner = galleryElements.loadMoreBtn.querySelector(".load-spinner");
    const text = galleryElements.loadMoreBtn.querySelector(".load-text");

    if (spinner) spinner.style.display = "none";
    if (text) text.textContent = "加载更多回忆";
  }, 800);
}

/**
 * 生成更多图片数据
 */
function generateMoreImages(count) {
  const categories = ["2024", "2023", "travel", "daily", "special"];
  const newImages = [];

  for (let i = 0; i < count; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const imageId = galleryState.images.length + i;

    newImages.push({
      id: imageId,
      src: `https://picsum.photos/400/300?random=${imageId + 100}`,
      alt: `新照片 ${imageId}`,
      title: `新的美好回忆 ${imageId}`,
      date: "2024.07.01",
      categories: [randomCategory],
      year: randomCategory.match(/\d{4}/) ? randomCategory : "2024",
      loaded: false,
      description: `这是第 ${imageId} 张新加载的照片，记录了更多美好时刻。`,
    });
  }

  return newImages;
}

/**
 * 添加图片到画廊
 */
function addImageToGallery(imageData) {
  // 创建画廊项目元素
  const galleryItem = createGalleryItemElement(imageData);

  // 添加到DOM
  if (galleryElements.galleryGrid) {
    galleryElements.galleryGrid.appendChild(galleryItem);
  }

  // 更新数据
  imageData.element = galleryItem;
  galleryState.images.push(imageData);
  galleryState.totalCount++;

  // 如果符合当前筛选条件，添加到筛选列表
  if (
    galleryState.currentFilter === "all" ||
    imageData.categories.includes(galleryState.currentFilter) ||
    imageData.year === galleryState.currentFilter
  ) {
    galleryState.filteredImages.push(imageData);
  }

  // 绑定事件
  bindImageEvents(imageData);

  // 启动懒加载
  if (window.IntersectionObserver) {
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !imageData.loaded) {
          loadGalleryImage(imageData);
          lazyLoadObserver.unobserve(entry.target);
        }
      });
    });

    lazyLoadObserver.observe(galleryItem);
  } else {
    loadGalleryImage(imageData);
  }

  // 入场动画
  setTimeout(() => {
    utils.addClass(galleryItem, "show");
  }, 100);

  // 更新筛选计数
  updateFilterCounts();
}

/**
 * 创建画廊项目元素
 */
function createGalleryItemElement(imageData) {
  const item = utils.createElement("div", "gallery-item fade-in-up");
  item.dataset.category = imageData.categories.join(" ");
  item.dataset.year = imageData.year;

  item.innerHTML = `
    <div class="gallery-card">
      <div class="gallery-image">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E" alt="${imageData.alt}" loading="lazy">
        <div class="image-overlay">
          <div class="overlay-content">
            <h3 class="image-title">${imageData.title}</h3>
            <p class="image-date">${imageData.date}</p>
            <button class="view-btn" data-image="${imageData.id}">
              <svg viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  return item;
}

/**
 * 绑定图片事件
 */
function bindImageEvents(imageData) {
  const viewBtn = imageData.element.querySelector(".view-btn");
  const img = imageData.element.querySelector("img");

  if (viewBtn) {
    viewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const imageIndex = galleryState.images.findIndex(
        (img) => img.id === imageData.id
      );
      openModal(imageIndex);
    });
  }

  if (img) {
    img.addEventListener("click", () => {
      const imageIndex = galleryState.images.findIndex(
        (img) => img.id === imageData.id
      );
      openModal(imageIndex);
    });
  }
}

// ===============================
// 键盘导航
// ===============================

/**
 * 初始化键盘导航
 */
function initializeKeyboardNavigation() {
  document.addEventListener("keydown", handleKeyboardNavigation);
}

/**
 * 处理键盘导航
 */
function handleKeyboardNavigation(e) {
  if (!galleryState.isModalOpen) return;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      showPreviousImage();
      break;

    case "ArrowRight":
      e.preventDefault();
      showNextImage();
      break;

    case "Escape":
      e.preventDefault();
      closeModal();
      break;

    case " ":
      e.preventDefault();
      showNextImage();
      break;
  }
}

// ===============================
// 触摸手势
// ===============================

/**
 * 初始化触摸手势
 */
function initializeTouchGestures() {
  if (!galleryElements.modal || !utils.device.isTouchDevice()) return;

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  galleryElements.modalImage.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  });

  galleryElements.modalImage.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  galleryElements.modalImage.addEventListener("touchend", (e) => {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // 检查是否为水平滑动
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        showPreviousImage();
      } else {
        showNextImage();
      }
    }

    // 检查是否为向下滑动关闭
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
      closeModal();
    }

    isDragging = false;
  });
}

// ===============================
// 工具函数
// ===============================

/**
 * 获取图片索引
 */
function getImageIndex(imageId) {
  return galleryState.images.findIndex((img) => img.id === imageId);
}

/**
 * 获取筛选后的图片索引
 */
function getFilteredImageIndex(imageId) {
  return galleryState.filteredImages.findIndex((img) => img.id === imageId);
}

/**
 * 预加载相邻图片
 */
function preloadAdjacentImages() {
  const current = galleryState.currentImageIndex;
  const prev = current - 1;
  const next = current + 1;

  if (prev >= 0) {
    const prevImage = galleryState.filteredImages[prev];
    utils.loadImage(prevImage.src);
  }

  if (next < galleryState.filteredImages.length) {
    const nextImage = galleryState.filteredImages[next];
    utils.loadImage(nextImage.src);
  }
}

/**
 * 重置画廊状态
 */
function resetGalleryState() {
  galleryState.currentFilter = "all";
  galleryState.currentImageIndex = 0;
  galleryState.isModalOpen = false;
  galleryState.isLoading = false;
  galleryState.filteredImages = [...galleryState.images];
}

// ===============================
// 公共API
// ===============================

/**
 * 添加新图片
 */
function addImage(imageData) {
  addImageToGallery(imageData);
}

/**
 * 删除图片
 */
function removeImage(imageId) {
  const index = getImageIndex(imageId);
  if (index === -1) return;

  const imageData = galleryState.images[index];
  if (imageData.element) {
    imageData.element.remove();
  }

  galleryState.images.splice(index, 1);
  galleryState.filteredImages = galleryState.filteredImages.filter(
    (img) => img.id !== imageId
  );
  galleryState.totalCount--;

  updateFilterCounts();
}

/**
 * 应用筛选器
 */
function setFilter(filter) {
  const filterTab = Array.from(galleryElements.filterTabs).find(
    (tab) => tab.dataset.filter === filter
  );
  if (filterTab) {
    handleFilterClick({ currentTarget: filterTab });
  }
}

/**
 * 打开指定图片
 */
function openImage(imageId) {
  const index = getImageIndex(imageId);
  if (index !== -1) {
    openModal(index);
  }
}

/**
 * 测试筛选功能
 */
function testGalleryFilter() {
  console.log("=== Gallery Filter Test ===");
  console.log("Total images:", galleryState.images.length);
  console.log("Current filter:", galleryState.currentFilter);
  console.log("Filtered images:", galleryState.filteredImages.length);

  galleryState.images.forEach((image, index) => {
    console.log(`Image ${index}:`, {
      title: image.title,
      year: image.year,
      categories: image.categories,
      visible: !image.element.hidden && image.element.style.display !== "none",
    });
  });

  console.log("=== End Test ===");
}

// 在开发环境中暴露测试函数到全局
if (typeof window !== "undefined") {
  window.testGalleryFilter = testGalleryFilter;
}

// ===============================
// 自动初始化
// ===============================

// 页面加载完成后初始化画廊
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // 检查是否在画廊页面
    if (
      window.location.pathname.includes("gallery.html") ||
      window.location.pathname.includes("pages/gallery.html")
    ) {
      setTimeout(() => {
        initializeGallery();
      }, 100);
    }
  });
} else {
  if (
    window.location.pathname.includes("gallery.html") ||
    window.location.pathname.includes("pages/gallery.html")
  ) {
    setTimeout(() => {
      initializeGallery();
    }, 100);
  }
}

// 为HTML中的onclick提供全局函数
window.openModal = openModal;

// ===============================
// 导出画廊接口
// ===============================
window.gallery = {
  // 状态
  state: galleryState,
  elements: galleryElements,

  // 核心功能
  initializeGallery,
  applyFilter,
  openModal,
  closeModal,

  // 图片管理
  addImage,
  removeImage,
  loadGalleryImage,

  // 导航
  showPreviousImage,
  showNextImage,

  // 公共API
  setFilter,
  openImage,
  resetGalleryState,

  // 工具函数
  getImageIndex,
  getFilteredImageIndex,
  preloadAdjacentImages,
};
