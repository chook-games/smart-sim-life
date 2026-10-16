// skilltree.js - Interactive skill tree visualization system

/**
 * Skill Tree Data Structure
 * Each node represents a skill with prerequisites and unlocks
 */
const SKILL_TREE = {
  // Social Skills Branch
  confidence_1: {
    id: 'confidence_1',
    name: 'Basic Confidence',
    description: 'Build self-assurance in daily interactions',
    icon: '💪',
    branch: 'social',
    position: { x: 100, y: 100 },
    cost: 0,
    prerequisites: [],
    unlocks: ['confidence_2', 'charisma_1'],
    maxLevel: 5,
    effects: { confidence: 5, happiness: 2 }
  },
  confidence_2: {
    id: 'confidence_2',
    name: 'Advanced Confidence',
    description: 'Lead conversations and take initiative',
    icon: '🎯',
    branch: 'social',
    position: { x: 100, y: 50 },
    cost: 10,
    prerequisites: ['confidence_1'],
    unlocks: ['leadership_1'],
    maxLevel: 5,
    effects: { confidence: 10, assertiveness: 5 }
  },
  charisma_1: {
    id: 'charisma_1',
    name: 'Natural Charm',
    description: 'Win people over with your personality',
    icon: '✨',
    branch: 'social',
    position: { x: 200, y: 100 },
    cost: 5,
    prerequisites: ['confidence_1'],
    unlocks: ['charisma_2', 'social_skills_1'],
    maxLevel: 5,
    effects: { charisma: 8, social_skills: 3 }
  },
  charisma_2: {
    id: 'charisma_2',
    name: 'Magnetic Presence',
    description: 'Command attention and respect wherever you go',
    icon: '👑',
    branch: 'social',
    position: { x: 200, y: 50 },
    cost: 15,
    prerequisites: ['charisma_1'],
    unlocks: ['romance_expert'],
    maxLevel: 3,
    effects: { charisma: 15, confidence: 5, romance_appeal: 20 }
  },
  social_skills_1: {
    id: 'social_skills_1',
    name: 'People Person',
    description: 'Excel at reading and responding to others',
    icon: '👥',
    branch: 'social',
    position: { x: 300, y: 100 },
    cost: 8,
    prerequisites: ['charisma_1'],
    unlocks: ['networking'],
    maxLevel: 5,
    effects: { social_skills: 10, charisma: 3 }
  },

  // Professional Skills Branch
  work_ethic_1: {
    id: 'work_ethic_1',
    name: 'Reliable Worker',
    description: 'Build a reputation for dependability',
    icon: '⚡',
    branch: 'professional',
    position: { x: 500, y: 100 },
    cost: 0,
    prerequisites: [],
    unlocks: ['work_ethic_2', 'assertiveness_1'],
    maxLevel: 5,
    effects: { work_performance: 10, job_security: 15 }
  },
  assertiveness_1: {
    id: 'assertiveness_1',
    name: 'Stand Your Ground',
    description: 'Express your needs and boundaries clearly',
    icon: '🛡️',
    branch: 'professional',
    position: { x: 600, y: 100 },
    cost: 8,
    prerequisites: ['work_ethic_1'],
    unlocks: ['assertiveness_2', 'leadership_1'],
    maxLevel: 5,
    effects: { assertiveness: 8, confidence: 3 }
  },
  leadership_1: {
    id: 'leadership_1',
    name: 'Team Leader',
    description: 'Guide and motivate others effectively',
    icon: '🎖️',
    branch: 'professional',
    position: { x: 350, y: 50 },
    cost: 12,
    prerequisites: ['confidence_2', 'assertiveness_1'],
    unlocks: ['leadership_2'],
    maxLevel: 5,
    effects: { leadership: 10, assertiveness: 5, salary_bonus: 15 }
  },
  leadership_2: {
    id: 'leadership_2',
    name: 'Executive Presence',
    description: 'Natural born leader with executive potential',
    icon: '👔',
    branch: 'professional',
    position: { x: 350, y: 10 },
    cost: 20,
    prerequisites: ['leadership_1'],
    unlocks: ['entrepreneur'],
    maxLevel: 3,
    effects: { leadership: 20, confidence: 10, promotion_chance: 30 }
  },

  // Personal Growth Branch
  patience_1: {
    id: 'patience_1',
    name: 'Inner Calm',
    description: 'Stay composed under pressure',
    icon: '🧘',
    branch: 'personal',
    position: { x: 100, y: 200 },
    cost: 0,
    prerequisites: [],
    unlocks: ['patience_2', 'wisdom_1'],
    maxLevel: 5,
    effects: { patience: 8, stress_resistance: 10 }
  },
  wisdom_1: {
    id: 'wisdom_1',
    name: 'Life Experience',
    description: 'Learn from every situation and mistake',
    icon: '📚',
    branch: 'personal',
    position: { x: 200, y: 200 },
    cost: 10,
    prerequisites: ['patience_1'],
    unlocks: ['wisdom_2'],
    maxLevel: 5,
    effects: { wisdom: 10, better_choices: 15 }
  },
  honesty_1: {
    id: 'honesty_1',
    name: 'Trustworthy',
    description: 'Build a reputation for honesty and integrity',
    icon: '🤝',
    branch: 'personal',
    position: { x: 300, y: 200 },
    cost: 5,
    prerequisites: [],
    unlocks: ['honesty_2'],
    maxLevel: 5,
    effects: { honesty_reputation: 10, trust_level: 15 }
  },

  // Special Unlock Skills
  entrepreneur: {
    id: 'entrepreneur',
    name: 'Business Mogul',
    description: 'Start and run successful businesses',
    icon: '💼',
    branch: 'special',
    position: { x: 450, y: 10 },
    cost: 30,
    prerequisites: ['leadership_2'],
    unlocks: [],
    maxLevel: 1,
    effects: { business_acumen: 50, startup_success: 40, wealth_generation: 25 }
  },
  romance_expert: {
    id: 'romance_expert',
    name: 'Romantic Virtuoso',
    description: 'Master the art of love and relationships',
    icon: '💕',
    branch: 'special',
    position: { x: 300, y: 10 },
    cost: 25,
    prerequisites: ['charisma_2'],
    unlocks: [],
    maxLevel: 1,
    effects: { romance_success: 50, relationship_stability: 30, charisma: 10 }
  },
  networking: {
    id: 'networking',
    name: 'Connected',
    description: 'Build powerful professional and social networks',
    icon: '🌐',
    branch: 'special',
    position: { x: 400, y: 100 },
    cost: 18,
    prerequisites: ['social_skills_1'],
    unlocks: [],
    maxLevel: 1,
    effects: { network_size: 50, job_opportunities: 25, social_influence: 20 }
  }
};

/**
 * Player skill tree state
 */
let playerSkillTree = {
  unlockedSkills: ['confidence_1', 'work_ethic_1', 'patience_1', 'honesty_1'],
  skillLevels: {},
  availablePoints: 0,
  totalPointsEarned: 0
};

/**
 * Open Skill Tree interface
 */
function openSkillTree() {
  const data = loadGameData();
  
  // Load player skill tree state
  loadSkillTreeState();
  
  // Calculate available skill points based on level and story progress
  updateSkillPoints(data);

  document.getElementById('modal-title').textContent = '🌳 Skill Tree';
  document.getElementById('modal-body').innerHTML = getSkillTreeContent();
  document.getElementById('app-modal').classList.remove('hidden');

  // Add skill tree styles and initialize canvas
  addSkillTreeStyles();
  setTimeout(() => initializeSkillTreeCanvas(), 100);
}

/**
 * Generate skill tree content
 */
function getSkillTreeContent() {
  return `
    <div class="skilltree-container">
      <div class="skilltree-header">
        <div class="skill-points-display">
          <div class="points-available">
            <span class="points-icon">⭐</span>
            <span class="points-text">Available Points: <strong>${playerSkillTree.availablePoints}</strong></span>
          </div>
          <div class="points-total">
            <span class="points-small">Total Earned: ${playerSkillTree.totalPointsEarned}</span>
          </div>
        </div>
        
        <div class="branch-legend">
          <div class="legend-item social">
            <span class="legend-color"></span>
            <span>Social Skills</span>
          </div>
          <div class="legend-item professional">
            <span class="legend-color"></span>
            <span>Professional</span>
          </div>
          <div class="legend-item personal">
            <span class="legend-color"></span>
            <span>Personal Growth</span>
          </div>
          <div class="legend-item special">
            <span class="legend-color"></span>
            <span>Mastery Skills</span>
          </div>
        </div>
      </div>

      <div class="skilltree-canvas-container">
        <canvas id="skilltree-canvas" width="700" height="300"></canvas>
        <div id="skill-tooltip" class="skill-tooltip hidden"></div>
      </div>

      <div class="skilltree-footer">
        <div class="footer-info">
          <p><strong>💡 How to earn skill points:</strong></p>
          <ul>
            <li>Complete story events (+2-3 points each)</li>
            <li>Level up (+1 point per level)</li>
            <li>Achieve major life milestones (+5 points)</li>
            <li>Build relationships and career success</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize the skill tree canvas for interactive visualization
 */
function initializeSkillTreeCanvas() {
  const canvas = document.getElementById('skilltree-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('skill-tooltip');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw connection lines first
  drawSkillConnections(ctx);
  
  // Draw skill nodes
  Object.values(SKILL_TREE).forEach(skill => {
    drawSkillNode(ctx, skill);
  });
  
  // Add canvas event listeners for interactivity
  canvas.addEventListener('mousemove', (event) => {
    handleCanvasMouseMove(event, canvas, tooltip);
  });
  
  canvas.addEventListener('click', (event) => {
    handleCanvasClick(event, canvas);
  });
  
  canvas.addEventListener('mouseleave', () => {
    tooltip.classList.add('hidden');
  });
}

/**
 * Draw connection lines between skills
 */
function drawSkillConnections(ctx) {
  Object.values(SKILL_TREE).forEach(skill => {
    skill.prerequisites.forEach(prereqId => {
      const prereq = SKILL_TREE[prereqId];
      if (prereq) {
        const isUnlocked = playerSkillTree.unlockedSkills.includes(skill.id);
        
        ctx.strokeStyle = isUnlocked ? '#28a745' : '#dee2e6';
        ctx.lineWidth = isUnlocked ? 3 : 2;
        ctx.setLineDash(isUnlocked ? [] : [5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(prereq.position.x + 25, prereq.position.y + 25);
        ctx.lineTo(skill.position.x + 25, skill.position.y + 25);
        ctx.stroke();
        
        ctx.setLineDash([]);
      }
    });
  });
}

/**
 * Draw individual skill node
 */
function drawSkillNode(ctx, skill) {
  const x = skill.position.x;
  const y = skill.position.y;
  const size = 50;
  
  const isUnlocked = playerSkillTree.unlockedSkills.includes(skill.id);
  const isMaxed = (playerSkillTree.skillLevels[skill.id] || 0) >= skill.maxLevel;
  const canUpgrade = isUnlocked && !isMaxed && playerSkillTree.availablePoints > 0;
  
  // Determine colors based on state
  let bgColor, borderColor, textColor;
  
  if (isMaxed) {
    bgColor = '#ffd700';
    borderColor = '#ffb300';
    textColor = '#333';
  } else if (isUnlocked) {
    bgColor = canUpgrade ? '#e8f5e8' : '#f8f9fa';
    borderColor = canUpgrade ? '#28a745' : '#6c757d';
    textColor = '#333';
  } else {
    bgColor = '#f1f3f4';
    borderColor = '#dee2e6';
    textColor = '#6c757d';
  }
  
  // Draw background circle
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.arc(x + 25, y + 25, 22, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Draw skill icon
  ctx.fillStyle = textColor;
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(skill.icon, x + 25, y + 32);
  
  // Draw skill level indicator
  const currentLevel = playerSkillTree.skillLevels[skill.id] || 0;
  if (currentLevel > 0) {
    ctx.fillStyle = '#007bff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(currentLevel.toString(), x + 40, y + 15);
  }
  
  // Draw unlock indicator for available skills
  if (!isUnlocked && canUnlockSkill(skill)) {
    ctx.fillStyle = '#ffc107';
    ctx.beginPath();
    ctx.arc(x + 40, y + 10, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('!', x + 40, y + 14);
  }
}

/**
 * Handle mouse movement over canvas for tooltips
 */
function handleCanvasMouseMove(event, canvas, tooltip) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  let hoveredSkill = null;
  
  Object.values(SKILL_TREE).forEach(skill => {
    const distance = Math.sqrt(
      Math.pow(mouseX - (skill.position.x + 25), 2) + 
      Math.pow(mouseY - (skill.position.y + 25), 2)
    );
    
    if (distance <= 25) {
      hoveredSkill = skill;
    }
  });
  
  if (hoveredSkill) {
    showSkillTooltip(tooltip, hoveredSkill, event.clientX, event.clientY);
  } else {
    tooltip.classList.add('hidden');
  }
}

/**
 * Handle canvas clicks for skill upgrades
 */
function handleCanvasClick(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  Object.values(SKILL_TREE).forEach(skill => {
    const distance = Math.sqrt(
      Math.pow(mouseX - (skill.position.x + 25), 2) + 
      Math.pow(mouseY - (skill.position.y + 25), 2)
    );
    
    if (distance <= 25) {
      attemptSkillUpgrade(skill.id);
    }
  });
}

/**
 * Show detailed tooltip for skill
 */
function showSkillTooltip(tooltip, skill, mouseX, mouseY) {
  const currentLevel = playerSkillTree.skillLevels[skill.id] || 0;
  const isUnlocked = playerSkillTree.unlockedSkills.includes(skill.id);
  const canUpgrade = isUnlocked && currentLevel < skill.maxLevel && playerSkillTree.availablePoints >= skill.cost;
  const canUnlock = !isUnlocked && canUnlockSkill(skill) && playerSkillTree.availablePoints >= skill.cost;
  
  let statusText = '';
  if (currentLevel >= skill.maxLevel) {
    statusText = '<span class="status-maxed">✨ MASTERED</span>';
  } else if (canUpgrade) {
    statusText = `<span class="status-available">⭐ Click to upgrade (${skill.cost} points)</span>`;
  } else if (canUnlock) {
    statusText = `<span class="status-available">🔓 Click to unlock (${skill.cost} points)</span>`;
  } else if (!isUnlocked) {
    statusText = '<span class="status-locked">🔒 Locked - Complete prerequisites first</span>';
  } else {
    statusText = `<span class="status-locked">Need ${skill.cost} skill points to upgrade</span>`;
  }
  
  tooltip.innerHTML = `
    <div class="tooltip-header">
      <span class="tooltip-icon">${skill.icon}</span>
      <span class="tooltip-title">${skill.name}</span>
      <span class="tooltip-level">Lv. ${currentLevel}/${skill.maxLevel}</span>
    </div>
    <div class="tooltip-description">${skill.description}</div>
    <div class="tooltip-effects">
      <strong>Effects:</strong> ${formatSkillEffects(skill.effects)}
    </div>
    <div class="tooltip-status">${statusText}</div>
    ${skill.prerequisites.length > 0 ? `
      <div class="tooltip-prereqs">
        <strong>Prerequisites:</strong> ${skill.prerequisites.map(id => SKILL_TREE[id].name).join(', ')}
      </div>
    ` : ''}
  `;
  
  tooltip.style.left = (mouseX + 10) + 'px';
  tooltip.style.top = (mouseY - 10) + 'px';
  tooltip.classList.remove('hidden');
}

/**
 * Attempt to upgrade or unlock a skill
 */
function attemptSkillUpgrade(skillId) {
  const skill = SKILL_TREE[skillId];
  if (!skill) return;
  
  const currentLevel = playerSkillTree.skillLevels[skillId] || 0;
  const isUnlocked = playerSkillTree.unlockedSkills.includes(skillId);
  
  // Check if we can unlock the skill
  if (!isUnlocked) {
    if (canUnlockSkill(skill) && playerSkillTree.availablePoints >= skill.cost) {
      unlockSkill(skillId);
      return;
    } else {
      showSkillMessage('Cannot unlock this skill yet. Complete prerequisites first.', 'error');
      return;
    }
  }
  
  // Check if we can upgrade the skill
  if (currentLevel >= skill.maxLevel) {
    showSkillMessage('This skill is already at maximum level!', 'info');
    return;
  }
  
  if (playerSkillTree.availablePoints < skill.cost) {
    showSkillMessage(`Need ${skill.cost} skill points to upgrade this skill.`, 'error');
    return;
  }
  
  upgradeSkill(skillId);
}

/**
 * Check if a skill can be unlocked
 */
function canUnlockSkill(skill) {
  return skill.prerequisites.every(prereqId => 
    playerSkillTree.unlockedSkills.includes(prereqId)
  );
}

/**
 * Unlock a new skill
 */
function unlockSkill(skillId) {
  const skill = SKILL_TREE[skillId];
  
  playerSkillTree.unlockedSkills.push(skillId);
  playerSkillTree.skillLevels[skillId] = 1;
  playerSkillTree.availablePoints -= skill.cost;
  
  // Unlock connected skills
  skill.unlocks.forEach(unlockedSkillId => {
    if (!playerSkillTree.unlockedSkills.includes(unlockedSkillId)) {
      const unlockedSkill = SKILL_TREE[unlockedSkillId];
      if (canUnlockSkill(unlockedSkill)) {
        // Make skill available for unlock (but don't auto-unlock)
      }
    }
  });
  
  // Apply skill effects to character
  applySkillEffects(skill);
  
  saveSkillTreeState();
  showSkillMessage(`Unlocked ${skill.name}! ${skill.description}`, 'success');
  
  // Refresh the canvas
  setTimeout(() => initializeSkillTreeCanvas(), 100);
}

/**
 * Upgrade an existing skill
 */
function upgradeSkill(skillId) {
  const skill = SKILL_TREE[skillId];
  
  playerSkillTree.skillLevels[skillId] = (playerSkillTree.skillLevels[skillId] || 0) + 1;
  playerSkillTree.availablePoints -= skill.cost;
  
  // Apply skill effects to character
  applySkillEffects(skill);
  
  saveSkillTreeState();
  showSkillMessage(`Upgraded ${skill.name}! Now level ${playerSkillTree.skillLevels[skillId]}.`, 'success');
  
  // Refresh the canvas
  setTimeout(() => initializeSkillTreeCanvas(), 100);
}

/**
 * Apply skill effects to character stats
 */
function applySkillEffects(skill) {
  const data = loadGameData();
  
  // Apply effects from skill.effects
  Object.entries(skill.effects).forEach(([stat, value]) => {
    switch (stat) {
      case 'happiness':
        data.happiness = Math.min(100, (data.happiness || 100) + value);
        break;
      case 'salary_bonus':
        data.salary = (data.salary || 0) * (1 + value / 100);
        break;
      case 'health':
        data.health = Math.min(100, (data.health || 100) + value);
        break;
      // Other stats are stored in story state for tracking
    }
  });
  
  // Update story state with character traits
  const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
  storyState.character_traits = storyState.character_traits || {};
  
  Object.entries(skill.effects).forEach(([trait, value]) => {
    if (['confidence', 'charisma', 'social_skills', 'assertiveness', 'leadership', 'patience', 'honesty_reputation'].includes(trait)) {
      storyState.character_traits[trait] = (storyState.character_traits[trait] || 0) + value;
    }
  });
  
  localStorage.setItem('smartSimStoryState', JSON.stringify(storyState));
  saveGameData(data);
}

/**
 * Update available skill points based on player progress
 */
function updateSkillPoints(data) {
  // Base points from level
  const levelPoints = data.level || 1;
  
  // Points from story events completed
  const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
  const storyPoints = (storyState.completed_events?.length || 0) * 2;
  
  // Bonus points for achievements and milestones
  const bonusPoints = calculateBonusPoints(data);
  
  const totalEarned = levelPoints + storyPoints + bonusPoints;
  const totalSpent = Object.values(playerSkillTree.skillLevels).reduce((sum, level) => sum + level, 0);
  
  playerSkillTree.totalPointsEarned = totalEarned;
  playerSkillTree.availablePoints = totalEarned - totalSpent;
}

/**
 * Calculate bonus points from achievements and milestones
 */
function calculateBonusPoints(data) {
  let bonus = 0;
  
  // Career milestones
  if (data.salary > 50) bonus += 2;
  if (data.salary > 100) bonus += 3;
  
  // Financial milestones
  if (data.bankBalance > 1000) bonus += 2;
  if (data.bankBalance > 10000) bonus += 5;
  
  // Life milestones
  if (data.house !== 'Parents Home') bonus += 3;
  if (data.vehicle !== 'Walking') bonus += 2;
  
  return bonus;
}

/**
 * Format skill effects for display
 */
function formatSkillEffects(effects) {
  return Object.entries(effects).map(([stat, value]) => {
    const displayName = stat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${displayName} +${value}`;
  }).join(', ');
}

/**
 * Show skill tree message
 */
function showSkillMessage(message, type = 'info') {
  // Create temporary message element
  const messageEl = document.createElement('div');
  messageEl.className = `skill-message skill-message-${type}`;
  messageEl.textContent = message;
  
  document.querySelector('.skilltree-container').appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 3000);
}

/**
 * Load skill tree state from localStorage
 */
function loadSkillTreeState() {
  const saved = localStorage.getItem('smartSimSkillTree');
  if (saved) {
    playerSkillTree = { ...playerSkillTree, ...JSON.parse(saved) };
  }
}

/**
 * Save skill tree state to localStorage
 */
function saveSkillTreeState() {
  localStorage.setItem('smartSimSkillTree', JSON.stringify(playerSkillTree));
}

/**
 * Add skill tree styles
 */
function addSkillTreeStyles() {
  const existingStyles = document.getElementById('skilltree-styles');
  if (existingStyles) existingStyles.remove();

  const style = document.createElement('style');
  style.id = 'skilltree-styles';
  style.textContent = `
    .skilltree-container {
      max-width: 750px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
    
    .skilltree-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    
    .skill-points-display {
      text-align: center;
      margin-bottom: 15px;
    }
    
    .points-available {
      font-size: 18px;
      margin-bottom: 5px;
    }
    
    .points-icon {
      font-size: 24px;
      margin-right: 10px;
    }
    
    .points-small {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .branch-legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
    }
    
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .legend-item.social .legend-color { background: #e3f2fd; border: 2px solid #2196f3; }
    .legend-item.professional .legend-color { background: #f3e5f5; border: 2px solid #9c27b0; }
    .legend-item.personal .legend-color { background: #e8f5e8; border: 2px solid #4caf50; }
    .legend-item.special .legend-color { background: #fff3e0; border: 2px solid #ff9800; }
    
    .skilltree-canvas-container {
      position: relative;
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    
    #skilltree-canvas {
      display: block;
      cursor: pointer;
    }
    
    .skill-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px;
      border-radius: 8px;
      max-width: 250px;
      font-size: 13px;
      z-index: 1000;
      pointer-events: none;
    }
    
    .skill-tooltip.hidden {
      display: none;
    }
    
    .tooltip-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .tooltip-icon {
      font-size: 16px;
    }
    
    .tooltip-title {
      flex: 1;
    }
    
    .tooltip-level {
      font-size: 11px;
      background: #007bff;
      padding: 2px 6px;
      border-radius: 10px;
    }
    
    .tooltip-description {
      margin-bottom: 8px;
      font-style: italic;
      color: #ccc;
    }
    
    .tooltip-effects {
      margin-bottom: 8px;
      color: #4caf50;
    }
    
    .tooltip-status {
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .status-available { color: #4caf50; }
    .status-locked { color: #f44336; }
    .status-maxed { color: #ffd700; }
    
    .tooltip-prereqs {
      font-size: 11px;
      color: #999;
    }
    
    .skilltree-footer {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }
    
    .footer-info h4 {
      margin: 0 0 10px 0;
      color: #495057;
    }
    
    .footer-info ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .footer-info li {
      margin-bottom: 4px;
      color: #6c757d;
    }
    
    .skill-message {
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 10px 15px;
      border-radius: 5px;
      font-weight: bold;
      z-index: 1001;
      animation: slideIn 0.3s ease;
    }
    
    .skill-message-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .skill-message-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .skill-message-info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @media (max-width: 600px) {
      .skilltree-container {
        padding: 10px;
      }
      
      #skilltree-canvas {
        width: 100%;
        height: auto;
      }
      
      .branch-legend {
        gap: 10px;
      }
      
      .legend-item {
        font-size: 12px;
      }
    }
  `;

  document.head.appendChild(style);
}

// Make functions globally accessible
window.openSkillTree = openSkillTree;