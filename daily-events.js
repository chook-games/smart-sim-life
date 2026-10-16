// daily-events.js - Fixed daily events system with real rewards

function generateDailyEventContent() {
    const data = loadGameData();
    
    // Check if already completed today
    if (data.dailyEventCompleted && data.lastDailyEventDay === data.day) {
        return `
            <div class="daily-event-container">
                <div class="daily-event-icon">✅</div>
                <div class="daily-event-title">Daily Event Complete</div>
                <div class="daily-event-description">
                    You've already completed today's event. Come back tomorrow for a new opportunity!
                </div>
                <div style="margin-top: 20px;">
                    <button class="action-btn decline" onclick="closeApp()">Close</button>
                </div>
            </div>
        `;
    }
    
    // Get a random event
    const event = getRandomDailyEvent();
    
    return `
        <div class="daily-event-container" id="daily-event-${event.id}">
            <div class="daily-event-icon">${event.icon}</div>
            <div class="daily-event-title">${event.title}</div>
            <div class="daily-event-description">${event.description}</div>
            
            <div class="daily-event-actions">
                ${event.choices.map((choice, index) => 
                    `<button class="action-btn ${index === 0 ? 'accept' : 'decline'}" 
                             onclick="handleDailyEventChoice('${event.id}', ${index})">
                        ${choice.text}
                        ${choice.cost ? ` (€${choice.cost.money})` : ''}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

function getRandomDailyEvent() {
    const availableEvents = window.DAILY_EVENTS.filter(event => {
        // Check if event is available based on player state
        const data = loadGameData();
        
        // Some events require minimum money
        if (event.id === 'street_performer' && data.bankBalance < 10) return false;
        if (event.id === 'book_sale' && data.bankBalance < 20) return false;
        if (event.id === 'tech_gadget' && data.bankBalance < 150) return false;
        
        return true;
    });
    
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

function handleDailyEventChoice(eventId, choiceIndex) {
    const data = loadGameData();
    const event = window.DAILY_EVENTS.find(e => e.id === eventId);
    
    if (!event || !event.choices[choiceIndex]) {
        showToast('Invalid choice!', 'error');
        return;
    }
    
    const choice = event.choices[choiceIndex];
    
    // Check if player can afford the cost
    if (choice.cost) {
        if (choice.cost.money && data.bankBalance < choice.cost.money) {
            showToast('Insufficient funds!', 'warning');
            return;
        }
        
        // Deduct cost
        if (choice.cost.money) {
            data.bankBalance -= choice.cost.money;
        }
    }
    
    // Process outcome
    const outcome = selectOutcome(choice.outcomes);
    applyDailyEventReward(data, outcome);
    
    // Mark as completed
    data.dailyEventCompleted = true;
    data.lastDailyEventDay = data.day;
    
    // Add event to history
    data.events.push({
        message: `Daily Event: ${event.title} - ${outcome.message}`,
        date: new Date().toISOString(),
        read: false
    });
    
    saveGameData(data);
    updateAllUI();
    
    // Show result
    showDailyEventResult(event, choice, outcome);
}

function selectOutcome(outcomes) {
    const random = Math.random();
    let cumulativeChance = 0;
    
    for (const outcome of outcomes) {
        cumulativeChance += outcome.chance;
        if (random <= cumulativeChance) {
            return outcome;
        }
    }
    
    // Fallback to last outcome
    return outcomes[outcomes.length - 1];
}

function applyDailyEventReward(data, outcome) {
    const reward = outcome.reward;
    
    if (reward.money) {
        // SECURITY FIX: Validate money reward is reasonable (max €2000 per event)
        const validatedMoney = Math.max(0, Math.min(2000, reward.money));
        data.bankBalance += validatedMoney;
        updateLifetimeStats(data, validatedMoney, 0);
    }
    
    if (reward.xp) {
        data.xp += reward.xp;
        
        // Check for level up
        const newLevel = window.LEVEL_SYSTEM.getLevelFromXP(data.xp);
        if (newLevel > data.level) {
            data.level = newLevel;
            data.events.push({
                message: `🎉 Level up! You are now level ${newLevel}!`,
                date: new Date().toISOString(),
                read: false
            });
            checkAchievementProgress(data, 'levelReached');
        }
    }
    
    if (reward.health) {
        data.health = Math.max(0, Math.min(100, data.health + reward.health));
    }
    
    if (reward.happiness) {
        data.happiness = Math.max(0, Math.min(100, data.happiness + reward.happiness));
    }
    
    // Special reward: item
    if (outcome.item) {
        if (!data.inventory) data.inventory = [];
        
        const inventoryItem = {
            id: `daily_${Date.now()}`,
            name: outcome.item.name,
            icon: outcome.item.icon,
            category: 'special',
            price: outcome.item.value,
            purchaseDay: data.day,
            purchaseDate: new Date().toISOString(),
            marketModifier: 1.0,
            special: true
        };
        
        data.inventory.push(inventoryItem);
    }
}

function showDailyEventResult(event, choice, outcome) {
    const rewardText = formatRewardText(outcome.reward);
    
    // Update the modal content to show result
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="daily-event-container">
            <div class="daily-event-icon">🎉</div>
            <div class="daily-event-title">Event Complete!</div>
            <div class="daily-event-description">${outcome.message}</div>
            
            ${rewardText ? `
                <div class="daily-event-reward">
                    <h4>Rewards Received:</h4>
                    ${rewardText}
                </div>
            ` : ''}
            
            ${outcome.item ? `
                <div style="background: #e7f3ff; border: 2px solid #007bff; border-radius: 10px; padding: 15px; margin: 15px 0;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">${outcome.item.icon}</div>
                    <strong>Bonus Item: ${outcome.item.name}</strong>
                    <div style="font-size: 14px; color: #6c757d;">Added to your inventory!</div>
                </div>
            ` : ''}
            
            <div style="margin-top: 20px;">
                <button class="action-btn accept" onclick="closeApp()">Continue</button>
            </div>
            
            <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #6c757d;">
                Come back tomorrow for another daily event opportunity!
            </div>
        </div>
    `;
}

function formatRewardText(reward) {
    const rewards = [];
    
    if (reward.money) {
        rewards.push(`💰 €${reward.money}`);
    }
    
    if (reward.xp) {
        rewards.push(`⭐ ${reward.xp} XP`);
    }
    
    if (reward.health) {
        const sign = reward.health > 0 ? '+' : '';
        rewards.push(`❤️ ${sign}${reward.health} Health`);
    }
    
    if (reward.happiness) {
        const sign = reward.happiness > 0 ? '+' : '';
        rewards.push(`😊 ${sign}${reward.happiness} Happiness`);
    }
    
    return rewards.join('<br>');
}

// Reset daily event availability each day
function resetDailyEventAvailability() {
    const data = loadGameData();
    
    // Reset if it's a new day
    if (data.lastDailyEventDay !== data.day) {
        data.dailyEventCompleted = false;
        data.lastDailyEventDay = data.day;
        saveGameData(data);
    }
}

// Check daily event availability (called from tick.js)
function checkDailyEventAvailability() {
    const data = loadGameData();
    
    // If daily event is available and player hasn't been notified
    if (!data.dailyEventCompleted && data.lastDailyEventDay !== data.day) {
        // Add a subtle notification
        data.events.push({
            message: '🎁 Daily event available! Check it out for rewards.',
            date: new Date().toISOString(),
            read: false
        });
        
        saveGameData(data);
    }
}

// Export functions
window.generateDailyEventContent = generateDailyEventContent;
window.handleDailyEventChoice = handleDailyEventChoice;
window.resetDailyEventAvailability = resetDailyEventAvailability;
window.checkDailyEventAvailability = checkDailyEventAvailability;
