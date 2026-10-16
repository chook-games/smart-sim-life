// achievements.js - Enhanced achievement system

function renderAchievements() {
    const data = loadGameData();
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="achievements-container">
            <div style="text-align: center; margin-bottom: 25px;">
                <h3 style="color: #667eea; margin: 0;">🏆 Achievements</h3>
                <div style="font-size: 14px; color: #6c757d; margin-top: 5px;">
                    ${getTotalAchievementsUnlocked(data)} of ${getTotalAchievements()} unlocked
                </div>
            </div>
            
            ${Object.keys(window.ACHIEVEMENT_CONFIGS).map(key => 
                generateAchievementCategoryHTML(key, data)
            ).join('')}
        </div>
    `;
}

function generateAchievementCategoryHTML(achievementKey, data) {
    const config = window.ACHIEVEMENT_CONFIGS[achievementKey];
    const achievement = data.achievements[achievementKey];
    
    if (!achievement) return '';
    
    return `
        <div class="achievement-category">
            <h3>${config.icon} ${config.name}</h3>
            <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">${config.description}</p>
            
            ${config.targets.map((target, index) => {
                const isUnlocked = achievement.unlocked.includes(index);
                const progress = Math.min(achievement.progress, target);
                const progressPercent = (progress / target) * 100;
                
                return `
                    <div class="achievement-item ${isUnlocked ? 'unlocked' : ''}">
                        <div class="achievement-icon">
                            ${isUnlocked ? '🏆' : config.icon}
                        </div>
                        <div class="achievement-info">
                            <div class="achievement-title">
                                ${config.name} ${index + 1}
                                ${isUnlocked ? '✓' : ''}
                            </div>
                            <div class="achievement-progress">
                                ${progress}/${target} ${getProgressUnit(achievementKey)}
                                <div style="background: #e9ecef; height: 4px; border-radius: 2px; margin-top: 5px; overflow: hidden;">
                                    <div style="background: ${isUnlocked ? '#28a745' : '#667eea'}; height: 100%; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                        </div>
                        <div class="achievement-reward">
                            €${config.rewards[index]}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getProgressUnit(achievementKey) {
    switch (achievementKey) {
        case 'surviveDays': return 'days';
        case 'kinoWins': return 'wins';
        case 'blackjackWins': return 'wins';
        case 'slotsWins': return 'wins';
        case 'itemsBought': return 'items';
        case 'moneyEarned': return '€';
        case 'levelReached': return 'level';
        default: return '';
    }
}

function getTotalAchievements() {
    return Object.values(window.ACHIEVEMENT_CONFIGS).reduce((total, config) => {
        return total + config.targets.length;
    }, 0);
}

function getTotalAchievementsUnlocked(data) {
    let total = 0;
    Object.keys(window.ACHIEVEMENT_CONFIGS).forEach(key => {
        if (data.achievements[key]) {
            total += data.achievements[key].unlocked.length;
        }
    });
    return total;
}

function checkAchievementProgress(data, achievementKey) {
    const config = window.ACHIEVEMENT_CONFIGS[achievementKey];
    const achievement = data.achievements[achievementKey];
    
    if (!config || !achievement) return;
    
    // Update progress based on achievement type
    updateAchievementProgress(data, achievementKey);
    
    // Check for new unlocks - FIXED: Proper duplicate prevention
    config.targets.forEach((target, index) => {
        // Only unlock if progress meets target AND hasn't been unlocked yet
        if (achievement.progress >= target && !achievement.unlocked.includes(index)) {
            unlockAchievement(data, achievementKey, index);
        }
    });
}

function updateAchievementProgress(data, achievementKey) {
    switch (achievementKey) {
        case 'surviveDays':
            data.achievements.surviveDays.progress = data.day;
            break;
        case 'levelReached':
            data.achievements.levelReached.progress = data.level;
            break;
        case 'moneyEarned':
            data.achievements.moneyEarned.progress = data.lifetimeEarnings || 0;
            break;
        // kinoWins, blackjackWins, slotsWins, itemsBought are updated elsewhere
    }
}

function unlockAchievement(data, achievementKey, index) {
    const config = window.ACHIEVEMENT_CONFIGS[achievementKey];
    const achievement = data.achievements[achievementKey];
    
    console.log(`Attempting to unlock: ${achievementKey} level ${index + 1}, current unlocked:`, achievement.unlocked);
    
    // FIXED: Double-check to prevent duplicate unlocks
    if (achievement.unlocked.includes(index)) {
        console.log(`Achievement ${achievementKey} level ${index + 1} already unlocked, skipping`);
        return; // Already unlocked, skip
    }
    
    // Add to unlocked array
    achievement.unlocked.push(index);
    
    // Give reward
    const reward = config.rewards[index];
    data.bankBalance += reward;
    data.xp += Math.floor(reward / 2); // Bonus XP
    
    // Add event
    data.events.push({
        message: `🏆 Achievement Unlocked: ${config.name} ${index + 1}! Reward: €${reward}`,
        date: new Date().toISOString(),
        read: false
    });
    
    // Show celebration
    showAchievementUnlocked(config, index + 1, reward);
    
    console.log(`Achievement unlocked successfully: ${achievementKey} level ${index + 1}, new unlocked:`, achievement.unlocked);
}

function showAchievementUnlocked(config, level, reward) {
    // Create achievement popup
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        z-index: 2000;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: achievementPop 0.5s ease-out;
        max-width: 300px;
    `;
    
    popup.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">🏆</div>
        <h3 style="margin: 0 0 10px 0;">Achievement Unlocked!</h3>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
            ${config.icon} ${config.name} ${level}
        </div>
        <div style="font-size: 14px; margin-bottom: 15px; opacity: 0.9;">
            ${config.description}
        </div>
        <div style="background: rgba(255,255,255,0.2); border-radius: 10px; padding: 10px;">
            <strong>Reward: €${reward}</strong>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.style.animation = 'achievementFade 0.5s ease-out';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 500);
        }
    }, 3000);
    
    // Add click to dismiss
    popup.onclick = () => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    };
}

// Check all achievements (called daily)
function checkAchievements() {
    const data = loadGameData();
    
    Object.keys(window.ACHIEVEMENT_CONFIGS).forEach(key => {
        checkAchievementProgress(data, key);
    });
    
    saveGameData(data);
}

function checkSpecificAchievement(data, achievementKey) {
    checkAchievementProgress(data, achievementKey);
    saveGameData(data);
}

function checkDayProgressionAchievements(data) {
    // Only check achievements that change with day progression
    // Skip game-specific achievements (slots, blackjack, kino) to prevent spam
    const dayProgressionAchievements = ['surviveDays', 'levelReached', 'moneyEarned', 'itemsBought'];
    
    dayProgressionAchievements.forEach(key => {
        if (window.ACHIEVEMENT_CONFIGS[key]) {
            checkAchievementProgress(data, key);
        }
    });
    
    saveGameData(data);
}

// Export functions for global access
window.checkAchievements = checkAchievements;
window.checkSpecificAchievement = checkSpecificAchievement;
window.checkDayProgressionAchievements = checkDayProgressionAchievements;

// Add achievement animation styles
const achievementStyles = `
    @keyframes achievementPop {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes achievementFade {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .achievement-popup {
        cursor: pointer;
    }
    
    .achievement-popup:hover {
        transform: translate(-50%, -50%) scale(1.05) !important;
    }
`;

// Add styles to document if not already added
if (!document.querySelector('#achievement-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'achievement-styles';
    styleSheet.textContent = achievementStyles;
    document.head.appendChild(styleSheet);
}

// Export functions
window.renderAchievements = renderAchievements;
window.checkAchievementProgress = checkAchievementProgress;
window.checkAchievements = checkAchievements;
window.getTotalAchievementsUnlocked = getTotalAchievementsUnlocked;
