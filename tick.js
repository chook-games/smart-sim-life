// Enhanced tick.js - Advanced day progression system with FIXED daily events

/**
 * Calculates days since last tick with more sophisticated logic
 */
function calculateDaysSinceLastTick() {
  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const data = loadGameData();
  const rawLast = data.lastTickDate;
  
  let lastMid;
  if (rawLast) {
    const parsed = new Date(rawLast);
    lastMid = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  } else {
    lastMid = todayMid;
  }
  
  const diffMs = todayMid - lastMid;
  const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Cap automatic progression to prevent exploitation
  return Math.min(daysPassed, 7); // Max 1 week of auto-progression
}

/**
 * Main tick application with comprehensive day progression
 */
function applyTick(days) {
  if (days <= 0) return;

  const data = loadGameData();
  const originalDay = data.day;
  
  console.log(`Applying ${days} day(s) of progression...`);
  
  for (let i = 0; i < days; i++) {
    processSingleDay(data);
  }
  
  // Post-processing after all days
  data.lastTickDate = new Date().toISOString().split("T")[0];
  
  // FIXED: Reset daily event availability for new day
  resetDailyEventForNewDay(data);
  
  // Check for major milestones
  checkSpecialMilestones(data);
  
  // Save before checking achievements to ensure data is up to date
  saveGameData(data);
  
  // Only check certain achievements on day progression to prevent spam
  checkDayProgressionAchievements(data);
  
  // Generate summary for multiple days
  if (days > 1) {
    generateProgressSummary(data, originalDay, days);
  }
  
  console.log(`Progression complete. Now on day ${data.day}`);
}

/**
 * FIXED: Reset daily event availability when day advances
 */
function resetDailyEventForNewDay(data) {
  if (data.lastDailyEventDay !== data.day) {
    data.dailyEventCompleted = false;
    data.lastDailyEventDay = data.day;
    
    // Reset social media daily posts
    if (data.socialMediaStats) {
      data.socialMediaStats.dailyPostsLeft = 3;
    }
    

    
    // Add notification about available daily event
    data.events.push({
      message: '🎁 New daily event available! Tap the gift button for rewards.',
      date: new Date().toISOString(),
      read: false
    });
  }
}

/**
 * Process a single day's worth of activities
 */
function processSingleDay(data) {
  // Increment day
  data.day++;
  
  // Check for New Game Plus at day 365
  if (data.day >= 365 && !data.extendedLife && !data.newGamePlusOffered) {
    setTimeout(() => {
      if (typeof checkForNewGamePlus === 'function') {
        checkForNewGamePlus();
      }
    }, 1000);
  }
  
  // Check for death first
  if (data.health <= 0) {
    processCharacterDeath(data);
    return;
  }
  
  // === FINANCIAL PROCESSING ===
  processFinances(data);
  
  // === WORK & CAREER ===
  processWork(data);
  
  // === HEALTH & WELLBEING ===
  processWellbeing(data);
  
  // === RELATIONSHIPS & SOCIAL ===
  processSocial(data);
  
  // === RANDOM EVENTS ===
  processRandomChance(data);
  
  // === JOB SECURITY ===
  processJobSecurity(data);
  
  // === HOME SECURITY ===
  processHomeSecurity(data);
  
  // === MARKET DYNAMICS ===
  processMarketChanges(data);
  
  // === ACHIEVEMENT PROGRESS ===
  updateDailyAchievements(data);
  
  // === ADDICTION SYSTEM ===
  processAddictionSystem(data);
  
  // === DAILY XP GAIN ===
  const dailyXP = calculateDailyXP(data);
  data.xp += dailyXP;
  
  // Check for level up
  const newLevel = window.LEVEL_SYSTEM.getLevelFromXP(data.xp);
  if (newLevel > data.level) {
    data.level = newLevel;
    data.events.push({
      message: `🎉 Level up! You are now level ${newLevel}!`,
      date: new Date().toISOString(),
      read: false
    });
    
    // Level up rewards
    const levelBonus = newLevel * 25;
    data.bankBalance += levelBonus;
    data.events.push({
      message: `💰 Level up bonus: €${levelBonus}`,
      date: new Date().toISOString(),
      read: false
    });
  }
  
  // Check for death after all processing
  if (data.health <= 0) {
    processCharacterDeath(data);
    return;
  }
  
  // Basic event logging
  data.events.push({
    message: `Day ${data.day}: ${getDayTypeName(data)} (+${dailyXP} XP)`,
    date: new Date().toISOString(),
    read: false
  });
}

/**
 * Process daily finances
 */
function processFinances(data) {
  const oldBalance = data.bankBalance;
  
  // Salary income
  if (data.profession && data.profession !== 'Unemployed') {
    let salaryModifier = 1.0;
    
    // Health affects work performance
    if (data.health < 50) salaryModifier *= 0.8;
    else if (data.health > 80) salaryModifier *= 1.1;
    
    // Happiness affects productivity
    if (data.happiness < 40) salaryModifier *= 0.9;
    else if (data.happiness > 80) salaryModifier *= 1.05;
    
    const actualSalary = Math.floor(data.salary * salaryModifier);
    data.bankBalance += actualSalary;
    updateLifetimeStats(data, actualSalary, 0);
    
    if (salaryModifier !== 1.0) {
      data.events.push({
        message: `Salary modified by health/happiness: €${actualSalary} (${Math.round(salaryModifier*100)}%)`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }
  
  // Daily expenses
  let totalExpenses = data.expenses;
  
  // Variable expenses based on lifestyle
  if (data.house === 'House') totalExpenses += Math.floor(Math.random() * 20); // Maintenance
  if (data.vehicle === 'LuxuryCar') totalExpenses += Math.floor(Math.random() * 30); // Fuel
  
  // Healthcare costs if sick
  if (data.health < 30) {
    const medicalCost = Math.floor(Math.random() * 50) + 20;
    totalExpenses += medicalCost;
    data.events.push({
      message: `Medical expenses: €${medicalCost} due to poor health`,
      date: new Date().toISOString(),
      read: false
    });
  }
  
  data.bankBalance -= totalExpenses;
  updateLifetimeStats(data, 0, totalExpenses);
  
  // Interest on debt (daily compounding)
  if (data.debt > 0) {
    const dailyRate = 0.05 / 365; // 5% annual rate
    const interest = Math.floor(data.debt * dailyRate);
    data.debt += interest;
    
    if (interest > 0) {
      data.events.push({
        message: `Debt interest: €${interest}`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }
  
  // Credit score updates
  if (data.bankBalance < -100) {
    updateCreditScore(data, 'missed_payment');
  } else if (data.debt === 0 && data.bankBalance > 1000) {
    if (Math.random() < 0.1) { // 10% chance
      updateCreditScore(data, 'good_financial_behavior');
    }
  }
  
  // Bankruptcy protection
  if (data.bankBalance < -5000) {
    data.bankBalance = -5000;
    data.events.push({
      message: '🚨 Bankruptcy protection activated! Debt capped at €5000',
      date: new Date().toISOString(),
      read: false
    });
  }
}

/**
 * Process work and career development
 */
function processWork(data) {
  if (data.profession && data.profession !== 'Unemployed') {
    data.workExperience = (data.workExperience || 0) + 1;
    
    // Milestone notifications for work experience
    if (data.workExperience === 30) {
      data.events.push({
        message: `🎉 30 days work experience! New jobs available in Job Search.`,
        date: new Date().toISOString(),
        read: false
      });
    } else if (data.workExperience === 90) {
      data.events.push({
        message: `🎉 90 days work experience! Skilled positions now available.`,
        date: new Date().toISOString(),
        read: false
      });
    } else if (data.workExperience === 180) {
      data.events.push({
        message: `🎉 180 days work experience! Professional roles unlocked.`,
        date: new Date().toISOString(),
        read: false
      });
    } else if (data.workExperience === 365) {
      data.events.push({
        message: `🎉 1 year work experience! Senior positions available.`,
        date: new Date().toISOString(),
        read: false
      });
    } else if (data.workExperience === 730) {
      data.events.push({
        message: `🎉 2 years work experience! Executive roles now open.`,
        date: new Date().toISOString(),
        read: false
      });
    }
    
    // Skill development - smaller raises every 30 days
    if (data.workExperience % 30 === 0) {
      const oldSalary = data.salary;
      data.salary = Math.floor(data.salary * 1.05); // 5% raise every 30 days
      
      data.events.push({
        message: `💼 Performance review! Salary increased from €${oldSalary} to €${data.salary}/day`,
        date: new Date().toISOString(),
        read: false
      });
      
      data.xp += 25; // Bonus XP for raises
    }
    
    // Random work events
    if (Math.random() < 0.05) { // 5% chance
      const events = [
        { message: 'Completed a challenging project successfully!', xp: 20 },
        { message: 'Received recognition from management', xp: 15 },
        { message: 'Learned a new skill at work', xp: 25 },
        { message: 'Mentored a new colleague', xp: 18 },
        { message: 'Suggested an improvement that was implemented', xp: 30 }
      ];
      
      const event = events[Math.floor(Math.random() * events.length)];
      data.events.push({
        message: `Work Event: ${event.message}`,
        date: new Date().toISOString(),
        read: false
      });
      data.xp += event.xp;
    }
  } else {
    // Unemployment effects
    data.happiness = Math.max(10, data.happiness - 1);
    
    if (Math.random() < 0.1) { // 10% chance
      data.events.push({
        message: 'Searched for job opportunities today',
        date: new Date().toISOString(),
        read: false
      });
      data.xp += 5;
    }
  }
}

/**
 * Process health and wellbeing with random daily drops
 */
function processWellbeing(data) {
  let healthChange = 0;
  let happinessChange = 0;
  
  // FIXED: RANDOM DAILY DROPS (2-10% as requested)
  const healthDrop = Math.floor(Math.random() * 9) + 2; // 2-10%
  const happinessDrop = Math.floor(Math.random() * 9) + 2; // 2-10%
  
  healthChange -= healthDrop;
  happinessChange -= happinessDrop;
  
  // Base regeneration (reduced to account for daily drops)
  if (data.health < 100) healthChange += 1;
  if (data.happiness < 100) happinessChange += 1;
  
  // Lifestyle factors
  if (data.house === 'House') {
    healthChange += 1;
    happinessChange += 1;
  } else if (data.house === 'Studio') {
    happinessChange -= 1;
  }
  
  if (data.vehicle === 'LuxuryCar') {
    happinessChange += 2;
  } else if (data.vehicle === 'Bike') {
    healthChange += 1; // Exercise!
  }
  
  // Financial stress
  if (data.bankBalance < 0) {
    happinessChange -= 3;
    healthChange -= 1;
  } else if (data.bankBalance > 10000) {
    happinessChange += 2;
  }
  
  // Debt stress
  const debtRatio = data.bankBalance > 0 ? data.debt / data.bankBalance : 1;
  if (debtRatio > 2) {
    happinessChange -= 2;
    healthChange -= 1;
  }
  
  // Work satisfaction
  if (data.salary > 200) happinessChange += 1;
  if (data.profession === 'Unemployed') happinessChange -= 2;
  
  // Random health events
  if (Math.random() < 0.02) { // 2% chance
    const healthEvents = [
      { message: 'Caught a minor cold', health: -10, happiness: -5 },
      { message: 'Had a great workout!', health: 5, happiness: 3 },
      { message: 'Enjoyed a relaxing day', health: 3, happiness: 8 },
      { message: 'Stress from work affected your sleep', health: -5, happiness: -3 }
    ];
    
    const event = healthEvents[Math.floor(Math.random() * healthEvents.length)];
    data.events.push({
      message: `Health Event: ${event.message}`,
      date: new Date().toISOString(),
      read: false
    });
    
    healthChange += event.health;
    happinessChange += event.happiness;
  }
  
  // Process addiction system first
  processAddictionSystem(data);
  
  // Apply changes with bounds - FIXED: Allow health and happiness to reach 0%
  data.health = Math.max(0, Math.min(100, data.health + healthChange));
  data.happiness = Math.max(0, Math.min(100, data.happiness + happinessChange));
  
  // Check for death after wellbeing processing
  if (data.health <= 0) {
    processCharacterDeath(data);
    return;
  }
  
  // Log significant daily drops for transparency
  if (healthDrop >= 7 || happinessDrop >= 7) {
    data.events.push({
      message: `Daily wear and tear: Health -${healthDrop}%, Happiness -${happinessDrop}%`,
      date: new Date().toISOString(),
      read: false
    });
  }
  
  // Extreme states
  if (data.health <= 10) {
    data.events.push({
      message: '⚠️ Health is critically low! Consider seeing a doctor.',
      date: new Date().toISOString(),
      read: false
    });
  }
  
  if (data.happiness <= 15) {
    data.events.push({
      message: '😔 Feeling very unhappy. Maybe try buying something nice or finding a better job?',
      date: new Date().toISOString(),
      read: false
    });
  }
}

/**
 * Process social and relationship aspects
 */
function processSocial(data) {
  if (!data.relationships) data.relationships = {};
  
  // Random social encounters
  if (Math.random() < 0.1) { // 10% chance
    const socialEvents = [
      'Met an interesting person at a coffee shop',
      'Had lunch with a colleague',
      'Called an old friend to catch up',
      'Helped a neighbor with their groceries',
      'Joined a community event'
    ];
    
    const event = socialEvents[Math.floor(Math.random() * socialEvents.length)];
    data.events.push({
      message: `Social: ${event}`,
      date: new Date().toISOString(),
      read: false
    });
    
    data.happiness += 5;
    data.xp += 8;
  }
}

/**
 * Process random chances and events
 */
function processRandomChance(data) {
  // Small random money events
  if (Math.random() < 0.05) { // 5% chance
    const amount = Math.floor(Math.random() * 50) + 5;
    const events = [
      `Found €${amount} in an old jacket pocket`,
      `Got a small tax refund of €${amount}`,
      `Sold some old stuff online for €${amount}`,
      `Won €${amount} in a small office lottery`
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    data.bankBalance += amount;
    data.events.push({
      message: `Lucky: ${event}`,
      date: new Date().toISOString(),
      read: false
    });
    data.xp += 10;
  }
  
  // Small losses
  if (Math.random() < 0.03) { // 3% chance
    const amount = Math.floor(Math.random() * 30) + 10;
    const events = [
      `Parking ticket cost €${amount}`,
      `Coffee machine broke, repair cost €${amount}`,
      `Lost €${amount} on a scratch card`,
      `Impulse purchase regret: €${amount}`
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    data.bankBalance -= amount;
    data.events.push({
      message: `Unlucky: ${event}`,
      date: new Date().toISOString(),
      read: false
    });
  }
}

/**
 * Process market changes and price fluctuations
 */
function processMarketChanges(data) {
  // Market volatility affects item values
  if (Math.random() < 0.1 && data.inventory && data.inventory.length > 0) { // 10% chance
    const marketEvents = [
      { message: 'Tech market surge! Electronics gained value.', categories: ['electronics'], modifier: 1.1 },
      { message: 'Fashion trends shifted. Clothing items affected.', categories: ['clothing'], modifier: 0.95 },
      { message: 'Economic downturn. Luxury items lost value.', categories: ['luxury'], modifier: 0.9 },
      { message: 'Supply chain issues. All items slightly more valuable.', categories: 'all', modifier: 1.05 }
    ];
    
    const marketEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
    
    let affected = 0;
    data.inventory.forEach(item => {
      if (marketEvent.categories === 'all' || marketEvent.categories.includes(item.category)) {
        item.marketModifier = (item.marketModifier || 1) * marketEvent.modifier;
        affected++;
      }
    });
    
    if (affected > 0) {
      data.events.push({
        message: `📈 Market Event: ${marketEvent.message} (${affected} items affected)`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }
}

/**
 * Update daily achievements
 */
function updateDailyAchievements(data) {
  // Survive days achievement
  data.achievements.surviveDays.progress = data.day;
  
  // Money earned achievement
  data.achievements.moneyEarned.progress = data.lifetimeEarnings || 0;
  
  // Level reached achievement
  data.achievements.levelReached.progress = data.level;
}

/**
 * Calculate daily XP based on activities
 */
function calculateDailyXP(data) {
  let xp = 10; // Base daily XP
  
  if (data.profession !== 'Unemployed') xp += 5;
  if (data.health > 80) xp += 3;
  if (data.happiness > 80) xp += 3;
  if (data.bankBalance > 0) xp += 2;
  
  return xp;
}

/**
 * Get day type name for logging
 */
function getDayTypeName(data) {
  if (data.health < 30) return 'Sick Day';
  if (data.happiness < 30) return 'Rough Day';
  if (data.bankBalance < 0) return 'Struggling Day';
  if (data.happiness > 80 && data.health > 80) return 'Great Day';
  return 'Regular Day';
}

/**
 * Generate progress summary for multiple days
 */
function generateProgressSummary(data, originalDay, days) {
  const moneyChange = data.bankBalance - (data.bankBalance - (days * (data.salary - data.expenses)));
  
  data.events.push({
    message: `📅 ${days} days passed. Money change: ${moneyChange >= 0 ? '+' : ''}€${Math.floor(moneyChange)}`,
    date: new Date().toISOString(),
    read: false
  });
}

/**
 * Process job security - small chance of getting fired
 */
function processJobSecurity(data) {
  // Only applies if player has a job
  if (!data.currentJob || data.currentJob === 'Unemployed') return;
  
  // Very small chance (0.5%) of getting fired per day
  if (Math.random() < 0.005) {
    const firingReasons = [
      'Company downsizing led to layoffs',
      'Performance issues reported by supervisor',
      'Department restructuring eliminated your position',
      'Company financial difficulties',
      'Automated systems replaced your role',
      'New management brought in their own team'
    ];
    
    const reason = firingReasons[Math.floor(Math.random() * firingReasons.length)];
    const severancePay = Math.floor(data.dailySalary * 7); // One week severance
    
    data.bankBalance += severancePay;
    data.currentJob = 'Unemployed';
    data.dailySalary = 0;
    
    data.events.push({
      message: `🚨 You've been fired! Reason: ${reason}. Received €${severancePay} severance pay.`,
      date: new Date().toISOString(),
      read: false
    });
    
    // Negative impact on happiness and health
    data.happiness = Math.max(10, (data.happiness ?? 100) - 25);
    data.health = Math.max(10, (data.health ?? 100) - 10);
  }
}

/**
 * Process home security - chance of burglary based on living situation
 */
function processHomeSecurity(data) {
  // Base chance depends on housing type
  let burglaryChance = 0;
  let maxLoss = 0;
  
  switch(data.currentHousing) {
    case 'Parents House':
      burglaryChance = 0.0005; // Very low, parents' neighborhood is safer
      maxLoss = 100;
      break;
    case 'Studio':
    case 'Apartment':
      burglaryChance = 0.001; // Low chance
      maxLoss = 300;
      break;
    case 'House':
      burglaryChance = 0.0015; // Slightly higher
      maxLoss = 500;
      break;
    case 'Mansion':
      burglaryChance = 0.002; // Higher chance but better security
      maxLoss = 800;
      break;
    default:
      return; // No housing, no burglary risk
  }
  
  if (Math.random() < burglaryChance) {
    // Calculate losses
    const moneyLoss = Math.floor(Math.random() * Math.min(maxLoss, data.bankBalance * 0.1));
    let itemsStolen = 0;
    let stolenValue = 0;
    
    // Steal some items (higher value items more likely to be stolen)
    if (data.inventory && data.inventory.length > 0) {
      const stealableItems = data.inventory.filter(item => 
        item.category === 'electronics' || 
        item.category === 'luxury' || 
        item.price > 100
      );
      
      const itemsToSteal = Math.min(
        Math.floor(Math.random() * 3) + 1, // 1-3 items
        stealableItems.length
      );
      
      for (let i = 0; i < itemsToSteal; i++) {
        if (stealableItems.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * stealableItems.length);
        const stolenItem = stealableItems[randomIndex];
        
        stolenValue += stolenItem.price;
        itemsStolen++;
        
        // Remove from inventory
        const inventoryIndex = data.inventory.indexOf(stolenItem);
        data.inventory.splice(inventoryIndex, 1);
        
        // Remove from stealable items to avoid duplicates
        stealableItems.splice(randomIndex, 1);
      }
    }
    
    // Apply money loss
    data.bankBalance = Math.max(0, data.bankBalance - moneyLoss);
    
    // Create event message
    let eventMessage = `🚨 BURGLARY! Your home was broken into. `;
    if (moneyLoss > 0) eventMessage += `Lost €${moneyLoss} in cash. `;
    if (itemsStolen > 0) eventMessage += `${itemsStolen} valuable items stolen (worth ~€${stolenValue}). `;
    eventMessage += `Consider improving home security.`;
    
    data.events.push({
      message: eventMessage,
      date: new Date().toISOString(),
      read: false
    });
    
    // Negative impact on happiness and health due to trauma
    data.happiness = Math.max(5, (data.happiness ?? 100) - 20);
    data.health = Math.max(5, (data.health ?? 100) - 5);
    
    // Add insurance/police report chance for partial recovery
    if (Math.random() < 0.3) { // 30% chance
      const recoveredAmount = Math.floor((moneyLoss + stolenValue) * 0.4);
      data.bankBalance += recoveredAmount;
      
      data.events.push({
        message: `📋 Insurance partially covered the burglary. Received €${recoveredAmount} compensation.`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }
}

/**
 * Process character death and restart
 */
function processCharacterDeath(data) {
    // Show death message
    const deathMessages = [
        'Your health reached zero. Life can be challenging.',
        'Poor health led to your demise. Take better care next time.',
        'Your body could not endure the stress. Rest in peace.',
        'Neglecting your health proved fatal. Start fresh.'
    ];
    
    const message = deathMessages[Math.floor(Math.random() * deathMessages.length)];
    
    // Clear all data except achievements for new start
    const achievements = data.achievements || {};
    const totalLifetimeGames = (data.totalLifetimeGames || 0) + 1;
    
    // Show death modal
    showModal(
        '💀 Game Over',
        `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">⚰️</div>
                <h3 style="color: #dc3545;">Life has ended</h3>
                <p>${message}</p>
                <p><strong>Days survived: ${data.day}</strong></p>
                <p><strong>Money earned: €${data.lifetimeEarnings || 0}</strong></p>
                <p style="font-size: 14px; color: #6c757d; margin-top: 20px;">
                    Your achievements are preserved, but everything else will reset.
                </p>
            </div>
        `,
        { showCancel: false }
    ).then(() => {
        // Reset game data
        localStorage.removeItem('smartSimData');
        
        // Initialize new character creation
        const newData = loadGameData();
        newData.achievements = achievements;
        newData.totalLifetimeGames = totalLifetimeGames;
        saveGameData(newData);
        
        // Restart game
        setTimeout(() => {
            location.reload();
        }, 1000);
    });
}

/**
 * Process addiction system - food and gambling addiction
 */
function processAddictionSystem(data) {
  // Ensure addiction properties exist
  data.foodAddiction = data.foodAddiction ?? 100;
  data.gamblingAddiction = data.gamblingAddiction ?? 100;
  data.daysSinceLastFood = data.daysSinceLastFood || 0;
  data.daysSinceLastGambling = data.daysSinceLastGambling || 0;
  
  // Increment days since last activities
  data.daysSinceLastFood++;
  data.daysSinceLastGambling++;
  
  // Reduce addiction levels based on abstinence
  if (data.daysSinceLastFood >= 1) {
    data.foodAddiction = Math.max(0, data.foodAddiction - 5);
  }
  
  if (data.daysSinceLastGambling >= 1) {
    data.gamblingAddiction = Math.max(0, data.gamblingAddiction - 3);
  }
  
  // Apply health/happiness penalties for low addiction levels - FIXED: Allow reaching 0%
  if (data.foodAddiction < 50) {
    const foodPenalty = Math.floor((50 - data.foodAddiction) / 10);
    data.health = Math.max(0, data.health - foodPenalty);
    
    if (data.foodAddiction < 25) {
      data.events.push({
        message: `🍎 Food withdrawal is affecting your health severely (-${foodPenalty} health)`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }
  
  if (data.gamblingAddiction < 50) {
    const gamblingPenalty = Math.floor((50 - data.gamblingAddiction) / 15);
    data.happiness = Math.max(0, data.happiness - gamblingPenalty);
    
    if (data.gamblingAddiction < 25) {
      data.events.push({
        message: `🎰 Gambling withdrawal is affecting your mood (-${gamblingPenalty} happiness)`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }
  
  // If happiness is below 50%, lose additional health
  if (data.happiness < 50) {
    const depressionPenalty = Math.floor((50 - data.happiness) / 20);
    data.health = Math.max(0, data.health - depressionPenalty);
    
    if (depressionPenalty > 0) {
      data.events.push({
        message: `😔 Depression from low happiness is affecting your health (-${depressionPenalty} health)`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }
}

// Export functions
window.calculateDaysSinceLastTick = calculateDaysSinceLastTick;
window.applyTick = applyTick;
window.processJobSecurity = processJobSecurity;
window.processHomeSecurity = processHomeSecurity;
window.processCharacterDeath = processCharacterDeath;
window.processAddictionSystem = processAddictionSystem;
