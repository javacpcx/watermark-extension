(function () {
  if (window.hasWatermarkLoaded) return;
  window.hasWatermarkLoaded = true;

  let moveInterval = null;

  function init() {
    chrome.storage.local.get([
      'enableWatermark',
      'watermarkText',
      'fontFamily',
      'displayMode',
      'fontSize',
      'color',
      'opacity',
      'enableRotation',
      'enableWave',
      'enableColorChange',
      'iconDataUrl'
    ], (settings) => {
      applyWatermark(settings);
    });
  }

  function createWatermarkElement(settings) {
    const waveLayer = document.createElement('div');
    waveLayer.className = 'wave-layer';
    
    const rotateLayer = document.createElement('div');
    rotateLayer.className = 'rotate-layer';
    
    const contentLayer = document.createElement('div');
    contentLayer.className = 'content-layer';
    
    rotateLayer.appendChild(contentLayer);
    waveLayer.appendChild(rotateLayer);

    // 應用內容與設定
    if (settings.iconDataUrl) {
      contentLayer.style.backgroundImage = `url(${settings.iconDataUrl})`;
      contentLayer.style.backgroundSize = 'contain';
      contentLayer.style.width = settings.displayMode === 'tiled' ? '64px' : '128px';
      contentLayer.style.height = settings.displayMode === 'tiled' ? '64px' : '128px';
      contentLayer.style.backgroundRepeat = 'no-repeat';
      contentLayer.innerText = '';
    } else {
      contentLayer.innerText = settings.watermarkText || 'Confidential';
      contentLayer.style.fontSize = `${settings.fontSize || 48}px`;
      contentLayer.style.color = settings.color || '#FF0000';
      contentLayer.style.fontFamily = settings.fontFamily || 'Arial';
    }

    contentLayer.style.opacity = (settings.opacity || 30) / 100;
    waveLayer.classList.toggle('active', settings.enableWave);
    rotateLayer.classList.toggle('active', settings.enableRotation);
    contentLayer.classList.toggle('color-active', settings.enableColorChange);

    return waveLayer;
  }

  function applyWatermark(settings) {
    let host = document.getElementById('watermark-host');
    if (host) host.remove();
    if (moveInterval) clearInterval(moveInterval);

    if (!settings || settings.enableWatermark === false) return;

    host = document.createElement('div');
    host.id = 'watermark-host';
    document.body.appendChild(host);

    if (settings.displayMode === 'tiled') {
      const grid = document.createElement('div');
      grid.className = 'grid-container';
      // 填充網格，大約 50 個元素足以覆蓋大多數螢幕
      for (let i = 0; i < 60; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.appendChild(createWatermarkElement(settings));
        grid.appendChild(item);
      }
      host.appendChild(grid);
    } else {
      const item = document.createElement('div');
      item.className = 'watermark-item';
      item.appendChild(createWatermarkElement(settings));
      host.appendChild(item);
      startMoving(item);
    }

    setupObserver(host);
  }

  function startMoving(element) {
    function move() {
      if (!element.parentElement) return;
      const windowWidth = window.innerWidth - element.offsetWidth;
      const windowHeight = window.innerHeight - element.offsetHeight;
      const randomTop = Math.random() * Math.max(0, windowHeight);
      const randomLeft = Math.random() * Math.max(0, windowWidth);
      const duration = Math.random() * 3 + 2;
      element.style.transition = `top ${duration}s ease-in-out, left ${duration}s ease-in-out`;
      element.style.top = `${randomTop}px`;
      element.style.left = `${randomLeft}px`;
    }
    move();
    moveInterval = setInterval(move, 4000);
  }

  function setupObserver(host) {
    const observer = new MutationObserver(() => {
      if (!document.getElementById('watermark-host')) {
        document.body.appendChild(host);
      }
    });
    observer.observe(document.body, { childList: true });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateWatermark') {
      applyWatermark(message.settings);
    }
  });

  init();
})();
