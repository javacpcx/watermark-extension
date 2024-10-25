document.getElementById('applyBtn').addEventListener('click', () => {
    const text = document.getElementById('watermarkText').value || 'Confidential';
    const fontSize = document.getElementById('fontSize').value || 48;
    const color = document.getElementById('color').value || '#FF0000';
    const opacity = document.getElementById('opacity').value || 30;
    const enableRotation = document.getElementById('enableRotation').checked;
    const enableWave = document.getElementById('enableWave').checked;
    const enableColorChange = document.getElementById('enableColorChange').checked;
  
    // 傳送設置到內容腳本
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        watermarkText: text,
        fontSize: fontSize,
        color: color,
        opacity: opacity,
        enableRotation: enableRotation,
        enableWave: enableWave,
        enableColorChange: enableColorChange
      });
    });
  });
  