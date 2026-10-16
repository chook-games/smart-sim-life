// messaging.js - Android SMS-style messaging app

/**
 * Messaging State Management
 */
let messagingState = {
  conversations: [],
  currentChat: null,
  unreadCounts: {}
};

/**
 * Friend profiles
 */
const FRIENDS = [
  { name: 'Carlos', avatar: '👨', phone: '+1 555-0123' },
  { name: 'Maya', avatar: '👩', phone: '+1 555-0124' },
  { name: 'Alex', avatar: '🧑', phone: '+1 555-0125' },
  { name: 'Sam', avatar: '👤', phone: '+1 555-0126' },
  { name: 'Emma', avatar: '👩‍🦱', phone: '+1 555-0127' },
  { name: 'Jake', avatar: '👨‍🦲', phone: '+1 555-0128' }
];

/**
 * Work group chat messages based on job type
 */
const WORK_MESSAGES = {
  'unemployed': [
    {
      sender: 'Job Search Group',
      text: "Anyone know of good opportunities? The market is tough right now.",
      responses: [
        "Keep looking, something will come up!",
        "Check online job boards daily"
      ]
    },
    {
      sender: 'Job Search Group',
      text: "Just updated my resume, anyone want to review it?",
      responses: [
        "Happy to take a look!",
        "Good luck with the job hunt!"
      ]
    }
  ],
  'retail': [
    {
      sender: 'Store Team',
      text: "Busy weekend ahead, all hands on deck! 💪",
      responses: [
        "Ready for the rush!",
        "Hope we have enough staff"
      ]
    },
    {
      sender: 'Store Team',
      text: "New inventory arriving tomorrow, need help unloading trucks",
      responses: [
        "I can help early shift",
        "Count me in for afternoon"
      ]
    },
    {
      sender: 'Store Team',
      text: "Customer complained about long wait times today",
      responses: [
        "We need more cashiers",
        "I'll try to move faster"
      ]
    }
  ],
  'food_service': [
    {
      sender: 'Kitchen Crew',
      text: "Friday night dinner rush was insane! 🔥",
      responses: [
        "My feet are still sore!",
        "At least tips were good"
      ]
    },
    {
      sender: 'Kitchen Crew',
      text: "New menu items launching next week, training session tomorrow",
      responses: [
        "Hope it's not too complicated",
        "Excited to learn new recipes"
      ]
    },
    {
      sender: 'Kitchen Crew',
      text: "Health inspector coming Tuesday, deep clean everything!",
      responses: [
        "On it, boss!",
        "Better get the scrub brushes out"
      ]
    }
  ],
  'office': [
    {
      sender: 'Office Team',
      text: "Quarterly reports due Friday, anyone need help with Excel?",
      responses: [
        "I could use some formula help",
        "Got mine done early this time"
      ]
    },
    {
      sender: 'Office Team',
      text: "Coffee machine broke again... third time this month 😫",
      responses: [
        "Time to invest in a better one",
        "I'll bring my French press"
      ]
    },
    {
      sender: 'Office Team',
      text: "Team building event next month, suggestions for activities?",
      responses: [
        "Escape room could be fun",
        "How about bowling?"
      ]
    }
  ],
  'skilled': [
    {
      sender: 'Tech Team',
      text: "System upgrade scheduled for this weekend, expect some downtime",
      responses: [
        "Good thing it's not during work hours",
        "Hope everything goes smoothly"
      ]
    },
    {
      sender: 'Tech Team',
      text: "New project starting next quarter, looks challenging but exciting!",
      responses: [
        "Love a good challenge",
        "Hope we get the resources we need"
      ]
    },
    {
      sender: 'Tech Team',
      text: "Anyone free for lunch? Want to discuss the API integration",
      responses: [
        "Sure, I have some ideas",
        "Can't today, but ping me tomorrow"
      ]
    }
  ],
  'management': [
    {
      sender: 'Leadership Team',
      text: "Board meeting went well, they approved our expansion plans! 🎉",
      responses: [
        "Great news for the company!",
        "More opportunities ahead"
      ]
    },
    {
      sender: 'Leadership Team',
      text: "Q3 performance reviews starting next week, please prepare your reports",
      responses: [
        "Will have everything ready",
        "Good chance to highlight achievements"
      ]
    },
    {
      sender: 'Leadership Team',
      text: "Budget planning session tomorrow, bring your department needs",
      responses: [
        "Finally, we can discuss new equipment",
        "Hope they approve our hiring request"
      ]
    }
  ],
  'executive': [
    {
      sender: 'Executive Board',
      text: "Merger talks are progressing well, confidential for now",
      responses: [
        "Exciting times for the company",
        "Will monitor developments closely"
      ]
    },
    {
      sender: 'Executive Board',
      text: "Investor presentation next week, need final numbers from all divisions",
      responses: [
        "My team will have them ready",
        "Let's make sure we impress them"
      ]
    },
    {
      sender: 'Executive Board',
      text: "Company retreat planning - thinking Switzerland this year?",
      responses: [
        "Sounds amazing, count me in",
        "The team will love that location"
      ]
    }
  ]
};

/**
 * Message templates for daily messages
 */
const MESSAGE_TEMPLATES = [
  {
    sender: 'Carlos',
    text: "Hey! Want to check out that new restaurant downtown?",
    responses: [
      "Sounds great! When?",
      "Maybe another time"
    ]
  },
  {
    sender: 'Maya',
    text: "How's your day going?",
    responses: [
      "Going well, thanks!",
      "Been better, you?"
    ]
  },
  {
    sender: 'Alex',
    text: "Movie night at my place tonight! You in?",
    responses: [
      "Absolutely! What time?",
      "Can't make it tonight"
    ]
  },
  {
    sender: 'Sam',
    text: "Did you see the news today? Crazy stuff!",
    responses: [
      "Yeah, unbelievable!",
      "I missed it, what happened?"
    ]
  },
  {
    sender: 'Emma',
    text: "Coffee later? I need to vent about work",
    responses: [
      "Sure! Where do you want to meet?",
      "I'm busy but call me if you need to talk"
    ]
  },
  {
    sender: 'Jake',
    text: "Party this weekend! Hope you can make it",
    responses: [
      "Wouldn't miss it!",
      "I'll try to make it"
    ]
  },
  {
    sender: 'Carlos',
    text: "Wanna grab lunch today?",
    responses: [
      "Yes! Where?",
      "Can't today, maybe tomorrow?"
    ]
  },
  {
    sender: 'Maya',
    text: "Thanks for listening yesterday, you're the best!",
    responses: [
      "Anytime! That's what friends are for",
      "Of course! Hope you're feeling better"
    ]
  },
  {
    sender: 'Alex',
    text: "Job interview went great! Keeping my fingers crossed",
    responses: [
      "That's awesome! I'm sure you nailed it",
      "Good luck! You deserve it"
    ]
  },
  {
    sender: 'Sam',
    text: "Game night this Friday? I got some new board games",
    responses: [
      "Count me in!",
      "Sounds fun but I might be busy"
    ]
  }
];

/**
 * Load messaging data
 */
function loadMessagingData() {
  const data = loadGameData();
  messagingState = data.messaging || {
    conversations: [],
    currentChat: null,
    unreadCounts: {}
  };
  console.log('Messaging data loaded:', messagingState);
}

/**
 * Save messaging data
 */
function saveMessagingData() {
  const data = loadGameData();
  data.messaging = messagingState;
  saveGameData(data);
  console.log('Messaging data saved:', messagingState);
}

/**
 * Open Messages App
 */
function openMessaging() {
  console.log('Opening Messages app...');
  
  try {
    loadMessagingData();
    console.log('Messaging data loaded:', messagingState);
    
    // Use the standard openApp function like other apps
    openApp('💬 Messages', ''); // Content will be generated by renderConversationsList
    renderConversationsList();
    currentApp = 'messages';
    
    console.log('Messages app opened successfully');
  } catch (error) {
    console.error('Error opening Messages app:', error);
    showToast('Failed to open Messages app', 'error');
  }
}

/**
 * Render the main conversations list (SMS app style)
 */
function renderConversationsList() {
  console.log('Rendering conversations list...');
  const modalBody = document.getElementById('modal-body');
  
  if (!modalBody) {
    console.error('Modal body not found!');
    return;
  }
  
  // Add Android SMS styling
  const style = document.createElement('style');
  style.id = 'sms-styles';
  style.textContent = `
    .sms-container {
      height: 400px;
      background: #ffffff;
      font-family: 'Roboto', sans-serif;
    }
    
    .conversation-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
    }
    
    .conversation-item:hover {
      background-color: #f5f5f5;
    }
    
    .conversation-item:last-child {
      border-bottom: none;
    }
    
    .contact-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(45deg, #25D366, #128C7E);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .conversation-content {
      flex: 1;
      min-width: 0;
    }
    
    .contact-name {
      font-size: 16px;
      font-weight: 500;
      color: #212121;
      margin-bottom: 2px;
    }
    
    .last-message {
      font-size: 14px;
      color: #757575;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .conversation-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    
    .message-time {
      font-size: 12px;
      color: #757575;
    }
    
    .unread-badge {
      background: #25D366;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    .no-messages {
      text-align: center;
      color: #757575;
      padding: 40px 20px;
      font-size: 16px;
    }
    
    .work-chat {
      background: linear-gradient(90deg, #f8f9ff, #ffffff);
      border-left: 3px solid #4285f4;
    }
    
    .work-chat .contact-avatar {
      background: linear-gradient(45deg, #4285f4, #34a853);
    }
  `;
  
  if (!document.querySelector('#sms-styles')) {
    document.head.appendChild(style);
  }
  
  // Get unique conversations grouped by sender
  const conversationMap = new Map();
  
  messagingState.conversations.forEach(conv => {
    if (!conversationMap.has(conv.sender)) {
      conversationMap.set(conv.sender, {
        sender: conv.sender,
        lastMessage: conv.text,
        timestamp: conv.timestamp,
        unreadCount: messagingState.unreadCounts[conv.sender] || 0
      });
    } else {
      // Update with latest message
      const existing = conversationMap.get(conv.sender);
      if (new Date(conv.timestamp) > new Date(existing.timestamp)) {
        existing.lastMessage = conv.text;
        existing.timestamp = conv.timestamp;
      }
    }
  });
  
  const conversations = Array.from(conversationMap.values())
    .sort((a, b) => {
      // Sort work chats to the top, then by timestamp
      const aIsWork = a.sender.includes('Team') || a.sender.includes('Group') || a.sender.includes('Board');
      const bIsWork = b.sender.includes('Team') || b.sender.includes('Group') || b.sender.includes('Board');
      if (aIsWork && !bIsWork) return -1;
      if (!aIsWork && bIsWork) return 1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  
  modalBody.innerHTML = `
    <div class="sms-container">
      ${conversations.length === 0 ? `
        <div class="no-messages">
          📱 No messages yet<br>
          <span style="font-size: 14px; color: #999;">Friends will message you daily</span>
        </div>
      ` : conversations.map(conv => {
        const friend = FRIENDS.find(f => f.name === conv.sender);
        const timeString = new Date(conv.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const isWorkChat = conv.sender.includes('Team') || conv.sender.includes('Group') || conv.sender.includes('Board');
        return `
          <div class="conversation-item ${isWorkChat ? 'work-chat' : ''}" onclick="openChat('${conv.sender}')">
            <div class="contact-avatar">
              ${isWorkChat ? '💼' : (friend ? friend.avatar : '👤')}
            </div>
            <div class="conversation-content">
              <div class="contact-name">${conv.sender}${isWorkChat ? ' 💼' : ''}</div>
              <div class="last-message">${conv.lastMessage}</div>
            </div>
            <div class="conversation-meta">
              <div class="message-time">${timeString}</div>
              ${conv.unreadCount > 0 ? `<div class="unread-badge">${conv.unreadCount}</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Open individual chat with a friend
 */
function openChat(friendName) {
  messagingState.currentChat = friendName;
  
  // Mark messages as read
  messagingState.unreadCounts[friendName] = 0;
  saveMessagingData();
  
  const friend = FRIENDS.find(f => f.name === friendName);
  const friendMessages = messagingState.conversations.filter(conv => conv.sender === friendName);
  
  // Add chat styling
  const style = document.createElement('style');
  style.id = 'chat-styles';
  style.textContent = `
    .chat-container {
      height: 400px;
      background: #f0f2f5;
      display: flex;
      flex-direction: column;
    }
    
    .chat-header {
      background: #25D366;
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-radius: 8px 8px 0 0;
    }
    
    .back-button {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
    }
    
    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .message.received {
      background: white;
      color: #212121;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    .message.sent {
      background: #DCF8C6;
      color: #212121;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    
    .message-time {
      font-size: 11px;
      color: #757575;
      margin-top: 4px;
      text-align: right;
    }
    
    .response-section {
      background: white;
      padding: 12px 16px;
      border-top: 1px solid #e0e0e0;
    }
    
    .response-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .response-btn {
      background: #25D366;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .response-btn:hover {
      background: #128C7E;
    }
    
    .response-btn:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  `;
  
  if (!document.querySelector('#chat-styles')) {
    document.head.appendChild(style);
  }
  
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        <button class="back-button" onclick="renderConversationsList()">←</button>
        <div class="contact-avatar" style="width: 36px; height: 36px; font-size: 16px;">
          ${friend ? friend.avatar : '👤'}
        </div>
        <div>
          <div style="font-weight: 500;">${friendName}</div>
          <div style="font-size: 12px; opacity: 0.9;">${friend ? friend.phone : 'Contact'}</div>
        </div>
      </div>
      
      <div class="chat-messages" id="chat-messages">
        ${generateChatMessages(friendMessages)}
      </div>
      
      <div class="response-section" id="response-section">
        ${generateResponseButtons(friendMessages)}
      </div>
    </div>
  `;
  
  // Scroll to bottom
  const messagesContainer = document.getElementById('chat-messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Generate chat messages HTML
 */
function generateChatMessages(messages) {
  if (messages.length === 0) {
    return '<div style="text-align: center; color: #757575; padding: 20px;">Start a conversation</div>';
  }
  
  return messages.map(msg => {
    const timeString = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    let html = `
      <div class="message received">
        ${msg.text}
        <div class="message-time">${timeString}</div>
      </div>
    `;
    
    if (msg.playerResponse) {
      html += `
        <div class="message sent">
          ${msg.playerResponse}
          <div class="message-time">${timeString}</div>
        </div>
      `;
    }
    
    return html;
  }).join('');
}

/**
 * Generate response buttons for the latest unanswered message
 */
function generateResponseButtons(messages) {
  const latestMessage = messages[messages.length - 1];
  
  if (!latestMessage || latestMessage.playerResponse) {
    return '<div style="text-align: center; color: #757575; padding: 8px;">No pending messages</div>';
  }
  
  const template = MESSAGE_TEMPLATES.find(t => t.sender === latestMessage.sender && t.text === latestMessage.text);
  
  if (!template || !template.responses) {
    return '<div style="text-align: center; color: #757575; padding: 8px;">No responses available</div>';
  }
  
  return `
    <div class="response-buttons">
      ${template.responses.map((response, index) => `
        <button class="response-btn" onclick="sendResponse('${latestMessage.id}', '${response.replace(/'/g, "\\'")}')">${response}</button>
      `).join('')}
    </div>
  `;
}

/**
 * Send a response to a message
 */
function sendResponse(messageId, responseText) {
  const message = messagingState.conversations.find(conv => conv.id === messageId);
  if (!message) return;
  
  message.playerResponse = responseText;
  message.respondedAt = new Date().toISOString();
  
  saveMessagingData();
  
  // Refresh the chat view
  openChat(message.sender);
  
  showToast('Message sent!', 'success');
}

/**
 * Generate daily messages (called from tick.js)
 */
function generateDailyMessages() {
  console.log('Generating daily messages...');
  loadMessagingData();
  
  // Generate 1-2 random friend messages per day
  const friendMessageCount = Math.random() < 0.7 ? 1 : 2;
  console.log(`Generating ${friendMessageCount} friend messages`);
  
  for (let i = 0; i < friendMessageCount; i++) {
    const template = MESSAGE_TEMPLATES[Math.floor(Math.random() * MESSAGE_TEMPLATES.length)];
    
    const message = {
      id: Date.now() + Math.random(),
      sender: template.sender,
      text: template.text,
      responses: template.responses,
      timestamp: new Date().toISOString(),
      playerResponse: null,
      respondedAt: null
    };
    
    messagingState.conversations.push(message);
    
    // Update unread count
    messagingState.unreadCounts[template.sender] = (messagingState.unreadCounts[template.sender] || 0) + 1;
    
    console.log(`Generated friend message from ${template.sender}: ${template.text}`);
  }
  
  // Generate work group chat message based on current job
  generateWorkMessage();
  
  saveMessagingData();
  
  // Update the messages badge
  if (typeof updateMessagesBadge === 'function') {
    updateMessagesBadge();
  }
  
  const totalMessages = friendMessageCount + 1; // +1 for work message
  if (totalMessages > 0) {
    console.log(`Generated ${totalMessages} new messages`);
    if (typeof showToast === 'function') {
      showToast(`📱 ${totalMessages} new message${totalMessages > 1 ? 's' : ''}`, 'info');
    }
  }
}

/**
 * Generate work-related message based on current job
 */
function generateWorkMessage() {
  const data = loadGameData();
  let jobType = 'unemployed';
  
  // Determine job type based on current job
  if (data.job) {
    if (data.job.includes('CEO') || data.job.includes('President')) {
      jobType = 'executive';
    } else if (data.job.includes('Manager') || data.job.includes('Director')) {
      jobType = 'management';
    } else if (data.job.includes('Engineer') || data.job.includes('Analyst') || data.job.includes('Specialist')) {
      jobType = 'skilled';
    } else if (data.job.includes('Office') || data.job.includes('Assistant') || data.job.includes('Clerk')) {
      jobType = 'office';
    } else if (data.job.includes('Server') || data.job.includes('Cook') || data.job.includes('Barista')) {
      jobType = 'food_service';
    } else if (data.job.includes('Cashier') || data.job.includes('Sales') || data.job.includes('Retail')) {
      jobType = 'retail';
    }
  }
  
  const workMessages = WORK_MESSAGES[jobType];
  if (!workMessages || workMessages.length === 0) return;
  
  const template = workMessages[Math.floor(Math.random() * workMessages.length)];
  
  const workMessage = {
    id: Date.now() + Math.random() + 0.1, // Slightly different timestamp
    sender: template.sender,
    text: template.text,
    responses: template.responses,
    timestamp: new Date().toISOString(),
    playerResponse: null,
    respondedAt: null,
    isWorkChat: true // Flag to identify work messages
  };
  
  messagingState.conversations.push(workMessage);
  
  // Update unread count
  messagingState.unreadCounts[template.sender] = (messagingState.unreadCounts[template.sender] || 0) + 1;
  
  console.log(`Generated work message from ${template.sender}: ${template.text} (Job: ${data.job || 'Unemployed'})`);
}

/**
 * Add a test message for demonstration
 */
function addTestMessage() {
  console.log('Adding test message...');
  loadMessagingData();
  
  const testTemplate = MESSAGE_TEMPLATES[0]; // Use first template
  const testMessage = {
    id: Date.now(),
    sender: testTemplate.sender,
    text: testTemplate.text,
    responses: testTemplate.responses,
    timestamp: new Date().toISOString(),
    playerResponse: null,
    respondedAt: null
  };
  
  messagingState.conversations.push(testMessage);
  messagingState.unreadCounts[testTemplate.sender] = (messagingState.unreadCounts[testTemplate.sender] || 0) + 1;
  
  saveMessagingData();
  
  // Update the messages badge
  if (typeof updateMessagesBadge === 'function') {
    updateMessagesBadge();
  }
  
  console.log('Test message added successfully');
  if (typeof showToast === 'function') {
    showToast(`📱 Test message added from ${testTemplate.sender}`, 'info');
  }
}

/**
 * Get total unread message count for the main app icon
 */
function getTotalUnreadCount() {
  loadMessagingData();
  return Object.values(messagingState.unreadCounts).reduce((sum, count) => sum + count, 0);
}

/**
 * Add a test work message for demonstration
 */
function addTestWorkMessage() {
  console.log('Adding test work message...');
  const data = loadGameData();
  loadMessagingData();
  
  // Use current job or default to retail
  let jobType = 'retail';
  if (data.job) {
    if (data.job.includes('CEO') || data.job.includes('President')) {
      jobType = 'executive';
    } else if (data.job.includes('Manager') || data.job.includes('Director')) {
      jobType = 'management';
    }
  }
  
  const workMessages = WORK_MESSAGES[jobType];
  if (!workMessages || workMessages.length === 0) return;
  
  const template = workMessages[0]; // Use first template
  const testWorkMessage = {
    id: Date.now() + 0.5,
    sender: template.sender,
    text: template.text,
    responses: template.responses,
    timestamp: new Date().toISOString(),
    playerResponse: null,
    respondedAt: null,
    isWorkChat: true
  };
  
  messagingState.conversations.push(testWorkMessage);
  messagingState.unreadCounts[template.sender] = (messagingState.unreadCounts[template.sender] || 0) + 1;
  
  saveMessagingData();
  
  // Update the messages badge
  if (typeof updateMessagesBadge === 'function') {
    updateMessagesBadge();
  }
  
  console.log('Test work message added successfully');
  if (typeof showToast === 'function') {
    showToast(`💼 Test work message added from ${template.sender}`, 'info');
  }
}

// Export functions
window.openMessaging = openMessaging;
window.openChat = openChat;
window.sendResponse = sendResponse;
window.renderConversationsList = renderConversationsList;
window.generateDailyMessages = generateDailyMessages;
window.generateWorkMessage = generateWorkMessage;
window.getTotalUnreadCount = getTotalUnreadCount;
window.addTestMessage = addTestMessage;
window.addTestWorkMessage = addTestWorkMessage;

// Debug function to check messaging state
window.debugMessages = function() {
  loadMessagingData();
  console.log('=== MESSAGING DEBUG ===');
  console.log('Total conversations:', messagingState.conversations.length);
  console.log('Conversations:', messagingState.conversations);
  console.log('Unread counts:', messagingState.unreadCounts);
  console.log('Current chat:', messagingState.currentChat);
  return messagingState;
};