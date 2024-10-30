// 初始化全局變數 moveInterval
let moveInterval = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let watermark = document.getElementById('watermark-overlay');

  // 如果浮水印不存在，創建一個新的
  if (!watermark) {
    watermark = document.createElement('div');
    watermark.id = 'watermark-overlay';
    document.body.appendChild(watermark);
  }

  // 檢查是否有自訂圖片的 URL
  if (message.iconDataUrl) {
    // 使用自訂圖片作為浮水印
    watermark.style.backgroundImage = `url(${message.iconDataUrl})`;
    watermark.style.backgroundSize = 'contain';
    watermark.style.width = '128px';  // 可根據需求調整大小
    watermark.style.height = '128px';
    watermark.style.backgroundRepeat = 'no-repeat';
    watermark.innerText = '';  // 清空文字
  } else if (message.watermarkText) {
    // 使用文字作為浮水印
    watermark.innerText = message.watermarkText;
    watermark.style.fontSize = `${message.fontSize}px`;
    watermark.style.color = message.color;
    watermark.style.opacity = message.opacity / 100;
    watermark.style.backgroundImage = '';  // 移除背景圖片
    watermark.style.width = '';            // 清空圖片樣式
    watermark.style.height = '';
  }

  // 應用特效
  watermark.classList.remove('rotate', 'wave', 'color-change');
  if (message.enableRotation) {
    watermark.classList.add('rotate');
  }
  if (message.enableWave) {
    watermark.classList.add('wave');
  }
  if (message.enableColorChange) {
    watermark.classList.add('color-change');
  }

  // 基本樣式
  watermark.style.pointerEvents = 'none';
  watermark.style.zIndex = '9999';
  watermark.style.position = 'fixed';

  // 定義移動浮水印的函數
  function moveWatermark() {
    const windowWidth = window.innerWidth - watermark.offsetWidth;
    const windowHeight = window.innerHeight - watermark.offsetHeight;

    const randomTop = Math.random() * windowHeight;
    const randomLeft = Math.random() * windowWidth;

    const randomDuration = Math.random() * 3 + 1;
    watermark.style.transition = `top ${randomDuration}s ease, left ${randomDuration}s ease, opacity ${randomDuration}s ease`;

    const randomOpacity = Math.random() * 0.5 + 0.5;
    watermark.style.opacity = randomOpacity;

    watermark.style.top = `${randomTop}px`;
    watermark.style.left = `${randomLeft}px`;
  }

  // 清除舊的移動計時器，避免重複設置
  if (moveInterval) {
    clearInterval(moveInterval);
  }

  // 初始化並啟動新的計時器，每 4 秒隨機移動一次浮水印
  moveWatermark(); // 立即執行一次
  moveInterval = setInterval(moveWatermark, 4000);
});
