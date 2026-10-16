// roulette.js - European Roulette Game

let currentRouletteBets = [];
let isRouletteSpinning = false;

const ROULETTE_NUMBERS = [
    { number: 0, color: 'green' },
    { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' },
    { number: 4, color: 'black' }, { number: 5, color: 'red' }, { number: 6, color: 'black' },
    { number: 7, color: 'red' }, { number: 8, color: 'black' }, { number: 9, color: 'red' },
    { number: 10, color: 'black' }, { number: 11, color: 'black' }, { number: 12, color: 'red' },
    { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' },
    { number: 16, color: 'red' }, { number: 17, color: 'black' }, { number: 18, color: 'red' },
    { number: 19, color: 'red' }, { number: 20, color: 'black' }, { number: 21, color: 'red' },
    { number: 22, color: 'black' }, { number: 23, color: 'red' }, { number: 24, color: 'black' },
    { number: 25, color: 'red' }, { number: 26, color: 'black' }, { number: 27, color: 'red' },
    { number: 28, color: 'black' }, { number: 29, color: 'black' }, { number: 30, color: 'red' },
    { number: 31, color: 'black' }, { number: 32, color: 'red' }, { number: 33, color: 'black' },
    { number: 34, color: 'red' }, { number: 35, color: 'black' }, { number: 36, color: 'red' }
];

function openRoulette() {
    const data = loadGameData();
    currentRouletteBets = [];
    
    const content = `
        <div class="roulette-container" style="padding: 20px; text-align: center; background: linear-gradient(135deg, #c0392b 0%, #8e44ad 100%); color: white; border-radius: 15px;">
            <h2 style="margin: 0 0 20px 0;">🎯 European Roulette</h2>
            
            <div class="roulette-wheel" style="background: #2c3e50; padding: 30px; border-radius: 50%; margin: 20px auto; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: inset 0 4px 8px rgba(0,0,0,0.3);">
                <div id="roulette-ball" style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; transition: transform 3s ease-out;"></div>
                <div id="winning-number" style="font-size: 3rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    ?
                </div>
            </div>
            
            <div id="roulette-result" class="result-display" style="height: 40px; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                Place your bets!
            </div>
            
            <div class="betting-board" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0;">🎯 Place Your Bets</h4>
                
                <!-- Quick Bet Buttons -->
                <div class="quick-bets" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-bottom: 20px;">
                    <button onclick="placeBet('red', 10)" style="background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">Red (€10)</button>
                    <button onclick="placeBet('black', 10)" style="background: #2c3e50; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">Black (€10)</button>
                    <button onclick="placeBet('even', 10)" style="background: #27ae60; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">Even (€10)</button>
                    <button onclick="placeBet('odd', 10)" style="background: #f39c12; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">Odd (€10)</button>
                </div>
                
                <!-- Number Grid -->
                <div class="number-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; margin-bottom: 15px;">
                    ${generateNumberGrid()}
                </div>
                
                <!-- Bet Amount Selector -->
                <div class="bet-amount" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 10px;">Bet Amount:</label>
                    <select id="bet-amount" style="padding: 5px; border-radius: 5px; border: none;">
                        <option value="5">€5</option>
                        <option value="10" selected>€10</option>
                        <option value="25">€25</option>
                        <option value="50">€50</option>
                        <option value="100">€100</option>
                    </select>
                </div>
                
                <!-- Current Bets -->
                <div id="current-bets" class="current-bets" style="min-height: 30px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">Your Bets:</div>
                    <div id="bets-list">No bets placed</div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="clearBets()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Clear Bets</button>
                    <button id="spin-roulette-btn" onclick="spinRoulette()" style="background: #e74c3c; color: white; border: none; padding: 10px 30px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer;">🎯 SPIN! 🎯</button>
                </div>
            </div>
            
            <div class="roulette-info" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <h4 style="margin: 0 0 10px 0;">💰 Payouts</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 14px;">
                    <div>Single Number = 35:1</div>
                    <div>Red/Black = 1:1</div>
                    <div>Even/Odd = 1:1</div>
                    <div>1-18/19-36 = 1:1</div>
                </div>
            </div>
            
            <div class="player-stats" style="display: flex; justify-content: space-between; margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 14px;">
                <span>💰 Balance: €${data.bankBalance}</span>
                <span>🎯 Today's Roulette: €${data.rouletteStats?.todayWinnings || 0}</span>
            </div>
        </div>
    `;
    
    openApp('European Roulette', content);
    currentApp = 'roulette';
}

function generateNumberGrid() {
    let grid = '';
    // Add 0 (green)
    grid += `<button onclick="placeBetOnNumber(0)" style="background: #27ae60; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">0</button>`;
    
    // Add numbers 1-36
    for (let i = 1; i <= 36; i++) {
        const numberData = ROULETTE_NUMBERS.find(n => n.number === i);
        const bgColor = numberData.color === 'red' ? '#e74c3c' : '#2c3e50';
        grid += `<button onclick="placeBetOnNumber(${i})" style="background: ${bgColor}; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">${i}</button>`;
        
        // Add break after every 6 numbers for proper grid layout
        if (i % 6 === 0 && i < 36) {
            // This is handled by CSS grid
        }
    }
    
    return grid;
}

function placeBet(type, amount) {
    const data = loadGameData();
    const betAmount = amount || parseInt(document.getElementById('bet-amount')?.value || 10);
    
    if (data.bankBalance < betAmount) {
        showToast('Insufficient funds!', 'warning');
        return;
    }
    
    currentRouletteBets.push({ type, amount: betAmount });
    updateBetsDisplay();
    showToast(`€${betAmount} bet placed on ${type}`, 'info');
}

function placeBetOnNumber(number) {
    const data = loadGameData();
    const betAmount = parseInt(document.getElementById('bet-amount')?.value || 10);
    
    if (data.bankBalance < betAmount) {
        showToast('Insufficient funds!', 'warning');
        return;
    }
    
    currentRouletteBets.push({ type: 'number', value: number, amount: betAmount });
    updateBetsDisplay();
    showToast(`€${betAmount} bet placed on number ${number}`, 'info');
}

function updateBetsDisplay() {
    const betsList = document.getElementById('bets-list');
    if (!betsList) return;
    
    if (currentRouletteBets.length === 0) {
        betsList.textContent = 'No bets placed';
        return;
    }
    
    const totalBet = currentRouletteBets.reduce((sum, bet) => sum + bet.amount, 0);
    betsList.innerHTML = currentRouletteBets.map(bet => {
        if (bet.type === 'number') {
            return `€${bet.amount} on ${bet.value}`;
        } else {
            return `€${bet.amount} on ${bet.type}`;
        }
    }).join(', ') + ` (Total: €${totalBet})`;
}

function clearBets() {
    currentRouletteBets = [];
    updateBetsDisplay();
    showToast('All bets cleared', 'info');
}

function spinRoulette() {
    if (isRouletteSpinning) return;
    
    if (currentRouletteBets.length === 0) {
        showToast('Place at least one bet!', 'warning');
        return;
    }
    
    const data = loadGameData();
    const totalBet = currentRouletteBets.reduce((sum, bet) => sum + bet.amount, 0);
    
    if (data.bankBalance < totalBet) {
        showToast('Insufficient funds for all bets!', 'warning');
        return;
    }
    
    // Deduct total bet amount
    data.bankBalance -= totalBet;
    isRouletteSpinning = true;
    
    const spinBtn = document.getElementById('spin-roulette-btn');
    const resultDiv = document.getElementById('roulette-result');
    const winningNumberDiv = document.getElementById('winning-number');
    const ball = document.getElementById('roulette-ball');
    
    if (spinBtn) spinBtn.disabled = true;
    if (resultDiv) resultDiv.textContent = 'Spinning...';
    if (winningNumberDiv) winningNumberDiv.textContent = '?';
    
    // Animate ball spinning
    if (ball) {
        ball.style.transform = 'rotate(1800deg)';
    }
    
    // Generate winning number after 3 seconds
    setTimeout(() => {
        const winningNumber = Math.floor(Math.random() * 37); // 0-36
        const winningData = ROULETTE_NUMBERS.find(n => n.number === winningNumber);
        
        if (winningNumberDiv) {
            winningNumberDiv.textContent = winningNumber;
            winningNumberDiv.style.color = winningData.color === 'green' ? '#27ae60' : 
                                          winningData.color === 'red' ? '#e74c3c' : '#2c3e50';
        }
        
        // Calculate winnings
        let totalWinnings = 0;
        const winningBets = [];
        
        currentRouletteBets.forEach(bet => {
            let isWin = false;
            let payout = 0;
            
            if (bet.type === 'number' && bet.value === winningNumber) {
                isWin = true;
                payout = bet.amount * 36; // 35:1 + original bet
                winningBets.push(`${bet.value} (€${payout})`);
            } else if (bet.type === 'red' && winningData.color === 'red') {
                isWin = true;
                payout = bet.amount * 2; // 1:1 + original bet
                winningBets.push(`Red (€${payout})`);
            } else if (bet.type === 'black' && winningData.color === 'black') {
                isWin = true;
                payout = bet.amount * 2;
                winningBets.push(`Black (€${payout})`);
            } else if (bet.type === 'even' && winningNumber !== 0 && winningNumber % 2 === 0) {
                isWin = true;
                payout = bet.amount * 2;
                winningBets.push(`Even (€${payout})`);
            } else if (bet.type === 'odd' && winningNumber % 2 === 1) {
                isWin = true;
                payout = bet.amount * 2;
                winningBets.push(`Odd (€${payout})`);
            }
            
            if (isWin) {
                totalWinnings += payout;
            }
        });
        
        // Apply winnings
        data.bankBalance += totalWinnings;
        
        // Update stats
        if (!data.rouletteStats) data.rouletteStats = { todayWinnings: 0, totalSpins: 0, totalWins: 0 };
        data.rouletteStats.todayWinnings += totalWinnings - totalBet;
        data.rouletteStats.totalSpins = (data.rouletteStats.totalSpins || 0) + 1;
        if (totalWinnings > 0) data.rouletteStats.totalWins = (data.rouletteStats.totalWins || 0) + 1;
        
        // Display result
        if (resultDiv) {
            if (totalWinnings > 0) {
                resultDiv.innerHTML = `🎉 Winner! ${winningBets.join(', ')} - Total: €${totalWinnings}`;
                resultDiv.style.color = '#f1c40f';
                
                data.events.push({
                    message: `🎯 Won €${totalWinnings} on roulette! Winning number: ${winningNumber}`,
                    date: new Date().toISOString(),
                    read: false
                });
                
                showToast(`🎯 Won €${totalWinnings}!`, 'success');
            } else {
                resultDiv.textContent = `No winning bets. Better luck next time!`;
                resultDiv.style.color = '#e74c3c';
            }
        }
        
        // Reset for next spin
        currentRouletteBets = [];
        updateBetsDisplay();
        isRouletteSpinning = false;
        if (spinBtn) spinBtn.disabled = false;
        if (ball) ball.style.transform = 'rotate(0deg)';
        
        // Update UI
        saveGameData(data);
        updateAllUI();
        
        // Update balance display
        const balanceSpan = document.querySelector('.player-stats span');
        if (balanceSpan) {
            balanceSpan.textContent = `💰 Balance: €${data.bankBalance}`;
        }
        
        // Update today's winnings
        const winningsSpan = document.querySelector('.player-stats span:last-child');
        if (winningsSpan) {
            winningsSpan.textContent = `🎯 Today's Roulette: €${data.rouletteStats?.todayWinnings || 0}`;
        }
        
    }, 3000);
}