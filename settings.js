// settings.js - Enhanced settings system

function renderSettings() {
  const data = loadGameData();
  const settings = data.settings || getDefaultSettings();
  
  // Update toggle states
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const autoSaveToggle = document.getElementById('auto-save-toggle');
  const notificationsToggle = document.getElementById('notifications-toggle');
  
  if (darkModeToggle) {
    darkModeToggle.checked = settings.darkMode;
    darkModeToggle.onchange = toggleDarkMode;
  }
  
  if (autoSaveToggle) {
    autoSaveToggle.checked = settings.autoSave;
    autoSaveToggle.onchange = toggleAutoSave;
  }
  
  if (notificationsToggle) {
    notificationsToggle.checked = settings.notifications;
    notificationsToggle.onchange = toggleNotifications;
  }
  
  // Apply current dark mode state
  applyDarkMode(settings.darkMode);
  
  // Update toggle switch styling
  updateToggleSwitches();
}

function getDefaultSettings() {
  return {
    darkMode: false,
    autoSave: true,
    notifications: true,
    soundEffects: true,
    autoTick: false
  };
}

function updateToggleSwitches() {
  const style = document.createElement('style');
  style.id = 'toggle-styles';
  style.textContent = `
    input[type="checkbox"]:checked + span {
      background-color: #007bff !important;
    }
    
    input[type="checkbox"]:checked + span:before {
      transform: translateX(26px);
    }
    
    input[type="checkbox"] + span:before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      transition: 0.4s;
    }
  `;
  
  if (!document.querySelector('#toggle-styles')) {
    document.head.appendChild(style);
  }
}

function toggleDarkMode() {
  const data = loadGameData();
  if (!data.settings) data.settings = getDefaultSettings();
  
  data.settings.darkMode = !data.settings.darkMode;
  saveGameData(data);
  
  applyDarkMode(data.settings.darkMode);
  
  showSettingChangeNotification('Dark mode ' + (data.settings.darkMode ? 'enabled' : 'disabled'));
}

function toggleAutoSave() {
  const data = loadGameData();
  if (!data.settings) data.settings = getDefaultSettings();
  
  data.settings.autoSave = !data.settings.autoSave;
  saveGameData(data);
  
  showSettingChangeNotification('Auto-save ' + (data.settings.autoSave ? 'enabled' : 'disabled'));
}

function toggleNotifications() {
  const data = loadGameData();
  if (!data.settings) data.settings = getDefaultSettings();
  
  data.settings.notifications = !data.settings.notifications;
  saveGameData(data);
  
  showSettingChangeNotification('Notifications ' + (data.settings.notifications ? 'enabled' : 'disabled'));
}

function applyDarkMode(isDark) {
  const body = document.body;
  if (isDark) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

function showSettingChangeNotification(message) {
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.className = 'setting-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2000);
  
  // Add animation styles
  addNotificationStyles();
}

function addNotificationStyles() {
  if (document.querySelector('#notification-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Save/Load System
function exportSave() {
  const data = loadGameData();
  const saveData = {
    ...data,
    exportDate: new Date().toISOString(),
    gameVersion: '2.0'
  };
  
  const dataStr = JSON.stringify(saveData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `smartsim_save_${data.userName}_day${data.day}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  showToast('Save file downloaded! Keep it safe.', 'success');
}

function importSave() {
  const fileInput = document.getElementById('import-file');
  if (!fileInput) return;
  
  fileInput.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const saveData = JSON.parse(e.target.result);
        
        // Validate save data
        if (!validateSaveData(saveData)) {
          showToast('Invalid save file!', 'error');
          return;
        }
        
        // Show import confirmation with save details
        showImportConfirmation(saveData);
        
      } catch (error) {
        showToast('Error reading save file: ' + error.message, 'error');
      }
    };
    
    reader.readAsText(file);
  };
  
  fileInput.click();
}

function showImportConfirmation(saveData) {
  showModal(
    'Import Save File',
    `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">💾</div>
        <h3>Import Save File</h3>
        <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin: 15px 0; text-align: left;">
          <div><strong>Player:</strong> ${saveData.userName || 'Unknown'}</div>
          <div><strong>Day:</strong> ${saveData.day || 1}</div>
          <div><strong>Level:</strong> ${saveData.level || 1}</div>
          <div><strong>Balance:</strong> €${saveData.bankBalance || 0}</div>
          <div><strong>Profession:</strong> ${saveData.profession || 'Unemployed'}</div>
          ${saveData.exportDate ? `<div><strong>Exported:</strong> ${new Date(saveData.exportDate).toLocaleDateString()}</div>` : ''}
        </div>
        <p style="color: #dc3545; font-weight: bold;">⚠️ This will overwrite your current game!</p>
      </div>
    `,
    { showCancel: true }
  ).then((confirmed) => {
    if (confirmed) {
      // Import the data
      localStorage.setItem('smartSimData', JSON.stringify(saveData));
      
      showToast('Save imported successfully! Reloading game...', 'success');
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  });
}

function validateSaveData(data) {
  // Check for required fields
  const requiredFields = ['userName', 'day', 'bankBalance', 'profession'];
  for (const field of requiredFields) {
    if (data[field] === undefined) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Check data types
  if (typeof data.userName !== 'string' || 
      typeof data.day !== 'number' || 
      typeof data.bankBalance !== 'number') {
    console.error('Invalid data types in save file');
    return false;
  }
  
  // Check for reasonable values
  if (data.day < 1 || data.day > 10000) {
    console.error('Invalid day value');
    return false;
  }
  
  return true;
}

// Advanced Settings
function resetStatistics() {
  showModal(
    'Reset Statistics',
    `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">📊</div>
        <h3>Reset Statistics</h3>
        <p>Reset all statistics? This will clear your gambling stats, work experience, etc. but keep your progress!</p>
        <p style="color: #dc3545; font-weight: bold;">This action cannot be undone!</p>
      </div>
    `,
    { showCancel: true }
  ).then((confirmed) => {
    if (confirmed) {
      const data = loadGameData();
      
      // Reset statistics but keep core progress
      data.bjStats = { wins: 0, losses: 0, pushes: 0 };
      data.kinoStats = { totalGames: 0, totalWon: 0, totalLost: 0 };
      data.workExperience = 0;
      data.itemsCollected = 0;
      data.lifetimeEarnings = 0;
      data.lifetimeSpending = 0;
      
      saveGameData(data);
      showToast('Statistics reset successfully!', 'success');
    }
  });
}

function clearInventory() {
  const data = loadGameData();
  
  if (!data.inventory || data.inventory.length === 0) {
    showToast('Inventory is already empty!', 'info');
    return;
  }
  
  const inventoryValue = data.inventory.reduce((sum, item) => {
    const daysSincePurchase = data.day - (item.purchaseDay || data.day);
    const depreciation = Math.floor(daysSincePurchase / 10) * 0.1;
    const currentValue = Math.max(item.price * (1 - depreciation), item.price * 0.1);
    return sum + currentValue;
  }, 0);
  
  const recoveryAmount = Math.floor(inventoryValue * 0.3);
  
  showModal(
    'Clear Inventory',
    `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">📦</div>
        <h3>Clear Inventory</h3>
        <p>Clear your entire inventory of ${data.inventory.length} items?</p>
        <div style="background: #f8f9fa; border-radius: 10px; padding: 15px; margin: 15px 0;">
          <div>Current inventory value: €${Math.floor(inventoryValue)}</div>
          <div style="color: #28a745; font-weight: bold;">Recovery amount (30%): €${recoveryAmount}</div>
        </div>
        <p style="color: #dc3545;">This action cannot be undone!</p>
      </div>
    `,
    { showCancel: true }
  ).then((confirmed) => {
    if (confirmed) {
      data.inventory = [];
      data.bankBalance += recoveryAmount;
      
      data.events.push({
        message: `Cleared inventory, recovered €${recoveryAmount}`,
        date: new Date().toISOString(),
        read: false
      });
      
      saveGameData(data);
      updateStatusBar();
      showToast(`Inventory cleared! Recovered €${recoveryAmount}`, 'success');
    }
  });
}

function factoryReset() {
  showModal(
    'Factory Reset',
    `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">⚠️</div>
        <h3 style="color: #dc3545;">FACTORY RESET</h3>
        <p>This will delete <strong>ALL</strong> your progress permanently!</p>
        <div style="background: #f8d7da; border: 1px solid #dc3545; border-radius: 10px; padding: 15px; margin: 15px 0;">
          <div>• All characters will be deleted</div>
          <div>• All progress will be lost</div>
          <div>• All achievements will be reset</div>
          <div>• All items and money will be gone</div>
        </div>
        <p style="color: #dc3545; font-weight: bold;">Are you absolutely sure?</p>
      </div>
    `,
    { showCancel: true }
  ).then((confirmed) => {
    if (confirmed) {
      showSecondFactoryResetConfirmation();
    }
  });
}

function showSecondFactoryResetConfirmation() {
  showModal(
    'Final Confirmation',
    `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">🚨</div>
        <h3 style="color: #dc3545;">LAST CHANCE!</h3>
        <p style="font-size: 18px; color: #dc3545; font-weight: bold;">
          This will delete everything and cannot be undone!
        </p>
        <p>Are you really, really sure you want to factory reset?</p>
      </div>
    `,
    { showCancel: true }
  ).then((confirmed) => {
    if (confirmed) {
      localStorage.clear();
      showToast('Factory reset complete. Reloading...', 'info');
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  });
}

// Auto-save functionality
function setupAutoSave() {
  const data = loadGameData();
  if (data.settings && data.settings.autoSave) {
    setInterval(() => {
      const currentData = loadGameData();
      if (currentData.settings && currentData.settings.autoSave) {
        saveGameData(currentData);
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      }
    }, 60000); // Auto-save every minute
  }
}

// Game statistics for settings page
function getGameStatistics() {
  const data = loadGameData();
  
  return {
    saveSize: JSON.stringify(data).length,
    totalEvents: data.events ? data.events.length : 0,
    inventoryItems: data.inventory ? data.inventory.length : 0,
    achievementsUnlocked: getTotalAchievementsUnlocked(data),
    playTime: calculatePlayTime(data)
  };
}

function calculatePlayTime(data) {
  const startDate = new Date(data.startDate || new Date());
  const now = new Date();
  const diffMs = now - startDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Initialize settings when page loads
function initializeSettings() {
  const data = loadGameData();
  if (!data.settings) {
    data.settings = getDefaultSettings();
    saveGameData(data);
  }
  
  applyDarkMode(data.settings.darkMode);
  setupAutoSave();
}

// Force refresh interface - clear all cached content and reload
function forceRefreshInterface() {
  showModal(
    'Force Refresh Interface',
    `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">🔄</div>
        <h3>Force Refresh Interface</h3>
        <p>This will clear all cached content and reload the interface with the latest changes.</p>
        <p><strong>Note:</strong> Your game progress will be preserved.</p>
      </div>
    `,
    { showCancel: true }
  ).then((confirmed) => {
    if (confirmed) {
      // Clear any cached styles
      document.querySelectorAll('style[id*="styles"]').forEach(el => el.remove());
      
      // Clear modal content
      const modalBody = document.getElementById('modal-body');
      if (modalBody) modalBody.innerHTML = '';
      
      // Force cache busting by adding timestamp to current URL
      const currentUrl = new URL(window.location);
      currentUrl.searchParams.set('refresh', Date.now());
      
      showToast('Refreshing interface...', 'info');
      setTimeout(() => {
        window.location.href = currentUrl.toString();
      }, 1000);
    }
  });
}

// Export functions
window.renderSettings = renderSettings;
window.initializeSettings = initializeSettings;
window.exportSave = exportSave;
window.importSave = importSave;
window.resetStatistics = resetStatistics;
window.clearInventory = clearInventory;
window.factoryReset = factoryReset;
window.getGameStatistics = getGameStatistics;
window.forceRefreshInterface = forceRefreshInterface;
