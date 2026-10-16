// realestate.js - Housing system for renting and buying homes

// Housing options with costs and requirements
const HOUSING = {
  'Parents Home': {
    type: 'free',
    rentPrice: 0,
    buyPrice: 0,
    dailyCost: 0,
    description: 'Living with your parents rent-free. No privacy but saves money.',
    happiness: -5,
    requirements: { age: { max: 35 } }
  },
  'Studio Apartment': {
    type: 'rent',
    rentPrice: 800,
    buyPrice: 50000,
    dailyCost: 25,
    description: 'Small but cozy studio apartment. Perfect for young professionals.',
    happiness: 0,
    requirements: { income: 60 }
  },
  'One Bedroom Apartment': {
    type: 'rent',
    rentPrice: 1200,
    buyPrice: 75000,
    dailyCost: 35,
    description: 'Comfortable apartment with separate bedroom and living area.',
    happiness: 5,
    requirements: { income: 90 }
  },
  'Two Bedroom Apartment': {
    type: 'rent',
    rentPrice: 1600,
    buyPrice: 95000,
    dailyCost: 50,
    description: 'Spacious apartment perfect for couples or roommates.',
    happiness: 10,
    requirements: { income: 120 }
  },
  'Small House': {
    type: 'both',
    rentPrice: 2000,
    buyPrice: 120000,
    dailyCost: 60,
    description: 'Cozy house with a small yard. Great for starting a family.',
    happiness: 15,
    requirements: { income: 150 }
  },
  'Family House': {
    type: 'both',
    rentPrice: 2800,
    buyPrice: 180000,
    dailyCost: 85,
    description: 'Large family home with multiple bedrooms and a big yard.',
    happiness: 25,
    requirements: { income: 200 }
  },
  'Luxury House': {
    type: 'both',
    rentPrice: 4000,
    buyPrice: 350000,
    dailyCost: 120,
    description: 'Luxurious mansion with premium amenities and prestigious location.',
    happiness: 40,
    requirements: { income: 300, netWorth: 100000 }
  }
};

// Housing icon function
function getHousingIcon(housingName) {
  const icons = {
    'Parents Home': `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M3 12 L12 3 L21 12 L21 18 C21 18.6 20.6 19 20 19 L4 19 C3.4 19 3 18.6 3 18 Z" fill="#8b4513" stroke="#654321" stroke-width="1.5"/><path d="M2 12 L12 2 L22 12" stroke="#d2691e" stroke-width="2" fill="none"/><rect x="10" y="14" width="4" height="5" fill="#654321"/><circle cx="13" cy="16.5" r="0.5" fill="#ffd700"/><rect x="6" y="8" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="16" y="8" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><text x="12" y="11" text-anchor="middle" font-size="8" fill="#666">👨‍👩‍👧‍👦</text></svg>`,
    'Studio Apartment': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="4" y="6" width="16" height="14" fill="#d2691e" stroke="#8b4513" stroke-width="1.5"/><rect x="6" y="8" width="12" height="10" fill="#f5f5dc" stroke="#ddd" stroke-width="1"/><rect x="10" y="16" width="4" height="2" fill="#654321"/><rect x="7" y="10" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="15" y="10" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="9" y="13" width="6" height="1" fill="#8b4513"/></svg>`,
    'One Bedroom Apartment': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="3" y="5" width="18" height="15" fill="#d2691e" stroke="#8b4513" stroke-width="1.5"/><rect x="5" y="7" width="14" height="11" fill="#f5f5dc" stroke="#ddd" stroke-width="1"/><rect x="10" y="16" width="4" height="2" fill="#654321"/><rect x="6" y="9" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="16" y="9" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><line x1="12" y1="7" x2="12" y2="18" stroke="#8b4513" stroke-width="1"/></svg>`,
    'Two Bedroom Apartment': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="2" y="4" width="20" height="16" fill="#d2691e" stroke="#8b4513" stroke-width="1.5"/><rect x="4" y="6" width="16" height="12" fill="#f5f5dc" stroke="#ddd" stroke-width="1"/><rect x="10" y="16" width="4" height="2" fill="#654321"/><rect x="5" y="8" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="17" y="8" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><line x1="12" y1="6" x2="12" y2="18" stroke="#8b4513" stroke-width="1"/><line x1="4" y1="12" x2="20" y2="12" stroke="#8b4513" stroke-width="1"/></svg>`,
    'Small House': `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M3 12 L12 3 L21 12 L21 19 C21 19.6 20.6 20 20 20 L4 20 C3.4 20 3 19.6 3 19 Z" fill="#d2691e" stroke="#8b4513" stroke-width="1.5"/><path d="M2 12 L12 2 L22 12" stroke="#8b0000" stroke-width="2" fill="none"/><rect x="10" y="15" width="4" height="5" fill="#654321"/><circle cx="13" cy="17.5" r="0.5" fill="#ffd700"/><rect x="6" y="8" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="16" y="8" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="2" y="20" width="20" height="2" fill="#32cd32"/></svg>`,
    'Family House': `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M2 12 L12 2 L22 12 L22 20 C22 20.6 21.6 21 21 21 L3 21 C2.4 21 2 20.6 2 20 Z" fill="#d2691e" stroke="#8b4513" stroke-width="1.5"/><path d="M1 12 L12 1 L23 12" stroke="#8b0000" stroke-width="2" fill="none"/><rect x="10" y="16" width="4" height="5" fill="#654321"/><circle cx="13" cy="18.5" r="0.5" fill="#ffd700"/><rect x="5" y="7" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="17" y="7" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="5" y="12" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="17" y="12" width="2" height="2" fill="#87ceeb" stroke="#4682b4" stroke-width="0.5"/><rect x="1" y="21" width="22" height="2" fill="#32cd32"/></svg>`,
    'Luxury House': `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M1 13 L12 1 L23 13 L23 21 C23 21.6 22.6 22 22 22 L2 22 C1.4 22 1 21.6 1 21 Z" fill="#4b0082" stroke="#301934" stroke-width="1.5"/><path d="M0 13 L12 0 L24 13" stroke="#8b0000" stroke-width="2" fill="none"/><rect x="10" y="17" width="4" height="5" fill="#654321"/><circle cx="13" cy="19.5" r="0.5" fill="#ffd700"/><rect x="4" y="6" width="2.5" height="2.5" fill="#87ceeb" stroke="#ffd700" stroke-width="1"/><rect x="17.5" y="6" width="2.5" height="2.5" fill="#87ceeb" stroke="#ffd700" stroke-width="1"/><rect x="4" y="12" width="2.5" height="2.5" fill="#87ceeb" stroke="#ffd700" stroke-width="1"/><rect x="17.5" y="12" width="2.5" height="2.5" fill="#87ceeb" stroke="#ffd700" stroke-width="1"/><rect x="0" y="22" width="24" height="2" fill="#32cd32"/><rect x="6" y="3" width="12" height="2" fill="#ffd700"/></svg>`
  };
  return icons[housingName] || `<div style="width: 40px; height: 40px; background: #e9ecef; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🏠</div>`;
}

function openRealEstate() {
  const data = loadGameData();
  openApp('🏠 Real Estate', getRealEstateContent());
  window.currentApp = 'realestate';
}

function getRealEstateContent() {
  const data = loadGameData();
  const currentHouse = HOUSING[data.house] || HOUSING['Parents Home'];
  const isRenting = data.homeOwnership === 'Renting';
  const ownedProperties = data.ownedProperties || [];
  
  let content = `
    <div class="realestate-container">
      <div class="current-housing-status" style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">Current Residence</h3>
        <div class="current-home-card" style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #667eea;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <div>${getHousingIcon(data.house)}</div>
            <div>
              <div style="font-weight: bold; font-size: 1.1rem;">${data.house}</div>
              <div style="font-size: 0.9rem; color: #6c757d;">${data.homeOwnership || 'Free'}</div>
            </div>
          </div>
          <div style="margin-bottom: 10px; font-size: 0.9rem; color: #495057;">${currentHouse.description}</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Daily Cost:</span>
            <span style="color: ${currentHouse.dailyCost > 0 ? '#dc3545' : '#28a745'}; font-weight: bold;">€${currentHouse.dailyCost}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <span>Happiness Effect:</span>
            <span style="color: ${currentHouse.happiness >= 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">${currentHouse.happiness > 0 ? '+' : ''}${currentHouse.happiness}</span>
          </div>
          
          <!-- Current Housing Actions -->
          <div class="housing-actions" style="display: flex; gap: 10px;">
            ${data.house !== 'Parents Home' ? `
              <button onclick="leaveCurrentHouse()" class="game-btn" style="background: #dc3545; color: white; flex: 1;">
                🚪 Leave House
              </button>
            ` : ''}
            ${ownedProperties.length > 0 ? `
              <button onclick="showOwnedProperties()" class="game-btn" style="background: #28a745; color: white; flex: 1;">
                🏠 My Properties (${ownedProperties.length})
              </button>
            ` : ''}
          </div>
        </div>
      </div>
      
      <div class="housing-tabs" style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button class="housing-tab active" onclick="showHousingTab('rent')" style="flex: 1; padding: 10px; border: none; border-radius: 10px; background: #667eea; color: white;">Rent</button>
        <button class="housing-tab" onclick="showHousingTab('buy')" style="flex: 1; padding: 10px; border: none; border-radius: 10px; background: #e9ecef; color: #495057;">Buy</button>
      </div>
      
      <div id="housing-listings">
  `;
  
  Object.entries(HOUSING).forEach(([houseName, house]) => {
    if (houseName === 'Parents Home') return; // Skip parents home in listings
    
    const canAffordRent = data.salary >= house.requirements.income;
    const canAffordBuy = data.bankBalance >= house.buyPrice && data.salary >= house.requirements.income;
    const meetsRequirements = checkHousingRequirements(data, house);
    const isCurrentHome = data.house === houseName;
    const alreadyOwned = (data.ownedProperties || []).includes(houseName);
    const canRent = house.type === 'rent' || house.type === 'both';
    const canBuy = house.type === 'both';
    
    content += `
      <div class="housing-listing rent-option" style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              ${getHousingIcon(houseName)}
            </div>
            <div>
              <h4 style="margin: 0; color: #495057;">${houseName}</h4>
              <p style="margin: 5px 0; color: #6c757d; font-size: 12px;">Happiness: ${house.happiness >= 0 ? '+' : ''}${house.happiness}</p>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="rent-price" style="color: #dc3545; font-weight: bold;">€${house.rentPrice}/month</div>
            <div class="buy-price" style="color: #28a745; font-weight: bold; display: none;">€${house.buyPrice}</div>
            <div style="color: #6c757d; font-size: 12px;">€${house.dailyCost}/day</div>
          </div>
        </div>
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">${house.description}</p>
        <div style="margin-bottom: 15px; font-size: 12px; color: #6c757d;">
          Requirements: €${house.requirements.income}/day income
          ${house.requirements.netWorth ? `, €${house.requirements.netWorth} net worth` : ''}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${isCurrentHome ? 
            `<span style="color: #6f42c1; font-weight: bold;">Current Home</span>` :
            alreadyOwned ?
            `<div>
              <span style="color: #28a745; font-weight: bold; margin-right: 10px;">✓ You Own This</span>
              <button onclick="moveToProperty('${houseName}')" class="game-btn" 
                      style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 5px; font-size: 12px;">
                Move In
              </button>
            </div>` :
            `<div>
              <button class="rent-btn" onclick="rentHouse('${houseName}')" 
                      style="padding: 8px 16px; background: ${canAffordRent && meetsRequirements ? '#dc3545' : '#6c757d'}; color: white; border: none; border-radius: 5px; margin-right: 10px; font-size: 14px;" 
                      ${!canAffordRent || !meetsRequirements ? 'disabled' : ''}>
                Rent
              </button>

              <button class="buy-btn" onclick="buyHouse('${houseName}')" 
                      style="padding: 8px 16px; background: ${canAffordBuy && meetsRequirements ? '#28a745' : '#6c757d'}; color: white; border: none; border-radius: 5px; font-size: 14px; display: none;" 
                      ${!canAffordBuy || !meetsRequirements ? 'disabled' : ''}>
                Buy
              </button>
            </div>`
          }
          <div style="color: #6c757d; font-size: 12px;">
            ${meetsRequirements && canAffordRent ? '✓ Qualified' : '✗ Not qualified'}
          </div>
        </div>
      </div>
    `;
  });
  
  content += `
      </div>
      
      ${data.house === 'Parents Home' ? `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">🏠 Housing Tips</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
            <li>Make sure your daily income covers rent and other expenses</li>
            <li>Renting requires first month's rent upfront</li>
            <li>Buying requires full payment but no monthly costs</li>
            <li>Better housing increases your happiness</li>
            <li>You can't stay with parents after age 30</li>
          </ul>
        </div>
      ` : ''}
    </div>
  `;
  
  return content;
}

function checkHousingRequirements(data, house) {
  if (house.requirements.income && data.salary < house.requirements.income) {
    return false;
  }
  
  if (house.requirements.netWorth && getNetWorth(data) < house.requirements.netWorth) {
    return false;
  }
  
  if (house.requirements.age) {
    if (house.requirements.age.max && data.age > house.requirements.age.max) {
      return false;
    }
    if (house.requirements.age.min && data.age < house.requirements.age.min) {
      return false;
    }
  }
  
  return true;
}

function showHousingTab(tab) {
  const rentBtns = document.querySelectorAll('.rent-btn');
  const buyBtns = document.querySelectorAll('.buy-btn');
  const rentPrices = document.querySelectorAll('.rent-price');
  const buyPrices = document.querySelectorAll('.buy-price');
  const tabs = document.querySelectorAll('.housing-tab');
  
  // Update tab appearance
  tabs.forEach(t => {
    t.classList.remove('active');
    t.style.background = '#e9ecef';
    t.style.color = '#495057';
  });
  
  event.target.classList.add('active');
  event.target.style.background = '#667eea';
  event.target.style.color = 'white';
  
  if (tab === 'rent') {
    rentBtns.forEach(btn => btn.style.display = 'inline-block');
    buyBtns.forEach(btn => btn.style.display = 'none');
    rentPrices.forEach(price => price.style.display = 'block');
    buyPrices.forEach(price => price.style.display = 'none');
  } else {
    rentBtns.forEach(btn => btn.style.display = 'none');
    buyBtns.forEach(btn => btn.style.display = 'inline-block');
    rentPrices.forEach(price => price.style.display = 'none');
    buyPrices.forEach(price => price.style.display = 'block');
  }
}

function rentHouse(houseName) {
  const data = loadGameData();
  const house = HOUSING[houseName];
  
  if (!house) {
    showToast('House not found!', 'error');
    return;
  }
  
  if (!checkHousingRequirements(data, house)) {
    showToast('You don\'t meet the requirements for this property!', 'warning');
    return;
  }
  
  if (data.bankBalance < house.rentPrice) {
    showToast(`You need €${house.rentPrice} for the first month's rent!`, 'warning');
    return;
  }
  
  if (data.house === houseName) {
    showToast('You already live here!', 'warning');
    return;
  }
  
  // SECURITY CHECK: Only allow one rental at a time
  if (data.homeOwnership === 'Renting') {
    showToast('You must leave your current rental before getting a new one!', 'warning');
    return;
  }
  
  // Pay first month's rent
  data.bankBalance -= house.rentPrice;
  
  // Update housing
  const oldHouse = data.house;
  data.house = houseName;
  data.homeOwnership = 'Renting';
  
  // Update expenses (remove old house cost, add new)
  const oldHouseCost = HOUSING[oldHouse]?.dailyCost || 0;
  data.expenses = (data.expenses - oldHouseCost) + house.dailyCost;
  
  // Update happiness
  const oldHappiness = HOUSING[oldHouse]?.happiness || 0;
  data.happiness += (house.happiness - oldHappiness);
  data.happiness = Math.max(0, Math.min(100, data.happiness));
  
  // Add event
  data.events.push({
    message: `🏠 You rented a ${houseName} for €${house.rentPrice}/month. Daily cost: €${house.dailyCost}`,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast(`Welcome to your new home: ${houseName}!`, 'success');
  
  // Refresh content
  document.getElementById('modal-body').innerHTML = getRealEstateContent();
}

/**
 * Leave current house - go to parents or choose another owned property
 */
function leaveCurrentHouse() {
  const data = loadGameData();
  
  if (data.house === 'Parents Home') {
    showToast('You\'re already at your parents home!', 'warning');
    return;
  }
  
  const oldHouse = HOUSING[data.house];
  const ownedProperties = data.ownedProperties || [];
  const isRenting = data.homeOwnership === 'Renting';
  
  // If they have other owned properties, show selection
  if (!isRenting && ownedProperties.length > 1) {
    showMoveOptions();
    return;
  }
  
  // Otherwise move to parents home
  data.house = 'Parents Home';
  data.homeOwnership = 'Free';
  
  // Remove housing expenses (only if was renting)
  if (isRenting) {
    data.expenses -= oldHouse.dailyCost;
  }
  
  // Adjust happiness
  data.happiness += (HOUSING['Parents Home'].happiness - oldHouse.happiness);
  data.happiness = Math.max(0, Math.min(100, data.happiness));
  
  const message = isRenting 
    ? `🚪 You left your rental and moved back to your parents home.`
    : `🚪 You left your ${data.house} and moved back to your parents home.`;
  
  data.events.push({
    message: message,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast('Moved back to parents home', 'info');
  
  // Refresh content
  document.getElementById('modal-body').innerHTML = getRealEstateContent();
}

/**
 * Show options for moving between owned properties or parents home
 */
function showMoveOptions() {
  const data = loadGameData();
  const ownedProperties = data.ownedProperties || [];
  const currentHouse = data.house;
  
  let content = `
    <div class="move-options-screen">
      <h3 style="margin-bottom: 20px; color: #667eea;">Where would you like to move?</h3>
      
      <!-- Parents Home Option -->
      <div class="move-option" style="background: white; border: 2px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px; cursor: pointer;" onclick="moveToParents()">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div>${getHousingIcon('Parents Home')}</div>
          <div>
            <div style="font-weight: bold; font-size: 1.1rem;">Parents Home</div>
            <div style="font-size: 0.9rem; color: #6c757d;">Free • Happiness: ${HOUSING['Parents Home'].happiness}</div>
          </div>
        </div>
      </div>
      
      <!-- Owned Properties -->
      ${ownedProperties.filter(prop => prop !== currentHouse).map(propertyName => {
        const property = HOUSING[propertyName];
        return `
          <div class="move-option" style="background: white; border: 2px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px; cursor: pointer;" onclick="moveToProperty('${propertyName}')">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div>${getHousingIcon(propertyName)}</div>
              <div>
                <div style="font-weight: bold; font-size: 1.1rem;">${propertyName}</div>
                <div style="font-size: 0.9rem; color: #6c757d;">You Own This • Happiness: ${property.happiness > 0 ? '+' : ''}${property.happiness}</div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
      
      <button onclick="showRealEstateMain()" class="game-btn" style="background: #6c757d; color: white; width: 100%; margin-top: 20px;">
        ← Cancel
      </button>
    </div>
  `;
  
  document.getElementById('modal-body').innerHTML = content;
}

/**
 * Move to parents home from move options
 */
function moveToParents() {
  const data = loadGameData();
  const oldHouse = HOUSING[data.house];
  const isRenting = data.homeOwnership === 'Renting';
  
  data.house = 'Parents Home';
  data.homeOwnership = 'Free';
  
  // Remove housing expenses (only if was renting)
  if (isRenting) {
    data.expenses -= oldHouse.dailyCost;
  }
  
  // Adjust happiness
  data.happiness += (HOUSING['Parents Home'].happiness - oldHouse.happiness);
  data.happiness = Math.max(0, Math.min(100, data.happiness));
  
  data.events.push({
    message: `🚪 You moved back to your parents home.`,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast('Moved to parents home', 'success');
  
  // Refresh content
  showRealEstateMain();
}

/**
 * Show owned properties management screen
 */
function showOwnedProperties() {
  const data = loadGameData();
  const ownedProperties = data.ownedProperties || [];
  
  if (ownedProperties.length === 0) {
    showToast('You don\'t own any properties!', 'warning');
    return;
  }
  
  let content = `
    <div class="owned-properties-screen">
      <h3 style="margin-bottom: 20px; color: #667eea;">My Property Portfolio</h3>
      <div class="properties-grid">
  `;
  
  ownedProperties.forEach(propertyName => {
    const property = HOUSING[propertyName];
    const isCurrentHome = data.house === propertyName;
    const salePrice = Math.floor(property.buyPrice * 0.8);
    
    content += `
      <div class="property-card" style="background: ${isCurrentHome ? '#e8f4fd' : 'white'}; border: 2px solid ${isCurrentHome ? '#667eea' : '#e9ecef'}; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <div>${getHousingIcon(propertyName)}</div>
          <div>
            <div style="font-weight: bold; font-size: 1.1rem;">${propertyName} ${isCurrentHome ? '(Current)' : ''}</div>
            <div style="font-size: 0.9rem; color: #6c757d;">Purchased for €${property.buyPrice}</div>
          </div>
        </div>
        <div style="margin-bottom: 15px; font-size: 0.9rem; color: #495057;">${property.description}</div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Sale Value:</span>
          <span style="color: #28a745; font-weight: bold;">€${salePrice}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <span>Happiness:</span>
          <span style="color: ${property.happiness >= 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">${property.happiness > 0 ? '+' : ''}${property.happiness}</span>
        </div>
        
        <div class="property-actions" style="display: flex; gap: 10px;">
          ${!isCurrentHome ? `
            <button onclick="moveToProperty('${propertyName}')" class="game-btn" style="background: #667eea; color: white; flex: 1;">
              🏠 Move In
            </button>
          ` : ''}
          <button onclick="sellProperty('${propertyName}')" class="game-btn" style="background: #28a745; color: white; flex: 1;">
            💰 Sell (€${salePrice})
          </button>
        </div>
      </div>
    `;
  });
  
  content += `
      </div>
      <button onclick="showRealEstateMain()" class="game-btn" style="background: #6c757d; color: white; width: 100%; margin-top: 20px;">
        ← Back to Real Estate
      </button>
    </div>
  `;
  
  document.getElementById('modal-body').innerHTML = content;
}

/**
 * Move to one of your owned properties
 */
function moveToProperty(propertyName) {
  const data = loadGameData();
  
  if (!data.ownedProperties || !data.ownedProperties.includes(propertyName)) {
    showToast('You don\'t own this property!', 'error');
    return;
  }
  
  if (data.house === propertyName) {
    showToast('You already live here!', 'warning');
    return;
  }
  
  const oldHouse = data.house;
  const newHouse = HOUSING[propertyName];
  const oldHouseData = HOUSING[oldHouse];
  const wasRenting = data.homeOwnership === 'Renting';
  
  // Update residence
  data.house = propertyName;
  data.homeOwnership = 'Owned';
  
  // Update expenses - remove rental costs if was renting
  if (wasRenting) {
    data.expenses -= oldHouseData.dailyCost;
  }
  
  // Update happiness
  const oldHappiness = oldHouseData?.happiness || 0;
  data.happiness += (newHouse.happiness - oldHappiness);
  data.happiness = Math.max(0, Math.min(100, data.happiness));
  
  data.events.push({
    message: `🏠 You moved from ${oldHouse} to your ${propertyName}.`,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast(`Moved to your ${propertyName}!`, 'success');
  
  // Refresh content - check if called from move options or property management
  if (document.querySelector('.move-options-screen')) {
    showRealEstateMain();
  } else if (document.querySelector('.owned-properties-screen')) {
    showOwnedProperties();
  } else {
    showRealEstateMain();
  }
}

/**
 * Sell a specific owned property
 */
function sellProperty(propertyName) {
  const data = loadGameData();
  
  if (!data.ownedProperties || !data.ownedProperties.includes(propertyName)) {
    showToast('You don\'t own this property!', 'error');
    return;
  }
  
  const property = HOUSING[propertyName];
  const salePrice = Math.floor(property.buyPrice * 0.8);
  const isCurrentHome = data.house === propertyName;
  
  // Add money from sale
  data.bankBalance += salePrice;
  
  // Remove from owned properties
  data.ownedProperties = data.ownedProperties.filter(p => p !== propertyName);
  
  // If selling current home, move to parents or another owned property
  if (isCurrentHome) {
    if (data.ownedProperties.length > 0) {
      // Move to first owned property
      const newHome = data.ownedProperties[0];
      data.house = newHome;
      data.homeOwnership = 'Owned';
    } else {
      // Return to parents home
      data.house = 'Parents Home';
      data.homeOwnership = 'Free';
      
      // Adjust happiness
      data.happiness += (HOUSING['Parents Home'].happiness - property.happiness);
      data.happiness = Math.max(0, Math.min(100, data.happiness));
    }
  }
  
  data.events.push({
    message: `💰 You sold your ${propertyName} for €${salePrice}.${isCurrentHome ? ` Moved to ${data.house}.` : ''}`,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast(`Sold ${propertyName} for €${salePrice}!`, 'success');
  
  // Refresh content
  if (data.ownedProperties.length > 0) {
    showOwnedProperties();
  } else {
    showRealEstateMain();
  }
}

/**
 * Return to main real estate screen
 */
function showRealEstateMain() {
  document.getElementById('modal-body').innerHTML = getRealEstateContent();
}

function buyHouse(houseName) {
  const data = loadGameData();
  const house = HOUSING[houseName];
  
  if (!house) {
    showToast('House not found!', 'error');
    return;
  }
  
  if (!checkHousingRequirements(data, house)) {
    showToast('You don\'t meet the requirements for this property!', 'warning');
    return;
  }
  
  if (data.bankBalance < house.buyPrice) {
    showToast(`You need €${house.buyPrice} to buy this house!`, 'warning');
    return;
  }
  
  if (data.house === houseName && data.homeOwnership === 'Owned') {
    showToast('You already own this house!', 'warning');
    return;
  }
  
  // SECURITY CHECK: Can't buy while renting (but can buy multiple owned properties)
  if (data.homeOwnership === 'Renting') {
    showToast('You must leave your rental before buying a house!', 'warning');
    return;
  }
  
  // Buy the house
  data.bankBalance -= house.buyPrice;
  
  // Add to owned properties first
  if (!data.ownedProperties) data.ownedProperties = [];
  if (!data.ownedProperties.includes(houseName)) {
    data.ownedProperties.push(houseName);
  }
  
  // Update current residence if not already living somewhere owned
  if (data.house === 'Parents Home' || data.homeOwnership === 'Renting') {
    const oldHouse = data.house;
    data.house = houseName;
    data.homeOwnership = 'Owned';
    
    // Update expenses (remove old house cost, owned houses have no daily rent)
    const oldHouseCost = HOUSING[oldHouse]?.dailyCost || 0;
    data.expenses = data.expenses - oldHouseCost;
    
    // Update happiness
    const oldHappiness = HOUSING[oldHouse]?.happiness || 0;
    data.happiness += (house.happiness - oldHappiness) + 10; // Bonus happiness for owning
    data.happiness = Math.max(0, Math.min(100, data.happiness));
  }
  
  // Add event
  const moveInMessage = (data.house === houseName) 
    ? `🎉 You bought a ${houseName} for €${house.buyPrice} and moved in immediately!`
    : `🎉 You bought a ${houseName} for €${house.buyPrice}. It's now part of your property portfolio!`;
  
  data.events.push({
    message: moveInMessage,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast(`Congratulations! You now own a ${houseName}!`, 'success');
  
  // Refresh content
  document.getElementById('modal-body').innerHTML = getRealEstateContent();
}

// Export functions
window.openRealEstate = openRealEstate;
window.showHousingTab = showHousingTab;
window.rentHouse = rentHouse;
window.buyHouse = buyHouse;
window.sellProperty = sellProperty;
window.leaveCurrentHouse = leaveCurrentHouse;
window.showMoveOptions = showMoveOptions;
window.moveToParents = moveToParents;
window.showOwnedProperties = showOwnedProperties;
window.moveToProperty = moveToProperty;
window.showRealEstateMain = showRealEstateMain;