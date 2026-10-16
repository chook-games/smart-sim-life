// Enhanced state.js - Complete game state management

function loadGameData() {
  const raw = JSON.parse(localStorage.getItem("smartSimData")) || {};
  const defaults = {
    // Basic character info
    userName: "",
    gender: "Other",
    age: 18,
    profession: "Unemployed",
    salary: 0,
    house: "Parents Home", 
    vehicle: "Walking",
    
    // Financial data
    bankBalance: 1000,
    debt: 0,
    expenses: 0,
    creditScore: 750,
    
    // Time and progression
    day: 1,
    level: 1,
    xp: 0,
    lastTickDate: new Date().toISOString().split("T")[0],
    startDate: new Date().toISOString(),
    
    // Game wallets for gambling
    gameWallets: { 
      blackjack: 100, 
      kino: 50, 
      slots: 0 
    },
    
    // Character stats
    health: 100,
    happiness: 100,
    
    // Work and career
    workExperience: 0,
    homeOwnership: "Living with Parents",
    ownedProperties: [],
    ownedVehicles: [],
    
    // Inventory system - FIXED
    inventory: [],
    itemsCollected: 0,
    
    // Events and achievements
    events: [],
    achievements: {
      surviveDays:   { target: [10,30,100,365,1000], progress: 0, unlocked: [] },
      kinoWins:      { target: [5,25,100,500], progress: 0, unlocked: [] },
      blackjackWins: { target: [5,25,100,500], progress: 0, unlocked: [] },
      itemsBought:   { target: [10,50,100,250], progress: 0, unlocked: [] },
      moneyEarned:   { target: [1000,5000,10000,50000], progress: 0, unlocked: [] },
      levelReached:  { target: [5,10,20,50], progress: 0, unlocked: [] }
    },
    
    // Game statistics
    bjStats: { wins: 0, losses: 0, pushes: 0 },
    kinoStats: { totalGames: 0, totalWon: 0, totalLost: 0 },
    
    // Daily events - FIXED
    dailyEventCompleted: false,
    lastDailyEventDay: 0,
    randomEventsCompleted: [],
    
    // Addiction system
    foodAddiction: 100,
    gamblingAddiction: 100,
    daysSinceLastFood: 0,
    daysSinceLastGambling: 0,
    
    // Settings
    settings: {
      darkMode: false,
      autoSave: true,
      notifications: true,
      soundEffects: true,
      autoTick: false
    },
    
    // Milestones and special data
    specialEvents: [],
    lifetimeEarnings: 0,
    lifetimeSpending: 0,
    bestStreak: { blackjack: 0, kino: 0 },
    
    // Social and relationships (for future features)
    relationships: {},
    reputation: 50
  };

  // Deep merge to ensure all nested objects exist
  let data = mergeDeep(defaults, raw);
  
  // Migrate old data if necessary
  data = migrateGameData(data);
  
  return data;
}

function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function migrateGameData(data) {
  // Migration for older save files
  
  // Add startDate if missing
  if (!data.startDate) {
    data.startDate = new Date().toISOString();
  }
  
  // Migrate old achievement structure
  if (data.achievements) {
    Object.keys(data.achievements).forEach(key => {
      if (!data.achievements[key].target) {
        // Old format, convert
        data.achievements[key] = {
          target: data.achievements[key].target || [10,100,1000],
          progress: data.achievements[key].progress || 0,
          unlocked: data.achievements[key].unlocked || []
        };
      }
    });
  }
  
  // Add new achievement categories if missing
  if (!data.achievements.itemsBought) {
    data.achievements.itemsBought = { target: [10,50,100,250], progress: 0, unlocked: [] };
  }
  if (!data.achievements.moneyEarned) {
    data.achievements.moneyEarned = { target: [1000,5000,10000,50000], progress: 0, unlocked: [] };
  }
  if (!data.achievements.levelReached) {
    data.achievements.levelReached = { target: [5,10,20,50], progress: 0, unlocked: [] };
  }
  
  // Initialize stats if missing
  if (!data.bjStats) {
    data.bjStats = { wins: 0, losses: 0, pushes: 0 };
  }
  if (!data.kinoStats) {
    data.kinoStats = { totalGames: 0, totalWon: 0, totalLost: 0 };
  }
  
  // Initialize health and happiness if missing
  if (data.health === undefined) data.health = 100;
  if (data.happiness === undefined) data.happiness = 100;
  
  // Initialize credit score if missing
  if (data.creditScore === undefined) data.creditScore = 750;
  
  // Update lifetime earnings tracking
  if (data.lifetimeEarnings === undefined) {
    data.lifetimeEarnings = data.day * data.salary; // Rough estimate
  }
  
  // FIXED: Initialize daily event system properly
  if (data.dailyEventCompleted === undefined) {
    data.dailyEventCompleted = false;
  }
  if (data.lastDailyEventDay === undefined) {
    data.lastDailyEventDay = 0;
  }
  
  // FIXED: Ensure inventory is properly initialized
  if (!data.inventory) {
    data.inventory = [];
  }
  
  return data;
}

function saveGameData(data) {
  // Update save timestamp
  data.lastSaveDate = new Date().toISOString();
  
  // Validate critical data
  if (typeof data.bankBalance !== 'number') data.bankBalance = 0;
  if (typeof data.day !== 'number') data.day = 1;
  if (typeof data.level !== 'number') data.level = 1;
  
  // Ensure constraints
  data.health = Math.max(0, Math.min(100, data.health ?? 100));
  data.happiness = Math.max(0, Math.min(100, data.happiness ?? 100));
  data.creditScore = Math.max(300, Math.min(850, data.creditScore || 750));
  
  // FIXED: Ensure inventory integrity
  if (!Array.isArray(data.inventory)) {
    data.inventory = [];
  }
  
  try {
    localStorage.setItem("smartSimData", JSON.stringify(data));
    console.log('Game data saved successfully');
  } catch (error) {
    console.error('Failed to save game data:', error);
    showToast('Failed to save game! Storage may be full.', 'error');
  }
}

// Utility functions for game state
function updateLifetimeStats(data, earning = 0, spending = 0) {
  data.lifetimeEarnings = (data.lifetimeEarnings || 0) + earning;
  data.lifetimeSpending = (data.lifetimeSpending || 0) + spending;
}

function updateCreditScore(data, action) {
  let change = 0;
  
  switch (action) {
    case 'loan_taken':
      change = -10;
      break;
    case 'debt_paid':
      change = 5;
      break;
    case 'debt_paid_full':
      change = 15;
      break;
    case 'missed_payment':
      change = -25;
      break;
    case 'good_financial_behavior':
      change = 2;
      break;
  }
  
  data.creditScore = Math.max(300, Math.min(850, data.creditScore + change));
  
  if (Math.abs(change) >= 10) {
    data.events.push({
      message: `Credit score ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)} points (now ${data.creditScore})`,
      date: new Date().toISOString(),
      read: false
    });
  }
}

function getNetWorth(data) {
  const inventoryValue = data.inventory ? 
    data.inventory.reduce((sum, item) => {
      const daysSincePurchase = data.day - (item.purchaseDay || data.day);
      const depreciation = Math.floor(daysSincePurchase / 10) * 0.1;
      const currentValue = Math.max(item.price * (1 - depreciation), item.price * 0.1);
      return sum + currentValue;
    }, 0) : 0;
  
  return data.bankBalance - data.debt + inventoryValue;
}

function getFinancialRating(data) {
  const netWorth = getNetWorth(data);
  const debtRatio = data.bankBalance > 0 ? data.debt / data.bankBalance : 1;
  const creditScore = data.creditScore;
  
  let rating = 0;
  
  if (netWorth > 0) rating += 20;
  if (netWorth > 1000) rating += 15;
  if (netWorth > 5000) rating += 15;
  if (debtRatio < 0.5) rating += 20;
  if (debtRatio === 0) rating += 10;
  if (creditScore >= 700) rating += 10;
  if (creditScore >= 750) rating += 10;
  
  return Math.min(100, rating);
}

// Check for special milestones
function checkSpecialMilestones(data) {
  const milestones = [
    { day: 365, name: 'First Year Survivor', reward: 1000 },
    { netWorth: 10000, name: 'Wealth Builder', reward: 500 },
    { level: 10, name: 'Experience Master', reward: 250 },
    { creditScore: 800, name: 'Credit Expert', reward: 300 }
  ];
  
  milestones.forEach(milestone => {
    const achieved = data.specialEvents && data.specialEvents.includes(milestone.name);
    
    if (!achieved) {
      let qualified = false;
      
      if (milestone.day && data.day >= milestone.day) qualified = true;
      if (milestone.netWorth && getNetWorth(data) >= milestone.netWorth) qualified = true;
      if (milestone.level && data.level >= milestone.level) qualified = true;
      if (milestone.creditScore && data.creditScore >= milestone.creditScore) qualified = true;
      
      if (qualified) {
        if (!data.specialEvents) data.specialEvents = [];
        data.specialEvents.push(milestone.name);
        data.bankBalance += milestone.reward;
        data.xp += milestone.reward / 2;
        
        data.events.push({
          message: `🏆 MILESTONE ACHIEVED: ${milestone.name}! Reward: €${milestone.reward}`,
          date: new Date().toISOString(),
          read: false
        });
      }
    }
  });
}

// Health and happiness effects
function updateWellbeing(data) {
  // Gradual health regeneration
  if (data.health < 100) {
    data.health = Math.min(100, data.health + 1);
  }
  
  // Happiness effects based on lifestyle
  let happinessChange = 0;
  
  // Money stress
  if (data.bankBalance < 0) happinessChange -= 2;
  else if (data.bankBalance > 5000) happinessChange += 1;
  
  // Debt stress
  if (data.debt > data.bankBalance * 2) happinessChange -= 1;
  
  // Work satisfaction
  if (data.salary > 100) happinessChange += 1;
  if (data.profession === 'Unemployed') happinessChange -= 1;
  
  data.happiness = Math.max(10, Math.min(100, data.happiness + happinessChange));
}

// Export state utilities
window.updateLifetimeStats = updateLifetimeStats;
window.updateCreditScore = updateCreditScore;
window.getNetWorth = getNetWorth;
window.getFinancialRating = getFinancialRating;
window.checkSpecialMilestones = checkSpecialMilestones;
window.updateWellbeing = updateWellbeing;
