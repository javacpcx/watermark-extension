document.getElementById('applyBtn').addEventListener('click', () => {
  const text = document.getElementById('watermarkText').value || 'Confidential';
  const fontSize = document.getElementById('fontSize').value || 48;
  const color = document.getElementById('color').value || '#FF0000';
  const opacity = document.getElementById('opacity').value || 30;
  const enableRotation = document.getElementById('enableRotation').checked;
  const enableWave = document.getElementById('enableWave').checked;
  const enableColorChange = document.getElementById('enableColorChange').checked;

  // 取得圖片上傳文件
  const iconInput = document.getElementById('iconUpload');
  if (iconInput.files && iconInput.files[0]) {
    const file = iconInput.files[0];

    // 確認圖片尺寸不超過 512x512
    const img = new Image();
    img.onload = () => {
      if (img.width > 512 || img.height > 512) {
        alert('Icon size cannot exceed 512x512 pixels.');
        return;
      }

      // 將圖片轉換為 Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const iconDataUrl = e.target.result;

        // 保存所有設置到 storage，包括圖片 Data URL
        chrome.storage.sync.set({
          watermarkText: text,
          fontSize: fontSize,
          color: color,
          opacity: opacity,
          enableRotation: enableRotation,
          enableWave: enableWave,
          enableColorChange: enableColorChange,
          iconDataUrl: iconDataUrl
        }, () => {
          console.log('Settings saved with custom icon.');
        });

        // 傳送設置到內容腳本
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            watermarkText: text,
            fontSize: fontSize,
            color: color,
            opacity: opacity,
            enableRotation: enableRotation,
            enableWave: enableWave,
            enableColorChange: enableColorChange,
            iconDataUrl: iconDataUrl
          });
        });
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
  } else {
    // 沒有上傳圖片，僅儲存其他設置
    chrome.storage.sync.set({
      watermarkText: text,
      fontSize: fontSize,
      color: color,
      opacity: opacity,
      enableRotation: enableRotation,
      enableWave: enableWave,
      enableColorChange: enableColorChange,
      iconDataUrl: null
    }, () => {
      console.log('Settings saved without custom icon.');
    });

    // 傳送設置到內容腳本
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        watermarkText: text,
        fontSize: fontSize,
        color: color,
        opacity: opacity,
        enableRotation: enableRotation,
        enableWave: enableWave,
        enableColorChange: enableColorChange,
        iconDataUrl: null
      });
    });
  }
});
