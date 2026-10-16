/**
 * Story Branching System - Interactive narrative events
 * Integrates with new day popup for immersive storytelling
 */

// Story Event Database - Each event has conditions, choices, and consequences
const STORY_EVENTS = {
  // Early Game Events (Days 1-30)
  childhood_friend: {
    id: 'childhood_friend',
    title: 'Childhood Friend',
    day_range: [3, 10],
    conditions: { min_age: 18, max_age: 25 },
    description: "You bump into your childhood friend Alex at a coffee shop. They seem different - more confident, well-dressed. You haven't spoken in years.",
    choices: [
      {
        text: "Approach and catch up",
        consequences: { happiness: 15, social_skills: 5 },
        next_event: 'friend_job_offer',
        story_branch: 'social_path'
      },
      {
        text: "Just nod and leave quickly",
        consequences: { happiness: -5 },
        story_branch: 'introvert_path'
      },
      {
        text: "Pretend you didn't see them",
        consequences: { confidence: -10, anxiety: 5 },
        story_branch: 'avoidant_path'
      }
    ]
  },

  first_job_interview: {
    id: 'first_job_interview',
    title: 'The Interview',
    day_range: [5, 15],
    conditions: { profession: 'Unemployed', job_applications: 1 },
    description: "You're sitting in the waiting room for your first real job interview. Your palms are sweaty, and the interviewer calls your name.",
    choices: [
      {
        text: "Take a deep breath and be confident",
        consequences: { confidence: 10, interview_success_chance: 25 },
        requirements: { confidence: 30 }
      },
      {
        text: "Be honest about your nervousness",
        consequences: { honesty_reputation: 10, interview_success_chance: 15 }
      },
      {
        text: "Try to impress with exaggerated experience",
        consequences: { confidence: 5, honesty_reputation: -15, interview_success_chance: 20 }
      }
    ]
  },

  mysterious_envelope: {
    id: 'mysterious_envelope',
    title: 'Mysterious Inheritance',
    day_range: [20, 40],
    conditions: { min_level: 2 },
    description: "A lawyer contacts you about a distant relative you never knew. They've left you something in their will, but you must choose what to inherit.",
    choices: [
      {
        text: "Take the €5,000 cash inheritance",
        consequences: { bankBalance: 5000, family_mystery: 0 }
      },
      {
        text: "Take the old family house (needs renovation)",
        consequences: { property: 'old_family_house', family_mystery: 1 },
        unlocks: 'renovation_storyline'
      },
      {
        text: "Take the box of family documents",
        consequences: { family_mystery: 3, family_secrets: 1 },
        unlocks: 'family_history_storyline'
      }
    ]
  },

  // Romance Events
  coffee_shop_meet: {
    id: 'coffee_shop_meet',
    title: 'Coffee Shop Encounter',
    day_range: [15, 60],
    conditions: { relationship_status: 'single', happiness: 40 },
    description: "While ordering your usual coffee, you notice someone reading your favorite book. They catch you looking and smile.",
    choices: [
      {
        text: "Start a conversation about the book",
        consequences: { confidence: 5, potential_romance: 'bookworm_partner' },
        story_branch: 'intellectual_romance'
      },
      {
        text: "Compliment their taste and introduce yourself",
        consequences: { charisma: 5, potential_romance: 'bookworm_partner' },
        story_branch: 'charming_romance'
      },
      {
        text: "Smile back but don't approach",
        consequences: { shyness: 5 }
      }
    ]
  },

  // Career Events
  workplace_drama: {
    id: 'workplace_drama',
    title: 'Office Politics',
    day_range: [30, 90],
    conditions: { has_job: true, work_experience: 30 },
    description: "You discover your coworker is taking credit for your ideas in meetings. Your boss seems impressed with their 'work'.",
    choices: [
      {
        text: "Confront your coworker directly",
        consequences: { assertiveness: 10, workplace_tension: 15 },
        story_branch: 'confrontational_career'
      },
      {
        text: "Document everything and report to HR",
        consequences: { caution: 10, workplace_reputation: 5 },
        story_branch: 'methodical_career'
      },
      {
        text: "Start looking for a new job",
        consequences: { independence: 10, job_search_motivation: 20 },
        story_branch: 'mobile_career'
      },
      {
        text: "Do nothing and focus on your own work",
        consequences: { patience: 5, workplace_tension: -5, missed_opportunities: 1 }
      }
    ]
  },

  // Life-changing Events
  startup_opportunity: {
    id: 'startup_opportunity',
    title: 'Startup Proposal',
    day_range: [60, 200],
    conditions: { min_level: 4, bankBalance: 1000, has_job: true },
    description: "A tech-savvy friend approaches you with a business idea. They need a partner and €10,000 to get started. It could make you rich... or broke.",
    choices: [
      {
        text: "Invest and become a co-founder",
        consequences: { bankBalance: -10000, business_venture: 1, stress: 20 },
        unlocks: 'entrepreneur_storyline',
        requirements: { bankBalance: 10000 }
      },
      {
        text: "Offer to help part-time for equity",
        consequences: { business_venture: 0.5, time_pressure: 10 },
        story_branch: 'side_hustle_path'
      },
      {
        text: "Politely decline and wish them luck",
        consequences: { missed_opportunities: 1, safety: 10 }
      }
    ]
  }
};

// Story state tracking
let playerStoryState = {
  completed_events: [],
  active_storylines: [],
  story_branches: [],
  character_traits: {},
  relationship_status: 'single',
  life_path: 'balanced'
};

/**
 * Load story state from localStorage
 */
function loadStoryState() {
  const saved = localStorage.getItem('smartSimStoryState');
  if (saved) {
    window.playerStoryState = JSON.parse(saved);
  } else {
    window.playerStoryState = {
      completed_events: [],
      character_traits: {
        confidence: 0,
        social_skills: 0,
        assertiveness: 0,
        charisma: 0,
        honesty_reputation: 0
      },
      story_branches: [],
      active_storylines: [],
      relationship_status: 'single'
    };
  }
}

/**
 * Check if a story event should trigger on this day
 */
function checkForStoryEvent(data) {
  // Load story state first
  loadStoryState();
  
  console.log(`Checking story event for day ${data.day}, playerStoryState:`, window.playerStoryState);
  
  // Show story events every 5 days for better pacing
  if (data.day % 5 !== 0) {
    console.log('Not a story day');
    return null; // Only on days 5, 10, 15, etc.
  }
  
  // Don't repeat events
  const available_events = Object.values(STORY_EVENTS).filter(event => {
    if (window.playerStoryState.completed_events.includes(event.id)) {
      console.log(`Event ${event.id} already completed`);
      return false;
    }
    
    // Check day range
    if (data.day < event.day_range[0] || data.day > event.day_range[1]) return false;
    
    // Check conditions
    if (event.conditions) {
      for (const [key, value] of Object.entries(event.conditions)) {
        switch (key) {
          case 'min_age':
            if (data.age < value) return false;
            break;
          case 'max_age':
            if (data.age > value) return false;
            break;
          case 'min_level':
            if (data.level < value) return false;
            break;
          case 'profession':
            if (data.profession !== value) return false;
            break;
          case 'has_job':
            if (value && (!data.profession || data.profession === 'Unemployed')) return false;
            break;
          case 'bankBalance':
            if (data.bankBalance < value) return false;
            break;
          case 'happiness':
            if (data.happiness < value) return false;
            break;
          case 'relationship_status':
            if (playerStoryState.relationship_status !== value) return false;
            break;
        }
      }
    }
    
    return true;
  });
  
  console.log(`Available story events: ${available_events.length}`, available_events.map(e => e.id));
  
  if (available_events.length === 0) {
    console.log('No available story events');
    return null;
  }
  
  // Return random available event
  const selectedEvent = available_events[Math.floor(Math.random() * available_events.length)];
  console.log('Selected story event:', selectedEvent.id);
  return selectedEvent;
}

/**
 * Apply consequences of a story choice
 */
function applyStoryConsequences(choice, data) {
  if (!choice.consequences) return;
  
  for (const [key, value] of Object.entries(choice.consequences)) {
    switch (key) {
      case 'happiness':
        data.happiness = Math.max(0, Math.min(100, (data.happiness || 100) + value));
        break;
      case 'health':
        data.health = Math.max(0, Math.min(100, (data.health || 100) + value));
        break;
      case 'bankBalance':
        data.bankBalance = Math.max(0, data.bankBalance + value);
        break;
      case 'confidence':
      case 'social_skills':
      case 'assertiveness':
      case 'charisma':
        // Track character traits
        playerStoryState.character_traits[key] = (playerStoryState.character_traits[key] || 0) + value;
        break;
      default:
        // Store other consequences for future reference
        data[key] = (data[key] || 0) + value;
    }
  }
  
  // Track story branches and unlocks
  if (choice.story_branch) {
    if (!playerStoryState.story_branches.includes(choice.story_branch)) {
      playerStoryState.story_branches.push(choice.story_branch);
    }
  }
  
  if (choice.unlocks) {
    if (!playerStoryState.active_storylines.includes(choice.unlocks)) {
      playerStoryState.active_storylines.push(choice.unlocks);
    }
  }
}

/**
 * Initialize story system
 */
if (typeof playerStoryState === 'undefined') {
  window.playerStoryState = {
    completed_events: [],
    character_traits: {
      confidence: 0,
      social_skills: 0,
      assertiveness: 0,
      charisma: 0,
      honesty_reputation: 0
    },
    story_branches: [],
    active_storylines: [],
    relationship_status: 'single'
  };
}

/**
 * Generate HTML for story event choices
 */
function generateStoryChoicesHTML(event) {
  let html = '';
  
  event.choices.forEach((choice, index) => {
    const disabled = choice.requirements && !meetsRequirements(choice.requirements) ? 'disabled' : '';
    const disabledStyle = disabled ? 'opacity: 0.5; cursor: not-allowed;' : '';
    const clickHandler = disabled ? '' : `window.makeStoryChoice(${index}); return false;`;
    
    html += `
      <div class="story-choice" 
           onclick="${clickHandler}" 
           style="background: white; border: 2px solid #007bff; border-radius: 10px; padding: 15px; margin: 10px 0; cursor: ${disabled ? 'not-allowed' : 'pointer'}; transition: all 0.3s; ${disabledStyle}"
           onmouseover="${disabled ? '' : 'this.style.background=\'#f8f9fa\'; this.style.borderColor=\'#0056b3\''}"
           onmouseout="${disabled ? '' : 'this.style.background=\'white\'; this.style.borderColor=\'#007bff\''}">
        <div style="font-weight: bold; color: #495057; margin-bottom: 5px;">${choice.text}</div>
        ${choice.requirements ? `<div style="font-size: 12px; color: #6c757d;">Requires: ${formatRequirements(choice.requirements)}</div>` : ''}
        ${choice.consequences ? `<div style="font-size: 12px; color: #28a745;">Effects: ${formatConsequences(choice.consequences)}</div>` : ''}
      </div>
    `;
  });
  
  return html;
}

function meetsRequirements(requirements) {
  const data = loadGameData();
  for (const [key, value] of Object.entries(requirements)) {
    switch (key) {
      case 'confidence':
        if ((playerStoryState.character_traits.confidence || 0) < value) return false;
        break;
      case 'bankBalance':
        if (data.bankBalance < value) return false;
        break;
    }
  }
  return true;
}

function formatRequirements(requirements) {
  return Object.entries(requirements).map(([key, value]) => {
    switch (key) {
      case 'confidence': return `${value} confidence`;
      case 'bankBalance': return `€${value}`;
      default: return `${key}: ${value}`;
    }
  }).join(', ');
}

function formatConsequences(consequences) {
  return Object.entries(consequences).map(([key, value]) => {
    const sign = value > 0 ? '+' : '';
    switch (key) {
      case 'happiness': return `${sign}${value}% happiness`;
      case 'health': return `${sign}${value}% health`;
      case 'bankBalance': return `${sign}€${value}`;
      case 'confidence': return `${sign}${value} confidence`;
      case 'social_skills': return `${sign}${value} social skills`;
      default: return `${key} ${sign}${value}`;
    }
  }).join(', ');
}

// Global variables for current story event
window.currentStoryEvent = null;

/**
 * Make a story choice and apply consequences
 */
function makeStoryChoice(choiceIndex) {
  console.log('Story choice clicked:', choiceIndex);
  if (!window.currentStoryEvent) {
    console.error('No current story event found');
    return;
  }
  
  const choice = window.currentStoryEvent.choices[choiceIndex];
  const data = loadGameData();
  
  // Apply consequences
  applyStoryConsequences(choice, data);
  
  // Mark event as completed
  playerStoryState.completed_events.push(window.currentStoryEvent.id);
  
  // Save story state
  localStorage.setItem('smartSimStoryState', JSON.stringify(playerStoryState));
  
  // Save game data
  saveGameData(data);
  
  // Show result and continue to regular new day popup
  showStoryChoiceResult(choice, data);
}

/**
 * Show the result of a story choice
 */
function showStoryChoiceResult(choice, data) {
  let resultHTML = `
    <div style="text-align: center; padding: 20px;">
      <h3 style="color: #28a745; margin-bottom: 15px;">✓ Choice Made</h3>
      <p style="margin-bottom: 15px;">"${choice.text}"</p>
  `;
  
  if (choice.consequences) {
    resultHTML += `<p style="color: #6c757d; font-size: 14px;">Effects: ${formatConsequences(choice.consequences)}</p>`;
  }
  
  resultHTML += `
      <button onclick="continueToNewDay()" 
              style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 15px;">
        Continue Your Day
      </button>
    </div>
  `;
  
  document.getElementById('modal-body').innerHTML = resultHTML;
}

/**
 * Continue to the regular new day popup after story choice
 */
function continueToNewDay() {
  // Close current modal
  closeModal();
  
  // Small delay then show regular new day popup
  setTimeout(() => {
    showNewDayPopup();
  }, 300);
}

/**
 * Load story state from localStorage
 */
function loadStoryState() {
  const saved = localStorage.getItem('smartSimStoryState');
  if (saved) {
    playerStoryState = { ...playerStoryState, ...JSON.parse(saved) };
  }
}

/**
 * Initialize story system
 */
function initializeStorySystem() {
  loadStoryState();
}

// Export functions for global access
window.checkForStoryEvent = checkForStoryEvent;
window.generateStoryChoicesHTML = generateStoryChoicesHTML;
window.makeStoryChoice = makeStoryChoice;
window.continueToNewDay = continueToNewDay;
window.initializeStorySystem = initializeStorySystem;
window.playerStoryState = playerStoryState;

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeStorySystem);