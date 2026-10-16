// Enhanced ui.js - Fixed level display and comprehensive UI management

/**
 * Update the game clock with real time
 */
function updateClock() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const el = document.getElementById('clock');
  if (el) el.textContent = `${hh}:${mm}`;
}

/**
 * Update the comprehensive status bar with all relevant info - FIXED LEVEL DISPLAY
 */
function updateStatusBar() {
  const data = loadGameData();
  
  // FIXED: Ensure level is calculated correctly
  const currentLevel = data.level || 1;
  const currentXP = data.xp || 0;
  
  // Update money display
  const moneyEl = document.getElementById('money-display');
  if (moneyEl) {
    moneyEl.textContent = `€${data.bankBalance}`;
    moneyEl.title = `Bank Balance: €${data.bankBalance}`;
    
    // Color coding for money
    if (data.bankBalance < 0) {
      moneyEl.style.color = '#dc3545'; // Red for negative
    } else if (data.bankBalance < 100) {
      moneyEl.style.color = '#ffc107'; // Yellow for low
    } else {
      moneyEl.style.color = '#28a745'; // Green for positive
    }
  }
  
  // Update health display
  const healthEl = document.getElementById('health-display');
  if (healthEl) {
    const health = Math.max(0, Math.min(100, data.health ?? 100));
    healthEl.textContent = `❤️ ${health}%`;
    healthEl.title = `Health: ${health}%`;
    
    // Color coding for health
    if (health < 30) {
      healthEl.style.color = '#dc3545'; // Red for critical
    } else if (health < 70) {
      healthEl.style.color = '#ffc107'; // Yellow for low
    } else {
      healthEl.style.color = '#28a745'; // Green for good
    }
  }
  
  // Update happiness display
  const happinessEl = document.getElementById('happiness-display');
  if (happinessEl) {
    const happiness = Math.max(0, Math.min(100, data.happiness ?? 100));
    happinessEl.textContent = `😊 ${happiness}%`;
    happinessEl.title = `Happiness: ${happiness}%`;
    
    // Color coding for happiness
    if (happiness < 30) {
      happinessEl.style.color = '#dc3545'; // Red for unhappy
    } else if (happiness < 70) {
      happinessEl.style.color = '#ffc107'; // Yellow for neutral
    } else {
      happinessEl.style.color = '#28a745'; // Green for happy
    }
  }
  
  // Update food addiction display
  const foodAddictionEl = document.getElementById('food-addiction-display');
  if (foodAddictionEl) {
    const foodAddiction = Math.max(0, Math.min(100, data.foodAddiction ?? 100));
    foodAddictionEl.textContent = `🍕 ${foodAddiction}%`;
    foodAddictionEl.title = `Food Addiction: ${foodAddiction}%`;
    
    // Color coding for food addiction
    if (foodAddiction < 30) {
      foodAddictionEl.style.color = '#dc3545'; // Red for withdrawal
    } else if (foodAddiction < 70) {
      foodAddictionEl.style.color = '#ffc107'; // Yellow for low
    } else {
      foodAddictionEl.style.color = '#28a745'; // Green for satisfied
    }
  }
  
  // Update gambling addiction display
  const gamblingAddictionEl = document.getElementById('gambling-addiction-display');
  if (gamblingAddictionEl) {
    const gamblingAddiction = Math.max(0, Math.min(100, data.gamblingAddiction ?? 100));
    gamblingAddictionEl.textContent = `🎲 ${gamblingAddiction}%`;
    gamblingAddictionEl.title = `Gambling Addiction: ${gamblingAddiction}%`;
    
    // Color coding for gambling addiction
    if (gamblingAddiction < 30) {
      gamblingAddictionEl.style.color = '#dc3545'; // Red for withdrawal
    } else if (gamblingAddiction < 70) {
      gamblingAddictionEl.style.color = '#ffc107'; // Yellow for low
    } else {
      gamblingAddictionEl.style.color = '#28a745'; // Green for satisfied
    }
  }
  
  // Update addiction progress bars
  const foodProgressEl = document.getElementById('food-addiction-progress');
  if (foodProgressEl) {
    const foodAddiction = Math.max(0, Math.min(100, data.foodAddiction ?? 100));
    foodProgressEl.style.width = `${foodAddiction}%`;
  }
  
  const gamblingProgressEl = document.getElementById('gambling-addiction-progress');
  if (gamblingProgressEl) {
    const gamblingAddiction = Math.max(0, Math.min(100, data.gamblingAddiction ?? 100));
    gamblingProgressEl.style.width = `${gamblingAddiction}%`;
  }
  
  // Update profile level display in quick actions (replaces level-display)
  const profileLevelEl = document.getElementById('profile-level-display');
  if (profileLevelEl) {
    profileLevelEl.textContent = `Lv.${currentLevel}`;
    profileLevelEl.title = `Level ${currentLevel} (${currentXP} XP)`;
  }
  
  // Update day display
  const dayEl = document.getElementById('day-display');
  if (dayEl) {
    dayEl.textContent = `Day ${data.day}`;
    dayEl.title = `Day ${data.day}`;
  }
  
  // Update bank balance in bank app if it's open
  const balEl = document.getElementById('bank-balance');
  if (balEl) balEl.textContent = `€${data.bankBalance}`;
  
  // Update debt in bank app if it's open
  const debtEl = document.getElementById('bank-debt');
  if (debtEl) debtEl.textContent = `€${data.debt}`;
  
  // Update credit score display
  updateCreditScoreDisplay();
  

  
  // Update any open wallets
  if (typeof updateBlackjackWallet === 'function') updateBlackjackWallet();
  if (typeof updateKinoWallet === 'function') updateKinoWallet();
  
  // Update profile name display if profile is open
  const profileNameEl = document.getElementById('profile-name');
  if (profileNameEl) profileNameEl.textContent = data.userName || 'Player';
  
  console.log(`Status bar updated - Level: ${currentLevel}, XP: ${currentXP}`);
  
  // Update message notification badge
  updateMessagesBadge();
}

/**
 * Update credit score display with color coding
 */
function updateCreditScoreDisplay() {
  const creditScoreEl = document.getElementById('credit-score');
  if (creditScoreEl) {
    const data = loadGameData();
    const score = data.creditScore || 750;
    creditScoreEl.textContent = score;
    
    // Add color coding for credit score
    creditScoreEl.className = 'credit-score';
    if (score >= 800) creditScoreEl.classList.add('excellent');
    else if (score >= 740) creditScoreEl.classList.add('good');
    else if (score >= 670) creditScoreEl.classList.add('fair');
    else if (score >= 580) creditScoreEl.classList.add('poor');
    else creditScoreEl.classList.add('bad');
    
    // Add tooltip
    creditScoreEl.title = getCreditScoreDescription(score);
  }
}

/**
 * Get credit score description
 */
function getCreditScoreDescription(score) {
  if (score >= 800) return `Excellent Credit (${score}) - Best rates available`;
  if (score >= 740) return `Good Credit (${score}) - Favorable rates`;
  if (score >= 670) return `Fair Credit (${score}) - Standard rates`;
  if (score >= 580) return `Poor Credit (${score}) - Higher rates`;
  return `Bad Credit (${score}) - Limited options`;
}

/**
 * Show a modal dialog with custom content
 */
function showModal(title, content, options = {}) {
  // Remove any existing modal
  const existingModal = document.getElementById('game-modal');
  if (existingModal) {
    existingModal.parentNode.removeChild(existingModal);
  }
  
  const modal = document.createElement('div');
  modal.id = 'game-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease-out;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 15px;
    padding: 0;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease-out;
    margin: 20px;
    display: flex;
    flex-direction: column;
  `;
  
  modalContent.innerHTML = `
    <div class="modal-header" style="padding: 20px 30px 0 30px; flex-shrink: 0;">
      <h2 style="margin: 0; color: #2c3e50; font-size: 24px;">${title}</h2>
    </div>
    <div class="modal-body" style="padding: 20px 30px; flex: 1; overflow-y: auto; min-height: 0;">
      ${content}
    </div>
    <div class="modal-footer" style="padding: 0 30px 20px 30px; text-align: right; flex-shrink: 0;">
      ${options.showCancel !== false ? '<button id="modal-cancel" class="modal-btn cancel">Cancel</button>' : ''}
      ${options.showOk !== false ? '<button id="modal-ok" class="modal-btn ok">OK</button>' : ''}
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Add modal styles if not exists
  addModalStyles();
  
  // Handle button clicks
  const okBtn = document.getElementById('modal-ok');
  const cancelBtn = document.getElementById('modal-cancel');
  
  return new Promise((resolve) => {
    if (okBtn) {
      okBtn.onclick = () => {
        closeModal();
        resolve(true);
      };
    }
    
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        closeModal();
        resolve(false);
      };
    }
    
    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) {
        closeModal();
        resolve(false);
      }
    };
    
    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escapeHandler);
        closeModal();
        resolve(false);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  });
}

/**
 * Close the modal
 */
function closeModal() {
  const modal = document.getElementById('game-modal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }
}

/**
 * Add modal styles
 */
function addModalStyles() {
  if (document.querySelector('#modal-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'modal-styles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes slideIn {
      from { transform: scale(0.7) translateY(-50px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
    
    .modal-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-left: 10px;
      transition: all 0.3s ease;
    }
    
    .modal-btn.ok {
      background: #007bff;
      color: white;
    }
    
    .modal-btn.ok:hover {
      background: #0056b3;
      transform: translateY(-2px);
    }
    
    .modal-btn.cancel {
      background: #6c757d;
      color: white;
    }
    
    .modal-btn.cancel:hover {
      background: #545b62;
      transform: translateY(-2px);
    }
    
    .credit-score.excellent { color: #28a745; font-weight: bold; }
    .credit-score.good { color: #20c997; font-weight: bold; }
    .credit-score.fair { color: #ffc107; font-weight: bold; }
    .credit-score.poor { color: #fd7e14; font-weight: bold; }
    .credit-score.bad { color: #dc3545; font-weight: bold; }
  `;
  document.head.appendChild(style);
}

/**
 * Show a toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    background: ${getToastColor(type)};
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1500;
    animation: toastSlide 0.5s ease-out;
    max-width: 300px;
    text-align: center;
  `;
  
  document.body.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'toastSlideOut 0.5s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }
  }, duration);
  
  // Add toast animations if not exists
  addToastStyles();
}

/**
 * Get toast color based on type
 */
function getToastColor(type) {
  switch (type) {
    case 'success': return 'linear-gradient(135deg, #28a745, #20c997)';
    case 'error': return 'linear-gradient(135deg, #dc3545, #c82333)';
    case 'warning': return 'linear-gradient(135deg, #ffc107, #ff8f00)';
    case 'info': default: return 'linear-gradient(135deg, #007bff, #0056b3)';
  }
}

/**
 * Add toast styles
 */
function addToastStyles() {
  if (document.querySelector('#toast-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes toastSlide {
      from { transform: translateX(-50%) translateY(100px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes toastSlideOut {
      from { transform: translateX(-50%) translateY(0); opacity: 1; }
      to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Show loading spinner
 */
function showLoading(message = 'Loading...') {
  const loading = document.createElement('div');
  loading.id = 'loading-overlay';
  loading.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 3000;
    color: white;
    font-size: 18px;
  `;
  
  loading.innerHTML = `
    <div class="loading-spinner" style="
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    "></div>
    <div>${message}</div>
  `;
  
  document.body.appendChild(loading);
  
  // Add spinner animation if not exists
  addSpinnerStyles();
}

/**
 * Hide loading spinner
 */
function hideLoading() {
  const loading = document.getElementById('loading-overlay');
  if (loading) {
    loading.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      if (loading.parentNode) {
        loading.parentNode.removeChild(loading);
      }
    }, 300);
  }
}

/**
 * Add spinner styles
 */
function addSpinnerStyles() {
  if (document.querySelector('#spinner-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'spinner-styles';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Update progress bars with smooth animations
 */
function updateProgressBar(elementId, current, max, showText = true) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  element.style.width = `${percentage}%`;
  
  if (showText) {
    element.textContent = `${current}/${max}`;
  }
}

/**
 * FIXED: Update event notification dot
 */
function updateEventDot() {
  const data = loadGameData();
  const dot = document.getElementById('events-dot');
  const appDot = document.getElementById('events-app-dot');
  
  // Check for unread events
  const hasUnreadEvents = data.events && data.events.some(ev => !ev.read);
  
  // Check if daily event is available
  const dailyEventAvailable = !data.dailyEventCompleted || data.lastDailyEventDay !== data.day;
  
  const shouldShow = hasUnreadEvents || dailyEventAvailable;
  
  if (dot) {
    dot.classList.toggle('show', shouldShow);
  }
  
  if (appDot) {
    appDot.classList.toggle('show', hasUnreadEvents);
  }
}

/**
 * Update messages badge with unread count
 */
function updateMessagesBadge() {
  const badge = document.getElementById('messages-badge');
  if (!badge) return;
  
  let unreadCount = 0;
  if (typeof getTotalUnreadCount === 'function') {
    unreadCount = getTotalUnreadCount();
  }
  
  if (unreadCount > 0) {
    badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}

// Export UI functions
window.updateClock = updateClock;
window.updateStatusBar = updateStatusBar;
window.updateEventDot = updateEventDot;
window.updateMessagesBadge = updateMessagesBadge;
window.showModal = showModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.updateProgressBar = updateProgressBar;
