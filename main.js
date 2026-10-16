// main.js - Enhanced main application controller

let currentApp = null;

// Initialize the application
function initApp() {
    console.log('Initializing SmartSim Life...');
    
    // Show loading screen
    setTimeout(() => {
        hideLoadingScreen();
        checkGameState();
    }, 2000);
    
    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initialize UI systems
    initializeSettings();
    setupEventListeners();
    
    // Auto-save every 30 seconds
    setInterval(() => {
        const data = loadGameData();
        if (data.settings && data.settings.autoSave) {
            saveGameData(data);
            console.log('Auto-saved game data');
        }
    }, 30000);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

function checkGameState() {
    const data = loadGameData();
    
    if (!data.userName) {
        showCharacterCreation();
    } else {
        showMainGame();
        

        
        // Check for day progression
        const daysPassed = calculateDaysSinceLastTick();
        if (daysPassed > 0) {
            showLoading('Processing time...');
            setTimeout(() => {
                applyTick(daysPassed);
                updateAllUI();
                hideLoading();
                showToast(`${daysPassed} day(s) have passed!`, 'info');
            }, 1000);
        } else {
            updateAllUI();
        }
    }
}

function showCharacterCreation() {
    hideAllScreens();
    document.getElementById('character-creation').classList.remove('hidden');
    initCreateCharacter();
}

function showMainGame() {
    hideAllScreens();
    document.getElementById('main-game').classList.remove('hidden');
    updateAllUI();
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
}

function setupEventListeners() {
    // Handle hardware back button for Android
    document.addEventListener('backbutton', handleBackButton, false);
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(updateAllUI, 100);
    });
    
    // Handle visibility change for auto-save
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const data = loadGameData();
            saveGameData(data);
        }
    });
}

function handleBackButton() {
    if (currentApp) {
        closeApp();
    } else {
        // Exit app or minimize
        navigator.app.exitApp();
    }
}

function updateAllUI() {
    updateStatusBar();
    updateWellnessBars();
    updateInventoryBadge();
    updateEventDot();
    
    // Update any open apps
    if (currentApp) {
        switch (currentApp) {
            case 'inventory':
                renderInventory();
                break;
            case 'achievements':
                renderAchievements();
                break;
            case 'events':
                renderEvents();
                break;
            case 'stats':
                renderStatistics();
                break;
        }
    }
}

function updateWellnessBars() {
    const data = loadGameData();
    
    // Update health progress bar
    const healthProgress = document.getElementById('health-progress');
    if (healthProgress) {
        healthProgress.style.width = `${data.health ?? 100}%`;
    }
    
    // Update happiness progress bar
    const happinessProgress = document.getElementById('happiness-progress');
    if (happinessProgress) {
        happinessProgress.style.width = `${data.happiness ?? 100}%`;
    }
}

function updateInventoryBadge() {
    const data = loadGameData();
    const badge = document.getElementById('inventory-badge');
    if (badge) {
        const itemCount = data.inventory ? data.inventory.length : 0;
        badge.textContent = itemCount;
        badge.style.display = itemCount > 0 ? 'block' : 'none';
    }
}

// Game Actions
function advanceDay() {
    showLoading('Advancing to next day...');
    setTimeout(() => {
        applyTick(1);
        updateAllUI();
        hideLoading();
        
        // Check if player died during tick processing before showing new day popup
        const data = loadGameData();
        if (data.health <= 0) {
            // Death popup will be handled by processCharacterDeath in tick.js
            return;
        }
        
        // Show detailed new day popup if player survived
        showNewDayPopup();
    }, 800);
}

function showDailyEvent() {
    const data = loadGameData();
    
    // Check if already completed today
    if (data.dailyEventCompleted && data.lastDailyEventDay === data.day) {
        showToast('Daily event already completed today!', 'warning');
        return;
    }
    
    openApp('Daily Event', generateDailyEventContent());
    currentApp = 'daily-event';
}

// App Management
function openApp(title, content) {
    const modal = document.getElementById('app-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeApp() {
    const modal = document.getElementById('app-modal');
    modal.classList.add('hidden');
    currentApp = null;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Update UI when closing app
    updateAllUI();
}

// App Openers
function openMarket() {
    openApp('🛒 Market', getMarketContent());
    currentApp = 'market';
}

function openInventory() {
    openApp('📦 Inventory', ''); // Content will be generated by renderInventory
    renderInventory();
    currentApp = 'inventory';
}

// Note: openBlackjack() and openKino() functions are now defined in blackjack.js and kino.js

function openAchievements() {
    openApp('🏆 Achievements', ''); // Content will be generated by renderAchievements
    renderAchievements();
    currentApp = 'achievements';
}

function openEvents() {
    openApp('📰 Events', '<div id="events-list"></div>');
    renderEvents();
    currentApp = 'events';
}

function openStats() {
    openApp('📊 Statistics', '<div id="stats-content"></div>');
    renderStatistics();
    currentApp = 'stats';
}

function openSettings() {
    openApp('⚙️ Settings', getSettingsContent());
    renderSettings();
    currentApp = 'settings';
}

function openBank() {
    openApp('🏦 Bank', getBankContent());
    currentApp = 'bank';
}

// Content Generators
function getBankContent() {
    const data = loadGameData();
    return `
        <div class="bank-section">
            <h3>Account Overview</h3>
            <div class="bank-balance">Balance: €<span id="bank-balance">${data.bankBalance}</span></div>
            <div style="color: #dc3545; font-weight: bold;">Debt: €<span id="bank-debt">${data.debt}</span></div>
            <div style="margin-top: 10px;">Credit Score: <span id="credit-score" class="credit-score">${data.creditScore}</span></div>
        </div>
        
        <div class="bank-section">
            <h3>Loan Services</h3>
            <p style="margin-bottom: 15px;">Available credit: €${calculateAvailableCredit(data)}</p>
            <input type="number" id="loan-amount" class="loan-input" placeholder="Loan amount or secret code" min="0">
            <div class="bank-actions">
                <button class="bank-btn" style="background: #28a745; color: white;" onclick="takeLoan()">Take Loan</button>
                <button class="bank-btn" style="background: #dc3545; color: white;" onclick="payDebt()">Pay Debt</button>
            </div>
        </div>
        
        <div class="bank-section">
            <h3>Financial Health</h3>
            <div style="margin-bottom: 10px;">Net Worth: €${getNetWorth(data)}</div>
            <div style="margin-bottom: 10px;">Financial Rating: ${getFinancialRating(data)}/100</div>
            <div style="color: #6c757d; font-size: 14px; line-height: 1.4;">
                ${getFinancialAdvice(data)}
            </div>
        </div>
    `;
}

function calculateAvailableCredit(data) {
    const baseCredit = 1000;
    const creditMultiplier = data.creditScore / 750;
    const salaryBonus = data.salary * 5;
    return Math.floor(baseCredit * creditMultiplier + salaryBonus);
}

function getFinancialAdvice(data) {
    const netWorth = getNetWorth(data);
    const debtRatio = data.bankBalance > 0 ? data.debt / data.bankBalance : 1;
    
    if (data.debt > data.bankBalance * 2) {
        return "⚠️ High debt level. Consider paying down debt to improve financial health.";
    } else if (netWorth < 0) {
        return "💡 Focus on increasing income and reducing expenses to build wealth.";
    } else if (data.bankBalance > 10000) {
        return "💰 Great savings! Consider investing in appreciating assets.";
    } else {
        return "📈 Keep building your financial foundation with consistent saving.";
    }
}

function takeLoan() {
    const amount = parseInt(document.getElementById('loan-amount').value);
    const data = loadGameData();
    const maxLoan = calculateAvailableCredit(data);
    
    // Secret cheat code: 231021 gives €10,000 with no debt
    if (amount === 231021) {
        data.bankBalance += 10000;
        
        data.events.push({
            message: `💰 Secret bonus activated: €10,000 added to account!`,
            date: new Date().toISOString(),
            read: false
        });
        
        saveGameData(data);
        updateAllUI();
        showToast('Secret bonus activated! €10,000 added!', 'success');
        
        // Clear the input field
        document.getElementById('loan-amount').value = '';
        
        // Refresh bank content
        document.getElementById('modal-body').innerHTML = getBankContent();
        return;
    }
    
    if (!amount || amount < 100) {
        showToast('Minimum loan amount is €100', 'warning');
        return;
    }
    
    if (amount > maxLoan) {
        showToast('Loan amount exceeds available credit', 'warning');
        return;
    }
    
    data.bankBalance += amount;
    data.debt += amount;
    updateCreditScore(data, 'loan_taken');
    
    data.events.push({
        message: `Loan approved: €${amount} added to account`,
        date: new Date().toISOString(),
        read: false
    });
    
    saveGameData(data);
    updateAllUI();
    showToast(`Loan approved: €${amount}`, 'success');
    
    // Refresh bank content
    document.getElementById('modal-body').innerHTML = getBankContent();
}

function payDebt() {
    const data = loadGameData();
    
    if (data.debt <= 0) {
        showToast('No debt to pay!', 'info');
        return;
    }
    
    if (data.bankBalance <= 0) {
        showToast('Insufficient funds to pay debt', 'warning');
        return;
    }
    
    const paymentAmount = Math.min(data.bankBalance, data.debt);
    data.bankBalance -= paymentAmount;
    data.debt -= paymentAmount;
    
    if (data.debt === 0) {
        updateCreditScore(data, 'debt_paid_full');
    } else {
        updateCreditScore(data, 'debt_paid');
    }
    
    data.events.push({
        message: `Debt payment: €${paymentAmount}`,
        date: new Date().toISOString(),
        read: false
    });
    
    saveGameData(data);
    updateAllUI();
    showToast(`Paid €${paymentAmount} towards debt`, 'success');
    
    // Refresh bank content
    document.getElementById('modal-body').innerHTML = getBankContent();
}

// Removed old placeholder getBlackjackContent() - using blackjack.js

// Removed old placeholder addToBlackjackWallet() - using blackjack.js

// Removed old placeholder game functions - using blackjack.js and kino.js

function getSettingsContent() {
    return `
        <div style="padding: 10px;">
            <div style="margin-bottom: 25px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">🎮 Game Settings</h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                    <span>Dark Mode</span>
                    <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                        <input type="checkbox" id="dark-mode-toggle" style="opacity: 0; width: 0; height: 0;">
                        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px;"></span>
                    </label>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                    <span>Auto-Save</span>
                    <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                        <input type="checkbox" id="auto-save-toggle" style="opacity: 0; width: 0; height: 0;">
                        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px;"></span>
                    </label>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                    <span>Notifications</span>
                    <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                        <input type="checkbox" id="notifications-toggle" style="opacity: 0; width: 0; height: 0;">
                        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px;"></span>
                    </label>
                </div>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">💾 Save Management</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button onclick="exportSave()" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 8px;">Export Save</button>
                    <button onclick="importSave()" style="flex: 1; padding: 10px; background: #007bff; color: white; border: none; border-radius: 8px;">Import Save</button>
                </div>
                <input type="file" id="import-file" accept=".json" style="display: none;">
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #ff6b35; margin-bottom: 15px;">🔄 Interface</h3>
                <button onclick="forceRefreshInterface()" style="width: 100%; padding: 10px; background: #ff6b35; color: white; border: none; border-radius: 8px; margin-bottom: 10px;">Force Refresh Interface</button>
                <p style="font-size: 12px; color: #6c757d; margin: 0;">Use this if apps are showing old versions or cached content</p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #dc3545; margin-bottom: 15px;">⚠️ Danger Zone</h3>
                <button onclick="factoryReset()" style="width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 8px;">Factory Reset</button>
            </div>
        </div>
    `;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Show enhanced new day popup with player status and critical events
 * Now includes story branching system for immersive narrative
 */
function showNewDayPopup() {
    const data = loadGameData();
    
    // Story events are now handled in Daily Events app
    // Show regular new day popup
    showRegularNewDayPopup(data);
}

/**
 * Show story event popup for narrative choices
 */
function showStoryEventPopup(event) {
    window.currentStoryEvent = event;
    console.log('Showing story event:', event.title);
    
    let content = `
        <div style="text-align: center; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px; border-radius: 15px; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 24px;">📖 ${event.title}</h2>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 15px; padding: 20px; margin-bottom: 25px; text-align: left;">
                <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0;">${event.description}</p>
            </div>
            
            <div style="text-align: left;">
                <h4 style="color: #495057; margin-bottom: 15px; text-align: center;">What do you choose?</h4>
                ${generateStoryChoicesHTML(event)}
            </div>
        </div>
    `;
    
    showModal('Life Choice', content, { showCancel: false, showOk: false });
}

/**
 * Show regular new day popup (original functionality)
 */
function showRegularNewDayPopup(data) {
    // Get player's emotional state
    const emotion = getPlayerEmotion(data);
    
    // Get critical events from the last day
    const criticalEvents = getCriticalEvents(data);
    
    // Get player status summary
    const statusInfo = getPlayerStatusSummary(data);
    
    // Create popup content
    const popupContent = `
        <div style="text-align: center;">
            <h2 style="color: #667eea; margin-bottom: 20px;">Day ${data.day} - New Dawn</h2>
            
            <!-- Player Emotion -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 48px; margin-bottom: 10px;">${emotion.emoji}</div>
                <h3 style="color: #333; margin-bottom: 5px;">${emotion.feeling}</h3>
                <p style="color: #666; font-size: 14px; margin: 0;">${emotion.description}</p>
            </div>
            
            <!-- Player Status -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="color: #667eea; margin-bottom: 15px;">📊 Your Status</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left;">
                    ${statusInfo.map(info => `
                        <div style="padding: 8px; background: white; border-radius: 6px; border-left: 3px solid ${info.color};">
                            <div style="font-size: 12px; color: #666;">${info.label}</div>
                            <div style="font-weight: bold; color: #333;">${info.value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Critical Events -->
            ${criticalEvents.length > 0 ? `
                <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
                    <h4 style="color: #856404; margin-bottom: 15px;">⚠️ Important Events</h4>
                    <div style="text-align: left;">
                        ${criticalEvents.map(event => `
                            <div style="padding: 8px 0; border-bottom: 1px solid #f1c40f22;">
                                <div style="font-weight: bold; color: #856404;">${event.title}</div>
                                <div style="font-size: 14px; color: #6c757d;">${event.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Daily Event Notice -->
            ${(!data.dailyEventCompleted || data.lastDailyEventDay !== data.day) ? `
                <div style="background: #d1ecf1; padding: 12px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #bee5eb;">
                    <div style="color: #0c5460; font-weight: bold;">🎯 Daily Event Available!</div>
                    <div style="font-size: 14px; color: #0c5460;">Check the Events app for your daily challenge</div>
                </div>
            ` : ''}
            
            <!-- Close Button -->
            <button onclick="closeModal()" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'" 
               onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)'">
                Continue Your Journey
            </button>
        </div>
    `;
    
    // Show the popup without default OK/Cancel buttons
    showModal('New Day', popupContent, { showCancel: false, showOk: false });
}

/**
 * Get player's emotional state based on stats
 */
function getPlayerEmotion(data) {
    const health = data.health ?? 100;
    const happiness = data.happiness ?? 100;
    const bankBalance = data.bankBalance ?? 0;
    
    // Determine emotion based on multiple factors
    if (health <= 20 && happiness <= 30) {
        return {
            emoji: '😵',
            feeling: 'Terrible',
            description: 'You feel awful - low health and very unhappy'
        };
    } else if (health <= 40 && happiness <= 40) {
        return {
            emoji: '😢',
            feeling: 'Depressed',
            description: 'Things are not going well for you'
        };
    } else if (bankBalance <= 0) {
        return {
            emoji: '😰',
            feeling: 'Stressed',
            description: 'Financial worries are weighing on your mind'
        };
    } else if (health <= 60 || happiness <= 60) {
        return {
            emoji: '😐',
            feeling: 'Okay',
            description: 'You feel average - nothing special'
        };
    } else if (health >= 80 && happiness >= 80 && bankBalance >= 1000) {
        return {
            emoji: '😄',
            feeling: 'Excellent',
            description: 'Life is great! You feel healthy, happy, and wealthy'
        };
    } else if (health >= 70 && happiness >= 70) {
        return {
            emoji: '🙂',
            feeling: 'Good',
            description: 'You feel pretty good about life'
        };
    } else {
        return {
            emoji: '😌',
            feeling: 'Content',
            description: 'You feel peaceful and satisfied'
        };
    }
}

/**
 * Get critical events that happened during the last day
 */
function getCriticalEvents(data) {
    const events = [];
    const recentEvents = data.events ? data.events.slice(-10) : [];
    
    // Check for job loss
    const firedEvent = recentEvents.find(event => 
        event.message && event.message.includes('fired') || 
        event.message.includes('terminated') ||
        event.message.includes('laid off')
    );
    
    if (firedEvent) {
        events.push({
            title: '💼 Job Loss',
            description: 'You lost your job! You need to find new employment.'
        });
    }
    
    // Check for burglary
    const burglaryEvent = recentEvents.find(event => 
        event.message && (event.message.includes('burgl') || 
        event.message.includes('stole') ||
        event.message.includes('robbed'))
    );
    
    if (burglaryEvent) {
        events.push({
            title: '🏠 Burglary',
            description: 'Your home was burglarized! Money and items were stolen.'
        });
    }
    
    // Check for major health issues
    if ((data.health ?? 100) <= 25) {
        events.push({
            title: '❤️ Health Crisis',
            description: 'Your health is critically low - consider buying food or medicine!'
        });
    }
    
    // Check for debt issues
    if ((data.debt ?? 0) > (data.bankBalance ?? 0) * 2) {
        events.push({
            title: '💸 Debt Warning',
            description: 'Your debt is becoming unmanageable - focus on paying it down!'
        });
    }
    
    // Check for addiction withdrawal
    if ((data.foodAddiction ?? 100) <= 20) {
        events.push({
            title: '🍎 Food Withdrawal',
            description: 'Severe food withdrawal is affecting your health!'
        });
    }
    
    if ((data.gamblingAddiction ?? 100) <= 20) {
        events.push({
            title: '🎰 Gambling Withdrawal',
            description: 'Gambling withdrawal is severely affecting your mood!'
        });
    }
    
    return events;
}

/**
 * Get player status summary for display
 */
function getPlayerStatusSummary(data) {
    return [
        {
            label: 'Health',
            value: `${Math.round(data.health ?? 100)}%`,
            color: (data.health ?? 100) >= 70 ? '#28a745' : (data.health ?? 100) >= 40 ? '#ffc107' : '#dc3545'
        },
        {
            label: 'Happiness',
            value: `${Math.round(data.happiness ?? 100)}%`,
            color: (data.happiness ?? 100) >= 70 ? '#28a745' : (data.happiness ?? 100) >= 40 ? '#ffc107' : '#dc3545'
        },
        {
            label: 'Bank Balance',
            value: `€${(data.bankBalance ?? 0).toLocaleString()}`,
            color: (data.bankBalance ?? 0) >= 1000 ? '#28a745' : (data.bankBalance ?? 0) >= 0 ? '#ffc107' : '#dc3545'
        },
        {
            label: 'Level',
            value: `Lv.${data.level ?? 1}`,
            color: '#667eea'
        },
        {
            label: 'Job',
            value: data.profession || 'Unemployed',
            color: (data.profession && data.profession !== 'Unemployed') ? '#28a745' : '#dc3545'
        },
        {
            label: 'Home',
            value: data.house || "Parents' Home",
            color: (data.house && data.house !== "Parents' Home") ? '#28a745' : '#ffc107'
        }
    ];
}

// Export functions for global access
window.advanceDay = advanceDay;
window.showDailyEvent = showDailyEvent;
window.openMarket = openMarket;
window.openInventory = openInventory;
// Note: openBlackjack, openKino, openJobSearch, openRealEstate, openCarDealership exported from their respective JS files
window.openAchievements = openAchievements;
window.openEvents = openEvents;
window.openStats = openStats;
window.openSettings = openSettings;
window.openBank = openBank;
window.closeApp = closeApp;
window.takeLoan = takeLoan;
window.payDebt = payDebt;
