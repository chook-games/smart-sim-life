// relationships.js - Social mechanics and romance system

/**
 * Relationship Types and NPCs
 */
const RELATIONSHIP_TYPES = {
  ROMANTIC: 'romantic',
  FRIENDSHIP: 'friendship',
  FAMILY: 'family',
  PROFESSIONAL: 'professional'
};

const NPC_DATABASE = {
  alex_chen: {
    id: 'alex_chen',
    name: 'Alex Chen',
    gender: 'non-binary',
    age: 25,
    profession: 'Software Engineer',
    personality: ['confident', 'witty', 'ambitious'],
    interests: ['technology', 'gaming', 'travel'],
    appearance: '👤',
    relationship_preferences: ['romantic', 'friendship'],
    unlock_requirements: { min_confidence: 15, min_level: 3 }
  },
  sarah_martinez: {
    id: 'sarah_martinez',
    name: 'Sarah Martinez',
    gender: 'female',
    age: 28,
    profession: 'Doctor',
    personality: ['caring', 'intelligent', 'serious'],
    interests: ['medicine', 'books', 'hiking'],
    appearance: '👩‍⚕️',
    relationship_preferences: ['romantic', 'friendship'],
    unlock_requirements: { min_charisma: 20, min_level: 5 }
  },
  james_wilson: {
    id: 'james_wilson',
    name: 'James Wilson',
    gender: 'male',
    age: 26,
    profession: 'Artist',
    personality: ['creative', 'sensitive', 'passionate'],
    interests: ['art', 'music', 'nature'],
    appearance: '🎨',
    relationship_preferences: ['romantic', 'friendship'],
    unlock_requirements: { min_social_skills: 10, bankBalance: 500 }
  },
  emma_thompson: {
    id: 'emma_thompson',
    name: 'Emma Thompson',
    gender: 'female',
    age: 24,
    profession: 'Teacher',
    personality: ['kind', 'patient', 'optimistic'],
    interests: ['education', 'children', 'volunteering'],
    appearance: '👩‍🏫',
    relationship_preferences: ['romantic', 'friendship'],
    unlock_requirements: { min_honesty_reputation: 15, min_age: 22 }
  },
  mike_rodriguez: {
    id: 'mike_rodriguez',
    name: 'Mike Rodriguez',
    gender: 'male',
    age: 30,
    profession: 'Business Owner',
    personality: ['charismatic', 'driven', 'loyal'],
    interests: ['business', 'sports', 'networking'],
    appearance: '💼',
    relationship_preferences: ['friendship', 'professional'],
    unlock_requirements: { min_level: 4, has_job: true }
  }
};

/**
 * Player's relationship state
 */
let playerRelationships = {
  relationships: {},
  dating_status: 'single',
  marriage_status: 'single',
  social_events: [],
  recent_interactions: []
};

/**
 * Open relationships/social app
 */
function openRelationships() {
  const data = loadGameData();
  loadRelationshipState();

  document.getElementById('modal-title').textContent = '💕 Relationships';
  document.getElementById('modal-body').innerHTML = getRelationshipsContent(data);
  document.getElementById('app-modal').classList.remove('hidden');

  addRelationshipStyles();
}

/**
 * Generate relationships app content
 */
function getRelationshipsContent(data) {
  const availableNPCs = getAvailableNPCs(data);
  const currentRelationships = Object.values(playerRelationships.relationships);
  
  return `
    <div class="relationships-container">
      <!-- Current Relationship Status -->
      <div class="relationship-status-card">
        <h3>💫 Your Social Life</h3>
        <div class="status-grid">
          <div class="status-item">
            <span class="status-label">Relationship Status:</span>
            <span class="status-value ${playerRelationships.dating_status === 'single' ? 'single' : 'taken'}">${capitalizeFirst(playerRelationships.dating_status)}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Active Relationships:</span>
            <span class="status-value">${currentRelationships.length}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Social Level:</span>
            <span class="status-value">${calculateSocialLevel(data)}</span>
          </div>
        </div>
      </div>

      <!-- Current Relationships -->
      ${currentRelationships.length > 0 ? `
        <div class="current-relationships">
          <h3>👥 Your Relationships</h3>
          <div class="relationships-list">
            ${currentRelationships.map(rel => generateRelationshipCard(rel)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Available People to Meet -->
      <div class="available-people">
        <h3>🌟 People You Can Meet</h3>
        <div class="people-grid">
          ${availableNPCs.length > 0 ? 
            availableNPCs.map(npc => generateNPCCard(npc, data)).join('') :
            '<div class="no-people">No new people to meet right now. Improve your social skills and try new activities!</div>'
          }
        </div>
      </div>

      <!-- Social Activities -->
      <div class="social-activities">
        <h3>💃 Social Activities</h3>
        <div class="activities-grid">
          ${generateSocialActivities(data)}
        </div>
      </div>

      <!-- Romance Tips -->
      <div class="romance-tips">
        <h4>💡 Romance & Social Tips</h4>
        <ul>
          <li>Build confidence and charisma through story choices</li>
          <li>Meet people by participating in social activities</li>
          <li>Different people are attracted to different traits</li>
          <li>Maintain relationships through regular interaction</li>
          <li>Some relationships unlock special storylines</li>
        </ul>
      </div>
    </div>
  `;
}

/**
 * Generate NPC card for meeting new people
 */
function generateNPCCard(npc, data) {
  const canMeet = meetsNPCRequirements(npc, data);
  const meetCost = calculateMeetCost(npc);
  
  return `
    <div class="npc-card ${canMeet ? 'available' : 'locked'}">
      <div class="npc-avatar">${npc.appearance}</div>
      <div class="npc-info">
        <div class="npc-name">${npc.name}</div>
        <div class="npc-details">
          <div class="npc-age">${npc.age} years old</div>
          <div class="npc-profession">${npc.profession}</div>
        </div>
        <div class="npc-personality">
          ${npc.personality.map(trait => `<span class="trait">${trait}</span>`).join('')}
        </div>
        <div class="npc-interests">
          <strong>Interests:</strong> ${npc.interests.join(', ')}
        </div>
        
        ${canMeet ? `
          <button class="meet-btn" onclick="initiateNPCMeeting('${npc.id}')">
            Meet ${npc.name.split(' ')[0]} (€${meetCost})
          </button>
        ` : `
          <div class="requirements-block">
            <strong>Requirements:</strong>
            ${formatNPCRequirements(npc.unlock_requirements)}
          </div>
        `}
      </div>
    </div>
  `;
}

/**
 * Generate existing relationship card
 */
function generateRelationshipCard(relationship) {
  const npc = NPC_DATABASE[relationship.npc_id];
  const relationshipLevel = getRelationshipLevel(relationship.points);
  
  return `
    <div class="relationship-card ${relationship.type}">
      <div class="rel-header">
        <div class="rel-avatar">${npc.appearance}</div>
        <div class="rel-info">
          <div class="rel-name">${npc.name}</div>
          <div class="rel-type">${capitalizeFirst(relationship.type)}</div>
          <div class="rel-level">${relationshipLevel.name} (${relationship.points}/${relationshipLevel.nextThreshold || 'MAX'})</div>
        </div>
        <div class="rel-actions">
          <button class="interact-btn" onclick="interactWithNPC('${relationship.npc_id}', 'chat')">💬 Chat</button>
          ${relationship.type === 'romantic' && relationship.points >= 50 ? `
            <button class="interact-btn special" onclick="interactWithNPC('${relationship.npc_id}', 'date')">💕 Date</button>
          ` : ''}
        </div>
      </div>
      
      <div class="rel-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(relationship.points / (relationshipLevel.nextThreshold || 100)) * 100}%"></div>
        </div>
      </div>
      
      <div class="rel-description">
        ${getRelationshipDescription(relationship, npc)}
      </div>
    </div>
  `;
}

/**
 * Generate social activities
 */
function generateSocialActivities(data) {
  const activities = [
    {
      name: 'Coffee Shop Visit',
      cost: 15,
      description: 'Meet new people in a relaxed setting',
      effects: 'Social skills +2, Chance to meet someone',
      icon: '☕'
    },
    {
      name: 'Gym Membership',
      cost: 50,
      description: 'Stay fit and meet health-conscious people',
      effects: 'Health +5, Confidence +3, Meet fitness enthusiasts',
      icon: '💪'
    },
    {
      name: 'Art Gallery Opening',
      cost: 25,
      description: 'Cultural event for creative individuals',
      effects: 'Charisma +3, Meet artistic people',
      icon: '🎨',
      requirements: { min_level: 3 }
    },
    {
      name: 'Networking Event',
      cost: 75,
      description: 'Professional networking opportunity',
      effects: 'Professional contacts +2, Leadership +2',
      icon: '🤝',
      requirements: { has_job: true, min_confidence: 15 }
    }
  ];

  return activities.map(activity => {
    const canAfford = data.bankBalance >= activity.cost;
    const meetsReqs = !activity.requirements || meetsActivityRequirements(activity.requirements, data);
    const available = canAfford && meetsReqs;

    return `
      <div class="activity-card ${available ? 'available' : 'unavailable'}">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-info">
          <div class="activity-name">${activity.name}</div>
          <div class="activity-description">${activity.description}</div>
          <div class="activity-effects">${activity.effects}</div>
          <div class="activity-cost">Cost: €${activity.cost}</div>
          
          ${available ? `
            <button class="activity-btn" onclick="participateInActivity('${activity.name.toLowerCase().replace(/\s+/g, '_')}')">
              Participate
            </button>
          ` : `
            <div class="activity-unavailable">
              ${!canAfford ? 'Insufficient funds' : 'Requirements not met'}
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Initiate meeting with an NPC
 */
function initiateNPCMeeting(npcId) {
  const npc = NPC_DATABASE[npcId];
  const data = loadGameData();
  const meetCost = calculateMeetCost(npc);

  if (data.bankBalance < meetCost) {
    showRelationshipMessage('Not enough money to meet ' + npc.name, 'error');
    return;
  }

  // Deduct cost and create relationship
  data.bankBalance -= meetCost;
  
  const newRelationship = {
    npc_id: npcId,
    type: 'friendship',
    points: 10,
    date_met: data.day,
    last_interaction: data.day,
    interactions_count: 1
  };

  playerRelationships.relationships[npcId] = newRelationship;
  
  saveGameData(data);
  saveRelationshipState();
  
  showRelationshipMessage(`You met ${npc.name}! You hit it off and became friends.`, 'success');
  
  // Refresh the interface
  setTimeout(() => {
    openRelationships();
  }, 2000);
}

/**
 * Interact with an NPC
 */
function interactWithNPC(npcId, interactionType) {
  const npc = NPC_DATABASE[npcId];
  const relationship = playerRelationships.relationships[npcId];
  const data = loadGameData();

  if (!relationship) return;

  let pointsGained = 0;
  let cost = 0;
  let message = '';

  switch (interactionType) {
    case 'chat':
      pointsGained = Math.floor(Math.random() * 3) + 2; // 2-4 points
      cost = 5;
      message = `You had a great conversation with ${npc.name}!`;
      break;
      
    case 'date':
      pointsGained = Math.floor(Math.random() * 5) + 5; // 5-9 points
      cost = 50;
      message = `You went on a wonderful date with ${npc.name}!`;
      data.happiness = Math.min(100, (data.happiness || 100) + 5);
      break;
  }

  if (data.bankBalance < cost) {
    showRelationshipMessage('Not enough money for this interaction', 'error');
    return;
  }

  // Apply interaction effects
  data.bankBalance -= cost;
  relationship.points += pointsGained;
  relationship.last_interaction = data.day;
  relationship.interactions_count++;

  // Check for relationship progression
  checkRelationshipProgression(relationship, npc);

  saveGameData(data);
  saveRelationshipState();
  
  showRelationshipMessage(`${message} (+${pointsGained} relationship points)`, 'success');
  
  // Refresh the interface
  setTimeout(() => {
    openRelationships();
  }, 1500);
}

/**
 * Participate in social activity
 */
function participateInActivity(activityKey) {
  const data = loadGameData();
  const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
  
  // Activity effects based on type
  const activityEffects = {
    coffee_shop_visit: {
      cost: 15,
      effects: { social_skills: 2 },
      meetChance: 0.3,
      message: 'You enjoyed coffee and met some interesting people!'
    },
    gym_membership: {
      cost: 50,
      effects: { confidence: 3 },
      healthBonus: 5,
      meetChance: 0.4,
      message: 'Great workout! You feel stronger and more confident.'
    },
    art_gallery_opening: {
      cost: 25,
      effects: { charisma: 3 },
      meetChance: 0.5,
      message: 'The art exhibition was inspiring and you met creative people.'
    },
    networking_event: {
      cost: 75,
      effects: { leadership: 2 },
      professionalBonus: true,
      meetChance: 0.6,
      message: 'Excellent networking! You made valuable professional connections.'
    }
  };

  const activity = activityEffects[activityKey];
  if (!activity || data.bankBalance < activity.cost) return;

  // Apply activity effects
  data.bankBalance -= activity.cost;
  
  if (activity.healthBonus) {
    data.health = Math.min(100, (data.health || 100) + activity.healthBonus);
  }

  // Update character traits
  if (!storyState.character_traits) storyState.character_traits = {};
  
  Object.entries(activity.effects).forEach(([trait, value]) => {
    storyState.character_traits[trait] = (storyState.character_traits[trait] || 0) + value;
  });

  // Random chance to meet someone new
  if (Math.random() < activity.meetChance) {
    const availableNPCs = getAvailableNPCs(data);
    if (availableNPCs.length > 0) {
      const randomNPC = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
      // Auto-meet at lower cost
      const newRelationship = {
        npc_id: randomNPC.id,
        type: 'friendship',
        points: 15,
        date_met: data.day,
        last_interaction: data.day,
        interactions_count: 1
      };
      playerRelationships.relationships[randomNPC.id] = newRelationship;
      activity.message += ` You also met ${randomNPC.name}!`;
    }
  }

  localStorage.setItem('smartSimStoryState', JSON.stringify(storyState));
  saveGameData(data);
  saveRelationshipState();
  
  showRelationshipMessage(activity.message, 'success');
  
  // Refresh interface
  setTimeout(() => {
    openRelationships();
  }, 2000);
}

/**
 * Helper functions
 */

function getAvailableNPCs(data) {
  const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
  const traits = storyState.character_traits || {};
  
  return Object.values(NPC_DATABASE).filter(npc => {
    if (playerRelationships.relationships[npc.id]) return false;
    return meetsNPCRequirements(npc, data, traits);
  });
}

function meetsNPCRequirements(npc, data, traits = null) {
  try {
    if (!npc || !data || typeof npc !== 'object' || typeof data !== 'object') {
      return false;
    }
    
    if (!traits) {
      const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
      traits = storyState.character_traits || {};
    }
    
    const requirements = npc.unlock_requirements || {};
    
    return Object.entries(requirements).every(([req, value]) => {
      switch (req) {
        case 'min_level': return (data.level || 0) >= value;
        case 'min_age': return (data.age || 0) >= value;
        case 'bankBalance': return (data.bankBalance || 0) >= value;
        case 'has_job': return value ? (data.profession && data.profession !== 'Unemployed') : true;
        case 'min_confidence': return (traits.confidence || 0) >= value;
        case 'min_charisma': return (traits.charisma || 0) >= value;
        case 'min_social_skills': return (traits.social_skills || 0) >= value;
        case 'min_honesty_reputation': return (traits.honesty_reputation || 0) >= value;
        default: return true;
      }
    });
  } catch (error) {
    console.error('Error in meetsNPCRequirements:', error);
    return false;
  }
}

function calculateMeetCost(npc) {
  return Math.floor(25 + (npc.age * 0.5) + (npc.personality.length * 5));
}

function calculateSocialLevel(data) {
  const relationshipCount = Object.keys(playerRelationships.relationships).length;
  const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
  const socialSkills = (storyState.character_traits?.social_skills || 0);
  const charisma = (storyState.character_traits?.charisma || 0);
  
  const level = Math.floor((relationshipCount * 10 + socialSkills + charisma) / 15);
  
  if (level >= 10) return 'Social Butterfly';
  if (level >= 7) return 'Popular';
  if (level >= 4) return 'Sociable';
  if (level >= 2) return 'Friendly';
  return 'Introvert';
}

function getRelationshipLevel(points) {
  if (points >= 100) return { name: 'Soulmate', nextThreshold: null };
  if (points >= 80) return { name: 'Deep Love', nextThreshold: 100 };
  if (points >= 60) return { name: 'In Love', nextThreshold: 80 };
  if (points >= 40) return { name: 'Dating', nextThreshold: 60 };
  if (points >= 25) return { name: 'Close Friend', nextThreshold: 40 };
  if (points >= 10) return { name: 'Friend', nextThreshold: 25 };
  return { name: 'Acquaintance', nextThreshold: 10 };
}

function getRelationshipDescription(relationship, npc) {
  const level = getRelationshipLevel(relationship.points);
  const daysSince = (loadGameData().day || 1) - relationship.last_interaction;
  
  let description = `You've been ${level.name.toLowerCase()} for ${relationship.interactions_count} interactions. `;
  
  if (daysSince > 7) {
    description += "It's been a while since you last spoke.";
  } else if (daysSince > 3) {
    description += "You should catch up soon.";
  } else {
    description += "Your relationship is going well!";
  }
  
  return description;
}

function checkRelationshipProgression(relationship, npc) {
  // Check if friendship can become romantic
  if (relationship.type === 'friendship' && relationship.points >= 30) {
    if (npc.relationship_preferences.includes('romantic') && Math.random() < 0.4) {
      relationship.type = 'romantic';
      playerRelationships.dating_status = 'dating';
      showRelationshipMessage(`Your relationship with ${npc.name} has become romantic! 💕`, 'special');
    }
  }
  
  // Check for marriage possibility
  if (relationship.type === 'romantic' && relationship.points >= 100) {
    if (Math.random() < 0.3) {
      // Marriage proposal event could be triggered here
      showRelationshipMessage(`${npc.name} seems ready for the next step in your relationship...`, 'special');
    }
  }
}

function meetsActivityRequirements(requirements, data) {
  try {
    const storyState = JSON.parse(localStorage.getItem('smartSimStoryState') || '{}');
    const traits = storyState.character_traits || {};
    
    if (!requirements || typeof requirements !== 'object') return true;
    if (!data || typeof data !== 'object') return false;
    
    return Object.entries(requirements).every(([req, value]) => {
      switch (req) {
        case 'min_level': return (data.level || 0) >= value;
        case 'has_job': return value ? (data.profession && data.profession !== 'Unemployed') : true;
        case 'min_confidence': return (traits.confidence || 0) >= value;
        default: return true;
      }
    });
  } catch (error) {
    console.error('Error in meetsActivityRequirements:', error);
    return false;
  }
}

function formatNPCRequirements(requirements) {
  try {
    if (!requirements || typeof requirements !== 'object') return '';
    
    return Object.entries(requirements).map(([req, value]) => {
      switch (req) {
        case 'min_level': return `Level ${value}+`;
        case 'min_age': return `Age ${value}+`;
        case 'bankBalance': return `€${value}+ in bank`;
        case 'has_job': return 'Have a job';
        case 'min_confidence': return `Confidence ${value}+`;
        case 'min_charisma': return `Charisma ${value}+`;
        case 'min_social_skills': return `Social Skills ${value}+`;
        case 'min_honesty_reputation': return `Honesty ${value}+`;
        default: return `${req}: ${value}`;
      }
    }).join(', ');
  } catch (error) {
    console.error('Error in formatNPCRequirements:', error);
    return '';
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showRelationshipMessage(message, type = 'info') {
  const messageEl = document.createElement('div');
  messageEl.className = `relationship-message relationship-message-${type}`;
  messageEl.textContent = message;
  
  document.querySelector('.relationships-container').appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, 4000);
}

function loadRelationshipState() {
  const saved = localStorage.getItem('smartSimRelationships');
  if (saved) {
    playerRelationships = { ...playerRelationships, ...JSON.parse(saved) };
  }
}

function saveRelationshipState() {
  localStorage.setItem('smartSimRelationships', JSON.stringify(playerRelationships));
}

function addRelationshipStyles() {
  const existingStyles = document.getElementById('relationship-styles');
  if (existingStyles) existingStyles.remove();

  const style = document.createElement('style');
  style.id = 'relationship-styles';
  style.textContent = `
    .relationships-container {
      max-width: 700px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
    
    .relationship-status-card {
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      color: white;
      padding: 20px;
      border-radius: 15px;
      margin-bottom: 20px;
    }
    
    .status-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
      margin-top: 15px;
    }
    
    .status-item {
      text-align: center;
    }
    
    .status-label {
      display: block;
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    
    .status-value {
      font-weight: bold;
      font-size: 16px;
    }
    
    .status-value.single { color: #fff; }
    .status-value.taken { color: #ff9ff3; }
    
    .current-relationships,
    .available-people,
    .social-activities {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    
    .relationships-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .relationship-card {
      background: white;
      border-radius: 10px;
      padding: 15px;
      border-left: 4px solid #007bff;
    }
    
    .relationship-card.romantic {
      border-left-color: #e91e63;
      background: linear-gradient(90deg, #fff 0%, #fce4ec 100%);
    }
    
    .rel-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
    }
    
    .rel-avatar {
      font-size: 32px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      border-radius: 50%;
    }
    
    .rel-info {
      flex: 1;
    }
    
    .rel-name {
      font-weight: bold;
      font-size: 18px;
      color: #333;
    }
    
    .rel-type {
      color: #666;
      font-size: 14px;
    }
    
    .rel-level {
      font-size: 12px;
      color: #888;
    }
    
    .rel-actions {
      display: flex;
      gap: 10px;
    }
    
    .interact-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .interact-btn.special {
      background: #e91e63;
    }
    
    .interact-btn:hover {
      opacity: 0.9;
    }
    
    .rel-progress {
      margin: 10px 0;
    }
    
    .progress-bar {
      width: 100%;
      height: 6px;
      background: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #007bff, #28a745);
      transition: width 0.3s ease;
    }
    
    .rel-description {
      font-size: 13px;
      color: #666;
      font-style: italic;
    }
    
    .people-grid,
    .activities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;
    }
    
    .npc-card {
      background: white;
      border-radius: 10px;
      padding: 15px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
    }
    
    .npc-card.available {
      border-color: #28a745;
    }
    
    .npc-card.available:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }
    
    .npc-card.locked {
      opacity: 0.7;
      border-color: #dc3545;
    }
    
    .npc-avatar {
      font-size: 40px;
      text-align: center;
      margin-bottom: 10px;
    }
    
    .npc-name {
      font-weight: bold;
      font-size: 18px;
      text-align: center;
      margin-bottom: 8px;
      color: #333;
    }
    
    .npc-details {
      text-align: center;
      margin-bottom: 10px;
      color: #666;
    }
    
    .npc-age,
    .npc-profession {
      font-size: 13px;
    }
    
    .npc-personality {
      display: flex;
      gap: 5px;
      justify-content: center;
      margin: 10px 0;
      flex-wrap: wrap;
    }
    
    .trait {
      background: #e3f2fd;
      color: #1976d2;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
    }
    
    .npc-interests {
      font-size: 12px;
      color: #666;
      margin: 10px 0;
      text-align: center;
    }
    
    .meet-btn {
      width: 100%;
      background: #28a745;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .meet-btn:hover {
      background: #218838;
    }
    
    .requirements-block {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 8px;
      border-radius: 5px;
      font-size: 12px;
      color: #856404;
    }
    
    .activity-card {
      background: white;
      border-radius: 10px;
      padding: 15px;
      border: 2px solid #e9ecef;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .activity-card.available {
      border-color: #17a2b8;
    }
    
    .activity-card.unavailable {
      opacity: 0.6;
    }
    
    .activity-icon {
      font-size: 32px;
      width: 60px;
      text-align: center;
    }
    
    .activity-info {
      flex: 1;
    }
    
    .activity-name {
      font-weight: bold;
      margin-bottom: 5px;
      color: #333;
    }
    
    .activity-description {
      font-size: 13px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .activity-effects {
      font-size: 12px;
      color: #28a745;
      margin-bottom: 5px;
    }
    
    .activity-cost {
      font-size: 12px;
      color: #dc3545;
      font-weight: bold;
    }
    
    .activity-btn {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 8px;
    }
    
    .activity-unavailable {
      color: #dc3545;
      font-size: 12px;
      font-style: italic;
      margin-top: 8px;
    }
    
    .no-people {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 40px;
      background: white;
      border-radius: 10px;
      border: 2px dashed #dee2e6;
    }
    
    .romance-tips {
      background: #e8f4f8;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #17a2b8;
    }
    
    .romance-tips ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .romance-tips li {
      margin-bottom: 5px;
      font-size: 14px;
      color: #495057;
    }
    
    .relationship-message {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 5px;
      font-weight: bold;
      z-index: 1001;
      max-width: 300px;
      animation: slideInMessage 0.3s ease;
    }
    
    .relationship-message-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .relationship-message-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .relationship-message-special {
      background: #fce4ec;
      color: #880e4f;
      border: 1px solid #f8bbd9;
    }
    
    @keyframes slideInMessage {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @media (max-width: 600px) {
      .relationships-container {
        padding: 10px;
      }
      
      .status-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .people-grid,
      .activities-grid {
        grid-template-columns: 1fr;
      }
      
      .activity-card {
        flex-direction: column;
        text-align: center;
      }
      
      .rel-header {
        flex-direction: column;
        text-align: center;
      }
    }
  `;

  document.head.appendChild(style);
}

// Make function globally accessible
window.openRelationships = openRelationships;
window.initiateNPCMeeting = initiateNPCMeeting;
window.interactWithNPC = interactWithNPC;
window.participateInActivity = participateInActivity;