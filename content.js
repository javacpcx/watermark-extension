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

  // 應用使用者的設定
  if (message.watermarkText) {
    watermark.innerText = message.watermarkText;
    watermark.style.fontSize = `${message.fontSize}px`;
    watermark.style.color = message.color;
    watermark.style.opacity = message.opacity / 100;
    watermark.style.pointerEvents = 'none';
    watermark.style.zIndex = '9999';
    watermark.style.position = 'fixed';

    // 清除所有動畫 class，避免覆蓋衝突
    watermark.classList.remove('rotate', 'wave', 'color-change');

    // 旋轉效果
    if (message.enableRotation) {
      watermark.classList.add('rotate');
    }

    // 波浪效果
    if (message.enableWave) {
      watermark.classList.add('wave');
    }

    // 顏色變換效果
    if (message.enableColorChange) {
      watermark.classList.add('color-change');
    }
  }

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
