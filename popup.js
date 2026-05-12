document.addEventListener('DOMContentLoaded', () => {
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
  ], (items) => {
    if (items.watermarkText !== undefined) {
      document.getElementById('enableWatermark').checked = items.enableWatermark ?? true;
      document.getElementById('watermarkText').value = items.watermarkText || '';
      document.getElementById('fontFamily').value = items.fontFamily || "'Microsoft JhengHei', sans-serif";
      document.getElementById('displayMode').value = items.displayMode || "floating";
      document.getElementById('fontSize').value = items.fontSize || 48;
      document.getElementById('color').value = items.color || '#FF0000';
      document.getElementById('opacity').value = items.opacity || 30;
      document.getElementById('enableRotation').checked = items.enableRotation || false;
      document.getElementById('enableWave').checked = items.enableWave || false;
      document.getElementById('enableColorChange').checked = items.enableColorChange || false;
      
      if (items.iconDataUrl) {
        const img = document.createElement('img');
        img.src = items.iconDataUrl;
        img.style.maxWidth = '100%';
        document.getElementById('iconPreview').innerHTML = '';
        document.getElementById('iconPreview').appendChild(img);
      }
    }
  });
});

document.getElementById('applyBtn').addEventListener('click', () => {
  const enabled = document.getElementById('enableWatermark').checked;
  const text = document.getElementById('watermarkText').value || 'Confidential';
  const fontFamily = document.getElementById('fontFamily').value;
  const displayMode = document.getElementById('displayMode').value;
  const fontSize = document.getElementById('fontSize').value || 48;
  const color = document.getElementById('color').value || '#FF0000';
  const opacity = document.getElementById('opacity').value || 30;
  const enableRotation = document.getElementById('enableRotation').checked;
  const enableWave = document.getElementById('enableWave').checked;
  const enableColorChange = document.getElementById('enableColorChange').checked;

  const saveAndNotify = (iconDataUrl = null) => {
    const settings = {
      enableWatermark: enabled,
      watermarkText: text,
      fontFamily: fontFamily,
      displayMode: displayMode,
      fontSize: fontSize,
      color: color,
      opacity: opacity,
      enableRotation: enableRotation,
      enableWave: enableWave,
      enableColorChange: enableColorChange,
      iconDataUrl: iconDataUrl
    };

    chrome.storage.local.set(settings, () => {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'updateWatermark', settings: settings }).catch(() => {});
        });
      });
      
      const btn = document.getElementById('applyBtn');
      const originalText = btn.innerText;
      btn.innerText = 'Settings Applied!';
      btn.style.backgroundColor = '#4CAF50';
      btn.style.color = 'white';
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 2000);
    });
  };

  const iconInput = document.getElementById('iconUpload');
  if (iconInput.files && iconInput.files[0]) {
    const file = iconInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => saveAndNotify(e.target.result);
    reader.readAsDataURL(file);
  } else {
    chrome.storage.local.get(['iconDataUrl'], (result) => {
      saveAndNotify(result.iconDataUrl);
    });
  }
});
