// inventory.js - Complete inventory management system

function renderInventory() {
    const data = loadGameData();
    const modalBody = document.getElementById('modal-body');

    if (!data.inventory || data.inventory.length === 0) {
        modalBody.innerHTML = `
            <div class="inventory-empty">
                <div style="font-size: 3rem; margin-bottom: 20px;">📦</div>
                <h3>Your inventory is empty</h3>
                <p>Visit the market to buy some items!</p>
                <button onclick="closeApp(); openMarket();" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Go to Market
                </button>
            </div>
        `;
        return;
    }

    const inventoryStats = getInventoryStats();
    const categories = getInventoryCategories(data.inventory);

    modalBody.innerHTML = `
        <div class="inventory-container">
            <div class="inventory-header">
                <div>
                    <h3 style="margin: 0; color: #667eea;">Your Items (${data.inventory.length})</h3>
                    <div class="inventory-value">Total Value: €${inventoryStats.totalCurrentValue}</div>
                    <div style="font-size: 12px; color: #6c757d;">
                        Original: €${inventoryStats.totalOriginalValue} | 
                        Depreciation: €${inventoryStats.totalDepreciation}
                    </div>
                </div>
                <button onclick="sellAllItems()" class="sell-all-btn" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Sell All
                </button>
            </div>

            <!-- Category Tabs -->
            <div class="category-tabs" style="display: flex; gap: 5px; margin-bottom: 15px; border-bottom: 2px solid #e9ecef;">
                ${Object.keys(categories).map(category => `
                    <button class="category-tab ${category === 'all' ? 'active' : ''}" 
                            onclick="switchInventoryCategory('${category}')" 
                            style="padding: 8px 12px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; font-weight: 500;">
                        ${getCategoryInfo(category).icon} ${getCategoryInfo(category).name} (${categories[category].length})
                    </button>
                `).join('')}
            </div>

            <div class="inventory-grid" id="inventory-grid">
                ${categories.all.map((item, index) => generateInventoryItemHTML(item, data.inventory.indexOf(item))).join('')}
            </div>

               <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Tips</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
            <li>Items depreciate over time (10% every 10 days)</li>
                    <li>Market events can affect item values</li>
                    <li>Luxury items hold value better</li>
                    <li>Food items expire after 7 days</li>
                    <li>Food and drinks can be consumed to restore health</li>
                    <li>Different items provide different health benefits</li>
          </ul>
        </div>
        </div>
    `;
}

function generateInventoryItemHTML(item, index) {
    const data = loadGameData();
    const currentValue = calculateItemValue(item, data.day);
    const originalValue = item.price;
    const valueChange = currentValue - originalValue;
    const valueChangePercent = ((valueChange / originalValue) * 100).toFixed(1);

    // Check if item is expired (food items)
    const isExpired = item.category === 'food' && (data.day - (item.purchaseDay || data.day)) > 7;

    return `
        <div class="inventory-item ${isExpired ? 'expired' : ''}">
            <div class="inventory-item-icon">${item.icon}</div>
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-value">
                <div style="font-weight: bold; color: ${valueChange >= 0 ? '#28a745' : '#dc3545'};">
                    €${currentValue}
                </div>
                <div style="font-size: 10px; color: ${valueChange >= 0 ? '#28a745' : '#dc3545'};">
                    ${valueChange >= 0 ? '+' : ''}${valueChangePercent}%
                </div>
            </div>
            <div style="font-size: 10px; color: #6c757d; margin-bottom: 8px;">
                ${getDaysOldText(item, data.day)}
            </div>
            <div class="item-actions">
                ${isExpired ? 
                    `<button class="sell-btn expired" onclick="disposeItem(${index})" style="background: #6c757d;">Dispose</button>` :
                    `<button class="sell-btn" onclick="sellItem(${index})">Sell</button>`
                }
                ${isConsumable(item) ? 
                    `<button class="consume-btn" onclick="consumeItem(${index})" style="background: #28a745; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; margin-left: 4px;">
                        ${item.category === 'food' ? '🍽️' : '☕'} Use
                    </button>` : ''
                }
            </div>
        </div>
    `;
}

function calculateItemValue(item, currentDay) {
    const daysSincePurchase = currentDay - (item.purchaseDay || currentDay);
    const marketModifier = item.marketModifier || 1.0;

    // Food items expire after 7 days
    if (item.category === 'food' && daysSincePurchase > 7) {
        return 0;
    }

    // FIXED: Immediate 25% depreciation upon purchase to prevent buy-sell exploit
    let immediateDepreciation = 0.25; // 25% loss immediately when bought

    // Calculate additional depreciation (10% every 10 days)
    const depreciationPeriods = Math.floor(daysSincePurchase / 10);
    const timeBasedDepreciation = depreciationPeriods * window.GAME_BALANCE.ITEM_DEPRECIATION_RATE;

    // Luxury items have reduced time-based depreciation but still lose 25% immediately
    const finalTimeBasedDepreciation = item.category === 'luxury' ? timeBasedDepreciation * 0.5 : timeBasedDepreciation;
    
    // Total depreciation = immediate + time-based
    const totalDepreciation = immediateDepreciation + finalTimeBasedDepreciation;

    // Apply market modifier and depreciation
    let value = item.price * marketModifier * (1 - totalDepreciation);

    // Minimum value is 10% of original price (except food)
    const minValue = item.category === 'food' ? 0 : item.price * window.GAME_BALANCE.MIN_ITEM_VALUE_RATIO;

    return Math.max(Math.floor(value), minValue);
}

function getDaysOldText(item, currentDay) {
    const daysOld = currentDay - (item.purchaseDay || currentDay);
    if (daysOld === 0) return 'Brand new';
    if (daysOld === 1) return '1 day old';
    return `${daysOld} days old`;
}

/**
 * Get inventory organized by categories
 */
function getInventoryCategories(inventory) {
    const categories = {
        all: [...inventory],
        food: [],
        electronics: [],
        luxury: [],
        vehicles: [],
        other: []
    };

    inventory.forEach(item => {
        if (categories[item.category]) {
            categories[item.category].push(item);
        } else {
            categories.other.push(item);
        }
    });

    return categories;
}

/**
 * Get category display information
 */
function getCategoryInfo(category) {
    const categoryMap = {
        all: { name: 'All', icon: '📦' },
        food: { name: 'Food & Drinks', icon: '🍕' },
        electronics: { name: 'Electronics', icon: '📱' },
        luxury: { name: 'Luxury', icon: '💎' },
        vehicles: { name: 'Vehicles', icon: '🚗' },
        other: { name: 'Other', icon: '📋' }
    };

    return categoryMap[category] || { name: 'Unknown', icon: '❓' };
}

/**
 * Switch inventory category view
 */
function switchInventoryCategory(category) {
    const data = loadGameData();
    const categories = getInventoryCategories(data.inventory);
    const grid = document.getElementById('inventory-grid');

    // Update tab appearance
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.style.borderBottomColor = 'transparent';
        tab.style.color = '#6c757d';
    });

    const activeTab = document.querySelector(`[onclick="switchInventoryCategory('${category}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.borderBottomColor = '#667eea';
        activeTab.style.color = '#667eea';
    }

    // Update grid content
    const items = categories[category] || [];
    grid.innerHTML = items.map((item, index) => 
        generateInventoryItemHTML(item, data.inventory.indexOf(item))
    ).join('');
}

/**
 * Check if item is consumable (food or drinks)
 */
function isConsumable(item) {
    return item.category === 'food';
}

/**
 * Consume an item to restore health
 */
function consumeItem(index) {
    const data = loadGameData();
    const item = data.inventory[index];

    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }

    if (!isConsumable(item)) {
        showToast('This item cannot be consumed!', 'warning');
        return;
    }

    // Check if expired
    const daysOld = data.day - (item.purchaseDay || data.day);
    if (daysOld > 7) {
        showToast('This item has expired and cannot be consumed!', 'error');
        return;
    }

    // Calculate health restoration based on item price
    const healthGain = Math.min(25, Math.max(3, Math.floor(item.price / 3)));

    // Use correct health property (data.health, not data.characterStats.health)
    const currentHealth = data.health ?? 100;
    const newHealth = Math.min(100, currentHealth + healthGain);
    const actualGain = newHealth - currentHealth;

    if (actualGain <= 0) {
        showToast('Your health is already at maximum!', 'info');
        return;
    }

    // Apply health gain
    data.health = newHealth;

    // Reset food addiction and counter
    data.foodAddiction = Math.min(100, (data.foodAddiction || 50) + 10);
    data.daysSinceLastFood = 0;

    // Remove item from inventory
    data.inventory.splice(index, 1);

    // Add event
    data.events.push({
        message: `Consumed ${item.name} and restored ${actualGain} health points`,
        date: new Date().toISOString(),
        read: false
    });

    saveGameData(data);
    updateAllUI();
    renderInventory(); // Refresh inventory display

    showToast(`${item.icon} +${actualGain} Health!`, 'success');
}

function sellItem(index) {
    const data = loadGameData();
    const item = data.inventory[index];

    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }

    const sellValue = calculateItemValue(item, data.day);

    if (sellValue <= 0) {
        showToast('Item has no resale value!', 'warning');
        return;
    }

    // Confirm sale
    showModal(
        'Sell Item',
        `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 15px;">${item.icon}</div>
                <h3>${item.name}</h3>
                <p>Sell for <strong style="color: #28a745;">€${sellValue}</strong>?</p>
                <p style="font-size: 14px; color: #6c757d;">
                    Original price: €${item.price}
                </p>
            </div>
        `,
        { showCancel: true }
    ).then((confirmed) => {
        if (confirmed) {
            processSale(index, sellValue);
        }
    });
}

function processSale(index, sellValue) {
    const data = loadGameData();
    const item = data.inventory[index];

    // SECURITY FIX: Validate sell value is reasonable
    const validatedSellValue = Math.max(0, Math.min(10000, sellValue)); // Max €10k per item sale
    data.bankBalance += validatedSellValue;

    // Remove from inventory
    data.inventory.splice(index, 1);

    // Add event
    data.events.push({
        message: `Sold ${item.name} for €${sellValue}`,
        date: new Date().toISOString(),
        read: false
    });

    saveGameData(data);
    updateAllUI();
    renderInventory(); // Refresh inventory display

    showToast(`Sold ${item.name} for €${sellValue}!`, 'success');
}

function sellAllItems() {
    const data = loadGameData();

    if (!data.inventory || data.inventory.length === 0) {
        showToast('No items to sell!', 'info');
        return;
    }

    const totalValue = data.inventory.reduce((total, item) => {
        return total + calculateItemValue(item, data.day);
    }, 0);

    if (totalValue <= 0) {
        showToast('No items have resale value!', 'warning');
        return;
    }

    showModal(
        'Sell All Items',
        `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 15px;">💰</div>
                <h3>Sell All Items</h3>
                <p>Sell all ${data.inventory.length} items for <strong style="color: #28a745;">€${totalValue}</strong>?</p>
                <p style="font-size: 14px; color: #dc3545;">This action cannot be undone!</p>
            </div>
        `,
        { showCancel: true }
    ).then((confirmed) => {
        if (confirmed) {
            processAllSales(totalValue);
        }
    });
}

function processAllSales(totalValue) {
    const data = loadGameData();
    const itemCount = data.inventory.length;

    // Add money
    data.bankBalance += totalValue;

    // Clear inventory
    data.inventory = [];

    // Add event
    data.events.push({
        message: `Sold all ${itemCount} items for €${totalValue}`,
        date: new Date().toISOString(),
        read: false
    });

    saveGameData(data);
    updateAllUI();
    renderInventory(); // Refresh inventory display

    showToast(`Sold all items for €${totalValue}!`, 'success');
}

function disposeItem(index) {
    const data = loadGameData();
    const item = data.inventory[index];

    if (!item) {
        showToast('Item not found!', 'error');
        return;
    }

    showModal(
        'Dispose Item',
        `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🗑️</div>
                <h3>Dispose ${item.name}</h3>
                <p style="color: #dc3545;">This expired item will be thrown away with no refund.</p>
            </div>
        `,
        { showCancel: true }
    ).then((confirmed) => {
        if (confirmed) {
            // Remove from inventory
            data.inventory.splice(index, 1);

            // Add event
            data.events.push({
                message: `Disposed expired ${item.name}`,
                date: new Date().toISOString(),
                read: false
            });

            saveGameData(data);
            updateAllUI();
            renderInventory(); // Refresh inventory display

            showToast(`Disposed ${item.name}`, 'info');
        }
    });
}

function getInventoryStats() {
    const data = loadGameData();

    if (!data.inventory || data.inventory.length === 0) {
        return {
            totalItems: 0,
            totalOriginalValue: 0,
            totalCurrentValue: 0,
            totalDepreciation: 0
        };
    }

    let totalOriginalValue = 0;
    let totalCurrentValue = 0;

    data.inventory.forEach(item => {
        totalOriginalValue += item.price;
        totalCurrentValue += calculateItemValue(item, data.day);
    });

    return {
        totalItems: data.inventory.length,
        totalOriginalValue,
        totalCurrentValue,
        totalDepreciation: totalOriginalValue - totalCurrentValue
    };
}

// Add inventory-specific styles
const inventoryStyles = `
    .inventory-item.expired {
        background: #f8d7da;
        border: 2px solid #dc3545;
    }

    .inventory-item.expired .inventory-item-icon {
        opacity: 0.5;
    }

    .sell-btn.expired {
        background: #6c757d !important;
    }

    .sell-all-btn:hover {
        background: #c82333 !important;
    }
`;

// Add styles to document if not already added
if (!document.querySelector('#inventory-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'inventory-styles';
    styleSheet.textContent = inventoryStyles;
    document.head.appendChild(styleSheet);
}

// Export functions
window.renderInventory = renderInventory;
window.sellItem = sellItem;
window.sellAllItems = sellAllItems;
window.disposeItem = disposeItem;
window.getInventoryStats = getInventoryStats;
window.getInventoryValue = () => getInventoryStats().totalCurrentValue; // For compatibility
window.isConsumable = isConsumable;
window.consumeItem = consumeItem;

function isConsumable(item) {
    return item.category === 'food' || 
           (item.category === 'drinks' || item.name.toLowerCase().includes('coffee') || 
            item.name.toLowerCase().includes('tea') || item.name.toLowerCase().includes('energy drink') ||
            item.name.toLowerCase().includes('soda') || item.name.toLowerCase().includes('juice'));
}

function consumeItem(index) {
    const data = loadGameData();
    const item = data.inventory[index];

    if (!item || !isConsumable(item)) {
        showToast('Item cannot be consumed!', 'error');
        return;
    }

    // Check if expired
    const isExpired = item.category === 'food' && (data.day - (item.purchaseDay || data.day)) > 7;
    if (isExpired) {
        showToast('Cannot consume expired food!', 'warning');
        return;
    }

    // Calculate health restoration based on item type and price
    let healthBoost = 0;
    if (item.category === 'food') {
        healthBoost = Math.min(25, Math.floor(item.price / 2) + 5); // Food gives 5-25 health
    } else {
        healthBoost = Math.min(15, Math.floor(item.price / 3) + 3); // Drinks give 3-15 health
    }

    // Apply health boost
    data.health = Math.min(100, (data.health ?? 100) + healthBoost);

    // Reset food addiction
    data.foodAddiction = Math.min(100, (data.foodAddiction || 50) + 5);
    data.daysSinceLastFood = 0;

    // Remove item from inventory
    data.inventory.splice(index, 1);

    // Add event
    data.events.push({
        message: `Consumed ${item.name} (+${healthBoost} health)`,
        date: new Date().toISOString(),
        read: false
    });

    saveGameData(data);
    updateStatusBar();
    renderInventory();

    const consumeText = item.category === 'food' ? 'ate' : 'drank';
    showToast(`You ${consumeText} ${item.name} and restored ${healthBoost} health!`, 'success');
}
