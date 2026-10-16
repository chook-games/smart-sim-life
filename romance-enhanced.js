/**
 * Enhanced Romance App
 * Integrates with Story system for dynamic relationship events
 */

/**
 * Open the enhanced Romance app
 */
function openRomanceApp() {
    try {
        document.getElementById('modal-title').innerHTML = '<i class="fas fa-heart"></i> Romance';
        document.getElementById('modal-body').innerHTML = getEnhancedRomanceContent();
        document.getElementById('app-modal').classList.remove('hidden');
    } catch (error) {
        console.error('Error opening Romance app:', error);
        document.getElementById('modal-body').innerHTML = getErrorContent('Unable to open Romance app');
    }
}

/**
 * Get enhanced romance app content
 */
function getEnhancedRomanceContent() {
    try {
        const data = loadGameData();
        
        // Ensure relationships object exists and is properly initialized
        if (!data || typeof data !== 'object') {
            console.error('Invalid game data');
            return getErrorContent('Game data not found');
        }
        
        if (!data.relationships || typeof data.relationships !== 'object') {
            data.relationships = {};
            saveGameData(data);
        }
        
        const relationshipCount = Object.keys(data.relationships).length;
        const hasActiveRelationships = relationshipCount > 0;
        
        let content = `
            <div class="enhanced-romance-container" style="padding: 20px;">
                <div class="app-header" style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #e74c3c; margin-bottom: 10px;">💕 Romance & Relationships</h2>
                    <p style="color: #7f8c8d; font-size: 14px;">Build meaningful connections through story events and activities</p>
                </div>
                
                ${hasActiveRelationships ? getActiveRelationshipsSection(data) : ''}
                
                <div class="romance-info-section" style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">💫 Relationship System</h3>
                    <div style="font-size: 14px; line-height: 1.6; color: #495057;">
                        <p><strong>📖 Story Events:</strong> Relationship events appear randomly in the Story app on non-main-story days (25% chance)</p>
                        <p><strong>🎭 Progressive Romance:</strong> Start as strangers, build friendship, develop romance, and create lasting partnerships</p>
                        <p><strong>👥 Five Unique NPCs:</strong> Each with distinct personalities, interests, and relationship styles</p>
                        <p><strong>⚡ Dynamic Events:</strong> Events adapt based on your current relationship level and history</p>
                    </div>
                </div>
                
                <div class="npc-gallery" style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">🌟 Available People</h3>
                    ${getNPCGallery(data)}
                </div>
                
                <div class="relationship-tips" style="background: #e3f2fd; padding: 20px; border-radius: 15px; border-left: 4px solid #2196f3;">
                    <h4 style="color: #1976d2; margin-bottom: 15px;">💡 Romance Tips</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #424242; font-size: 14px;">
                        <li>Relationships develop naturally through Story app events</li>
                        <li>Each person has different interests and personality traits</li>
                        <li>Your choices in relationship events affect the connection strength</li>
                        <li>Higher relationships unlock deeper, more meaningful interactions</li>
                        <li>Romance events become available as friendships deepen (level 50+)</li>
                    </ul>
                </div>
                
                ${getRelationshipStats(data)}
            </div>
            ${getEnhancedRomanceStyles()}
        `;
        
        return content;
    } catch (error) {
        console.error('Error in getEnhancedRomanceContent:', error);
        return getErrorContent('Unable to load romance content');
    }
}

/**
 * Get error content for Romance app
 */
function getErrorContent(message) {
    return `
        <div style="padding: 20px; text-align: center;">
            <h2 style="color: #e74c3c;">⚠️ Error</h2>
            <p style="color: #666;">${message}</p>
            <button onclick="location.reload()" style="
                background: #3498db; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 5px; 
                cursor: pointer;
            ">Refresh Game</button>
        </div>
    `;
}

/**
 * Get active relationships section
 */
function getActiveRelationshipsSection(data) {
    try {
        const relationships = data.relationships || {};
        
        let content = `
            <div class="active-relationships" style="background: #fff3e0; padding: 20px; border-radius: 15px; margin-bottom: 25px; border-left: 4px solid #ff9800;">
                <h3 style="color: #ef6c00; margin-bottom: 15px;">💖 Your Relationships</h3>
                <div class="relationships-grid" style="display: grid; gap: 15px;">
        `;
        
        Object.entries(relationships).forEach(([name, relationship]) => {
            const level = relationship?.level || 0;
            const interactions = relationship?.interactions || 0;
            const lastInteraction = relationship?.lastInteraction || 'Never';
            
            let statusIcon = '👋';
            let statusText = 'Stranger';
            let statusColor = '#95a5a6';
            
            if (level >= 75) {
                statusIcon = '💕';
                statusText = 'Romantic Partner';
                statusColor = '#e74c3c';
            } else if (level >= 50) {
                statusIcon = '😍';
                statusText = 'Close Friend';
                statusColor = '#f39c12';
            } else if (level >= 20) {
                statusIcon = '😊';
                statusText = 'Friend';
                statusColor = '#27ae60';
            } else if (level > 0) {
                statusIcon = '🙂';
                statusText = 'Acquaintance';
                statusColor = '#3498db';
            }
            
            content += `
                <div class="relationship-card" style="
                    background: white; 
                    padding: 15px; 
                    border-radius: 10px; 
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    border-left: 4px solid ${statusColor};
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: #2c3e50;">${statusIcon} ${name}</h4>
                        <span style="font-size: 12px; color: ${statusColor}; font-weight: bold;">${statusText}</span>
                    </div>
                    <div style="font-size: 13px; color: #6c757d; margin-bottom: 8px;">
                        Relationship Level: ${level}/100
                    </div>
                    <div style="background: #ecf0f1; border-radius: 10px; overflow: hidden; height: 6px; margin-bottom: 8px;">
                        <div style="background: ${statusColor}; height: 100%; width: ${level}%; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #7f8c8d;">
                        <span>Interactions: ${interactions}</span>
                        <span>Last: Day ${lastInteraction}</span>
                    </div>
                </div>
            `;
        });
        
        content += '</div></div>';
        return content;
    } catch (error) {
        console.error('Error in getActiveRelationshipsSection:', error);
        return '<div style="color: red; padding: 20px;">Error loading relationships</div>';
    }
}

/**
 * Get NPC gallery
 */
function getNPCGallery(data) {
    try {
        const npcs = [
            { name: "Alex", personality: "Adventurous", interests: "Travel, Sports, Photography", emoji: "🏃‍♀️" },
            { name: "Sam", personality: "Intellectual", interests: "Books, Art, Philosophy", emoji: "📚" },
            { name: "Jordan", personality: "Ambitious", interests: "Career, Networking, Fitness", emoji: "💼" },
            { name: "Casey", personality: "Creative", interests: "Music, Writing, Cooking", emoji: "🎨" },
            { name: "Taylor", personality: "Caring", interests: "Family, Volunteering, Gardening", emoji: "🌱" }
        ];
        
        const relationships = data.relationships || {};
        
        let content = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">';
        
        npcs.forEach(npc => {
            const relationship = relationships[npc.name];
            const level = relationship?.level || 0;
            const hasMetBefore = level > 0;
            
            let cardBackground = hasMetBefore ? '#f8f9fa' : '#e9ecef';
            let nameDisplay = hasMetBefore ? npc.name : '???';
            let detailsDisplay = hasMetBefore ? `
                <div style="font-size: 13px; color: #6c757d; margin-bottom: 5px;">
                    <strong>Personality:</strong> ${npc.personality}
                </div>
                <div style="font-size: 13px; color: #6c757d; margin-bottom: 10px;">
                    <strong>Interests:</strong> ${npc.interests}
                </div>
                <div style="font-size: 12px; color: #495057;">
                    <strong>Relationship:</strong> ${level}/100
                </div>
            ` : `
                <div style="font-size: 13px; color: #6c757d; margin-bottom: 15px;">
                    Meet them through Story events to learn more!
                </div>
            `;
            
            content += `
                <div class="npc-card" style="
                    background: ${cardBackground}; 
                    padding: 15px; 
                    border-radius: 10px; 
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                ">
                    <div style="font-size: 2rem; margin-bottom: 10px;">${hasMetBefore ? npc.emoji : '❓'}</div>
                    <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${nameDisplay}</h4>
                    ${detailsDisplay}
                </div>
            `;
        });
        
        content += '</div>';
        return content;
    } catch (error) {
        console.error('Error in getNPCGallery:', error);
        return '<div style="color: red;">Error loading NPC gallery</div>';
    }
}

/**
 * Get relationship statistics
 */
function getRelationshipStats(data) {
    try {
        const relationships = data.relationships || {};
        const relationshipCount = Object.keys(relationships).length;
        const totalInteractions = Object.values(relationships).reduce((sum, rel) => sum + (rel?.interactions || 0), 0);
        const averageLevel = relationshipCount > 0 ? 
            Math.round(Object.values(relationships).reduce((sum, rel) => sum + (rel?.level || 0), 0) / relationshipCount) : 0;
        
        return `
            <div class="relationship-stats" style="background: #f1f8e9; padding: 20px; border-radius: 15px; border-left: 4px solid #4caf50;">
                <h4 style="color: #2e7d32; margin-bottom: 15px;">📊 Your Social Statistics</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
                    <div>
                        <div style="font-size: 1.5rem; color: #4caf50; font-weight: bold;">${relationshipCount}</div>
                        <div style="font-size: 12px; color: #6c757d;">People Met</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; color: #4caf50; font-weight: bold;">${totalInteractions}</div>
                        <div style="font-size: 12px; color: #6c757d;">Total Interactions</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; color: #4caf50; font-weight: bold;">${averageLevel}</div>
                        <div style="font-size: 12px; color: #6c757d;">Average Relationship</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error in getRelationshipStats:', error);
        return '<div style="color: red;">Error loading statistics</div>';
    }
}

/**
 * Get enhanced romance app styles
 */
function getEnhancedRomanceStyles() {
    return `
        <style>
            .enhanced-romance-container {
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .relationship-card:hover {
                transform: translateY(-2px);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15) !important;
            }
            
            .npc-card:hover {
                transform: translateY(-2px);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15) !important;
            }
            
            .relationships-grid {
                animation: fadeIn 0.5s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    `;
}

// Export functions to replace the existing ones
window.openRomanceApp = openRomanceApp;
window.openRelationships = openRomanceApp; // Redirect old function to new enhanced version