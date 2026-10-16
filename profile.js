// profile.js - Character profile and wellness tracking

/**
 * Open Profile screen
 */
function openProfile() {
  const data = loadGameData();

  document.getElementById('modal-title').textContent = '👤 Profile';
  document.getElementById('modal-body').innerHTML = getProfileContent(data);
  document.getElementById('app-modal').classList.remove('hidden');

  // Add styles
  addProfileStyles();
}

/**
 * Generate profile content
 */
function getProfileContent(data) {
  return `
    <div class="profile-container">

      <!-- Character Overview -->
      <div class="profile-section">
        <h3>📋 Character Overview</h3>
        <div class="profile-stats">
          <div class="stat-row">
            <span class="stat-label">Name:</span>
            <span class="stat-value">${data.userName || 'Unknown'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Gender:</span>
            <span class="stat-value">${data.gender || 'Unknown'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Age:</span>
            <span class="stat-value">${data.age || 'Unknown'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Level:</span>
            <span class="stat-value">${data.level || 1}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Experience:</span>
            <span class="stat-value">${data.xp || 0} XP</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Days Survived:</span>
            <span class="stat-value">${data.day || 1}</span>
          </div>
        </div>
      </div>

      <!-- Current Lifestyle -->
      <div class="profile-section">
        <h3>🏙️ Current Lifestyle</h3>
        <div class="profile-stats">
          <div class="stat-row">
            <span class="stat-label">Job:</span>
            <span class="stat-value">${data.profession || 'Unemployed'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Daily Salary:</span>
            <span class="stat-value">€${data.salary || 0}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Work Experience:</span>
            <span class="stat-value">${data.workExperience || 0} days</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Housing:</span>
            <span class="stat-value">${data.house || 'Parents Home'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Vehicle:</span>
            <span class="stat-value">${data.vehicle || 'Walking'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Daily Expenses:</span>
            <span class="stat-value">€${data.expenses || 0}</span>
          </div>
        </div>
      </div>

      <!-- Financial Status -->
      <div class="profile-section">
        <h3>💰 Financial Status</h3>
        <div class="profile-stats">
          <div class="stat-row">
            <span class="stat-label">Bank Balance:</span>
            <span class="stat-value ${data.bankBalance >= 0 ? 'positive' : 'negative'}">€${data.bankBalance || 0}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Debt:</span>
            <span class="stat-value ${data.debt > 0 ? 'negative' : ''}">€${data.debt || 0}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Credit Score:</span>
            <span class="stat-value">${data.creditScore || 750}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Net Worth:</span>
            <span class="stat-value ${getNetWorth(data) >= 0 ? 'positive' : 'negative'}">€${getNetWorth(data)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Daily Net Income:</span>
            <span class="stat-value ${(data.salary - data.expenses) >= 0 ? 'positive' : 'negative'}">€${(data.salary || 0) - (data.expenses || 0)}</span>
          </div>
        </div>
      </div>

      <!-- Character Skills & Traits -->
      <div class="profile-section">
        <h3>🎭 Character Skills & Traits</h3>
        <div class="skills-container">
          ${generateCharacterSkills(data)}
        </div>
      </div>

      <!-- Health & Happiness Analysis -->
      <div class="profile-section">
        <h3>🏥 Wellness Analysis</h3>
        <div class="wellness-overview">
          <div class="wellness-stat">
            <div class="wellness-header">
              <span class="wellness-label">❤️ Health</span>
              <span class="wellness-value ${getHealthStatus(data.health ?? 100).color}">${data.health ?? 100}%</span>
            </div>
            <div class="wellness-bar">
              <div class="wellness-fill health" style="width: ${data.health ?? 100}%"></div>
            </div>
            <div class="wellness-status">${getHealthStatus(data.health ?? 100).text}</div>
          </div>

          <div class="wellness-stat">
            <div class="wellness-header">
              <span class="wellness-label">😊 Happiness</span>
              <span class="wellness-value ${getHappinessStatus(data.happiness ?? 100).color}">${data.happiness ?? 100}%</span>
            </div>
            <div class="wellness-bar">
              <div class="wellness-fill happiness" style="width: ${data.happiness ?? 100}%"></div>
            </div>
            <div class="wellness-status">${getHappinessStatus(data.happiness ?? 100).text}</div>
          </div>
        </div>



        <div class="wellness-stat">
          <div class="wellness-header">
            <span class="wellness-label">🍕 Food Addiction</span>
            <span class="wellness-value ${(data.foodAddiction ?? 100) < 50 ? 'critical' : (data.foodAddiction ?? 100) < 70 ? 'warning' : 'good'}">${Math.round(data.foodAddiction ?? 100)}%</span>
          </div>
          <div class="wellness-bar">
            <div class="wellness-fill food-addiction" style="width: ${data.foodAddiction ?? 100}%"></div>
          </div>
          <div class="wellness-status">${(data.foodAddiction ?? 100) < 50 ? 'Withdrawal effects - health declining' : 'Satisfied'}</div>
        </div>

        <div class="wellness-stat">
          <div class="wellness-header">
            <span class="wellness-label">🎲 Gambling Addiction</span>
            <span class="wellness-value ${(data.gamblingAddiction ?? 100) < 50 ? 'critical' : (data.gamblingAddiction ?? 100) < 70 ? 'warning' : 'good'}">${Math.round(data.gamblingAddiction ?? 100)}%</span>
          </div>
          <div class="wellness-bar">
            <div class="wellness-fill gambling-addiction" style="width: ${data.gamblingAddiction ?? 100}%"></div>
          </div>
          <div class="wellness-status">${(data.gamblingAddiction ?? 100) < 50 ? 'Withdrawal effects - happiness declining' : 'Satisfied'}</div>
        </div>
      </div>
</div>

      <!-- Daily Wellness Effects -->
      <div class="profile-section">
        <h3>📊 Daily Wellness Effects</h3>
        <div class="effects-container">
          ${generateWellnessEffects(data)}
        </div>




      <!-- Possessions -->
      <div class="profile-section">
        <h3>🎒 Possessions</h3>
        <div class="possessions-grid">
          ${generatePossessionsList(data)}
        </div>
      </div>

      <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Tips</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
            <li>Level increases with XP earned from work, achievements, and activities</li>
          <li>Level 1-5: Beginner, 6-15: Experienced, 16-30: Expert, 31+: Master</li>
          <li>Keep health above 50% by eating food and drinking beverages</li>
          <li>Maintain happiness through good jobs, nice home, and gambling</li>
          <li>Track your progress with achievements and daily statistics</li>
          <li>Addiction levels below 50% cause health/happiness penalties</li>
          </ul>
        </div>
  `;
}

/**
 * Generate character skills and traits display
 */
function generateCharacterSkills(data) {
  // Load story state to get character traits
  const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
  const traits = storyState.character_traits || {};
  
  const skillCategories = [
    {
      name: 'Social Skills',
      icon: '👥',
      skills: [
        { name: 'Confidence', value: traits.confidence || 0, description: 'Self-assurance in social situations' },
        { name: 'Charisma', value: traits.charisma || 0, description: 'Natural charm and influence over others' },
        { name: 'Social Skills', value: traits.social_skills || 0, description: 'Ability to interact effectively with people' }
      ]
    },
    {
      name: 'Professional Skills',
      icon: '💼',
      skills: [
        { name: 'Assertiveness', value: traits.assertiveness || 0, description: 'Standing up for yourself at work' },
        { name: 'Leadership', value: traits.leadership || 0, description: 'Ability to guide and motivate others' },
        { name: 'Work Experience', value: data.workExperience || 0, description: 'Days of professional experience' }
      ]
    },
    {
      name: 'Personal Traits',
      icon: '🎭',
      skills: [
        { name: 'Honesty', value: traits.honesty_reputation || 0, description: 'Reputation for truthfulness' },
        { name: 'Patience', value: traits.patience || 0, description: 'Ability to wait and stay calm' },
        { name: 'Independence', value: traits.independence || 0, description: 'Self-reliance and autonomy' }
      ]
    }
  ];
  
  let html = '';
  
  skillCategories.forEach(category => {
    html += `
      <div class="skill-category">
        <h4 class="skill-category-title">
          <span class="skill-category-icon">${category.icon}</span>
          ${category.name}
        </h4>
        <div class="skills-list">
    `;
    
    category.skills.forEach(skill => {
      const level = getSkillLevel(skill.value);
      html += `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-value ${level.color}">${skill.value} (${level.rank})</span>
          </div>
          <div class="skill-bar">
            <div class="skill-fill" style="width: ${Math.min(100, skill.value * 2)}%; background: ${level.barColor}"></div>
          </div>
          <div class="skill-description">${skill.description}</div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  // Story progress summary
  const completedEvents = storyState.completed_events ? storyState.completed_events.length : 0;
  const activeBranches = storyState.story_branches ? storyState.story_branches.length : 0;
  
  html += `
    <div class="story-progress">
      <h4 class="skill-category-title">
        <span class="skill-category-icon">📖</span>
        Story Progress
      </h4>
      <div class="story-stats">
        <div class="story-stat">
          <span class="story-label">Events Completed:</span>
          <span class="story-value">${completedEvents}</span>
        </div>
        <div class="story-stat">
          <span class="story-label">Life Paths:</span>
          <span class="story-value">${activeBranches}</span>
        </div>
        <div class="story-stat">
          <span class="story-label">Character Type:</span>
          <span class="story-value">${getCharacterType(traits)}</span>
        </div>
      </div>
    </div>
  `;
  
  return html;
}

/**
 * Get skill level and rank
 */
function getSkillLevel(value) {
  if (value >= 50) return { rank: 'Master', color: 'excellent', barColor: '#28a745' };
  if (value >= 30) return { rank: 'Expert', color: 'good', barColor: '#20c997' };
  if (value >= 15) return { rank: 'Skilled', color: 'fair', barColor: '#ffc107' };
  if (value >= 5) return { rank: 'Novice', color: 'poor', barColor: '#fd7e14' };
  return { rank: 'Beginner', color: 'critical', barColor: '#6c757d' };
}

/**
 * Determine character type based on dominant traits
 */
function getCharacterType(traits) {
  const social = (traits.charisma || 0) + (traits.social_skills || 0);
  const professional = (traits.assertiveness || 0) + (traits.leadership || 0);
  const personal = (traits.honesty_reputation || 0) + (traits.patience || 0);
  
  if (social > professional && social > personal) return 'Social Butterfly';
  if (professional > social && professional > personal) return 'Career Focused';
  if (personal > social && personal > professional) return 'Moral Compass';
  return 'Balanced Individual';
}

/**
 * Generate wellness effects analysis
 */
function generateWellnessEffects(data) {
  let effects = [];

  // Base regeneration
  effects.push({
    type: 'positive',
    icon: '🔄',
    title: 'Natural Recovery',
    health: '+1',
    happiness: '+1',
    description: 'Daily natural regeneration'
  });

  // Random daily drops
  effects.push({
    type: 'negative',
    icon: '📉',
    title: 'Daily Wear & Tear',
    health: '-2 to -10',
    happiness: '-2 to -10',
    description: 'Random daily stress and aging'
  });

  // Financial effects
  if (data.bankBalance < 0) {
    effects.push({
      type: 'negative',
      icon: '💸',
      title: 'Financial Stress',
      health: '0',
      happiness: '-2',
      description: 'Negative bank balance causing worry'
    });
  } else if (data.bankBalance > 5000) {
    effects.push({
      type: 'positive',
      icon: '💰',
      title: 'Financial Security',
      health: '0',
      happiness: '+1',
      description: 'Having over €5000 in savings'
    });
  }

  // Debt effects
  if (data.debt > (data.bankBalance * 2)) {
    effects.push({
      type: 'negative',
      icon: '📋',
      title: 'Debt Burden',
      health: '0',
      happiness: '-1',
      description: 'High debt compared to assets'
    });
  }

  // Work effects
  if (data.profession === 'Unemployed') {
    effects.push({
      type: 'negative',
      icon: '😔',
      title: 'Unemployment',
      health: '0',
      happiness: '-1',
      description: 'Being unemployed affects mood'
    });
  } else if (data.salary > 100) {
    effects.push({
      type: 'positive',
      icon: '💼',
      title: 'Good Job',
      health: '0',
      happiness: '+1',
      description: 'Well-paying job provides satisfaction'
    });
  }

  // Housing effects
  if (data.house === 'House') {
    effects.push({
      type: 'positive',
      icon: '🏠',
      title: 'Own House',
      health: '+1',
      happiness: '+1',
      description: 'Living in your own house'
    });
  } else if (data.house === 'Studio') {
    effects.push({
      type: 'negative',
      icon: '🏢',
      title: 'Small Studio',
      health: '0',
      happiness: '-1',
      description: 'Cramped living conditions'
    });
  }

  // Vehicle effects
  if (data.vehicle === 'LuxuryCar') {
    effects.push({
      type: 'positive',
      icon: '🚗',
      title: 'Luxury Car',
      health: '0',
      happiness: '+2',
      description: 'Driving a luxury vehicle'
    });
  } else if (data.vehicle === 'Bike') {
    effects.push({
      type: 'positive',
      icon: '🚴',
      title: 'Cycling',
      health: '+1',
      happiness: '0',
      description: 'Exercise from biking'
    });
  }

  return effects.map(effect => `
    <div class="effect-item ${effect.type}">
      <div class="effect-icon">${effect.icon}</div>
      <div class="effect-details">
        <div class="effect-title">${effect.title}</div>
        <div class="effect-changes">
          <span class="health-change">❤️ ${effect.health}</span>
          <span class="happiness-change">😊 ${effect.happiness}</span>
        </div>
        <div class="effect-description">${effect.description}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Generate possessions list
 */
function generatePossessionsList(data) {
  if (!data.inventory || data.inventory.length === 0) {
    return '<div class="no-possessions">No items owned yet. Visit the Market to buy things!</div>';
  }

  return data.inventory.map(item => `
    <div class="possession-item">
      <div class="possession-icon">${item.icon || '📦'}</div>
      <div class="possession-name">${item.name}</div>
      <div class="possession-value">€${item.price}</div>
    </div>
  `).join('');
}

/**
 * Get health status info
 */
function getHealthStatus(health) {
  const safeHealth = health ?? 100;
  if (safeHealth >= 80) return { text: 'Excellent Health', color: 'excellent' };
  if (safeHealth >= 60) return { text: 'Good Health', color: 'good' };
  if (safeHealth >= 40) return { text: 'Fair Health', color: 'fair' };
  if (safeHealth >= 20) return { text: 'Poor Health', color: 'poor' };
  return { text: 'Critical Health', color: 'critical' };
}

/**
 * Get happiness status info
 */
function getHappinessStatus(happiness) {
  const safeHappiness = happiness ?? 100;
  if (safeHappiness >= 80) return { text: 'Very Happy', color: 'excellent' };
  if (safeHappiness >= 60) return { text: 'Content', color: 'good' };
  if (safeHappiness >= 40) return { text: 'Neutral', color: 'fair' };
  if (safeHappiness >= 20) return { text: 'Unhappy', color: 'poor' };
  return { text: 'Depressed', color: 'critical' };
}

/**
 * Calculate net worth
 */
function getNetWorth(data) {
  let netWorth = (data.bankBalance || 0) - (data.debt || 0);

  // Add inventory value
  if (data.inventory && data.inventory.length > 0) {
    data.inventory.forEach(item => {
      netWorth += item.price || 0;
    });
  }

  return netWorth;
}

/**
 * Add profile styles
 */
function addProfileStyles() {
  // Remove existing styles
  const existingStyles = document.getElementById('profile-styles');
  if (existingStyles) {
    existingStyles.remove();
  }

  const style = document.createElement('style');
  style.id = 'profile-styles';
  style.textContent = `
    #app-modal .profile-container {
      max-width: 500px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }

    #app-modal .profile-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }

    #app-modal .profile-section h3 {
      margin: 0 0 15px 0;
      color: #2c3e50;
      font-size: 1.1rem;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 8px;
    }

    #app-modal .profile-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    #app-modal .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }

    #app-modal .stat-row:last-child {
      border-bottom: none;
    }

    #app-modal .stat-label {
      font-weight: bold;
      color: #495057;
    }

    #app-modal .stat-value {
      color: #2c3e50;
      font-weight: 500;
    }

    #app-modal .stat-value.positive {
      color: #28a745;
    }

    #app-modal .stat-value.negative {
      color: #dc3545;
    }

    .wellness-overview {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .wellness-stat {
      background: white;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .wellness-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .wellness-label {
      font-weight: bold;
      color: #495057;
    }

    .wellness-value {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .wellness-value.excellent { color: #28a745; }
    .wellness-value.good { color: #20c997; }
    .wellness-value.fair { color: #ffc107; }
    .wellness-value.poor { color: #fd7e14; }
    .wellness-value.critical { color: #dc3545; }

    #app-modal .wellness-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    #app-modal .wellness-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    #app-modal .wellness-fill.health {
      background: linear-gradient(90deg, #dc3545, #ffc107, #28a745);
    }

    #app-modal .wellness-fill.happiness {
      background: linear-gradient(90deg, #6f42c1, #007bff, #20c997);
    }

    .wellness-status {
      font-size: 0.85rem;
      color: #6c757d;
      font-style: italic;
    }

    .effects-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .effect-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 6px;
      background: white;
      border-left: 4px solid #e9ecef;
    }

    .effect-item.positive {
      border-left-color: #28a745;
      background: #f8fff9;
    }

    .effect-item.negative {
      border-left-color: #dc3545;
      background: #fff8f8;
    }

    .effect-icon {
      font-size: 1.2rem;
      width: 30px;
      text-align: center;
    }

    .effect-details {
      flex: 1;
    }

    .effect-title {
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 3px;
    }

    .effect-changes {
      display: flex;
      gap: 15px;
      margin-bottom: 3px;
    }

    .health-change, .happiness-change {
      font-size: 0.8rem;
      font-weight: bold;
    }

    .effect-description {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .possessions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
    }

    .possession-item {
      background: white;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #e9ecef;
      text-align: center;
    }

    .possession-icon {
      font-size: 1.5rem;
      margin-bottom: 5px;
    }

    .possession-name {
      font-weight: bold;
      font-size: 0.8rem;
      color: #2c3e50;
      margin-bottom: 3px;
    }

    .possession-value {
      font-size: 0.7rem;
      color: #28a745;
      font-weight: bold;
    }

    .no-possessions {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      padding: 20px;
    }
    
    /* Character Skills Styles */
    .skills-container { margin-bottom: 20px; }
    .skill-category { 
      background: #f8f9fa; 
      border-radius: 10px; 
      padding: 15px; 
      margin-bottom: 15px;
      border: 1px solid #e9ecef;
    }
    .skill-category-title { 
      color: #495057; 
      margin: 0 0 15px 0; 
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    .skill-category-icon { 
      margin-right: 8px; 
      font-size: 18px; 
    }
    .skill-item { 
      background: white; 
      border-radius: 8px; 
      padding: 12px; 
      margin-bottom: 10px;
      border: 1px solid #e9ecef;
    }
    .skill-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 8px; 
    }
    .skill-name { 
      font-weight: 500; 
      color: #333; 
    }
    .skill-value { 
      font-weight: bold; 
      font-size: 14px; 
    }
    .skill-bar { 
      height: 6px; 
      background: #e9ecef; 
      border-radius: 3px; 
      margin-bottom: 5px; 
      overflow: hidden;
    }
    .skill-fill { 
      height: 100%; 
      transition: width 0.3s ease; 
    }
    .skill-description { 
      font-size: 12px; 
      color: #6c757d; 
      font-style: italic; 
    }
    .story-progress { 
      background: #e3f2fd; 
      border-radius: 10px; 
      padding: 15px; 
      border: 1px solid #bbdefb;
    }
    .story-stats { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 10px; 
    }
    .story-stat { 
      background: white; 
      padding: 8px; 
      border-radius: 6px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    }
    .story-label { 
      font-size: 12px; 
      color: #666; 
    }
    .story-value { 
      font-weight: bold; 
      color: #1976d2; 
    }

    @media (max-width: 600px) {
      .profile-container {
        max-width: 100%;
        padding: 0 10px;
      }

      .profile-section {
        padding: 12px;
        margin-bottom: 12px;
      }

      .stat-row {
        padding: 6px 0;
      }

      .wellness-overview {
        gap: 12px;
      }

      .effect-item {
        padding: 8px;
        gap: 10px;
      }

      .possessions-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
      }
    }
  `;

  document.head.appendChild(style);
}