/**
 * 🔄 Real-time Dashboard Loader
 * Memuat data langsung dari Google Sheets
 * Auto-refresh setiap 5 menit
 */

(function() {
  'use strict';
  
  const CONFIG = {
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTIgvTkNXKi7oucoWOwaPILA171fXQIjr4vmAKyqIr78El6yUXjy4ThcglzszbhSp9hwzEHiHsH50ll/pub?gid=1182304110&single=true&output=csv',
    REFRESH_INTERVAL: 5 * 60 * 1000, // 5 menit
    ENABLE_NOTIFICATION: true,
    DEBUG: false
  };
  
  function log(...args) {
    if (CONFIG.DEBUG) console.log('[RealtimeDashboard]', ...args);
  }
  
  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
  
  function parseCSV(csv) {
    const lines = csv.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => 
      h.trim().replace(/^"|"$/g, '')
    );
    
    return lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = (values[i] || '').trim().replace(/^"|"$/g, '');
      });
      return obj;
    }).filter(obj => Object.values(obj).some(v => v));
  }
  
  function showNotification(message, type = 'success') {
    if (!CONFIG.ENABLE_NOTIFICATION) return;
    
    const colors = {
      success: '#10b981',
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444'
    };
    
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 99999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.3s';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }
  
  async function loadFreshData() {
    try {
      log('Fetching fresh data...');
      const url = CONFIG.SHEET_URL + '&t=' + Date.now();
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const csvText = await response.text();
      const freshData = parseCSV(csvText);
      
      log(`Fetched ${freshData.length} records`);
      
      if (typeof window.EMBEDDED_DATA !== 'undefined') {
        const oldCount = window.EMBEDDED_DATA.length;
        const newCount = freshData.length;
        
        if (newCount !== oldCount) {
          log(`Data changed: ${oldCount} → ${newCount}`);
          window.EMBEDDED_DATA = freshData;
          
          if (typeof window.renderDashboard === 'function') {
            window.renderDashboard(freshData);
          }
          
          const diff = newCount - oldCount;
          const msg = diff > 0 
            ? `🔄 +${diff} data baru ditambahkan`
            : `🔄 Data diperbarui (${newCount} records)`;
          showNotification(msg, 'success');
        }
      }
      
      return freshData;
    } catch (error) {
      console.warn('⚠️ Real-time load failed, using cached data:', error.message);
      return typeof window.EMBEDDED_DATA !== 'undefined' ? window.EMBEDDED_DATA : [];
    }
  }
  
  function init() {
    log('Initializing...');
    loadFreshData();
    setInterval(loadFreshData, CONFIG.REFRESH_INTERVAL);
    log(`Auto-refresh setiap ${CONFIG.REFRESH_INTERVAL / 1000 / 60} menit`);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.RealtimeDashboard = {
    refreshNow: loadFreshData,
    getConfig: () => CONFIG,
    setConfig: (key, value) => { CONFIG[key] = value; }
  };
})();
