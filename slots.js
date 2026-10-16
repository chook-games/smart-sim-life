// slots.js - Slot Machine Game

let currentSlotBet = 10;
let isSpinning = false;

const SLOT_SYMBOLS = [
    { symbol: '🍒', name: 'Cherry', multiplier: 2 },
    { symbol: '🍋', name: 'Lemon', multiplier: 3 },
    { symbol: '🍊', name: 'Orange', multiplier: 5 },
    { symbol: '🍇', name: 'Grape', multiplier: 8 },
    { symbol: '💎', name: 'Diamond', multiplier: 15 }
];

function openSlots() {
    const data = loadGameData();
    
    const content = `
        <div class="slots-container" style="padding: 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px;">
            <h2 style="margin: 0 0 20px 0;">🎰 Lucky Slots</h2>
            
            <div class="slots-machine" style="background: #2c3e50; padding: 30px; border-radius: 15px; margin-bottom: 20px; box-shadow: inset 0 4px 8px rgba(0,0,0,0.3);">
                <div class="reels" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
                    <div id="reel1" class="reel" style="background: white; color: #2c3e50; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 3rem; border-radius: 10px; border: 3px solid #f39c12;">
                        🍒
                    </div>
                    <div id="reel2" class="reel" style="background: white; color: #2c3e50; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 3rem; border-radius: 10px; border: 3px solid #f39c12;">
                        🍒
                    </div>
                    <div id="reel3" class="reel" style="background: white; color: #2c3e50; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 3rem; border-radius: 10px; border: 3px solid #f39c12;">
                        🍒
                    </div>
                </div>
                
                <div id="slots-result" class="result-display" style="height: 40px; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                    Place your bet and spin!
                </div>
                
                <div class="bet-controls" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px;">Bet Amount: €${currentSlotBet}</label>
                    <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                        <button onclick="setSlotBet(5)" class="bet-btn ${currentSlotBet === 5 ? 'active' : ''}" style="padding: 8px 16px; border: none; border-radius: 8px; background: ${currentSlotBet === 5 ? '#f39c12' : '#34495e'}; color: white; cursor: pointer;">€5</button>
                        <button onclick="setSlotBet(10)" class="bet-btn ${currentSlotBet === 10 ? 'active' : ''}" style="padding: 8px 16px; border: none; border-radius: 8px; background: ${currentSlotBet === 10 ? '#f39c12' : '#34495e'}; color: white; cursor: pointer;">€10</button>
                        <button onclick="setSlotBet(25)" class="bet-btn ${currentSlotBet === 25 ? 'active' : ''}" style="padding: 8px 16px; border: none; border-radius: 8px; background: ${currentSlotBet === 25 ? '#f39c12' : '#34495e'}; color: white; cursor: pointer;">€25</button>
                        <button onclick="setSlotBet(50)" class="bet-btn ${currentSlotBet === 50 ? 'active' : ''}" style="padding: 8px 16px; border: none; border-radius: 8px; background: ${currentSlotBet === 50 ? '#f39c12' : '#34495e'}; color: white; cursor: pointer;">€50</button>
                        <button onclick="setSlotBet(100)" class="bet-btn ${currentSlotBet === 100 ? 'active' : ''}" style="padding: 8px 16px; border: none; border-radius: 8px; background: ${currentSlotBet === 100 ? '#f39c12' : '#34495e'}; color: white; cursor: pointer;">€100</button>
                    </div>
                </div>
                
                <button id="spin-btn" onclick="spinSlots()" style="background: #e74c3c; color: white; border: none; padding: 15px 40px; font-size: 18px; font-weight: bold; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                    🎰 SPIN! 🎰
                </button>
            </div>
            
            <div class="slots-info" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <h4 style="margin: 0 0 10px 0;">💰 Payouts</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; font-size: 14px;">
                    <div>🍒🍒🍒 = 2x</div>
                    <div>🍋🍋🍋 = 2x</div>
                    <div>🍊🍊🍊 = 3x</div>
                    <div>🍇🍇🍇 = 3x</div>
                    <div>⭐⭐⭐ = 5x</div>
                    <div>💎💎💎 = 10x</div>
                    <div>7️⃣7️⃣7️⃣ = 20x</div>
                    <div>💰💰💰 = 100x</div>
                </div>
                <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">Match 3 symbols to win! Higher bets = higher rewards!</p>
            </div>
            
            <div class="player-stats" style="display: flex; justify-content: space-between; margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 14px;">
                <span>💰 Balance: €${data.bankBalance}</span>
                <span>🎰 Today's Slots: €${data.slotStats?.todayWinnings || 0}</span>
            </div>
        </div>
    `;
    
    openApp('Lucky Slots', content);
    currentApp = 'slots';
}

function setSlotBet(amount) {
    const data = loadGameData();
    
    if (amount > data.bankBalance) {
        showToast('Insufficient funds!', 'warning');
        return;
    }
    
    currentSlotBet = amount;
    
    // Update bet buttons
    document.querySelectorAll('.bet-btn').forEach(btn => {
        btn.style.background = '#34495e';
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="setSlotBet(${amount})"]`);
    if (activeBtn) {
        activeBtn.style.background = '#f39c12';
        activeBtn.classList.add('active');
    }
    
    // Update bet display
    const betLabel = document.querySelector('.bet-controls label');
    if (betLabel) {
        betLabel.textContent = `Bet Amount: €${currentSlotBet}`;
    }
}

function spinSlots() {
    if (isSpinning) return;
    
    const data = loadGameData();
    
    if (data.bankBalance < currentSlotBet) {
        showToast('Insufficient funds!', 'warning');
        return;
    }
    
    // Deduct bet
    data.bankBalance -= currentSlotBet;
    isSpinning = true;
    
    const spinBtn = document.getElementById('spin-btn');
    const resultDiv = document.getElementById('slots-result');
    
    if (spinBtn) spinBtn.disabled = true;
    if (resultDiv) resultDiv.textContent = 'Spinning...';
    
    // Animate spinning
    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    let spinCounter = 0;
    const maxSpins = 15;
    
    const spinInterval = setInterval(() => {
        reels.forEach(reel => {
            if (reel) {
                const randomSymbol = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
                reel.textContent = randomSymbol.symbol;
                reel.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (reel) reel.style.transform = 'scale(1)';
                }, 100);
            }
        });
        
        spinCounter++;
        if (spinCounter >= maxSpins) {
            clearInterval(spinInterval);
            finalizeSpin(data);
        }
    }, 150);
}

function finalizeSpin(data) {
    // Generate final symbols with weighted probability
    const finalSymbols = [];
    
    for (let i = 0; i < 3; i++) {
        const rand = Math.random();
        let symbol;
        
        if (rand < 0.50) symbol = SLOT_SYMBOLS[0]; // Cherry (50%)
        else if (rand < 0.75) symbol = SLOT_SYMBOLS[1]; // Lemon (25%)
        else if (rand < 0.90) symbol = SLOT_SYMBOLS[2]; // Orange (15%)
        else if (rand < 0.97) symbol = SLOT_SYMBOLS[3]; // Grape (7%)
        else symbol = SLOT_SYMBOLS[4]; // Diamond (3%)
        
        finalSymbols.push(symbol);
    }
    
    // Display final symbols
    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    reels.forEach((reel, index) => {
        if (reel) {
            reel.textContent = finalSymbols[index].symbol;
            reel.style.border = '3px solid #f39c12';
        }
    });
    
    // Check for winning combinations
    const isWin = finalSymbols[0].symbol === finalSymbols[1].symbol && 
                  finalSymbols[1].symbol === finalSymbols[2].symbol;
    
    const resultDiv = document.getElementById('slots-result');
    const spinBtn = document.getElementById('spin-btn');
    
    if (isWin) {
        const winAmount = currentSlotBet * finalSymbols[0].multiplier;
        
        // SECURITY FIX: Validate win amount before adding to balance
        if (winAmount >= 0 && winAmount <= currentSlotBet * 100) { // Max 100x multiplier
            data.bankBalance += winAmount;
        } else {
            console.warn('Invalid slots payout amount blocked:', winAmount);
            data.bankBalance += 0; // No payout if invalid
        }
        
        // Update stats
        if (!data.slotStats) data.slotStats = { todayWinnings: 0, totalSpins: 0, totalWins: 0 };
        data.slotStats.todayWinnings += winAmount - currentSlotBet;
        data.slotStats.totalSpins = (data.slotStats.totalSpins || 0) + 1;
        data.slotStats.totalWins = (data.slotStats.totalWins || 0) + 1;
        
        // Initialize achievements if they don't exist
        if (!data.achievements) {
            data.achievements = {};
        }
        if (!data.achievements.slotsWins) {
            data.achievements.slotsWins = { progress: 0, unlocked: [] };
        }
        
        // Update achievement progress
        data.achievements.slotsWins.progress = data.slotStats.totalWins;
        
        // Highlight winning reels
        reels.forEach(reel => {
            if (reel) reel.style.border = '3px solid #00ff00';
        });
        
        if (resultDiv) {
            resultDiv.innerHTML = `🎉 <span style="color: #f1c40f;">BIG WIN!</span> €${winAmount} 🎉`;
            resultDiv.style.color = '#f1c40f';
        }
        
        data.events.push({
            message: `🎰 Won €${winAmount} on slots with ${finalSymbols[0].symbol}${finalSymbols[1].symbol}${finalSymbols[2].symbol}!`,
            date: new Date().toISOString(),
            read: false
        });
        
        showToast(`🎰 Won €${winAmount}!`, 'success');
    } else {
        // Update stats for loss
        if (!data.slotStats) data.slotStats = { todayWinnings: 0, totalSpins: 0, totalWins: 0 };
        data.slotStats.todayWinnings -= currentSlotBet;
        data.slotStats.totalSpins = (data.slotStats.totalSpins || 0) + 1;
        
        if (resultDiv) {
            resultDiv.textContent = 'No match. Try again!';
            resultDiv.style.color = '#e74c3c';
        }
    }
    
    // FIXED: Increase gambling addiction by 1% every time player plays (regardless of win/loss)
    data.gamblingAddiction = Math.min(100, (data.gamblingAddiction || 50) + 1);
    data.daysSinceLastGambling = 0;
    data.xp += 2; // Small XP for each spin
    
    // Update UI first
    saveGameData(data);
    updateAllUI();
    
    // Check achievements after saving to prevent duplicate notifications
    if (isWin) {
        checkSpecificAchievement(data, 'slotsWins');
    }
    
    // Re-enable spinning
    isSpinning = false;
    if (spinBtn) spinBtn.disabled = false;
    
    // Update balance display
    const balanceSpan = document.querySelector('.player-stats span');
    if (balanceSpan) {
        balanceSpan.textContent = `💰 Balance: €${data.bankBalance}`;
    }
    
    // Update today's winnings
    const winningsSpan = document.querySelector('.player-stats span:last-child');
    if (winningsSpan) {
        winningsSpan.textContent = `🎰 Today's Slots: €${data.slotStats?.todayWinnings || 0}`;
    }
}