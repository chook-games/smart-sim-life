/**
 * New Game Plus System
 * Manages the transition from one life cycle (365 days) to the next
 * Player keeps achievements, skills, and certain progress
 */

/**
 * Check if player has reached end of life cycle
 */
function checkForNewGamePlus() {
    const data = loadGameData();
    
    if (data.day >= 365 && !data.newGamePlusOffered) {
        data.newGamePlusOffered = true;
        saveGameData(data);
        showNewGamePlusModal();
        return true;
    }
    return false;
}

/**
 * Show New Game Plus modal
 */
function showNewGamePlusModal() {
    const data = loadGameData();
    
    const content = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #667eea; margin-bottom: 20px;">Life Cycle Complete!</h2>
            
            <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.5;">
                Congratulations! You've completed your first life journey of 365 days. 
                Your character has lived a full life and gained valuable experience.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">📊 Your Life Summary</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left;">
                    <div>
                        <strong>Final Level:</strong> ${data.level}
                        <br><strong>Total XP:</strong> ${data.experience}
                        <br><strong>Money Earned:</strong> €${data.totalMoneyEarned || data.bankBalance}
                    </div>
                    <div>
                        <strong>Achievements:</strong> ${Object.keys(data.achievements || {}).filter(key => data.achievements[key].completed).length}
                        <br><strong>Stories Completed:</strong> ${(data.completedStories || []).length}
                        <br><strong>Skill Points:</strong> ${data.skillPoints || 0}
                    </div>
                </div>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 2px solid #667eea;">
                <h3 style="color: #667eea; margin-bottom: 15px;">🔄 New Game Plus Benefits</h3>
                <div style="text-align: left;">
                    <p><strong>✓ Keep Forever:</strong></p>
                    <ul style="margin-left: 20px; margin-bottom: 15px;">
                        <li>All achievements and their XP bonuses</li>
                        <li>All skill tree unlocks and upgrades</li>
                        <li>Half of your current money (inheritance)</li>
                        <li>Character name and customization</li>
                        <li>Romance relationship memories</li>
                    </ul>
                    <p><strong>🔄 Reset for New Journey:</strong></p>
                    <ul style="margin-left: 20px;">
                        <li>Start at Day 1 again</li>
                        <li>Fresh story events and choices</li>
                        <li>New procedural story generation</li>
                        <li>Reset health, happiness, and job status</li>
                        <li>New opportunities and challenges</li>
                    </ul>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="startNewGamePlus()" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                ">
                    🌟 Begin New Life
                </button>
                <button onclick="continueCurrentLife()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                    Continue Current Life
                </button>
            </div>
        </div>
    `;
    
    showModal('Life Cycle Complete', content, { showCancel: false, showOk: false });
}

/**
 * Start New Game Plus
 */
function startNewGamePlus() {
    const data = loadGameData();
    
    // Save permanent progress
    const permanentData = {
        achievements: data.achievements || {},
        skillTree: data.skillTree || {},
        skillPoints: data.skillPoints || 0,
        characterName: data.characterName || 'Player',
        characterGender: data.characterGender || 'Other',
        totalLifeCycles: (data.totalLifeCycles || 0) + 1,
        inheritedMoney: Math.floor((data.bankBalance || 0) / 2),
        romanceMemories: data.romanceMemories || {},
        completedStoriesHistory: data.completedStories || []
    };
    
    // Reset to new life
    const newData = getDefaultGameData();
    
    // Apply permanent benefits
    newData.achievements = permanentData.achievements;
    newData.skillTree = permanentData.skillTree;
    newData.skillPoints = permanentData.skillPoints;
    newData.characterName = permanentData.characterName;
    newData.characterGender = permanentData.characterGender;
    newData.totalLifeCycles = permanentData.totalLifeCycles;
    newData.bankBalance = permanentData.inheritedMoney;
    newData.romanceMemories = permanentData.romanceMemories;
    newData.newGamePlusActive = true;
    
    // Calculate level and XP from achievements (permanent XP boost)
    let bonusXP = 0;
    Object.values(newData.achievements).forEach(achievement => {
        if (achievement.completed) {
            bonusXP += achievement.xpReward || 0;
        }
    });
    
    newData.experience = bonusXP;
    newData.level = Math.floor(newData.experience / 100) + 1;
    
    // Reset story completion for new experience
    newData.completedStories = [];
    newData.newGamePlusOffered = false;
    
    // Add special New Game Plus event
    newData.events.push({
        message: `🌟 New Game Plus activated! Starting life cycle ${newData.totalLifeCycles} with inherited benefits.`,
        date: new Date().toISOString(),
        read: false
    });
    
    saveGameData(newData);
    
    // Refresh the entire UI
    updateAllUI();
    closeModal();
    
    showToast(`Welcome to Life Cycle ${newData.totalLifeCycles}! You inherit €${permanentData.inheritedMoney.toLocaleString()}`, 'success');
}

/**
 * Continue current life beyond 365 days
 */
function continueCurrentLife() {
    const data = loadGameData();
    data.newGamePlusOffered = false;
    data.extendedLife = true;
    
    data.events.push({
        message: `🕰️ Extended your current life beyond the normal cycle. The journey continues...`,
        date: new Date().toISOString(),
        read: false
    });
    
    saveGameData(data);
    closeModal();
    
    showToast('Continuing your current life journey!', 'info');
}

/**
 * Get default game data (from state.js equivalent)
 */
function getDefaultGameData() {
    return {
        day: 1,
        level: 1,
        experience: 0,
        bankBalance: 500,
        debt: 0,
        health: 100,
        happiness: 100,
        profession: 'Unemployed',
        workExperience: 0,
        house: "Parents' Home",
        homeOwnership: 'Free',
        car: 'Walking',
        inventory: {},
        expenses: 0,
        creditScore: 700,
        gamblingAddiction: 100,
        foodAddiction: 100,
        characterName: 'Player',
        characterGender: 'Other',
        characterAge: 18,
        events: [],
        achievements: {},
        skillTree: {},
        skillPoints: 0,
        completedStories: [],
        relationships: {},
        romancePartner: null,
        ownedProperties: []
    };
}

// Export functions
window.checkForNewGamePlus = checkForNewGamePlus;
window.startNewGamePlus = startNewGamePlus;
window.continueCurrentLife = continueCurrentLife;