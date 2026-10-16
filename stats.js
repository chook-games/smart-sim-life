// stats.js - Comprehensive statistics system

function renderStatistics() {
  const data = loadGameData();
  const statsEl = document.getElementById('stats-content');
  if (!statsEl) return;
  
  const stats = calculateAllStats(data);
  
  statsEl.innerHTML = `
    <div class="stats-section">
      <h3>📊 General Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data.day}</div>
          <div class="stat-label">Days Survived</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.level}</div>
          <div class="stat-label">Level</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.xp}</div>
          <div class="stat-label">Experience Points</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${data.bankBalance}</div>
          <div class="stat-label">Bank Balance</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>💼 Career Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data.profession}</div>
          <div class="stat-label">Current Job</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${data.salary}</div>
          <div class="stat-label">Daily Salary</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.workExperience || 0}</div>
          <div class="stat-label">Work Experience</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${stats.totalEarned}</div>
          <div class="stat-label">Total Earned</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>🏠 Lifestyle Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data.house}</div>
          <div class="stat-label">House Type</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.vehicle}</div>
          <div class="stat-label">Vehicle</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${data.expenses}</div>
          <div class="stat-label">Daily Expenses</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${stats.totalSpent}</div>
          <div class="stat-label">Total Spent</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>🛒 Shopping Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.inventory.totalItems}</div>
          <div class="stat-label">Items Owned</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${stats.inventory.totalOriginalValue}</div>
          <div class="stat-label">Items Bought For</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${stats.inventory.totalCurrentValue}</div>
          <div class="stat-label">Current Items Value</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.itemsCollected || 0}</div>
          <div class="stat-label">Items Collected</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>🎰 Gambling Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.blackjack.totalGames}</div>
          <div class="stat-label">Blackjack Games</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.blackjack.winRate}%</div>
          <div class="stat-label">Blackjack Win Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.kino.totalGames}</div>
          <div class="stat-label">Kino Games</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">€${stats.gambling.totalWon}</div>
          <div class="stat-label">Total Gambling Won</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>🏆 Achievement Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.achievements.total}</div>
          <div class="stat-label">Total Achievements</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.achievements.completed}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.achievements.completionRate}%</div>
          <div class="stat-label">Completion Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.events ? data.events.length : 0}</div>
          <div class="stat-label">Total Events</div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>💰 Financial Overview</h3>
      <div class="financial-chart">
        <div class="chart-item">
          <div class="chart-label">Assets</div>
          <div class="chart-bar">
            <div class="chart-fill" style="width: ${Math.min(100, (Math.abs(data.bankBalance) / 10000) * 100)}%; background: ${data.bankBalance >= 0 ? '#28a745' : '#dc3545'};"></div>
            <span>€${data.bankBalance}</span>
          </div>
        </div>
        <div class="chart-item">
          <div class="chart-label">Debt</div>
          <div class="chart-bar debt">
            <div class="chart-fill" style="width: ${Math.min(100, (data.debt / 10000) * 100)}%; background: #dc3545;"></div>
            <span>€${data.debt}</span>
          </div>
        </div>
        <div class="chart-item">
          <div class="chart-label">Net Worth</div>
          <div class="chart-bar ${stats.netWorth >= 0 ? 'positive' : 'negative'}">
            <div class="chart-fill" style="width: ${Math.min(100, (Math.abs(stats.netWorth) / 10000) * 100)}%; background: ${stats.netWorth >= 0 ? '#28a745' : '#dc3545'};"></div>
            <span>€${stats.netWorth}</span>
          </div>
        </div>
        <div class="chart-item">
          <div class="chart-label">Inventory Value</div>
          <div class="chart-bar">
            <div class="chart-fill" style="width: ${Math.min(100, (stats.inventory.totalCurrentValue / 5000) * 100)}%; background: #007bff;"></div>
            <span>€${stats.inventory.totalCurrentValue}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>📈 Performance Ratings</h3>
      <div class="performance-grid">
        ${generatePerformanceRating('Financial Management', calculateFinancialRating(data))}
        ${generatePerformanceRating('Career Progress', calculateCareerRating(data))}
        ${generatePerformanceRating('Achievement Hunter', calculateAchievementRating(data))}
        ${generatePerformanceRating('Risk Taker', calculateRiskRating(data))}
      </div>
    </div>
    
    <div class="stats-section">
      <h3>🎯 Personal Records</h3>
      <div class="records-grid">
        <div class="record-item">
          <div class="record-label">Highest Balance</div>
          <div class="record-value">€${data.highestBalance || data.bankBalance}</div>
        </div>
        <div class="record-item">
          <div class="record-label">Best Winning Streak</div>
          <div class="record-value">${Math.max(data.bestStreak?.blackjack || 0, data.bestStreak?.kino || 0)}</div>
        </div>
        <div class="record-item">
          <div class="record-label">Longest Survival</div>
          <div class="record-value">${data.day} days</div>
        </div>
        <div class="record-item">
          <div class="record-label">Credit Score Peak</div>
          <div class="record-value">${data.highestCreditScore || data.creditScore}</div>
        </div>
      </div>
    </div>
    
    <div class="stats-actions">
      <button onclick="exportStatsText()" class="stats-btn">📋 Copy Stats</button>
      <button onclick="clearOldEvents()" class="stats-btn">🗑️ Clear Old Events</button>
      <button onclick="resetStatistics()" class="stats-btn danger">📊 Reset Stats</button>
    </div>
  `;
  
  // Update personal records
  updatePersonalRecords(data, stats);
}

function calculateAllStats(data) {
  const bjStats = data.bjStats || { wins: 0, losses: 0, pushes: 0 };
  const kinoStats = data.kinoStats || { totalGames: 0, totalWon: 0, totalLost: 0 };
  
  const inventory = getInventoryStats();
  
  const blackjackTotal = bjStats.wins + bjStats.losses + bjStats.pushes;
  const blackjackWinRate = blackjackTotal > 0 ? Math.round((bjStats.wins / blackjackTotal) * 100) : 0;
  
  const totalEarned = data.lifetimeEarnings || (data.day * data.salary);
  const totalSpent = data.lifetimeSpending || (data.day * data.expenses);
  
  const achievements = data.achievements;
  let totalAchievements = 0;
  let completedAchievements = 0;
  
  if (achievements) {
    Object.values(achievements).forEach(ach => {
      if (ach.target && ach.unlocked) {
        totalAchievements += ach.target.length;
        completedAchievements += ach.unlocked.length;
      }
    });
  }
  
  const completionRate = totalAchievements > 0 ? Math.round((completedAchievements / totalAchievements) * 100) : 0;
  
  const netWorth = data.bankBalance - data.debt + inventory.totalCurrentValue;
  
  return {
    totalEarned,
    totalSpent,
    netWorth,
    blackjack: {
      totalGames: blackjackTotal,
      winRate: blackjackWinRate,
      wins: bjStats.wins,
      losses: bjStats.losses
    },
    kino: {
      totalGames: kinoStats.totalGames,
      totalWon: kinoStats.totalWon,
      totalLost: kinoStats.totalLost
    },
    gambling: {
      totalWon: kinoStats.totalWon + (bjStats.wins * 25) // Estimate blackjack winnings
    },
    achievements: {
      total: totalAchievements,
      completed: completedAchievements,
      completionRate
    },
    inventory
  };
}

function generatePerformanceRating(category, rating) {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const percentage = (rating / 5) * 100;
  const color = rating >= 4 ? '#28a745' : rating >= 3 ? '#ffc107' : rating >= 2 ? '#fd7e14' : '#dc3545';
  
  return `
    <div class="performance-card">
      <div class="performance-category">${category}</div>
      <div class="performance-stars" style="color: ${color};">${stars}</div>
      <div class="performance-bar">
        <div class="performance-fill" style="width: ${percentage}%; background: ${color};"></div>
      </div>
      <div class="performance-score">${rating}/5</div>
    </div>
  `;
}

function calculateFinancialRating(data) {
  let score = 1; // Base score
  
  // Positive bank balance
  if (data.bankBalance > 0) score += 1;
  if (data.bankBalance > 1000) score += 1;
  if (data.bankBalance > 5000) score += 0.5;
  
  // Low debt ratio
  if (data.debt === 0) score += 1;
  else if (data.debt < data.bankBalance) score += 0.5;
  
  // Net worth
  const netWorth = data.bankBalance - data.debt;
  if (netWorth > 2000) score += 0.5;
  
  return Math.min(5, Math.round(score));
}

function calculateCareerRating(data) {
  let score = 0;
  
  if (data.profession !== 'Unemployed') score += 1;
  if (data.salary >= 50) score += 1;
  if (data.salary >= 100) score += 1;
  if (data.salary >= 200) score += 1;
  if ((data.workExperience || 0) >= 30) score += 1;
  
  return Math.min(5, score);
}

function calculateAchievementRating(data) {
  const achievements = data.achievements;
  let totalUnlocked = 0;
  let totalPossible = 0;
  
  Object.values(achievements).forEach(ach => {
    if (ach.target && ach.unlocked) {
      totalUnlocked += ach.unlocked.length;
      totalPossible += ach.target.length;
    }
  });
  
  const rate = totalPossible > 0 ? totalUnlocked / totalPossible : 0;
  return Math.round(rate * 5);
}

function calculateRiskRating(data) {
  let score = 0;
  const bjStats = data.bjStats || { wins: 0, losses: 0, pushes: 0 };
  const kinoStats = data.kinoStats || { totalGames: 0 };
  
  const totalGambling = (bjStats.wins + bjStats.losses + bjStats.pushes) + kinoStats.totalGames;
  
  if (totalGambling > 10) score += 1;
  if (totalGambling > 50) score += 1;
  if (totalGambling > 100) score += 1;
  if (data.debt > 1000) score += 1;
  if ((data.inventory?.length || 0) > 20) score += 1;
  
  return Math.min(5, score);
}

function updatePersonalRecords(data, stats) {
  // Update highest balance
  if (!data.highestBalance || data.bankBalance > data.highestBalance) {
    data.highestBalance = data.bankBalance;
  }
  
  // Update highest credit score
  if (!data.highestCreditScore || data.creditScore > data.highestCreditScore) {
    data.highestCreditScore = data.creditScore;
  }
  
  saveGameData(data);
}

// Export stats to text for sharing
function exportStatsText() {
  const data = loadGameData();
  const stats = calculateAllStats(data);
  
  const statsText = `
📊 SmartSim Life Statistics - ${data.userName}

🏆 General Stats:
• Days Survived: ${data.day}
• Level: ${data.level} (${data.xp} XP)
• Bank Balance: €${data.bankBalance}
• Net Worth: €${stats.netWorth}

💼 Career:
• Job: ${data.profession}
• Salary: €${data.salary}/day
• Work Experience: ${data.workExperience || 0} days
• Total Earned: €${stats.totalEarned}

🎰 Gambling:
• Blackjack Games: ${stats.blackjack.totalGames} (${stats.blackjack.winRate}% win rate)
• Kino Games: ${stats.kino.totalGames}
• Total Won: €${stats.gambling.totalWon}

🏠 Lifestyle:
• House: ${data.house}
• Vehicle: ${data.vehicle}
• Items Owned: ${stats.inventory.totalItems}
• Items Value: €${stats.inventory.totalCurrentValue}

🏆 Achievements: ${stats.achievements.completed}/${stats.achievements.total} (${stats.achievements.completionRate}%)

📊 Performance Ratings:
• Financial: ${calculateFinancialRating(data)}/5
• Career: ${calculateCareerRating(data)}/5
• Achievements: ${calculateAchievementRating(data)}/5
• Risk Taking: ${calculateRiskRating(data)}/5

Generated on ${new Date().toLocaleString()}
  `.trim();
  
  // Try to copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(statsText).then(() => {
      showToast('Statistics copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopyToClipboard(statsText);
    });
  } else {
    fallbackCopyToClipboard(statsText);
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showToast('Statistics copied to clipboard!', 'success');
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showToast('Failed to copy to clipboard', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Add statistics-specific styles
const statsStyles = `
  .stats-section {
    margin-bottom: 30px;
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .stats-section h3 {
    margin: 0 0 20px 0;
    color: #667eea;
    font-size: 1.2rem;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .stat-card {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 12px;
    color: #6c757d;
    font-weight: 600;
  }
  
  .financial-chart {
    display: grid;
    gap: 15px;
  }
  
  .chart-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .chart-label {
    width: 100px;
    font-weight: 600;
    color: #2c3e50;
  }
  
  .chart-bar {
    flex: 1;
    height: 30px;
    background: #e9ecef;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
  
  .chart-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 15px;
    transition: width 0.5s ease;
  }
  
  .chart-bar span {
    position: relative;
    z-index: 1;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .performance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .performance-card {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
  }
  
  .performance-category {
    font-weight: 600;
    margin-bottom: 10px;
    color: #2c3e50;
  }
  
  .performance-stars {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .performance-bar {
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 5px;
  }
  
  .performance-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease;
  }
  
  .performance-score {
    font-size: 12px;
    color: #6c757d;
    font-weight: bold;
  }
  
  .records-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .record-item {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    border: 2px solid #e9ecef;
  }
  
  .record-label {
    font-size: 12px;
    color: #6c757d;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .record-value {
    font-size: 1.3rem;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .stats-actions {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .stats-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #667eea;
    color: white;
  }
  
  .stats-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .stats-btn.danger {
    background: #dc3545;
  }
  
  .stats-btn.danger:hover {
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
  
  /* Dark mode styles */
  body.dark-mode .stats-section {
    background: #34495e;
    color: #ecf0f1;
  }
  
  body.dark-mode .stat-card,
  body.dark-mode .performance-card,
  body.dark-mode .record-item {
    background: #2c3e50;
    color: #ecf0f1;
  }
  
  body.dark-mode .stat-value,
  body.dark-mode .record-value {
    color: #ecf0f1;
  }
`;

// Add styles to document if not already added
if (!document.querySelector('#stats-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'stats-styles';
  styleSheet.textContent = statsStyles;
  document.head.appendChild(styleSheet);
}

// Export functions
window.renderStatistics = renderStatistics;
window.exportStatsText = exportStatsText;
window.calculateAllStats = calculateAllStats;
