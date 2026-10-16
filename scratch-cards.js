// scratch-cards.js - Scratch-off lottery ticket mini-game

// Scratch card types with different themes and odds
const SCRATCH_CARD_TYPES = {
  lucky7: {
    name: "Lucky 7's",
    price: 5,
    theme: "🎰",
    color: "#ff6b6b",
    prizes: [
      { symbols: ["7", "7", "7"], payout: 100, chance: 0.01 },
      { symbols: ["🍒", "🍒", "🍒"], payout: 25, chance: 0.03 },
      { symbols: ["⭐", "⭐", "⭐"], payout: 15, chance: 0.05 },
      { symbols: ["🔔", "🔔", "🔔"], payout: 10, chance: 0.08 },
      { symbols: ["💎", "💎", "💎"], payout: 5, chance: 0.12 }
    ]
  },
  cashCow: {
    name: "Cash Cow",
    price: 10,
    theme: "🐄",
    color: "#4ecdc4",
    prizes: [
      { symbols: ["🐄", "🐄", "🐄"], payout: 500, chance: 0.005 },
      { symbols: ["💰", "💰", "💰"], payout: 100, chance: 0.015 },
      { symbols: ["🥛", "🥛", "🥛"], payout: 50, chance: 0.025 },
      { symbols: ["🌾", "🌾", "🌾"], payout: 25, chance: 0.04 },
      { symbols: ["🚜", "🚜", "🚜"], payout: 15, chance: 0.06 }
    ]
  },
  goldRush: {
    name: "Gold Rush",
    price: 20,
    theme: "⛏️",
    color: "#f9ca24",
    prizes: [
      { symbols: ["👑", "👑", "👑"], payout: 1000, chance: 0.002 },
      { symbols: ["💎", "💎", "💎"], payout: 200, chance: 0.008 },
      { symbols: ["🏆", "🏆", "🏆"], payout: 100, chance: 0.015 },
      { symbols: ["⚡", "⚡", "⚡"], payout: 60, chance: 0.025 },
      { symbols: ["🔥", "🔥", "🔥"], payout: 40, chance: 0.035 }
    ]
  }
};

let scratchState = {
  wallet: 0,
  currentCard: null,
  isScratching: false,
  scratchedAreas: [],
  revealedSymbols: [],
  cardType: 'lucky7'
};

/**
 * Open Scratch Cards App
 */
function openScratchCards() {
  const data = loadGameData();
  scratchState.wallet = data.bankBalance || 0;
  
  document.getElementById('modal-title').textContent = '🎫 Scratch Cards';
  document.getElementById('modal-body').innerHTML = `
    <div class="scratch-cards-game">
      <!-- Compact Header -->
      <div class="game-header" style="margin-bottom: 10px;">
        <div class="wallet-display" style="font-size: 14px;">
          <span class="wallet-label">Wallet:</span>
          <span id="scratch-wallet" class="wallet-amount">€${scratchState.wallet}</span>
        </div>
      </div>

      <!-- Card Selection at Top -->
      <div class="card-selection-top">
        <div class="card-types-horizontal">
          ${Object.entries(SCRATCH_CARD_TYPES).map(([key, card]) => `
            <div class="card-option" onclick="buyAndPlayCard('${key}')">
              <div class="card-visual" style="background-color: ${card.color}; border: 3px solid #333; border-radius: 12px; padding: 15px; margin: 3px; text-align: center; cursor: pointer; min-height: 70px; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 18px; font-weight: bold; color: white; text-shadow: 1px 1px 2px #000;">€${card.price}</div>
                <div style="font-size: 12px; color: white; font-weight: bold; text-shadow: 1px 1px 2px #000; margin: 5px 0;">${card.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Current Card Display -->
      <div class="current-card-container">
        <div id="scratch-card" class="scratch-card hidden">
          <div class="scratch-card-header" style="margin-bottom: 8px;">
            <span id="card-title" style="font-size: 14px;">Scratch Card</span>
            <span id="card-instructions" style="font-size: 11px;">Match 3 symbols to win!</span>
          </div>
          <div class="scratch-areas">
            <div class="scratch-row">
              <div class="scratch-area" data-index="0">
                <div class="scratch-overlay" onclick="scratchArea(0)">Scratch</div>
                <div class="scratch-symbol hidden"></div>
              </div>
              <div class="scratch-area" data-index="1">
                <div class="scratch-overlay" onclick="scratchArea(1)">Scratch</div>
                <div class="scratch-symbol hidden"></div>
              </div>
              <div class="scratch-area" data-index="2">
                <div class="scratch-overlay" onclick="scratchArea(2)">Scratch</div>
                <div class="scratch-symbol hidden"></div>
              </div>
            </div>
            <div class="scratch-row">
              <div class="scratch-area" data-index="3">
                <div class="scratch-overlay" onclick="scratchArea(3)">Scratch</div>
                <div class="scratch-symbol hidden"></div>
              </div>
              <div class="scratch-area" data-index="4">
                <div class="scratch-overlay" onclick="scratchArea(4)">Scratch</div>
                <div class="scratch-symbol hidden"></div>
              </div>
              <div class="scratch-area" data-index="5">
                <div class="scratch-overlay" onclick="scratchArea(5)">Scratch</div>
                <div class="scratch-symbol hidden"></div>
              </div>
            </div>
          </div>
          <div id="scratch-result" class="scratch-result hidden">
            <div id="result-message">Scratch all areas to see results!</div>
            <div id="prize-amount" class="prize-amount hidden">You won €0!</div>
          </div>
        </div>
      </div>

      <!-- Game Controls -->
      <div class="game-controls">
        <button id="reveal-all-btn" class="game-btn" onclick="revealAll()" disabled>
          Reveal All
        </button>
        <button class="game-btn" onclick="openScratchCards()">
          Play Again
        </button>
      </div>

      <!-- Compact Statistics -->
      <div class="scratch-stats" style="display: flex; gap: 15px; justify-content: center; font-size: 12px; margin: 10px 0;">
        <div class="stat-item">
          <span class="stat-label">Played:</span>
          <span id="cards-played" class="stat-value">${data.scratchStats?.played || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Won:</span>
          <span id="total-won" class="stat-value">€${data.scratchStats?.totalWon || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Rate:</span>
          <span id="win-rate" class="stat-value">${data.scratchStats?.played > 0 ? Math.round((data.scratchStats?.wins || 0) / data.scratchStats.played * 100) : 0}%</span>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('app-modal').classList.remove('hidden');
  addScratchCardsStyles();
  updateCardSelection();
}

/**
 * Select card type
 */
function selectCardType(cardType) {
  scratchState.cardType = cardType;
  updateCardSelection();
}

/**
 * Update card selection display
 */
function updateCardSelection() {
  // Update selected card styling
  document.querySelectorAll('.card-type').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`[onclick="selectCardType('${scratchState.cardType}')"]`)?.classList.add('selected');
  
  // Update buy button
  const buyBtn = document.getElementById('buy-card-btn');
  const cardPrice = SCRATCH_CARD_TYPES[scratchState.cardType].price;
  const canAfford = scratchState.wallet >= cardPrice;
  
  buyBtn.textContent = `Buy New Card (€${cardPrice})`;
  buyBtn.disabled = !canAfford;
  
  if (!canAfford) {
    buyBtn.style.background = '#6c757d';
    buyBtn.style.cursor = 'not-allowed';
  } else {
    buyBtn.style.background = '#28a745';
    buyBtn.style.cursor = 'pointer';
  }
}

/**
 * Buy and immediately play a card (new combined function)
 */
function buyAndPlayCard(type) {
  const card = SCRATCH_CARD_TYPES[type];
  const data = loadGameData();
  
  // Check if player has enough money
  if (data.bankBalance < card.price) {
    showToast(`Not enough money! Need €${card.price}`, 'warning');
    return;
  }
  
  // Deduct money
  data.bankBalance -= card.price;
  saveGameData(data);
  
  // Update wallet display
  scratchState.wallet = data.bankBalance;
  document.getElementById('scratch-wallet').textContent = `€${scratchState.wallet}`;
  updateAllUI();
  
  // Set up the card
  scratchState.cardType = type;
  scratchState.currentCard = generateScratchCard(type);
  scratchState.isScratching = true;
  scratchState.scratchedAreas = [];
  scratchState.revealedSymbols = [];
  
  // Show the scratch card
  const cardElement = document.getElementById('scratch-card');
  cardElement.classList.remove('hidden');
  cardElement.style.borderColor = card.color;
  
  const cardTitle = document.getElementById('card-title');
  if (cardTitle) cardTitle.textContent = card.name;
  
  // Reset all scratch areas
  document.querySelectorAll('.scratch-area').forEach((area, index) => {
    const overlay = area.querySelector('.scratch-overlay');
    const symbol = area.querySelector('.scratch-symbol');
    
    overlay.classList.remove('hidden');
    overlay.style.background = card.color;
    symbol.classList.add('hidden');
    symbol.textContent = scratchState.currentCard.symbols[index];
  });
  
  // Hide result and enable reveal button  
  const scratchResult = document.getElementById('scratch-result');
  const revealBtn = document.getElementById('reveal-all-btn');
  
  if (scratchResult) scratchResult.classList.add('hidden');
  if (revealBtn) revealBtn.disabled = false;
  
  showToast(`Purchased ${card.name} for €${card.price}!`, 'success');
}

/**
 * Buy a new scratch card
 */
function buyNewCard() {
  const cardType = SCRATCH_CARD_TYPES[scratchState.cardType];
  
  if (scratchState.wallet < cardType.price) {
    showToast('Insufficient funds!', 'error');
    return;
  }
  
  // Deduct cost
  scratchState.wallet -= cardType.price;
  updateScratchWallet();
  
  // Generate new card
  scratchState.currentCard = generateScratchCard(scratchState.cardType);
  scratchState.scratchedAreas = [];
  scratchState.revealedSymbols = [];
  scratchState.isScratching = true;
  
  // Show card
  const cardElement = document.getElementById('scratch-card');
  cardElement.classList.remove('hidden');
  cardElement.style.borderColor = cardType.color;
  
  const cardTitle = document.getElementById('card-title');
  if (cardTitle) cardTitle.textContent = cardType.name;
  
  // Reset all scratch areas
  document.querySelectorAll('.scratch-area').forEach((area, index) => {
    const overlay = area.querySelector('.scratch-overlay');
    const symbol = area.querySelector('.scratch-symbol');
    
    overlay.classList.remove('hidden');
    overlay.style.background = cardType.color;
    symbol.classList.add('hidden');
    symbol.textContent = scratchState.currentCard.symbols[index];
  });
  
  // Hide result and enable reveal button
  const scratchResult = document.getElementById('scratch-result');
  const revealBtn = document.getElementById('reveal-all-btn');
  
  if (scratchResult) scratchResult.classList.add('hidden');
  if (revealBtn) revealBtn.disabled = false;
  
  // Update controls
  document.getElementById('buy-card-btn').disabled = true;
  updateCardSelection();
}

/**
 * Generate scratch card symbols and determine win
 */
function generateScratchCard(cardTypeKey) {
  const cardType = SCRATCH_CARD_TYPES[cardTypeKey];
  const symbols = [];
  let isWinner = false;
  let winAmount = 0;
  let winningPrize = null;
  
  // Determine if this card is a winner
  const random = Math.random();
  let cumulativeChance = 0;
  
  for (const prize of cardType.prizes) {
    cumulativeChance += prize.chance;
    if (random <= cumulativeChance) {
      isWinner = true;
      winAmount = prize.payout;
      winningPrize = prize;
      break;
    }
  }
  
  if (isWinner && winningPrize) {
    // Place winning symbols (at least 3 matching)
    const winningSymbol = winningPrize.symbols[0];
    const positions = [0, 1, 2, 3, 4, 5];
    
    // Shuffle positions and place 3 winning symbols
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Place 3 winning symbols in random positions
    for (let i = 0; i < 3; i++) {
      symbols[positions[i]] = winningSymbol;
    }
    
    // Fill remaining positions with random non-winning symbols
    const allSymbols = ['🍒', '⭐', '🔔', '💎', '7', '🍋', '🎯', '🎲'];
    for (let i = 3; i < 6; i++) {
      let randomSymbol;
      do {
        randomSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
      } while (randomSymbol === winningSymbol);
      symbols[positions[i]] = randomSymbol;
    }
  } else {
    // Non-winning card - ensure no 3 matches
    const allSymbols = ['🍒', '⭐', '🔔', '💎', '7', '🍋', '🎯', '🎲'];
    for (let i = 0; i < 6; i++) {
      symbols[i] = allSymbols[Math.floor(Math.random() * allSymbols.length)];
    }
    
    // Ensure no accidental wins
    while (hasThreeMatches(symbols)) {
      for (let i = 0; i < 6; i++) {
        symbols[i] = allSymbols[Math.floor(Math.random() * allSymbols.length)];
      }
    }
  }
  
  return {
    symbols,
    isWinner,
    winAmount,
    cardType: cardTypeKey
  };
}

/**
 * Check if symbols array has 3 matching symbols
 */
function hasThreeMatches(symbols) {
  const counts = {};
  for (const symbol of symbols) {
    counts[symbol] = (counts[symbol] || 0) + 1;
    if (counts[symbol] >= 3) return true;
  }
  return false;
}

/**
 * Scratch off an area
 */
function scratchArea(index) {
  if (!scratchState.isScratching || scratchState.scratchedAreas.includes(index)) return;
  
  scratchState.scratchedAreas.push(index);
  
  const area = document.querySelector(`[data-index="${index}"]`);
  const overlay = area.querySelector('.scratch-overlay');
  const symbol = area.querySelector('.scratch-symbol');
  
  // Animate scratch off
  overlay.style.transform = 'scale(0.8)';
  overlay.style.opacity = '0.5';
  
  setTimeout(() => {
    overlay.classList.add('hidden');
    symbol.classList.remove('hidden');
    symbol.style.animation = 'bounceIn 0.5s ease-out';
  }, 200);
  
  // Check if all areas are scratched
  if (scratchState.scratchedAreas.length === 6) {
    setTimeout(() => {
      checkWin();
    }, 500);
  }
}

/**
 * Reveal all areas at once
 */
function revealAll() {
  if (!scratchState.isScratching) return;
  
  for (let i = 0; i < 6; i++) {
    if (!scratchState.scratchedAreas.includes(i)) {
      setTimeout(() => {
        scratchArea(i);
      }, i * 100);
    }
  }
}

/**
 * Check for winning combinations
 */
function checkWin() {
  const card = scratchState.currentCard;
  scratchState.isScratching = false;
  
  // Show result
  const resultDiv = document.getElementById('scratch-result');
  const messageDiv = document.getElementById('result-message');
  const prizeDiv = document.getElementById('prize-amount');
  
  resultDiv.classList.remove('hidden');
  
  if (card.isWinner) {
    scratchState.wallet += card.winAmount;
    updateScratchWallet();
    
    messageDiv.textContent = '🎉 WINNER!';
    messageDiv.style.color = '#28a745';
    prizeDiv.textContent = `You won €${card.winAmount}!`;
    prizeDiv.classList.remove('hidden');
    prizeDiv.style.color = '#28a745';
    
    // Highlight winning symbols
    highlightWinningSymbols(card.symbols);
    
    showToast(`You won €${card.winAmount}!`, 'success');
  } else {
    messageDiv.textContent = '😔 No match - Try again!';
    messageDiv.style.color = '#dc3545';
    prizeDiv.classList.add('hidden');
  }
  
  // Update stats and save data
  updateScratchStats(card.isWinner, card.winAmount);
  
  // Re-enable buy button
  setTimeout(() => {
    document.getElementById('buy-card-btn').disabled = false;
    document.getElementById('reveal-all-btn').disabled = true;
    updateCardSelection();
  }, 2000);
}

/**
 * Highlight winning symbols
 */
function highlightWinningSymbols(symbols) {
  const symbolCounts = {};
  symbols.forEach(symbol => {
    symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
  });
  
  // Find winning symbol (appears 3+ times)
  const winningSymbol = Object.keys(symbolCounts).find(symbol => symbolCounts[symbol] >= 3);
  
  if (winningSymbol) {
    document.querySelectorAll('.scratch-symbol').forEach(element => {
      if (element.textContent === winningSymbol) {
        element.style.background = '#fff3cd';
        element.style.border = '2px solid #ffc107';
        element.style.animation = 'pulse 1s infinite';
      }
    });
  }
}

/**
 * Update scratch card statistics
 */
function updateScratchStats(isWin, winAmount) {
  const data = loadGameData();
  
  if (!data.scratchStats) {
    data.scratchStats = { played: 0, wins: 0, totalWon: 0 };
  }
  
  data.scratchStats.played++;
  if (isWin) {
    data.scratchStats.wins++;
    data.scratchStats.totalWon += winAmount;
  }
  
  // Update bank balance
  data.bankBalance = scratchState.wallet;
  
  // Increase gambling addiction
  data.gamblingAddiction = Math.min(100, (data.gamblingAddiction || 50) + 1);
  data.daysSinceLastGambling = 0;
  
  saveGameData(data);
  updateAllUI();
  
  // Update display
  document.getElementById('cards-played').textContent = data.scratchStats.played;
  document.getElementById('total-won').textContent = `€${data.scratchStats.totalWon}`;
  document.getElementById('win-rate').textContent = `${Math.round(data.scratchStats.wins / data.scratchStats.played * 100)}%`;
  
  // Check achievements
  if (isWin) {
    checkAchievements();
  }
}

/**
 * Update wallet display
 */
function updateScratchWallet() {
  document.getElementById('scratch-wallet').textContent = `€${scratchState.wallet}`;
}

/**
 * Add CSS styles for scratch cards
 */
function addScratchCardsStyles() {
  if (document.getElementById('scratch-cards-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'scratch-cards-styles';
  style.textContent = `
    .scratch-cards-game {
      max-width: 100%;
      margin: 0 auto;
    }
    
    .card-types-horizontal {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .card-option {
      flex: 1;
      min-width: 100px;
      max-width: 120px;
    }
    
    .card-types {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .card-type {
      padding: 15px;
      border: 2px solid #e9ecef;
      border-radius: 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }
    
    .card-type:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .card-type.selected {
      border-width: 3px;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .card-theme {
      font-size: 2rem;
      margin-bottom: 8px;
    }
    
    .card-name {
      font-weight: bold;
      color: #495057;
      margin-bottom: 5px;
    }
    
    .card-price {
      color: #28a745;
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 3px;
    }
    
    .card-odds {
      font-size: 11px;
      color: #6c757d;
    }
    
    .scratch-card {
      background: white;
      border: 3px solid #007bff;
      border-radius: 12px;
      padding: 12px;
      margin: 10px 0;
      text-align: center;
    }
    
    .scratch-card-header {
      margin-bottom: 15px;
    }
    
    #card-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #495057;
      display: block;
      margin-bottom: 5px;
    }
    
    #card-instructions {
      font-size: 12px;
      color: #6c757d;
    }
    
    .scratch-areas {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 300px;
      margin: 0 auto;
    }
    
    .scratch-row {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    
    .scratch-area {
      position: relative;
      width: 55px;
      height: 55px;
      border: 2px solid #dee2e6;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .scratch-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #6c757d;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 10px;
      font-weight: bold;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    
    .scratch-overlay:hover {
      opacity: 0.8;
      transform: scale(0.95);
    }
    
    .scratch-symbol {
      font-size: 2rem;
      font-weight: bold;
      color: #495057;
    }
    
    .scratch-result {
      margin-top: 20px;
      padding: 15px;
      border-radius: 10px;
      background: #f8f9fa;
    }
    
    #result-message {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .prize-amount {
      font-size: 1.1rem;
      font-weight: bold;
    }
    
    .scratch-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
    }
    
    .scratch-stats .stat-item {
      text-align: center;
    }
    
    .scratch-stats .stat-label {
      display: block;
      font-size: 12px;
      color: #6c757d;
      margin-bottom: 5px;
    }
    
    .scratch-stats .stat-value {
      font-weight: bold;
      color: #495057;
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @media (max-width: 480px) {
      .card-types {
        grid-template-columns: 1fr;
      }
      
      .scratch-area {
        width: 60px;
        height: 60px;
      }
      
      .scratch-symbol {
        font-size: 1.5rem;
      }
      
      .scratch-stats {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
  `;
  
  document.head.appendChild(style);
}