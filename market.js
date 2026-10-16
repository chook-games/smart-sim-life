// market.js - Enhanced market system with proper inventory integration

function getMarketContent() {
    return `
        <div class="market-container">
            <div class="market-categories">
                <button class="category-btn active" onclick="showMarketCategory('all')">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><rect x="3" y="3" width="18" height="18" rx="2" fill="#4169e1"/><rect x="6" y="6" width="12" height="12" fill="#fff" opacity="0.8"/><rect x="8" y="8" width="8" height="8" fill="#4169e1"/></svg>
                    All
                </button>
                <button class="category-btn" onclick="showMarketCategory('electronics')">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><rect x="3" y="5" width="18" height="12" rx="2" fill="#2f4f4f" stroke="#000" stroke-width="1.5"/><rect x="5" y="7" width="14" height="8" fill="#000"/><circle cx="12" cy="19" r="1" fill="#2f4f4f"/><rect x="10" y="17" width="4" height="2" fill="#2f4f4f"/></svg>
                    Tech
                </button>
                <button class="category-btn" onclick="showMarketCategory('clothing')">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M6 2 L8 2 L8 8 L6 10 L6 22 L18 22 L18 10 L16 8 L16 2 L18 2 L20 6 L22 4 L20 0 L4 0 L2 4 L4 6 Z" fill="#dc143c" stroke="#8b0000" stroke-width="1"/></svg>
                    Clothes
                </button>
                <button class="category-btn" onclick="showMarketCategory('home')">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M3 12 L12 3 L21 12 L21 20 C21 20.6 20.6 21 20 21 L4 21 C3.4 21 3 20.6 3 20 Z" fill="#d2691e" stroke="#8b4513" stroke-width="1.5"/><rect x="10" y="16" width="4" height="5" fill="#654321"/></svg>
                    Home
                </button>
                <button class="category-btn" onclick="showMarketCategory('luxury')">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1"/></svg>
                    Luxury
                </button>
                <button class="category-btn" onclick="showMarketCategory('food')">
                    <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><circle cx="12" cy="12" r="8" fill="#ff6b35" stroke="#d45087" stroke-width="2"/><path d="M8 12 Q12 8 16 12 Q12 16 8 12" fill="#fff"/></svg>
                    Food
                </button>
            </div>
            <div id="market-items" class="market-grid">
                ${generateMarketItems('all')}
            </div>

                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Tips</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
            <li>Eating food immediately restores health (3-25 points)</li>
                    <li>Drinking beverages also boosts your health instantly</li>
                    <li>All items lose 25% value immediately when purchased</li>
                    <li>Luxury items depreciate slower over time but still lose initial 25%</li>
                    <li>Food expires after 7 days, so consume it quickly</li>
          </ul>
        </div>
        </div>
    `;
}

function generateMarketItems(category) {
    let items = [];

    if (category === 'all') {
        // Show all categories
        Object.values(window.MARKET_ITEMS).forEach(categoryItems => {
            items = items.concat(categoryItems);
        });
    } else {
        items = window.MARKET_ITEMS[category] || [];
    }

    return items.map(item => generateMarketItemHTML(item)).join('');
}

function generateMarketItemHTML(item) {
    const data = loadGameData();
    const canAfford = data.bankBalance >= item.price;

    return `
        <div class="market-item ${!canAfford ? 'unaffordable' : ''}">
            <div class="market-item-icon">${item.icon}</div>
            <div class="market-item-name">${item.name}</div>
            <div class="market-item-price">€${item.price}</div>
            <button class="buy-btn" ${!canAfford ? 'disabled' : ''} onclick="buyItem('${item.id}')">
                ${canAfford ? 'Buy' : 'Too Expensive'}
            </button>
        </div>
    `;
}

function showMarketCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update items display
    document.getElementById('market-items').innerHTML = generateMarketItems(category);
}

function buyItem(itemId) {
    const data = loadGameData();

    // Find the item in all categories
    let item = null;
    for (const category of Object.values(window.MARKET_ITEMS)) {
        item = category.find(i => i.id === itemId);
        if (item) break;
    }

    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }

    if (data.bankBalance < item.price) {
        showToast('Insufficient funds!', 'warning');
        return;
    }

    // SECURITY FIX: Validate item price before purchase
    const validatedPrice = Math.max(0, Math.min(50000, item.price)); // Max €50k per item
    data.bankBalance -= validatedPrice;

    // Add to inventory
    if (!data.inventory) data.inventory = [];

    const inventoryItem = {
        id: item.id,
        name: item.name,
        icon: item.icon,
        category: item.category,
        price: item.price,
        purchaseDay: data.day,
        purchaseDate: new Date().toISOString(),
        marketModifier: 1.0
    };

    data.inventory.push(inventoryItem);

    // Update achievements
    data.achievements.itemsBought.progress++;
    checkAchievementProgress(data, 'itemsBought');

    // Add event
    data.events.push({
        message: `Purchased ${item.name} for €${item.price}`,
        date: new Date().toISOString(),
        read: false
    });

    // Update happiness based on item value
    let happinessBonus = Math.min(20, Math.floor(item.price / 50));
    if (item.category === 'luxury') happinessBonus *= 2;
    data.happiness = Math.min(100, data.happiness + happinessBonus);

    // Update lifetime stats
    updateLifetimeStats(data, 0, item.price);

    saveGameData(data);
    updateAllUI();

    showToast(`Purchased ${item.name}!`, 'success');

    // Refresh market display
    const currentCategory = document.querySelector('.category-btn.active').textContent === 'All' ? 'all' : 
                           document.querySelector('.category-btn.active').textContent === 'Tech' ? 'electronics' :
                           document.querySelector('.category-btn.active').textContent === 'Clothes' ? 'clothing' :
                           document.querySelector('.category-btn.active').textContent === 'Home' ? 'home' :
                           document.querySelector('.category-btn.active').textContent === 'Luxury' ? 'luxury' : 'food';

    document.getElementById('market-items').innerHTML = generateMarketItems(currentCategory);
}

// Add to CSS for unaffordable items
const marketStyles = `
    .market-item.unaffordable {
        opacity: 0.6;
        background: #f8f9fa;
    }

    .market-item.unaffordable .buy-btn {
        background: #6c757d;
        cursor: not-allowed;
    }

    .market-categories {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .market-categories::-webkit-scrollbar {
        display: none;
    }
`;

// Add styles to document if not already added
if (!document.querySelector('#market-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'market-styles';
    styleSheet.textContent = marketStyles;
    document.head.appendChild(styleSheet);
}

// Export functions
window.showMarketCategory = showMarketCategory;
window.buyItem = buyItem;
window.getMarketContent = getMarketContent;
