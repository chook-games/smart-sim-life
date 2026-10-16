// events.js - Enhanced events system

function openDailyEvents() {
    document.getElementById('modal-title').textContent = '📅 Daily Events';
    document.getElementById('modal-body').innerHTML = getDailyEventsContent();
    document.getElementById('app-modal').classList.remove('hidden');
}

/**
 * Get daily events content - only regular daily events
 */
function getDailyEventsContent() {
    const data = loadGameData();
    return getRegularDailyEventContent(data);
}



/**
 * Generate story event content for the daily events app
 */
function getStoryEventContent(event) {
    return `
        <div class="story-event-container">
            <div class="story-header">
                <div class="story-icon">📖</div>
                <h2>${event.title}</h2>
                <div class="story-type">Life Story Event</div>
            </div>
            
            <div class="story-description">
                <p>${event.description}</p>
            </div>
            
            <div class="story-choices">
                <h4>What do you choose?</h4>
                ${generateStoryChoicesHTML(event)}
            </div>
        </div>
        
        <style>
            .story-event-container {
                max-width: 600px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
            }
            
            .story-header {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                margin-bottom: 25px;
            }
            
            .story-icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
            
            .story-header h2 {
                margin: 0 0 10px 0;
                font-size: 28px;
            }
            
            .story-type {
                font-size: 14px;
                opacity: 0.9;
                background: rgba(255,255,255,0.2);
                padding: 5px 15px;
                border-radius: 20px;
                display: inline-block;
            }
            
            .story-description {
                background: #f8f9fa;
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
                border-left: 4px solid #667eea;
            }
            
            .story-description p {
                font-size: 16px;
                line-height: 1.6;
                color: #495057;
                margin: 0;
            }
            
            .story-choices h4 {
                color: #495057;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .choice-button {
                width: 100%;
                background: white;
                border: 2px solid #e9ecef;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                display: block;
                font-size: 16px;
                color: #495057;
            }
            
            .choice-button:hover {
                border-color: #667eea;
                background: #f8f9fa;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
            }
            
            .choice-button:active {
                transform: translateY(0);
            }
            
            .choice-requirements {
                font-size: 12px;
                color: #dc3545;
                font-style: italic;
                margin-top: 8px;
            }
            
            .choice-consequences {
                font-size: 12px;
                color: #28a745;
                margin-top: 8px;
            }
        </style>
    `;
}

/**
 * Generate regular daily event content  
 */
function getRegularDailyEventContent(data) {
    // Get today's random event
    const dailyEvent = generateDailyEvent(data);
    
    return `
        <div class="daily-event-container">
            <div class="daily-header">
                <div class="daily-icon">${dailyEvent.icon}</div>
                <h2>Daily Event</h2>
                <div class="daily-date">Day ${data.day}</div>
            </div>
            
            <div class="daily-content">
                <h3>${dailyEvent.title}</h3>
                <p>${dailyEvent.description}</p>
                
                ${dailyEvent.choices ? `
                    <div class="daily-choices">
                        <h4>What do you do?</h4>
                        ${dailyEvent.choices.map((choice, index) => `
                            <button class="daily-choice-btn" onclick="handleDailyChoice(${index}, '${dailyEvent.id}')">
                                ${choice.text}
                                ${choice.cost ? ` (€${choice.cost})` : ''}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="recent-events">
                <h4>Recent Life Events</h4>
                <div class="events-summary">
                    ${getRecentEventsSummary(data)}
                </div>
            </div>
        </div>
        
        <style>
            .daily-event-container {
                max-width: 600px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
            }
            
            .daily-header {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                margin-bottom: 25px;
            }
            
            .daily-icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
            
            .daily-header h2 {
                margin: 0 0 10px 0;
                font-size: 28px;
            }
            
            .daily-date {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .daily-content {
                background: #f8f9fa;
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
            }
            
            .daily-content h3 {
                color: #495057;
                margin: 0 0 15px 0;
            }
            
            .daily-content p {
                color: #6c757d;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .daily-choices {
                margin-top: 20px;
            }
            
            .daily-choice-btn {
                width: 100%;
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                margin-bottom: 10px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s ease;
            }
            
            .daily-choice-btn:hover {
                background: #0056b3;
            }
            
            .recent-events {
                background: #e9ecef;
                padding: 20px;
                border-radius: 10px;
            }
            
            .recent-events h4 {
                color: #495057;
                margin: 0 0 15px 0;
            }
            
            .events-summary {
                font-size: 14px;
                color: #6c757d;
            }
            
            .event-item {
                padding: 8px 0;
                border-bottom: 1px solid #dee2e6;
            }
            
            .event-item:last-child {
                border-bottom: none;
            }
        </style>
    `;
}

/**
 * Generate a random daily event
 */
function generateDailyEvent(data) {
    const events = [
        {
            id: 'weather_good',
            title: 'Beautiful Day',
            description: 'The weather is perfect today. You feel energized and motivated.',
            icon: '☀️',
            effects: { happiness: 5, health: 3 }
        },
        {
            id: 'find_money',
            title: 'Lucky Find',
            description: 'You find some money on the street while walking.',
            icon: '💰',
            effects: { bankBalance: Math.floor(Math.random() * 20) + 10 }
        },
        {
            id: 'social_encounter',
            title: 'Friendly Conversation',
            description: 'A stranger strikes up a pleasant conversation with you.',
            icon: '👋',
            effects: { happiness: 8, social_skills: 2 }
        },
        {
            id: 'work_opportunity',
            title: 'Job Offer',
            description: 'Someone mentions a potential job opportunity.',
            icon: '💼',
            choices: [
                { text: 'Ask for details', effects: { confidence: 5 } },
                { text: 'Politely decline', effects: { happiness: 2 } },
                { text: 'Exchange contact info', effects: { networking: 3 } }
            ]
        },
        {
            id: 'health_check',
            title: 'Health Awareness',
            description: 'You notice you should take better care of your health.',
            icon: '🏥',
            choices: [
                { text: 'Start exercising', cost: 25, effects: { health: 15 } },
                { text: 'Buy vitamins', cost: 15, effects: { health: 8 } },
                { text: 'Ignore it', effects: { health: -2 } }
            ]
        }
    ];
    
    return events[Math.floor(Math.random() * events.length)];
}

/**
 * Handle daily event choice
 */
function handleDailyChoice(choiceIndex, eventId) {
    const data = loadGameData();
    const event = generateDailyEvent(data); // In real implementation, store the current event
    const choice = event.choices[choiceIndex];
    
    if (choice.cost && data.bankBalance < choice.cost) {
        alert('Not enough money for this choice.');
        return;
    }
    
    // Apply choice effects
    if (choice.cost) data.bankBalance -= choice.cost;
    
    Object.entries(choice.effects).forEach(([stat, value]) => {
        if (stat === 'bankBalance') {
            data.bankBalance += value;
        } else if (stat === 'happiness') {
            data.happiness = Math.min(100, Math.max(0, (data.happiness || 100) + value));
        } else if (stat === 'health') {
            data.health = Math.min(100, Math.max(0, (data.health || 100) + value));
        }
        // Other stats handled in story system
    });
    
    data.events.push({
        message: `Daily Event: Made a choice - ${choice.text}`,
        date: new Date().toISOString(),
        read: false
    });
    
    saveGameData(data);
    openDailyEvents(); // Refresh
}

/**
 * Get recent events summary
 */
function getRecentEventsSummary(data) {
    if (!data.events || data.events.length === 0) {
        return '<div class="event-item">No recent events</div>';
    }
    
    return data.events
        .slice(-5)
        .reverse()
        .map(event => `
            <div class="event-item">
                ${event.message}
            </div>
        `)
        .join('');
}

function renderEvents() {
  const data = loadGameData();
  const list = document.getElementById('events-list');
  if (!list) return;
  
  list.innerHTML = '';

  // Show message if no events
  if (data.events.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; color: #666; padding: 40px 20px;">
        <div style="font-size: 3rem; margin-bottom: 15px;">📰</div>
        <h3>No events yet</h3>
        <p style="margin-top: 10px; color: #999;">Your life events will appear here as you play.</p>
      </div>
    `;
    return;
  }

  // Add summary stats at the TOP
  const unreadCount = data.events.filter(ev => !ev.read).length;
  const totalCount = data.events.length;

  const summary = document.createElement('div');
  summary.style.cssText = `
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 14px;
    color: #6c757d;
  `;

  summary.innerHTML = `
    <div style="margin-bottom: 10px;">
      <strong>${totalCount}</strong> total events | 
      <strong style="color: #ffc107;">${unreadCount}</strong> unread
    </div>
    ${unreadCount > 0 ? 
      `<button onclick="markAllEventsRead()" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 12px;">
        Mark All as Read
      </button>` : 
      '<div style="color: #28a745;">✓ All events read</div>'
    }
  `;

  list.appendChild(summary);

  // FIXED: Show events in reverse chronological order (newest first)
  const sortedEvents = data.events
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedEvents.forEach((ev, index) => {
    const item = document.createElement('div');
    item.className = 'event-item' + (ev.read ? '' : ' unread');
    
    // Format date nicely
    const date = new Date(ev.date);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    
    let timeText = '';
    if (diffHours < 1) {
      timeText = 'Just now';
    } else if (diffHours < 24) {
      timeText = `${Math.floor(diffHours)} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) {
        timeText = 'Yesterday';
      } else {
        timeText = `${diffDays} days ago`;
      }
    }
    
    // Add event category icon
    let categoryIcon = '📝';
    if (ev.message.includes('Daily Event')) categoryIcon = '🎁';
    else if (ev.message.includes('Achievement')) categoryIcon = '🏆';
    else if (ev.message.includes('Level up')) categoryIcon = '⭐';
    else if (ev.message.includes('Salary')) categoryIcon = '💼';
    else if (ev.message.includes('Purchased') || ev.message.includes('Sold')) categoryIcon = '🛒';
    else if (ev.message.includes('Loan') || ev.message.includes('Debt')) categoryIcon = '🏦';
    else if (ev.message.includes('Lucky') || ev.message.includes('Won')) categoryIcon = '🍀';
    else if (ev.message.includes('Unlucky') || ev.message.includes('Lost')) categoryIcon = '💸';
    else if (ev.message.includes('Health') || ev.message.includes('Medical')) categoryIcon = '❤️';
    else if (ev.message.includes('Social')) categoryIcon = '👥';
    else if (ev.message.includes('Work')) categoryIcon = '💼';
    
    item.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 10px;">
        <div style="font-size: 18px; margin-top: 2px;">${categoryIcon}</div>
        <div style="flex: 1;">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
            <span>${timeText}</span>
            ${!ev.read ? '<span style="background: #ffc107; color: #212529; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold; margin-left: auto;">NEW</span>' : ''}
          </div>
          <div style="line-height: 1.4;">${ev.message}</div>
        </div>
      </div>
    `;
    
    // Enhanced styling for unread events
    if (!ev.read) {
      item.style.background = 'linear-gradient(135deg, #fff3cd, #fef3c7)';
      item.style.borderLeft = '4px solid #ffc107';
      item.style.boxShadow = '0 2px 4px rgba(255, 193, 7, 0.2)';
    }
    
    // Mark as read on click
    item.onclick = () => {
      if (!ev.read) {
        ev.read = true;
        saveGameData(data);
        renderEvents();
        updateEventDot();
        
        // Visual feedback
        showToast('Event marked as read', 'info', 1000);
      }
    };
    
    list.appendChild(item);
  });
}

/**
 * Mark all events as read
 */
function markAllEventsRead() {
  const data = loadGameData();
  let markedCount = 0;

  data.events.forEach(ev => {
    if (!ev.read) {
      ev.read = true;
      markedCount++;
    }
  });

  if (markedCount > 0) {
    saveGameData(data);
    renderEvents();
    updateEventDot();
    showToast(`Marked ${markedCount} events as read`, 'success');
  }
}

/**
 * Enhanced update event dot with better logic
 */
function updateEventDot() {
  const data = loadGameData();
  const dot = document.getElementById('events-dot');
  const appDot = document.getElementById('events-app-dot');
  
  if (!data.events) return;
  
  // Check for unread events
  const hasUnreadEvents = data.events.some(ev => !ev.read);
  
  // Check if daily event is available
  const dailyEventAvailable = !data.dailyEventCompleted || data.lastDailyEventDay !== data.day;
  
  // Show dot if there are unread events OR daily event is available
  const shouldShowDot = hasUnreadEvents || dailyEventAvailable;
  
  if (dot) {
    dot.classList.toggle('show', shouldShowDot);
  }
  
  // App dot only shows for regular unread events (not daily events)
  if (appDot) {
    appDot.classList.toggle('show', hasUnreadEvents);
  }
}

/**
 * Add event to the events list programmatically
 */
function addGameEvent(message, category = 'general') {
  const data = loadGameData();
  
  if (!data.events) data.events = [];
  
  const event = {
    message: message,
    category: category,
    date: new Date().toISOString(),
    read: false
  };
  
  data.events.push(event);
  
  // Keep only last 100 events to prevent storage bloat
  if (data.events.length > 100) {
    data.events = data.events.slice(-100);
  }
  
  saveGameData(data);
  updateEventDot();
}

/**
 * Clear old events (keep only last 50)
 */
function clearOldEvents() {
  const data = loadGameData();
  
  if (!data.events || data.events.length <= 50) return;
  
  showModal(
    'Clear Old Events',
    `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">🗑️</div>
        <h3>Clear Old Events</h3>
        <p>You have ${data.events.length} events. Clear old events to keep only the most recent 50?</p>
        <p style="font-size: 14px; color: #6c757d;">This will help improve game performance.</p>
      </div>
    `,
    { showCancel: true }
  ).then((confirmed) => {
    if (confirmed) {
      const removedCount = data.events.length - 50;
      data.events = data.events.slice(-50);
      saveGameData(data);
      renderEvents();
      showToast(`Removed ${removedCount} old events`, 'success');
    }
  });
}

/**
 * Export events data
 */
function exportEvents() {
  const data = loadGameData();
  
  if (!data.events || data.events.length === 0) {
    showToast('No events to export', 'info');
    return;
  }
  
  const eventsText = data.events.map(event => {
    const date = new Date(event.date);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}: ${event.message}`;
  }).join('\n');
  
  const dataBlob = new Blob([eventsText], { type: 'text/plain' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `smartsim_events_${data.userName}_day${data.day}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  showToast('Events exported successfully!', 'success');
}

// Add events management styles
if (!document.querySelector('#events-styles')) {
  const eventsStyles = `
    .event-item {
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }
    
    .event-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .event-item.unread:hover {
      box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
    }
    
    .event-category-icon {
      font-size: 18px;
      margin-right: 8px;
      opacity: 0.8;
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'events-styles';
  styleSheet.textContent = eventsStyles;
  document.head.appendChild(styleSheet);
}

/**
 * Alias for backward compatibility (Events app calls this)
 */
function openEvents() {
    openDailyEvents();
}

// Export functions
window.renderEvents = renderEvents;
window.updateEventDot = updateEventDot;
window.addGameEvent = addGameEvent;
window.markAllEventsRead = markAllEventsRead;
window.clearOldEvents = clearOldEvents;
window.exportEvents = exportEvents;
window.openEvents = openEvents;
window.openDailyEvents = openDailyEvents;
