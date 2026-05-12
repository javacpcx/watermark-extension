// Background service worker
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Watermark Overlay extension installed.');
    
    // 初始化預設設置
    chrome.storage.local.get(['watermarkText'], (result) => {
        if (!result.watermarkText) {
            chrome.storage.local.set({
                enableWatermark: true,
                watermarkText: 'Confidential',
                fontSize: 48,
                color: '#FF0000',
                opacity: 30,
                enableRotation: false,
                enableWave: false,
                enableColorChange: false
            });
        }
    });

    // 關鍵：將內容腳本手動注入到所有已開啟的標籤頁中
    const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
    for (const tab of tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }).catch(err => console.log('Injection failed for tab:', tab.id, err));
        
        chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['watermark.css']
        }).catch(err => console.log('CSS injection failed for tab:', tab.id, err));
    }
});
