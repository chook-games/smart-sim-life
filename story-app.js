/**
 * Story App - Interactive narrative events for life simulation
 */

/**
 * Open the Story app modal
 */
function openStoryApp() {
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-book"></i> Story';
    document.getElementById('modal-body').innerHTML = getStoryAppContent();
    document.getElementById('app-modal').classList.remove('hidden');
}

/**
 * Get story app content
 */
function getStoryAppContent() {
    const data = loadGameData();
    
    // Check if there's a story event available today
    const todayStory = getTodaysStoryEvent(data.day);
    
    if (todayStory) {
        return renderStoryEvent(todayStory, data.day);
    } else {
        return renderNoStoryToday(data.day);
    }
}

/**
 * Get today's story event if available
 */
function getTodaysStoryEvent(day) {
    // Check if it's a milestone day for story events (every 5 days)
    if (isStoryDay(day)) {
        // Use preset stories for early game, then procedural generation
        if (day <= 60) {
            return getPresetStoryEvents()[day] || null;
        } else {
            return generateProceduralStory(day);
        }
    }
    
    // Check for relationship events on non-main-story days
    const relationshipEvent = getRandomRelationshipEvent(day);
    if (relationshipEvent) {
        return relationshipEvent;
    }
    
    return null;
}

/**
 * Check if today is a story day
 */
function isStoryDay(day) {
    // Story events every 5 days
    return day % 5 === 0;
}

/**
 * Get preset story events for early game
 */
function getPresetStoryEvents() {
    return {
        5: {
            id: "childhood_friend",
            title: "Childhood Friend Encounter",
            description: "You bump into your old friend Alex at a coffee shop. They look different - more confident and well-dressed. You haven't spoken in years.",
            choices: [
                { text: "Approach and catch up", effects: "happiness +15, confidence +5" },
                { text: "Just nod and leave", effects: "happiness -5" },
                { text: "Pretend you didn't see them", effects: "confidence -10" }
            ]
        },
        10: {
            id: "job_interview",
            title: "Job Interview Opportunity", 
            description: "You're sitting in a waiting room for your first real job interview. Your palms are sweaty as the interviewer calls your name.",
            choices: [
                { text: "Take a deep breath and be confident", effects: "confidence +10, better job chances" },
                { text: "Be honest about your nervousness", effects: "honesty +10" },
                { text: "Try to impress with exaggerated experience", effects: "confidence +5, honesty -15" }
            ]
        },
        15: {
            id: "inheritance",
            title: "Mysterious Inheritance",
            description: "A lawyer contacts you about a distant relative's will. They've left you something, but you must choose what to inherit.",
            choices: [
                { text: "Take the €5,000 cash", effects: "money +€5,000" },
                { text: "Take the old family house", effects: "property: old house" },
                { text: "Take the box of family documents", effects: "family mystery unlocked" }
            ]
        },
        20: {
            id: "career_crossroads",
            title: "Career Crossroads",
            description: "Your boss offers you a promotion that requires moving to another city. It's a big opportunity but means leaving everything behind.",
            choices: [
                { text: "Accept the promotion", effects: "career boost, stress +20" },
                { text: "Decline and stay", effects: "happiness +10, missed opportunity" },
                { text: "Ask for time to think", effects: "anxiety +15" }
            ]
        },
        25: {
            id: "old_love",
            title: "An Old Love Returns",
            description: "Your first love from school reaches out on social media. They're in town and want to meet for coffee. Old feelings stir within you.",
            choices: [
                { text: "Meet them for coffee", effects: "romance opportunity, happiness +20" },
                { text: "Politely decline", effects: "stability +10" },
                { text: "Ignore the message", effects: "regret +15" }
            ]
        },
        30: {
            id: "family_secret",
            title: "Family Secret Revealed",
            description: "While cleaning out your parents' attic, you discover old letters that reveal a family secret that changes everything you thought you knew.",
            choices: [
                { text: "Confront your family about it", effects: "truth +20, family tension +15" },
                { text: "Keep the secret to yourself", effects: "burden +25" },
                { text: "Research more before deciding", effects: "wisdom +10" }
            ]
        },
        35: {
            id: "mentor_opportunity",
            title: "The Mentor's Offer",
            description: "A successful person in your field notices your potential and offers to mentor you. This could change your career trajectory, but they have strict expectations.",
            choices: [
                { text: "Accept the mentorship eagerly", effects: "career boost +30, stress +10" },
                { text: "Accept but set boundaries", effects: "career boost +20, confidence +10" },
                { text: "Politely decline to stay independent", effects: "independence +15, missed opportunity" }
            ]
        },
        40: {
            id: "investment_choice",
            title: "Investment Opportunity",
            description: "A friend approaches you with an investment opportunity in their startup. It could make you wealthy or cost you everything you've saved.",
            choices: [
                { text: "Invest everything you have", effects: "high risk, potential €20,000 gain or total loss" },
                { text: "Invest half your savings", effects: "moderate risk, potential €10,000 gain or 50% loss" },
                { text: "Decline the investment", effects: "safety +10, missed opportunity" }
            ]
        },
        45: {
            id: "relationship_crisis",
            title: "Relationship at a Crossroads",
            description: "Your closest relationship is facing a major crisis. Trust has been broken, and both of you are hurt. How you handle this will define your future connections.",
            choices: [
                { text: "Fight for the relationship", effects: "relationship repair attempt, emotional drain +20" },
                { text: "Take a break to think", effects: "wisdom +15, loneliness +10" },
                { text: "End it and move on", effects: "freedom +20, heartbreak +25" }
            ]
        },
        50: {
            id: "life_purpose",
            title: "Finding Your Purpose",
            description: "You wake up one morning questioning everything. What's your real purpose in life? This existential moment could reshape your entire future path.",
            choices: [
                { text: "Focus on making money and success", effects: "ambition +25, inner peace -10" },
                { text: "Prioritize relationships and family", effects: "happiness +20, career ambition -5" },
                { text: "Seek adventure and new experiences", effects: "excitement +30, stability -15" }
            ]
        },
        55: {
            id: "health_scare",
            title: "Health Wake-Up Call",
            description: "A routine check-up reveals a health concern that makes you reevaluate your lifestyle choices. It's not serious yet, but it's a warning sign.",
            choices: [
                { text: "Completely overhaul your lifestyle", effects: "health +25, happiness +15, stress +10" },
                { text: "Make gradual healthy changes", effects: "health +15, sustainable habits" },
                { text: "Ignore it and hope for the best", effects: "denial +20, future health risks" }
            ]
        },
        60: {
            id: "legacy_decision",
            title: "Building Your Legacy",
            description: "You're at a point where you can influence the next generation. How do you want to be remembered, and what mark will you leave on the world?",
            choices: [
                { text: "Start a foundation or charity", effects: "legacy +30, money -€15,000, fulfillment +25" },
                { text: "Mentor young people in your field", effects: "wisdom sharing +25, time investment +15" },
                { text: "Focus on building wealth for family", effects: "family security +20, money focus +15" }
            ]
        }
    };
}

/**
 * Generate procedural story based on current day and player data
 */
function generateProceduralStory(day) {
    const data = loadGameData();
    const lifeStage = getLifeStage(day);
    const storyTemplates = getStoryTemplatesForStage(lifeStage);
    const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    
    return personalizeStory(template, data, day);
}

/**
 * Get life stage based on current day
 */
function getLifeStage(day) {
    if (day <= 100) return 'young_adult';
    if (day <= 200) return 'adult';
    if (day <= 300) return 'mature';
    return 'elder';
}

/**
 * Get story templates for specific life stage
 */
function getStoryTemplatesForStage(stage) {
    const templates = {
        young_adult: [
            {
                id: "career_challenge",
                title: "Workplace Challenge",
                description: "A difficult situation arises at work that tests your problem-solving skills and ethics.",
                choices: [
                    { text: "Take the ethical route", effects: "happiness +10, respect +15" },
                    { text: "Choose the profitable option", effects: "money +€2000, guilt +5" },
                    { text: "Find a compromise", effects: "wisdom +10, moderate_gain" }
                ]
            },
            {
                id: "social_opportunity",
                title: "New Social Circle",
                description: "You have the chance to join a new social group that could expand your network.",
                choices: [
                    { text: "Join enthusiastically", effects: "social_skills +20, energy -10" },
                    { text: "Join cautiously", effects: "social_skills +10, safety +5" },
                    { text: "Stay with current friends", effects: "loyalty +15, missed_opportunity" }
                ]
            },
            {
                id: "skill_development",
                title: "Learning Opportunity",
                description: "A chance to learn a new valuable skill presents itself, but it requires time and effort.",
                choices: [
                    { text: "Dedicate yourself fully", effects: "skill_points +5, stress +15" },
                    { text: "Learn at your own pace", effects: "skill_points +3, balance +10" },
                    { text: "Focus on current abilities", effects: "mastery +10, missed_growth" }
                ]
            }
        ],
        adult: [
            {
                id: "family_decision",
                title: "Family Crossroads",
                description: "A major family decision needs to be made that will affect everyone's future.",
                choices: [
                    { text: "Put family first", effects: "family_bond +25, career -5" },
                    { text: "Balance both priorities", effects: "stress +20, wisdom +15" },
                    { text: "Focus on personal goals", effects: "ambition +20, guilt +10" }
                ]
            },
            {
                id: "leadership_test",
                title: "Leadership Challenge",
                description: "You're given the opportunity to lead a significant project or team.",
                choices: [
                    { text: "Accept with confidence", effects: "leadership +25, pressure +15" },
                    { text: "Accept but seek mentorship", effects: "leadership +15, humility +10" },
                    { text: "Recommend someone else", effects: "modesty +20, missed_opportunity" }
                ]
            },
            {
                id: "investment_dilemma",
                title: "Financial Crossroads",
                description: "A significant investment opportunity could change your financial future.",
                choices: [
                    { text: "Take the calculated risk", effects: "potential_wealth +30, anxiety +10" },
                    { text: "Make a conservative choice", effects: "security +20, modest_gain" },
                    { text: "Seek professional advice", effects: "wisdom +15, patience +10" }
                ]
            }
        ],
        mature: [
            {
                id: "mentorship_role",
                title: "Becoming a Mentor",
                description: "Younger people look to you for guidance and wisdom from your life experience.",
                choices: [
                    { text: "Embrace the mentor role", effects: "fulfillment +30, responsibility +15" },
                    { text: "Share wisdom selectively", effects: "wisdom +20, boundaries +10" },
                    { text: "Focus on your own journey", effects: "independence +15, isolation +5" }
                ]
            },
            {
                id: "health_priority",
                title: "Health Reality Check",
                description: "Age brings new health considerations that require lifestyle adjustments.",
                choices: [
                    { text: "Overhaul your lifestyle completely", effects: "health +35, discipline +20" },
                    { text: "Make gradual improvements", effects: "health +20, sustainability +15" },
                    { text: "Accept aging gracefully", effects: "acceptance +25, potential_decline" }
                ]
            },
            {
                id: "legacy_planning",
                title: "Planning Your Legacy",
                description: "You begin thinking seriously about what you want to leave behind.",
                choices: [
                    { text: "Focus on wealth building", effects: "financial_legacy +30, materialism +10" },
                    { text: "Invest in relationships", effects: "love_legacy +35, fulfillment +20" },
                    { text: "Create something meaningful", effects: "creative_legacy +40, purpose +25" }
                ]
            }
        ],
        elder: [
            {
                id: "wisdom_sharing",
                title: "Sharing Life Wisdom",
                description: "People seek your advice based on decades of life experience.",
                choices: [
                    { text: "Become a community elder", effects: "respect +40, purpose +30" },
                    { text: "Write your memoirs", effects: "legacy +35, reflection +25" },
                    { text: "Enjoy quiet wisdom", effects: "peace +30, contentment +20" }
                ]
            },
            {
                id: "final_adventure",
                title: "One Last Adventure",
                description: "An opportunity for one final meaningful adventure presents itself.",
                choices: [
                    { text: "Embrace the adventure", effects: "vitality +25, memories +30" },
                    { text: "Plan it carefully", effects: "safety +20, measured_joy +15" },
                    { text: "Appreciate current life", effects: "gratitude +35, inner_peace +25" }
                ]
            },
            {
                id: "generational_bridge",
                title: "Bridging Generations",
                description: "You have the chance to connect different generations through your experience.",
                choices: [
                    { text: "Actively bridge the gap", effects: "unity +40, energy -5" },
                    { text: "Share when asked", effects: "wisdom +25, balance +15" },
                    { text: "Let each generation find its way", effects: "acceptance +20, detachment +10" }
                ]
            }
        ]
    };
    
    return templates[stage] || templates.young_adult;
}

/**
 * Personalize story template based on player data
 */
function personalizeStory(template, data, day) {
    const personalizedTemplate = { ...template };
    
    // Modify description based on player's situation
    if (data.bankBalance > 50000 && template.id.includes('investment')) {
        personalizedTemplate.description = `With your substantial savings of €${data.bankBalance.toLocaleString()}, ` + template.description;
    }
    
    if (data.profession && template.id.includes('career')) {
        personalizedTemplate.description = personalizedTemplate.description.replace('at work', `as a ${data.profession}`);
    }
    
    if (data.house !== "Parents' Home" && template.id.includes('family')) {
        personalizedTemplate.description = `At your ${data.house.toLowerCase()}, ` + template.description.toLowerCase();
    }
    
    // Scale effects based on player level and day
    const scaleFactor = Math.min(2.0, 1.0 + (day / 365) * 0.5);
    personalizedTemplate.choices = personalizedTemplate.choices.map(choice => ({
        ...choice,
        effects: scaleEffects(choice.effects, scaleFactor)
    }));
    
    return personalizedTemplate;
}

/**
 * Scale story effects based on game progression
 */
function scaleEffects(effects, scale) {
    return effects.replace(/\+(\d+)/g, (match, number) => {
        return `+${Math.round(parseInt(number) * scale)}`;
    }).replace(/€(\d+)/g, (match, number) => {
        return `€${Math.round(parseInt(number) * scale)}`;
    });
}

/**
 * Get random relationship event for non-main-story days
 */
function getRandomRelationshipEvent(day) {
    const data = loadGameData();
    
    // 25% chance of relationship event on non-main-story days
    if (Math.random() > 0.25) return null;
    
    // Get available NPCs from relationships system
    const availableNPCs = getAvailableNPCs();
    if (availableNPCs.length === 0) return null;
    
    // Select random NPC
    const npc = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
    const relationship = data.relationships?.[npc.name] || { level: 0, interactions: 0 };
    
    // Generate relationship event based on current relationship level
    return generateRelationshipEvent(npc, relationship, day);
}

/**
 * Get available NPCs for relationship events
 */
function getAvailableNPCs() {
    return [
        {
            name: "Alex",
            personality: "adventurous",
            interests: ["travel", "sports", "photography"],
            description: "An adventurous spirit who loves trying new things"
        },
        {
            name: "Sam",
            personality: "intellectual",
            interests: ["books", "art", "philosophy"],
            description: "A thoughtful person who enjoys deep conversations"
        },
        {
            name: "Jordan",
            personality: "ambitious",
            interests: ["career", "networking", "fitness"],
            description: "A driven professional focused on success"
        },
        {
            name: "Casey",
            personality: "creative",
            interests: ["music", "writing", "cooking"],
            description: "An artistic soul with a passion for creativity"
        },
        {
            name: "Taylor",
            personality: "caring",
            interests: ["family", "volunteering", "gardening"],
            description: "A nurturing person who values meaningful connections"
        }
    ];
}

/**
 * Generate relationship event based on NPC and current relationship
 */
function generateRelationshipEvent(npc, relationship, day) {
    const level = relationship.level;
    const interactions = relationship.interactions;
    
    let eventTemplates = [];
    
    if (level < 20) {
        // Stranger/Acquaintance level
        eventTemplates = [
            {
                title: `Meeting ${npc.name}`,
                description: `You bump into ${npc.name} at a coffee shop. ${npc.description}. They seem friendly but you don't know each other well yet.`,
                choices: [
                    { text: "Strike up a conversation", effects: `relationship_${npc.name}_+8, confidence +5` },
                    { text: "Just smile and nod", effects: `relationship_${npc.name}_+3` },
                    { text: "Pretend you didn't notice", effects: "missed_opportunity" }
                ]
            },
            {
                title: `${npc.name}'s Invitation`,
                description: `${npc.name} invites you to join them for ${npc.interests[0]}. It could be a good way to get to know each other better.`,
                choices: [
                    { text: "Accept enthusiastically", effects: `relationship_${npc.name}_+10, happiness +8` },
                    { text: "Accept but seem hesitant", effects: `relationship_${npc.name}_+5, anxiety +3` },
                    { text: "Politely decline", effects: `relationship_${npc.name}_-2, safety +5` }
                ]
            }
        ];
    } else if (level < 50) {
        // Friend level
        eventTemplates = [
            {
                title: `${npc.name}'s Problem`,
                description: `${npc.name} comes to you with a personal problem and asks for your advice. They seem to trust your judgment.`,
                choices: [
                    { text: "Listen carefully and give thoughtful advice", effects: `relationship_${npc.name}_+12, wisdom +10` },
                    { text: "Offer practical help", effects: `relationship_${npc.name}_+8, loyalty +8` },
                    { text: "Suggest they figure it out themselves", effects: `relationship_${npc.name}_-5, independence +5` }
                ]
            },
            {
                title: `Quality Time with ${npc.name}`,
                description: `${npc.name} suggests spending a day together doing something you both enjoy. It's a chance to deepen your friendship.`,
                choices: [
                    { text: "Plan an exciting adventure", effects: `relationship_${npc.name}_+10, excitement +15` },
                    { text: "Have a deep conversation over dinner", effects: `relationship_${npc.name}_+12, emotional_bond +10` },
                    { text: "Keep it casual and low-key", effects: `relationship_${npc.name}_+6, comfort +8` }
                ]
            }
        ];
    } else if (level < 75) {
        // Close friend/romantic interest level
        eventTemplates = [
            {
                title: `Romantic Tension with ${npc.name}`,
                description: `There's an undeniable romantic tension between you and ${npc.name}. The air feels charged with possibility during your conversations.`,
                choices: [
                    { text: "Flirt openly and test the waters", effects: `relationship_${npc.name}_+15, romance_tension +20` },
                    { text: "Drop subtle hints about your feelings", effects: `relationship_${npc.name}_+8, romantic_buildup +10` },
                    { text: "Keep things platonic for now", effects: `relationship_${npc.name}_+3, emotional_safety +15` }
                ]
            },
            {
                title: `${npc.name}'s Confession`,
                description: `${npc.name} admits they have feelings for you and asks if you feel the same way. This is a pivotal moment in your relationship.`,
                choices: [
                    { text: "Confess your feelings too", effects: `relationship_${npc.name}_+25, happiness +20, romance_activated` },
                    { text: "Ask for time to think about it", effects: `relationship_${npc.name}_+5, anxiety +10, contemplation +15` },
                    { text: "Let them down gently", effects: `relationship_${npc.name}_-10, guilt +15, friendship_preserved` }
                ]
            }
        ];
    } else {
        // Romantic partner level
        eventTemplates = [
            {
                title: `Date Night with ${npc.name}`,
                description: `${npc.name} plans a special date night for you both. Your relationship has grown into something beautiful and meaningful.`,
                choices: [
                    { text: "Make it incredibly romantic", effects: `relationship_${npc.name}_+20, love_deepening +25, happiness +15` },
                    { text: "Focus on having fun together", effects: `relationship_${npc.name}_+15, joy +20, playfulness +10` },
                    { text: "Have a heart-to-heart conversation", effects: `relationship_${npc.name}_+18, emotional_intimacy +20, wisdom +10` }
                ]
            },
            {
                title: `Future Plans with ${npc.name}`,
                description: `${npc.name} brings up the topic of your future together. They want to know where you see the relationship going.`,
                choices: [
                    { text: "Talk about moving in together", effects: `relationship_${npc.name}_+25, commitment +30, life_milestone` },
                    { text: "Discuss taking things one day at a time", effects: `relationship_${npc.name}_+10, present_focus +20` },
                    { text: "Express uncertainty about the future", effects: `relationship_${npc.name}_-5, honesty +15, anxiety +10` }
                ]
            }
        ];
    }
    
    if (eventTemplates.length === 0) return null;
    
    const selectedTemplate = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    
    return {
        ...selectedTemplate,
        id: `relationship_${npc.name.toLowerCase()}_${day}`,
        isRelationshipEvent: true,
        npcName: npc.name,
        npcPersonality: npc.personality
    };
}

/**
 * Check if player has already completed today's story
 */
function hasCompletedTodaysStory(day) {
    const data = loadGameData();
    if (!data.completedStories) data.completedStories = [];
    return data.completedStories.includes(day);
}

/**
 * Render a story event
 */
function renderStoryEvent(event, day) {
    // Check if already completed today
    if (hasCompletedTodaysStory(day)) {
        return renderAlreadyCompletedStory(event, day);
    }
    
    return `
        <div class="story-event-container">
            <div class="story-header">
                <div class="story-icon">📖</div>
                <h2>${event.title}</h2>
                <div class="story-type">Life Story Event - Day ${day}</div>
            </div>
            
            <div class="story-description">
                <p>${event.description}</p>
            </div>
            
            <div class="story-choices">
                <h4>What do you choose?</h4>
                ${event.choices.map((choice, index) => `
                    <button class="story-choice-btn" onclick="makeStoryChoice(${index}, '${event.id}', '${event.title}', '${choice.text}', '${choice.effects}', ${day})">
                        <div class="choice-text">${choice.text}</div>
                        <div class="choice-effects">${choice.effects}</div>
                    </button>
                `).join('')}
            </div>
        </div>
        ${getStoryStyles()}
    `;
}

/**
 * Render when story is already completed
 */
function renderAlreadyCompletedStory(event, day) {
    return `
        <div class="story-event-container">
            <div class="story-header completed">
                <div class="story-icon">✅</div>
                <h2>${event.title}</h2>
                <div class="story-type">Completed - Day ${day}</div>
            </div>
            
            <div class="story-description">
                <p>You have already experienced this story event today. Come back tomorrow for new adventures!</p>
            </div>
            
            <div class="story-info">
                <p style="text-align: center; color: #6c757d; font-style: italic;">
                    Stories refresh daily. Check back tomorrow for new narrative opportunities.
                </p>
            </div>
        </div>
        ${getStoryStyles()}
    `;
}

/**
 * Render when no story is available today
 */
function renderNoStoryToday(day) {
    const nextStoryDay = getNextStoryDay(day);
    
    return `
        <div class="story-event-container">
            <div class="story-header no-story">
                <div class="story-icon">📚</div>
                <h2>No Story Today</h2>
                <div class="story-type">Day ${day}</div>
            </div>
            
            <div class="story-description">
                <p>Your life is peaceful today. No major story events are unfolding right now.</p>
                ${nextStoryDay ? `<p style="margin-top: 15px;"><strong>Next story event:</strong> Day ${nextStoryDay}</p>` : ''}
            </div>
            
            <div class="story-info">
                <h4>Story Schedule</h4>
                <div style="text-align: left; color: #6c757d; max-height: 200px; overflow-y: auto;">
                    <p><strong>Story Events occur every 5 days!</strong></p>
                    <p><em>Early Game (Days 5-60):</em> Curated story events</p>
                    <p><em>Mid-Late Game (Days 65-365):</em> Procedurally generated stories based on your life stage and choices</p>
                    <p><strong>Life Stages:</strong></p>
                    <ul>
                        <li>Young Adult (Days 1-100): Career, relationships, skill building</li>
                        <li>Adult (Days 101-200): Leadership, family, investments</li>
                        <li>Mature (Days 201-300): Mentorship, health, legacy planning</li>
                        <li>Elder (Days 301-365): Wisdom sharing, final adventures, generational impact</li>
                    </ul>
                    <p><strong>After Day 365:</strong> New Game Plus begins - keep your progress and continue!</p>
                </div>
            </div>
        </div>
        ${getStoryStyles()}
    `;
}

/**
 * Get next story day
 */
function getNextStoryDay(currentDay) {
    // Story every 5 days, continuing beyond 365
    const nextStoryDay = Math.ceil((currentDay + 1) / 5) * 5;
    return nextStoryDay; // Always return next story day, no limit
}

/**
 * Handle story choice
 */
function makeStoryChoice(choiceIndex, eventId, eventTitle, choiceText, effects, day) {
    const data = loadGameData();
    
    // Mark story as completed
    if (!data.completedStories) data.completedStories = [];
    data.completedStories.push(day);
    
    // Add to events log
    data.events.push({
        message: `📖 Story: "${eventTitle}" - ${choiceText}`,
        date: new Date().toISOString(),
        read: false
    });
    
    // Parse and apply effects
    applyStoryEffects(data, effects);
    
    saveGameData(data);
    
    // Show success message and refresh story app
    alert(`Choice made: ${choiceText}\nEffects: ${effects}`);
    openStoryApp();
}

/**
 * Apply story effects to game data
 */
function applyStoryEffects(data, effects) {
    if (effects.includes('happiness +')) {
        const bonus = parseInt(effects.match(/happiness \+(\d+)/)[1]);
        data.happiness = Math.min(100, data.happiness + bonus);
    }
    if (effects.includes('happiness -')) {
        const penalty = parseInt(effects.match(/happiness -(\d+)/)[1]);
        data.happiness = Math.max(0, data.happiness - penalty);
    }
    if (effects.includes('money +€')) {
        const bonus = parseInt(effects.match(/money \+€(\d+,?\d*)/)[1].replace(',', ''));
        data.bankBalance += bonus;
    }
    if (effects.includes('money -€')) {
        const penalty = parseInt(effects.match(/money -€(\d+,?\d*)/)[1].replace(',', ''));
        data.bankBalance -= penalty;
        data.bankBalance = Math.max(0, data.bankBalance); // Don't go negative
    }
    if (effects.includes('stress +')) {
        // Track stress events
        data.events.push({
            message: `Stress levels increased from recent life events`,
            date: new Date().toISOString(),
            read: false
        });
    }
    if (effects.includes('skill_points +')) {
        const bonus = parseInt(effects.match(/skill_points \+(\d+)/)[1]);
        data.skillPoints = (data.skillPoints || 0) + bonus;
    }
    if (effects.includes('health +')) {
        const bonus = parseInt(effects.match(/health \+(\d+)/)[1]);
        data.health = Math.min(100, data.health + bonus);
    }
    if (effects.includes('relationship_')) {
        // Handle relationship effects
        const relationshipMatch = effects.match(/relationship_(\w+)_([+-])(\d+)/);
        if (relationshipMatch) {
            const npcName = relationshipMatch[1];
            const operator = relationshipMatch[2];
            const value = parseInt(relationshipMatch[3]);
            
            if (!data.relationships) data.relationships = {};
            if (!data.relationships[npcName]) {
                data.relationships[npcName] = { level: 0, interactions: 0, lastInteraction: null };
            }
            
            if (operator === '+') {
                data.relationships[npcName].level += value;
            } else {
                data.relationships[npcName].level -= value;
            }
            
            data.relationships[npcName].level = Math.max(0, Math.min(100, data.relationships[npcName].level));
            data.relationships[npcName].interactions++;
            data.relationships[npcName].lastInteraction = data.day;
        }
    }
    // Add more effect parsing as needed
}

/**
 * Get story app styles
 */
function getStoryStyles() {
    return `
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
            
            .story-header.completed {
                background: linear-gradient(135deg, #28a745, #20c997);
            }
            
            .story-header.no-story {
                background: linear-gradient(135deg, #6c757d, #495057);
            }
            
            .story-icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
            
            .story-header h2 {
                margin: 0 0 10px 0;
                font-size: 24px;
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
                margin: 0 0 15px 0;
            }
            
            .story-description p:last-child {
                margin-bottom: 0;
            }
            
            .story-choices h4 {
                color: #495057;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .story-choice-btn {
                width: 100%;
                background: white;
                border: 2px solid #e9ecef;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }
            
            .story-choice-btn:hover {
                border-color: #667eea;
                background: #f8f9fa;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
            }
            
            .choice-text {
                font-size: 16px;
                font-weight: bold;
                color: #495057;
                margin-bottom: 8px;
            }
            
            .choice-effects {
                font-size: 12px;
                color: #28a745;
                font-style: italic;
            }
            
            .story-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 15px;
                border-left: 4px solid #6c757d;
            }
            
            .story-info h4 {
                color: #495057;
                margin-bottom: 15px;
            }
            
            .story-info ul {
                color: #6c757d;
                line-height: 1.8;
            }
        </style>
    `;
}

// Export functions
window.openStoryApp = openStoryApp;