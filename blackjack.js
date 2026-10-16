// blackjack.js - Playable Blackjack Game with Real Card Images

// Card deck configuration
const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const CARD_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'jack': 10, 'queen': 10, 'king': 10, 'ace': 11
};

// Blackjack game state
let blackjackState = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  gameActive: false,
  playerTurn: true,
  currentBet: 10,
  wallet: 0,
  gameResult: null,
  dealerHidden: true
};

/**
 * Open Blackjack Game
 */
function openBlackjack() {
  const data = loadGameData();
  blackjackState.wallet = data.bankBalance || 0;
  
  document.getElementById('modal-title').textContent = '🃏 Blackjack Casino';
  document.getElementById('modal-body').innerHTML = `
    <div class="blackjack-game">
      <!-- Game Info Panel - with placeholder text -->
      <div id="game-result" class="game-result-header" style="margin-bottom: 10px; padding: 8px; background: rgba(52, 152, 219, 0.1); border-radius: 6px; text-align: center; border: 1px solid rgba(52, 152, 219, 0.2);">
        <div id="result-text" class="result-text" style="font-weight: bold; margin-bottom: 4px;">🃏 Get closer to 21 than the dealer</div>
        <div id="payout-text" class="payout-text" style="font-size: 12px;">Blackjack pays 3:2 • Regular wins pay 2:1</div>
      </div>

      <!-- Dealer Section -->
      <div class="dealer-section">
        <h3>Dealer's Hand <span id="dealer-total" class="hand-total"></span></h3>
        <div id="dealer-cards" class="card-container">
          <!-- Dealer cards will appear here -->
        </div>
      </div>

      <!-- Player Section -->
      <div class="player-section">
        <h3>Your Hand <span id="player-total" class="hand-total"></span></h3>
        <div id="player-cards" class="card-container">
          <!-- Player cards will appear here -->
        </div>
      </div>

      <!-- Game Controls -->
      <div class="game-controls">
        <button id="deal-btn" class="game-btn primary" onclick="dealNewHand()">Deal Cards</button>
        <button id="hit-btn" class="game-btn" onclick="playerHit()" disabled>Hit</button>
        <button id="stand-btn" class="game-btn" onclick="playerStand()" disabled>Stand</button>
        <button id="double-btn" class="game-btn" onclick="playerDouble()" disabled>Double Down</button>
      </div>

      <!-- Game Header -->
      <div class="game-header">
        <div class="wallet-display">
          <span class="wallet-label">Wallet:</span>
          <span id="blackjack-wallet" class="wallet-amount">€${blackjackState.wallet}</span>
        </div>
        <div class="bet-controls">
          <label for="bet-amount">Bet:</label>
          <select id="bet-amount" onchange="updateBet()">
            <option value="5">€5</option>
            <option value="10" selected>€10</option>
            <option value="25">€25</option>
            <option value="50">€50</option>
            <option value="100">€100</option>
          </select>
        </div>
      </div>

      <!-- Game Stats -->
      <div class="game-stats">
        <div class="stat-item">
          <span class="stat-label">Wins:</span>
          <span id="bj-wins" class="stat-value">${data.bjStats?.wins || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Losses:</span>
          <span id="bj-losses" class="stat-value">${data.bjStats?.losses || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Pushes:</span>
          <span id="bj-pushes" class="stat-value">${data.bjStats?.pushes || 0}</span>
        </div>
      </div>

      <!-- Strategy Hint -->
      <div class="strategy-hint">
        <button onclick="toggleStrategyHint()" class="hint-toggle">💡 Strategy Hint</button>
        <div id="strategy-display" class="strategy-text hidden"></div>
      </div>
    </div>
  `;
  
  document.getElementById('app-modal').classList.remove('hidden');
  addBlackjackStyles();
  updateBet();
}

/**
 * Create and shuffle a new deck
 */
function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, value: CARD_VALUES[rank] });
    }
  }
  return shuffleDeck(deck);
}

/**
 * Shuffle deck using Fisher-Yates algorithm
 */
function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get card image filename
 */
function getCardImage(card) {
  if (!card) return 'cards/back.png';
  
  // Convert to match your card naming convention
  const suitNames = { clubs: 'clubs', diamonds: 'diamonds', hearts: 'hearts', spades: 'spades' };
  const rankNames = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
    'jack': 'jack', 'queen': 'queen', 'king': 'king', 'ace': 'ace'
  };
  
  return `cards/${rankNames[card.rank]}_of_${suitNames[card.suit]}.png`;
}

/**
 * Deal a new hand
 */
function dealNewHand() {
  if (blackjackState.wallet < blackjackState.currentBet) {
    showToast('Insufficient funds!', 'error');
    return;
  }

  // Reset game state
  blackjackState.deck = createDeck();
  blackjackState.playerHand = [];
  blackjackState.dealerHand = [];
  blackjackState.gameActive = true;
  blackjackState.playerTurn = true;
  blackjackState.gameResult = null;
  blackjackState.dealerHidden = true;

  // Clear existing cards before dealing new ones
  resetCardDisplay();

  // Deduct bet from wallet
  blackjackState.wallet -= blackjackState.currentBet;
  updateBlackjackWallet();

  // Deal initial cards with animation delays
  setTimeout(() => {
    blackjackState.playerHand.push(blackjackState.deck.pop());
    displayCards();
    updateHandTotals();
  }, 100);
  
  setTimeout(() => {
    blackjackState.dealerHand.push(blackjackState.deck.pop());
    displayCards();
    updateHandTotals();
  }, 300);
  
  setTimeout(() => {
    blackjackState.playerHand.push(blackjackState.deck.pop());
    displayCards();
    updateHandTotals();
  }, 500);
  
  setTimeout(() => {
    blackjackState.dealerHand.push(blackjackState.deck.pop());
    displayCards();
    updateHandTotals();
    updateControls();
  
    // Hide result display
    document.getElementById('game-result').classList.add('hidden');

    // Check for natural blackjack
    if (getHandValue(blackjackState.playerHand) === 21) {
      if (getHandValue(blackjackState.dealerHand) === 21) {
        endGame('push');
      } else {
        endGame('blackjack');
      }
    }

    updateStrategyHint();
  }, 700);
}

/**
 * Player hits (takes another card)
 */
function playerHit() {
  if (!blackjackState.gameActive || !blackjackState.playerTurn) return;

  blackjackState.playerHand.push(blackjackState.deck.pop());
  displayCards();
  updateHandTotals();

  const playerTotal = getHandValue(blackjackState.playerHand);
  if (playerTotal > 21) {
    endGame('bust');
  } else if (playerTotal === 21) {
    playerStand();
  }

  updateControls();
  updateStrategyHint();
}

/**
 * Player stands (ends their turn)
 */
function playerStand() {
  if (!blackjackState.gameActive || !blackjackState.playerTurn) return;

  // CRITICAL FIX: Prevent multiple calls by immediately setting playerTurn to false
  blackjackState.playerTurn = false;
  blackjackState.dealerHidden = false;
  
  // Update controls immediately to disable all buttons
  updateControls();
  
  // Dealer plays
  dealerPlay();
}

/**
 * Player doubles down
 */
function playerDouble() {
  if (!blackjackState.gameActive || !blackjackState.playerTurn) return;
  
  // SECURITY FIX: Validate sufficient funds BEFORE modifying bet
  const originalBet = blackjackState.currentBet;
  if (blackjackState.wallet < originalBet) {
    showToast('Insufficient funds to double down!', 'error');
    return;
  }

  // Double the bet and deduct additional amount
  blackjackState.wallet -= originalBet; // Deduct the additional bet amount
  blackjackState.currentBet = originalBet * 2; // Double the total bet
  updateBlackjackWallet();

  // Take one card and stand
  blackjackState.playerHand.push(blackjackState.deck.pop());
  displayCards();
  updateHandTotals();

  const playerTotal = getHandValue(blackjackState.playerHand);
  if (playerTotal > 21) {
    endGame('bust');
  } else {
    playerStand();
  }
}

/**
 * Dealer plays according to rules
 */
function dealerPlay() {
  // CRITICAL FIX: Prevent multiple dealer plays
  if (!blackjackState.gameActive || blackjackState.playerTurn) return;
  
  blackjackState.dealerHidden = false;
  displayCards();
  updateHandTotals();

  const playDealer = () => {
    // Double-check game is still active before each dealer action
    if (!blackjackState.gameActive) return;
    
    const dealerTotal = getHandValue(blackjackState.dealerHand);
    
    if (dealerTotal < 17) {
      // Dealer must hit
      setTimeout(() => {
        // Triple-check before dealing card
        if (!blackjackState.gameActive) return;
        
        blackjackState.dealerHand.push(blackjackState.deck.pop());
        displayCards();
        updateHandTotals();
        playDealer();
      }, 1000);
    } else {
      // Dealer stands, determine winner
      setTimeout(() => {
        if (!blackjackState.gameActive) return;
        determineWinner();
      }, 500);
    }
  };

  setTimeout(playDealer, 1000);
}

/**
 * Determine the winner
 */
function determineWinner() {
  const playerTotal = getHandValue(blackjackState.playerHand);
  const dealerTotal = getHandValue(blackjackState.dealerHand);

  if (dealerTotal > 21) {
    endGame('dealer-bust');
  } else if (playerTotal > dealerTotal) {
    endGame('win');
  } else if (dealerTotal > playerTotal) {
    endGame('lose');
  } else {
    endGame('push');
  }
}

/**
 * End the game with result
 */
function endGame(result) {
  blackjackState.gameActive = false;
  blackjackState.playerTurn = false;
  blackjackState.dealerHidden = false;
  blackjackState.gameResult = result;

  let payout = 0;
  let resultText = '';
  let payoutText = '';

  switch (result) {
    case 'blackjack':
      payout = blackjackState.currentBet * 2.5;
      resultText = '🎉 BLACKJACK! Natural 21!';
      payoutText = `You win €${payout}!`;
      updateStats('wins');
      break;
    case 'win':
      payout = blackjackState.currentBet * 2;
      resultText = '🎉 YOU WIN!';
      payoutText = `You win €${payout}!`;
      updateStats('wins');
      break;
    case 'dealer-bust':
      payout = blackjackState.currentBet * 2;
      resultText = '🎉 DEALER BUSTS! You win!';
      payoutText = `You win €${payout}!`;
      updateStats('wins');
      break;
    case 'lose':
      payout = 0;
      resultText = '😞 You lose!';
      payoutText = `You lose €${blackjackState.currentBet}`;
      updateStats('losses');
      break;
    case 'bust':
      payout = 0;
      resultText = '💥 BUST! Over 21!';
      payoutText = `You lose €${blackjackState.currentBet}`;
      updateStats('losses');
      break;
    case 'push':
      payout = blackjackState.currentBet;
      resultText = '🤝 PUSH! It\'s a tie!';
      payoutText = `Bet returned: €${payout}`;
      updateStats('pushes');
      break;
  }

  // SECURITY FIX: Validate payout before adding to wallet
  if (payout >= 0 && payout <= blackjackState.currentBet * 5) { // Max 5x bet payout (generous for blackjack)
    blackjackState.wallet += payout;
  } else {
    console.warn('Invalid payout amount blocked:', payout);
  }
  updateBlackjackWallet();

  // Update game data
  const data = loadGameData();
  data.bankBalance = blackjackState.wallet;
  
  // FIXED: Increase gambling addiction by 1% every time player plays
  data.gamblingAddiction = Math.min(100, (data.gamblingAddiction || 50) + 1);
  data.daysSinceLastGambling = 0;
  
  saveGameData(data);

  // Show result
  document.getElementById('result-text').textContent = resultText;
  document.getElementById('payout-text').textContent = payoutText;
  document.getElementById('game-result').classList.remove('hidden');

  // Display all cards
  displayCards();
  updateHandTotals();
  updateControls();

  // SECURITY FIX: Validate and reset bet to reasonable amount
  const betElement = document.getElementById('bet-amount');
  const newBet = parseInt(betElement?.value || 10);
  blackjackState.currentBet = Math.max(5, Math.min(1000, newBet)); // Between €5-€1000

  // Add event log
  addGameEvent(`Blackjack: ${resultText} ${payoutText}`, 'gambling');
}

/**
 * Calculate hand value with ace handling
 */
function getHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.rank === 'ace') {
      aces++;
      value += 11;
    } else {
      value += card.value;
    }
  }

  // Handle aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

/**
 * Display cards on screen - only animate new cards
 */
function displayCards() {
  const playerContainer = document.getElementById('player-cards');
  const dealerContainer = document.getElementById('dealer-cards');

  // Store current card counts to detect new cards
  const currentPlayerCards = playerContainer.children.length;
  const currentDealerCards = dealerContainer.children.length;

  // Display player cards - only add new ones
  for (let i = currentPlayerCards; i < blackjackState.playerHand.length; i++) {
    const card = blackjackState.playerHand[i];
    const cardEl = createCardElement(card, false, true); // true = animate this new card
    playerContainer.appendChild(cardEl);
  }

  // Display dealer cards - only add new ones or update existing ones
  for (let i = currentDealerCards; i < blackjackState.dealerHand.length; i++) {
    const card = blackjackState.dealerHand[i];
    let cardEl;
    if (i === 1 && blackjackState.dealerHidden && blackjackState.gameActive) {
      // Hide dealer's second card
      cardEl = createCardElement(null, true, true); // hidden=true, animate=true
    } else {
      cardEl = createCardElement(card, false, true); // animate=true for new card
    }
    dealerContainer.appendChild(cardEl);
  }

  // Handle dealer's hidden card reveal (when game ends)
  if (!blackjackState.dealerHidden && dealerContainer.children.length >= 2) {
    const hiddenCard = dealerContainer.children[1];
    if (hiddenCard && hiddenCard.classList.contains('card-hidden')) {
      // Animate the flip of the hidden card
      const card = blackjackState.dealerHand[1];
      const newCardEl = createCardElement(card, false, true); // animate=true for flip
      dealerContainer.replaceChild(newCardEl, hiddenCard);
    }
  }
}

/**
 * Reset card display for new game
 */
function resetCardDisplay() {
  document.getElementById('player-cards').innerHTML = '';
  document.getElementById('dealer-cards').innerHTML = '';
}

/**
 * Create card element
 */
function createCardElement(card, isHidden = false, animate = false) {
  const cardEl = document.createElement('div');
  cardEl.className = 'playing-card';
  
  // Only add animation to new cards
  if (animate) {
    cardEl.classList.add('card-deal-animation');
  }
  
  if (isHidden) {
    cardEl.innerHTML = `<img src="cards/back.png" alt="Hidden card" onerror="this.style.display='none'; this.parentElement.innerHTML='🂠';">`;
    cardEl.classList.add('card-hidden');
  } else if (card) {
    const imagePath = getCardImage(card);
    cardEl.innerHTML = `<img src="${imagePath}" alt="${card.rank} of ${card.suit}" onerror="this.style.display='none'; this.parentElement.innerHTML='${getCardEmoji(card)}';">`;
    
    // Add color class
    if (card.suit === 'hearts' || card.suit === 'diamonds') {
      cardEl.classList.add('card-red');
    } else {
      cardEl.classList.add('card-black');
    }
  }
  
  return cardEl;
}

/**
 * Get card emoji fallback
 */
function getCardEmoji(card) {
  const suitEmojis = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  const rankDisplay = card.rank === '10' ? 'T' : card.rank.charAt(0).toUpperCase();
  return `${rankDisplay}${suitEmojis[card.suit]}`;
}

/**
 * Update hand totals display
 */
function updateHandTotals() {
  const playerTotal = getHandValue(blackjackState.playerHand);
  const dealerTotal = blackjackState.dealerHidden && blackjackState.gameActive ? 
    blackjackState.dealerHand[0]?.value || 0 : 
    getHandValue(blackjackState.dealerHand);

  document.getElementById('player-total').textContent = `(${playerTotal})`;
  
  if (blackjackState.dealerHidden && blackjackState.gameActive) {
    document.getElementById('dealer-total').textContent = `(${dealerTotal}+?)`;
  } else {
    document.getElementById('dealer-total').textContent = `(${dealerTotal})`;
  }
}

/**
 * Update game controls
 */
function updateControls() {
  const dealBtn = document.getElementById('deal-btn');
  const hitBtn = document.getElementById('hit-btn');
  const standBtn = document.getElementById('stand-btn');
  const doubleBtn = document.getElementById('double-btn');

  if (blackjackState.gameActive && blackjackState.playerTurn) {
    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    doubleBtn.disabled = blackjackState.playerHand.length !== 2 || blackjackState.wallet < blackjackState.currentBet;
  } else {
    dealBtn.disabled = blackjackState.wallet < blackjackState.currentBet;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    doubleBtn.disabled = true;
  }
}

/**
 * Update bet amount
 */
function updateBet() {
  const betSelect = document.getElementById('bet-amount');
  blackjackState.currentBet = parseInt(betSelect.value);
  updateControls();
}

/**
 * Update wallet display
 */
function updateBlackjackWallet() {
  const walletEl = document.getElementById('blackjack-wallet');
  if (walletEl) {
    walletEl.textContent = `€${blackjackState.wallet}`;
  }
}

/**
 * Update statistics
 */
function updateStats(result) {
  const data = loadGameData();
  if (!data.bjStats) {
    data.bjStats = { wins: 0, losses: 0, pushes: 0 };
  }
  
  data.bjStats[result]++;
  
  // Initialize achievements if they don't exist
  if (!data.achievements) {
    data.achievements = {};
  }
  if (!data.achievements.blackjackWins) {
    data.achievements.blackjackWins = { progress: 0, unlocked: [] };
  }
  
  // Update achievement progress for wins
  if (result === 'wins') {
    data.achievements.blackjackWins.progress = data.bjStats.wins;
  }
  
  saveGameData(data);

  // Update display
  document.getElementById('bj-wins').textContent = data.bjStats.wins;
  document.getElementById('bj-losses').textContent = data.bjStats.losses;
  document.getElementById('bj-pushes').textContent = data.bjStats.pushes;
  
  // Check achievements after updating stats
  checkAchievements();
}

/**
 * Toggle strategy hint
 */
function toggleStrategyHint() {
  const strategyDisplay = document.getElementById('strategy-display');
  strategyDisplay.classList.toggle('hidden');
  updateStrategyHint();
}

/**
 * Update strategy hint
 */
function updateStrategyHint() {
  const strategyDisplay = document.getElementById('strategy-display');
  if (strategyDisplay.classList.contains('hidden') || !blackjackState.gameActive || !blackjackState.playerTurn) {
    return;
  }

  const playerTotal = getHandValue(blackjackState.playerHand);
  const dealerCard = blackjackState.dealerHand[0];
  const dealerUpValue = dealerCard ? dealerCard.value : 0;

  let strategy = getBasicStrategy(playerTotal, dealerUpValue, blackjackState.playerHand.length === 2);
  strategyDisplay.textContent = `💡 Basic Strategy: ${strategy}`;
}

/**
 * Basic blackjack strategy
 */
function getBasicStrategy(playerTotal, dealerUp, canDouble) {
  if (playerTotal >= 17) return 'Stand';
  if (playerTotal <= 11) return 'Hit';
  
  if (playerTotal === 16) {
    return dealerUp >= 7 ? 'Hit' : 'Stand';
  }
  if (playerTotal === 15) {
    return dealerUp >= 7 ? 'Hit' : 'Stand';
  }
  if (playerTotal === 14) {
    return dealerUp >= 7 ? 'Hit' : 'Stand';
  }
  if (playerTotal === 13) {
    return dealerUp >= 7 ? 'Hit' : 'Stand';
  }
  if (playerTotal === 12) {
    return (dealerUp >= 4 && dealerUp <= 6) ? 'Stand' : 'Hit';
  }
  
  if (canDouble) {
    if (playerTotal === 11) return 'Double';
    if (playerTotal === 10 && dealerUp <= 9) return 'Double';
    if (playerTotal === 9 && dealerUp >= 3 && dealerUp <= 6) return 'Double';
  }
  
  return 'Hit';
}

/**
 * Add blackjack styles
 */
function addBlackjackStyles() {
  if (document.querySelector('#blackjack-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'blackjack-styles';
  style.textContent = `
    .blackjack-game {
      max-width: 400px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      font-size: 0.9rem;
    }
    
    .game-result-header {
      padding: 8px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #28a745, #20c997);
      border-radius: 8px;
      color: white;
      text-align: center;
    }
    
    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 10px;
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      border-radius: 8px;
      color: white;
      font-size: 0.85rem;
    }
    
    .wallet-display {
      font-weight: bold;
      font-size: 0.9rem;
    }
    
    .wallet-amount {
      color: #4CAF50;
    }
    
    .bet-controls select {
      padding: 4px 8px;
      border-radius: 4px;
      border: none;
      font-size: 0.8rem;
    }
    
    .dealer-section, .player-section {
      margin: 10px 0;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .dealer-section h3, .player-section h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 1rem;
    }
    
    .hand-total {
      color: #007bff;
      font-weight: bold;
    }
    
    .card-container {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      min-height: 70px;
    }
    
    .playing-card {
      width: 50px;
      height: 70px;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    
    .card-deal-animation {
      animation: dealCard 0.5s ease-out;
      transition: transform 0.3s ease;
    }
    
    .playing-card:hover {
      transform: translateY(-5px);
    }
    
    .playing-card img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .card-hidden {
      background: linear-gradient(135deg, #8B4513, #A0522D);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
    }
    
    @keyframes dealCard {
      from {
        transform: translateY(-100px) rotate(180deg);
        opacity: 0;
      }
      to {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
    }
    
    .game-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 6px;
      margin: 10px 0;
    }
    
    .game-btn {
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.8rem;
    }
    
    .game-btn.primary {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }
    
    .game-btn:not(.primary) {
      background: linear-gradient(135deg, #007bff, #0056b3);
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
    }
    
    .game-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .stat-item {
      text-align: center;
      padding: 10px;
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
    
    .strategy-hint {
      margin-top: 20px;
      text-align: center;
    }
    
    .hint-toggle {
      background: linear-gradient(135deg, #ffc107, #ff8f00);
      color: #212529;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .hint-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
    }
    
    .strategy-text {
      margin-top: 10px;
      padding: 10px;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      color: #856404;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
}

// Export functions
window.openBlackjack = openBlackjack;
window.dealNewHand = dealNewHand;
window.playerHit = playerHit;
window.playerStand = playerStand;
window.playerDouble = playerDouble;
window.updateBet = updateBet;
window.updateBlackjackWallet = updateBlackjackWallet;
window.toggleStrategyHint = toggleStrategyHint;