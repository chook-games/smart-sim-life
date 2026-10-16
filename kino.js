// kino.js - Playable Kino Lottery Game

// Kino game state
let kinoState = {
  selectedNumbers: [],
  drawnNumbers: [],
  gameActive: false,
  currentBet: 5,
  wallet: 0,
  gameResult: null,
  drawing: false,
  maxSelections: 10,
  minSelections: 1
};

// Kino payout table (based on numbers matched vs numbers selected)
const KINO_PAYOUTS = {
  1: { 1: 3 },
  2: { 1: 1, 2: 12 },
  3: { 2: 1, 3: 42 },
  4: { 2: 1, 3: 5, 4: 100 },
  5: { 3: 1, 4: 12, 5: 800 },
  6: { 3: 1, 4: 4, 5: 70, 6: 1500 },
  7: { 4: 1, 5: 20, 6: 400, 7: 7500 },
  8: { 5: 2, 6: 25, 7: 1000, 8: 15000 },
  9: { 5: 1, 6: 5, 7: 142, 8: 4000, 9: 25000 },
  10: { 5: 1, 6: 2, 7: 24, 8: 1000, 9: 10000, 10: 100000 }
};

/**
 * Open Kino Game
 */
function openKino() {
  const data = loadGameData();
  kinoState.wallet = data.bankBalance || 0;
  
  document.getElementById('modal-title').textContent = '🎰 Kino Lottery';
  document.getElementById('modal-body').innerHTML = `
    <div class="kino-game" style="max-height: 90vh; overflow-y: auto; padding: 8px;">
      <!-- Game Info Panel - with placeholder text -->
      <div id="kino-result" class="game-result-header" style="margin-bottom: 6px; padding: 6px; background: rgba(52, 152, 219, 0.1); border-radius: 6px; text-align: center; border: 1px solid rgba(52, 152, 219, 0.2);">
        <div id="kino-result-text" class="result-text" style="font-weight: bold; margin-bottom: 2px; font-size: 11px;">🎰 Select 1-10 numbers to play</div>
        <div id="kino-payout-text" class="payout-text" style="font-size: 10px; margin-bottom: 2px;">Match more numbers for bigger prizes!</div>
        <div id="matches-info" class="matches-info" style="font-size: 9px; opacity: 0.8;">Pick your lucky numbers and press Draw to start</div>
      </div>

      <!-- Ultra Compact Controls - all in one line -->
      <div class="game-header-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 2px; font-size: 10px;">
        <div class="wallet-display" style="font-size: 10px;">
          💰<span id="kino-wallet">€${kinoState.wallet}</span>
        </div>
        <div class="bet-controls" style="font-size: 10px;">
          <select id="kino-bet-amount" onchange="updateKinoBet()" style="padding: 2px; font-size: 10px;">
            <option value="1">€1</option>
            <option value="2">€2</option>
            <option value="5" selected>€5</option>
            <option value="10">€10</option>
            <option value="20">€20</option>
          </select>
        </div>
        <div class="selection-info" style="font-size: 10px;">
          <span id="selected-count">0</span>/10
        </div>
        <div class="game-controls" style="display: flex; gap: 4px;">
          <button id="kino-play-btn" class="game-btn primary" onclick="playKino()" disabled style="padding: 2px 6px; border: none; border-radius: 3px; background: #e74c3c; color: white; cursor: pointer; font-size: 9px;">
            🎯 Draw
          </button>
          <button id="kino-auto-pick" class="game-btn" onclick="autoPickNumbers()" style="padding: 2px 6px; border: none; border-radius: 3px; background: #3498db; color: white; cursor: pointer; font-size: 9px;">
            🎲 Pick
          </button>
        </div>
      </div>

      <!-- Number Grid - compact -->
      <div class="number-grid" id="kino-grid" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 1px; margin-bottom: 5px; max-width: 100%; padding: 0 2px;">
        <!-- Numbers 1-80 will be generated here -->
      </div>


    </div>
  `;
  
  document.getElementById('app-modal').classList.remove('hidden');
  addKinoStyles();
  generateNumberGrid();
  updateKinoBet();
  resetKinoGame(); // Reset to fresh state
}

/**
 * Generate the number selection grid
 */
function generateNumberGrid() {
  const grid = document.getElementById('kino-grid');
  grid.innerHTML = '';
  
  for (let i = 1; i <= 80; i++) {
    const numberBtn = document.createElement('button');
    numberBtn.className = 'number-btn';
    numberBtn.textContent = i;
    numberBtn.onclick = () => toggleNumber(i);
    numberBtn.id = `number-${i}`;
    // Ultra compact styling for number buttons
    numberBtn.style.cssText = `
      padding: 2px;
      border: 1px solid #ccc;
      background: white;
      color: #333;
      border-radius: 3px;
      cursor: pointer;
      font-size: 9px;
      font-weight: bold;
      transition: all 0.2s;
      min-height: 20px;
      aspect-ratio: 1;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `;
    grid.appendChild(numberBtn);
  }
}

/**
 * Toggle number selection
 */
function toggleNumber(number) {
  if (kinoState.drawing || kinoState.gameActive) return;
  
  const index = kinoState.selectedNumbers.indexOf(number);
  const btn = document.getElementById(`number-${number}`);
  
  if (index > -1) {
    // Deselect number
    kinoState.selectedNumbers.splice(index, 1);
    btn.classList.remove('selected');
    // Update button style immediately
    btn.style.background = 'white';
    btn.style.color = '#333';
    btn.style.border = '2px solid #ccc';
    btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    btn.style.transform = 'scale(1)';
  } else {
    // Select number (if under limit)
    if (kinoState.selectedNumbers.length < kinoState.maxSelections) {
      kinoState.selectedNumbers.push(number);
      btn.classList.add('selected');
      // Update button style immediately with stronger visual feedback
      btn.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
      btn.style.color = 'white';
      btn.style.border = '2px solid #2980b9';
      btn.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.4)';
      btn.style.transform = 'scale(1.05)';
    } else {
      showToast('Maximum 10 numbers allowed!', 'warning');
      return;
    }
  }
  
  updateSelectionDisplay();
}

/**
 * Clear all selected numbers
 */
function clearKinoSelection() {
  if (kinoState.drawing || kinoState.gameActive) return;
  
  kinoState.selectedNumbers = [];
  document.querySelectorAll('.number-btn').forEach(btn => {
    btn.classList.remove('selected', 'matched', 'drawn');
    // Reset button styles
    btn.style.background = 'white';
    btn.style.color = '#333';
    btn.style.border = '2px solid #ccc';
    btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    btn.style.transform = 'scale(1)';
  });
  
  updateSelectionDisplay();
}

/**
 * Auto pick random numbers
 */
function autoPickNumbers() {
  if (kinoState.drawing || kinoState.gameActive) return;
  
  clearKinoSelection();
  
  const numToPick = Math.floor(Math.random() * 10) + 1; // Pick 1-10 numbers
  const available = Array.from({length: 80}, (_, i) => i + 1);
  
  for (let i = 0; i < numToPick; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const number = available.splice(randomIndex, 1)[0];
    kinoState.selectedNumbers.push(number);
    const btn = document.getElementById(`number-${number}`);
    btn.classList.add('selected');
    // Apply selected styles with stronger visual feedback
    btn.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    btn.style.color = 'white';
    btn.style.border = '2px solid #2980b9';
    btn.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.4)';
    btn.style.transform = 'scale(1.05)';
  }
  
  updateSelectionDisplay();
}

/**
 * Reset Kino game to fresh state
 */
function resetKinoGame() {
  kinoState.selectedNumbers = [];
  kinoState.drawnNumbers = [];
  kinoState.gameActive = false;
  kinoState.drawing = false;
  kinoState.gameResult = null;
  
  // Show placeholder text in result panel
  const resultEl = document.getElementById('kino-result');
  const resultText = document.getElementById('kino-result-text');
  const payoutText = document.getElementById('kino-payout-text');
  const matchesInfo = document.getElementById('matches-info');
  if (resultEl) {
    resultEl.classList.remove('hidden');
    resultEl.style.background = 'rgba(52, 152, 219, 0.1)';
    resultEl.style.border = '1px solid rgba(52, 152, 219, 0.2)';
  }
  if (resultText) resultText.textContent = '🎰 Select 1-10 numbers to play';
  if (payoutText) payoutText.textContent = 'Match more numbers for bigger prizes!';
  if (matchesInfo) matchesInfo.textContent = 'Pick your lucky numbers and press Draw to start';
  
  // Clear all number states and reset styles
  document.querySelectorAll('.number-btn').forEach(btn => {
    btn.classList.remove('selected', 'matched', 'drawn');
    // Reset button styles to default
    btn.style.background = 'white';
    btn.style.color = '#333';
    btn.style.border = '1px solid #ccc';
    btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    btn.style.transform = 'scale(1)';
  });
  
  // Re-enable controls
  const autoPickBtn = document.getElementById('kino-auto-pick');
  const playBtn = document.getElementById('kino-play-btn');
  if (autoPickBtn) autoPickBtn.disabled = false;
  if (playBtn) playBtn.disabled = true; // Disabled until numbers are selected
  
  updateSelectionDisplay();
}

/**
 * Update selection display
 */
function updateSelectionDisplay() {
  const count = kinoState.selectedNumbers.length;
  document.getElementById('selected-count').textContent = count;
  document.getElementById('kino-play-btn').disabled = count === 0 || kinoState.wallet < kinoState.currentBet || kinoState.drawing || kinoState.gameActive;
}

/**
 * Play Kino game
 */
function playKino() {
  if (kinoState.selectedNumbers.length === 0) {
    showToast('Select at least one number!', 'warning');
    return;
  }
  
  if (kinoState.wallet < kinoState.currentBet) {
    showToast('Insufficient funds!', 'error');
    return;
  }
  
  // Deduct bet
  kinoState.wallet -= kinoState.currentBet;
  updateKinoWallet();
  
  // Start drawing
  kinoState.gameActive = true;
  kinoState.drawing = true;
  kinoState.drawnNumbers = [];
  
  // Show drawing status in result panel
  const resultEl = document.getElementById('kino-result');
  const resultText = document.getElementById('kino-result-text');
  const payoutText = document.getElementById('kino-payout-text');
  const matchesInfo = document.getElementById('matches-info');
  
  if (resultEl) {
    resultEl.style.background = 'rgba(255, 193, 7, 0.2)';
    resultEl.style.border = '1px solid rgba(255, 193, 7, 0.5)';
  }
  if (resultText) resultText.textContent = '🎯 Drawing numbers...';
  if (payoutText) payoutText.textContent = 'Good luck!';
  if (matchesInfo) matchesInfo.textContent = 'Finding your matches...';
  
  // Disable controls
  document.getElementById('kino-play-btn').disabled = true;
  document.getElementById('kino-auto-pick').disabled = true;
  
  // Start animated drawing
  animateDrawing();
}

/**
 * Animate the number drawing - simplified version
 */
function animateDrawing() {
  // Generate 20 random numbers (standard kino draw) instantly
  const availableNumbers = Array.from({length: 80}, (_, i) => i + 1);
  const totalDrawn = 20;
  
  // Pick all numbers at once
  for (let i = 0; i < totalDrawn; i++) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const drawnNumber = availableNumbers.splice(randomIndex, 1)[0];
    kinoState.drawnNumbers.push(drawnNumber);
    
    const btn = document.getElementById(`number-${drawnNumber}`);
    
    // Apply colors based on selection status
    if (kinoState.selectedNumbers.includes(drawnNumber)) {
      // Green: Player selected AND drawn (match)
      btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      btn.style.color = 'white';
      btn.style.border = '2px solid #27ae60';
      btn.style.boxShadow = '0 2px 8px rgba(39, 174, 96, 0.4)';
      btn.classList.add('matched');
    } else {
      // Orange: Drawn but not selected by player
      btn.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
      btn.style.color = 'white';
      btn.style.border = '2px solid #e67e22';
      btn.style.boxShadow = '0 2px 8px rgba(230, 126, 34, 0.4)';
      btn.classList.add('drawn');
    }
  }
  
  // Finish immediately
  setTimeout(() => {
    finishDrawing();
  }, 500);
}

/**
 * Finish the drawing and calculate results
 */
function finishDrawing() {
  setTimeout(() => {
    kinoState.drawing = false;
    calculateKinoResult();
    
    // Result panel will be updated with final results by calculateKinoResult()
    
    // FIXED: Auto-reset after 3 seconds to allow result viewing
    setTimeout(() => {
      resetKinoGame();
    }, 3000);
    
  }, 1000);
}

/**
 * Calculate Kino game result
 */
function calculateKinoResult() {
  const selectedCount = kinoState.selectedNumbers.length;
  const matches = kinoState.selectedNumbers.filter(num => 
    kinoState.drawnNumbers.includes(num)
  ).length;
  
  // Calculate payout
  const payoutMultiplier = KINO_PAYOUTS[selectedCount]?.[matches] || 0;
  const payout = payoutMultiplier * kinoState.currentBet;
  
  // SECURITY FIX: Validate payout before adding to wallet
  if (payout >= 0 && payout <= kinoState.currentBet * 100) { // Max 100x Kino payout (more reasonable)
    kinoState.wallet += payout;
  } else {
    console.warn('Invalid Kino payout amount blocked:', payout);
    kinoState.wallet += 0; // No payout if invalid
  }
  updateKinoWallet();
  
  // Update game data
  const data = loadGameData();
  data.bankBalance = kinoState.wallet;
  
  // Update stats
  if (!data.kinoStats) {
    data.kinoStats = { totalGames: 0, totalWon: 0, totalLost: 0 };
  }
  
  data.kinoStats.totalGames++;
  if (payout > 0) {
    data.kinoStats.totalWon += payout;
    
    // Track individual wins for achievements
    if (!data.kinoStats.wins) {
      data.kinoStats.wins = 0;
    }
    data.kinoStats.wins++;
    
    // Initialize achievements if they don't exist
    if (!data.achievements) {
      data.achievements = {};
    }
    if (!data.achievements.kinoWins) {
      data.achievements.kinoWins = { progress: 0, unlocked: [] };
    }
    
    // Update achievement progress
    data.achievements.kinoWins.progress = data.kinoStats.wins;
  } else {
    data.kinoStats.totalLost += kinoState.currentBet;
  }
  
  // FIXED: Increase gambling addiction by 1% every time player plays (regardless of win/loss)
  data.gamblingAddiction = Math.min(100, (data.gamblingAddiction || 50) + 1);
  data.daysSinceLastGambling = 0;
  
  saveGameData(data);
  
  // Display result
  let resultText = '';
  let payoutText = '';
  
  if (matches === 0) {
    resultText = '😞 No matches!';
    payoutText = `You lose €${kinoState.currentBet}`;
  } else if (payout === 0) {
    resultText = `🎯 ${matches} match${matches > 1 ? 'es' : ''}!`;
    payoutText = 'No payout for this combination';
  } else {
    resultText = `🎉 ${matches} match${matches > 1 ? 'es' : ''}!`;
    payoutText = `You win €${payout}!`;
  }
  
  // Update result panel styling based on outcome
  const resultEl = document.getElementById('kino-result');
  if (resultEl) {
    if (payout > 0) {
      resultEl.style.background = 'rgba(40, 167, 69, 0.2)';
      resultEl.style.border = '1px solid rgba(40, 167, 69, 0.5)';
    } else {
      resultEl.style.background = 'rgba(220, 53, 69, 0.2)';
      resultEl.style.border = '1px solid rgba(220, 53, 69, 0.5)';
    }
  }
  
  document.getElementById('kino-result-text').textContent = resultText;
  document.getElementById('kino-payout-text').textContent = payoutText;
  
  // Show match details
  const matchInfo = `Selected ${selectedCount} numbers, matched ${matches}`;
  if (payoutMultiplier > 0) {
    document.getElementById('matches-info').textContent = 
      `${matchInfo} (${payoutMultiplier}x multiplier)`;
  } else {
    document.getElementById('matches-info').textContent = matchInfo;
  }
  
  // Update stats display - only if elements exist
  const gamesEl = document.getElementById('kino-games');
  const wonEl = document.getElementById('kino-won');
  const lostEl = document.getElementById('kino-lost');
  if (gamesEl) gamesEl.textContent = data.kinoStats.totalGames;
  if (wonEl) wonEl.textContent = `€${data.kinoStats.totalWon}`;
  if (lostEl) lostEl.textContent = `€${data.kinoStats.totalLost}`;
  
  // Add event log
  addGameEvent(`Kino: ${resultText} ${payoutText}`, 'gambling');
  
  // Reset game state
  kinoState.gameActive = false;
}

/**
 * Generate payout table
 */
function generatePayoutTable() {
  const grid = document.getElementById('payout-grid');
  grid.innerHTML = '<h4>Payout Table (multiplier × bet)</h4>';
  
  Object.entries(KINO_PAYOUTS).forEach(([selected, payouts]) => {
    const row = document.createElement('div');
    row.className = 'payout-row';
    
    let payoutInfo = '';
    Object.entries(payouts).forEach(([matches, multiplier]) => {
      payoutInfo += `${matches} matches: ${multiplier}x | `;
    });
    
    row.innerHTML = `
      <div class="payout-selected">${selected} selected:</div>
      <div class="payout-info">${payoutInfo.slice(0, -3)}</div>
    `;
    
    grid.appendChild(row);
  });
}

/**
 * Toggle payout table display
 */
function togglePayoutTable() {
  const payoutDisplay = document.getElementById('payout-display');
  payoutDisplay.classList.toggle('hidden');
}

/**
 * Update bet amount
 */
function updateKinoBet() {
  const betSelect = document.getElementById('kino-bet-amount');
  kinoState.currentBet = parseInt(betSelect.value);
  updateSelectionDisplay();
}

/**
 * Update wallet display
 */
function updateKinoWallet() {
  const walletEl = document.getElementById('kino-wallet');
  if (walletEl) {
    walletEl.textContent = `€${kinoState.wallet}`;
  }
}

/**
 * Add Kino styles
 */
function addKinoStyles() {
  if (document.querySelector('#kino-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'kino-styles';
  style.textContent = `
    .kino-game {
      max-width: 450px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      font-size: 0.85rem;
    }
    
    .game-result-header {
      padding: 8px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #28a745, #20c997);
      border-radius: 8px;
      color: white;
      text-align: center;
      font-size: 0.8rem;
    }
    
    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 10px;
      background: linear-gradient(135deg, #8e44ad, #9b59b6);
      border-radius: 8px;
      color: white;
      font-size: 0.8rem;
    }
    
    .wallet-display {
      font-weight: bold;
      font-size: 0.85rem;
    }
    
    .wallet-amount {
      color: #4CAF50;
    }
    
    .bet-controls select {
      padding: 4px 8px;
      border-radius: 4px;
      border: none;
      font-size: 0.75rem;
    }
    
    .game-instructions {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 10px;
      text-align: center;
      font-size: 0.75rem;
    }
    
    .selection-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }
    
    .selection-info button {
      padding: 5px 15px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .selection-info button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .number-grid {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 4px;
      margin: 10px 0;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .number-btn {
      aspect-ratio: 1;
      border: 1px solid #dee2e6;
      background: white;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 28px;
    }
    
    .number-btn:hover {
      border-color: #007bff;
      transform: scale(1.1);
    }
    
    .number-btn.selected {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      border-color: #0056b3;
    }
    
    .number-btn.drawn {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
      border-color: #e67e22;
    }
    
    .number-btn.matched {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
      border-color: #27ae60;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .game-controls {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 8px;
      margin: 10px 0;
    }
    
    .game-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.75rem;
    }
    
    .game-btn.primary {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }
    
    .game-btn:not(.primary) {
      background: linear-gradient(135deg, #6f42c1, #8e44ad);
      color: white;
    }
    
    .game-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    .game-btn:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .drawing-display {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 10px;
      margin: 20px 0;
    }
    
    .drawn-numbers {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 8px;
      margin: 20px 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .drawn-number {
      aspect-ratio: 1;
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: bold;
      animation: bounceIn 0.6s ease-out;
    }
    
    .drawn-number.matched {
      background: linear-gradient(135deg, #ffc107, #ff8f00);
      color: #212529;
      animation: bounceInMatch 0.8s ease-out;
    }
    
    @keyframes bounceIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes bounceInMatch {
      from {
        transform: scale(0) rotate(180deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.3) rotate(360deg);
      }
      to {
        transform: scale(1) rotate(360deg);
        opacity: 1;
      }
    }
    
    .drawing-progress {
      width: 100%;
      height: 8px;
      background: #dee2e6;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 15px;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(135deg, #28a745, #20c997);
      transition: width 0.3s ease;
      border-radius: 4px;
    }
    
    .game-result {
      text-align: center;
      padding: 20px;
      margin: 20px 0;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 10px;
      border: 2px solid #dee2e6;
    }
    
    .result-text {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c3e50;
    }
    
    .payout-text {
      font-size: 1.2rem;
      color: #28a745;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .matches-info {
      font-size: 1rem;
      color: #6c757d;
      font-style: italic;
    }
    
    .payout-table {
      margin-top: 20px;
      text-align: center;
    }
    
    .payout-toggle {
      background: linear-gradient(135deg, #17a2b8, #138496);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .payout-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
    }
    
    .payout-content {
      margin-top: 15px;
      background: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      text-align: left;
    }
    
    .payout-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 10px;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #dee2e6;
    }
    
    .payout-selected {
      font-weight: bold;
      color: #2c3e50;
    }
    
    .payout-info {
      font-size: 0.9rem;
      color: #6c757d;
    }
    
    .game-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }
    
    .stat-label {
      display: block;
      font-size: 0.9rem;
      color: #6c757d;
      margin-bottom: 5px;
    }
    
    .stat-value {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c3e50;
    }
  `;
  document.head.appendChild(style);
}

// Export functions
window.openKino = openKino;
window.toggleNumber = toggleNumber;
window.clearKinoSelection = clearKinoSelection;
window.autoPickNumbers = autoPickNumbers;
window.playKino = playKino;
window.updateKinoBet = updateKinoBet;
window.updateKinoWallet = updateKinoWallet;
window.togglePayoutTable = togglePayoutTable;