// cars.js - Car dealership and transportation system

// Vehicle icon function
function getVehicleIcon(vehicleName) {
  const icons = {
    'Walking': `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M14 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" fill="#4169e1"/><path d="M12 8l-1 5h2l1-5z" fill="#4169e1"/><path d="M8 17h2v5h2v-5h2l.5-3H8z" fill="#4169e1"/></svg>`,
    'Bicycle': `<svg viewBox="0 0 24 24" width="40" height="40"><circle cx="6" cy="18" r="4" fill="none" stroke="#32cd32" stroke-width="2"/><circle cx="18" cy="18" r="4" fill="none" stroke="#32cd32" stroke-width="2"/><path d="M12 6l-3 8h2l2-6 2 6h2l-3-8z" fill="#32cd32"/><line x1="10" y1="14" x2="14" y2="14" stroke="#32cd32" stroke-width="2"/></svg>`,
    'Public Transport': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="2" y="8" width="20" height="10" rx="2" fill="#ff6b35" stroke="#d45087" stroke-width="1.5"/><rect x="4" y="10" width="16" height="2" fill="#fff" opacity="0.8"/><circle cx="6" cy="16" r="1.5" fill="#333"/><circle cx="18" cy="16" r="1.5" fill="#333"/><rect x="8" y="12" width="8" height="2" fill="#fff" opacity="0.6"/></svg>`,
    'Used Economy Car': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="3" y="12" width="18" height="6" rx="3" fill="#8b7d6b" stroke="#5d5c5c" stroke-width="1.5"/><path d="M6 12 L8 8 L16 8 L18 12" fill="#8b7d6b"/><circle cx="7" cy="17" r="2" fill="#2f4f4f"/><circle cx="17" cy="17" r="2" fill="#2f4f4f"/></svg>`,
    'New Economy Car': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="3" y="12" width="18" height="6" rx="3" fill="#4169e1" stroke="#2e4b6b" stroke-width="1.5"/><path d="M6 12 L8 8 L16 8 L18 12" fill="#4169e1"/><circle cx="7" cy="17" r="2" fill="#2f4f4f"/><circle cx="17" cy="17" r="2" fill="#2f4f4f"/><circle cx="21" cy="14" r="0.8" fill="#ffff00"/></svg>`,
    'Used Sedan': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="2" y="12" width="20" height="6" rx="3" fill="#8b4513" stroke="#654321" stroke-width="1.5"/><path d="M5 12 L7 7 L17 7 L19 12" fill="#8b4513"/><circle cx="7" cy="17" r="2.5" fill="#2f4f4f"/><circle cx="17" cy="17" r="2.5" fill="#2f4f4f"/></svg>`,
    'New Sedan': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="2" y="12" width="20" height="6" rx="3" fill="#dc143c" stroke="#8b0000" stroke-width="1.5"/><path d="M5 12 L7 7 L17 7 L19 12" fill="#dc143c"/><circle cx="7" cy="17" r="2.5" fill="#2f4f4f"/><circle cx="17" cy="17" r="2.5" fill="#2f4f4f"/><circle cx="21" cy="14" r="1" fill="#ffff00"/></svg>`,
    'SUV': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="1" y="10" width="22" height="8" rx="4" fill="#2f4f2f" stroke="#1c3a1c" stroke-width="1.5"/><path d="M4 10 L6 5 L18 5 L20 10" fill="#2f4f2f"/><circle cx="6" cy="17" r="2.5" fill="#2f4f4f"/><circle cx="18" cy="17" r="2.5" fill="#2f4f4f"/><rect x="8" y="7" width="8" height="2" fill="#87ceeb"/></svg>`,
    'Sports Car': `<svg viewBox="0 0 24 24" width="40" height="40"><path d="M3 15 L5 11 L8 8 L16 8 L19 11 L21 15 L21 18 L3 18 Z" fill="#ff4500" stroke="#dc143c" stroke-width="1.5"/><circle cx="7" cy="17" r="2" fill="#2f4f4f"/><circle cx="17" cy="17" r="2" fill="#2f4f4f"/><path d="M8 11 L16 11" stroke="#87ceeb" stroke-width="1.5"/></svg>`,
    'Luxury Car': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="2" y="11" width="20" height="7" rx="3.5" fill="#4b0082" stroke="#301934" stroke-width="1.5"/><path d="M5 11 L7 6 L17 6 L19 11" fill="#4b0082"/><circle cx="7" cy="17" r="2.5" fill="#2f4f4f" stroke="#ffd700" stroke-width="1"/><circle cx="17" cy="17" r="2.5" fill="#2f4f4f" stroke="#ffd700" stroke-width="1"/><rect x="9" y="8" width="6" height="2" fill="#87ceeb"/></svg>`,
    'Electric Car': `<svg viewBox="0 0 24 24" width="40" height="40"><rect x="3" y="12" width="18" height="6" rx="3" fill="#32cd32" stroke="#228b22" stroke-width="1.5"/><path d="M6 12 L8 8 L16 8 L18 12" fill="#32cd32"/><circle cx="7" cy="17" r="2" fill="#2f4f4f"/><circle cx="17" cy="17" r="2" fill="#2f4f4f"/><path d="M10 10 L14 6 L12 9 L14 9 L10 13 L12 10 Z" fill="#ffff00"/></svg>`
  };
  return icons[vehicleName] || `<div style="width: 40px; height: 40px; background: #e9ecef; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🚗</div>`;
}

// Vehicle options with costs and features
const VEHICLES = {
  'Walking': {
    type: 'free',
    buyPrice: 0,
    dailyCost: 0,
    description: 'Free transportation. Takes longer but saves money.',
    happiness: -10,
    travelOptions: ['Local trips only'],
    requirements: {}
  },
  'Bicycle': {
    type: 'buy',
    buyPrice: 300,
    dailyCost: 2,
    description: 'Eco-friendly and healthy way to get around the city.',
    happiness: 0,
    travelOptions: ['City trips', 'Local trips'],
    requirements: {}
  },
  'Public Transport': {
    type: 'subscription',
    buyPrice: 80,
    dailyCost: 15,
    description: 'Monthly pass for buses and trains. Convenient but crowded.',
    happiness: -5,
    travelOptions: ['City trips', 'Regional trips'],
    requirements: {}
  },
  'Used Economy Car': {
    type: 'buy',
    buyPrice: 8000,
    dailyCost: 25,
    description: 'Reliable older car. Basic transportation with freedom.',
    happiness: 10,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips'],
    requirements: { income: 50 }
  },
  'New Economy Car': {
    type: 'buy',
    buyPrice: 18000,
    dailyCost: 35,
    description: 'Brand new economy car with warranty and good fuel efficiency.',
    happiness: 15,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips'],
    requirements: { income: 80 }
  },
  'Used Sedan': {
    type: 'buy',
    buyPrice: 15000,
    dailyCost: 40,
    description: 'Comfortable mid-size car with more space and features.',
    happiness: 20,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips', 'Vacation trips'],
    requirements: { income: 100 }
  },
  'New Sedan': {
    type: 'buy',
    buyPrice: 28000,
    dailyCost: 50,
    description: 'Modern sedan with advanced safety features and comfort.',
    happiness: 25,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips', 'Vacation trips'],
    requirements: { income: 120 }
  },
  'SUV': {
    type: 'buy',
    buyPrice: 35000,
    dailyCost: 60,
    description: 'Spacious SUV perfect for families and outdoor adventures.',
    happiness: 30,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips', 'Vacation trips', 'Adventure trips'],
    requirements: { income: 150 }
  },
  'Sports Car': {
    type: 'buy',
    buyPrice: 55000,
    dailyCost: 75,
    description: 'High-performance sports car that turns heads and boosts confidence.',
    happiness: 40,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips', 'Racing events'],
    requirements: { income: 180, age: { min: 25 } }
  },
  'Luxury Car': {
    type: 'buy',
    buyPrice: 85000,
    dailyCost: 95,
    description: 'Premium luxury vehicle with top-tier comfort and prestige.',
    happiness: 50,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips', 'Vacation trips', 'Business trips'],
    requirements: { income: 250, netWorth: 50000 }
  },
  'Electric Car': {
    type: 'buy',
    buyPrice: 45000,
    dailyCost: 30,
    description: 'Eco-friendly electric vehicle with low running costs.',
    happiness: 35,
    travelOptions: ['City trips', 'Regional trips', 'Weekend trips', 'Eco tours'],
    requirements: { income: 140 }
  }
};

function openCarDealership() {
  const data = loadGameData();
  openApp('🚗 Car Dealership', getCarDealershipContent());
  window.currentApp = 'cars';
}

function getCarDealershipContent() {
  const data = loadGameData();
  
  let content = `
    <div class="car-dealership-container">
      <div class="current-vehicle-status" style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">Current Transportation</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Vehicle:</span>
          <span style="font-weight: bold;">${data.vehicle}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Daily Cost:</span>
          <span style="color: ${(VEHICLES[data.vehicle]?.dailyCost || 0) > 0 ? '#dc3545' : '#28a745'}; font-weight: bold;">€${VEHICLES[data.vehicle]?.dailyCost || 0}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Happiness Bonus:</span>
          <span style="color: ${(VEHICLES[data.vehicle]?.happiness || 0) >= 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">${(VEHICLES[data.vehicle]?.happiness || 0) >= 0 ? '+' : ''}${VEHICLES[data.vehicle]?.happiness || 0}</span>
        </div>
      </div>
      
      <div class="vehicle-categories" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        <button class="category-btn active" onclick="filterVehicles('all')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #667eea; color: white; font-size: 12px;">All</button>
        <button class="category-btn" onclick="filterVehicles('economy')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #e9ecef; color: #495057; font-size: 12px;">Economy</button>
        <button class="category-btn" onclick="filterVehicles('comfort')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #e9ecef; color: #495057; font-size: 12px;">Comfort</button>
        <button class="category-btn" onclick="filterVehicles('luxury')" style="padding: 8px 15px; border: none; border-radius: 20px; background: #e9ecef; color: #495057; font-size: 12px;">Luxury</button>
      </div>
      
      <div class="vehicle-listings" id="vehicle-list">
  `;
  
  Object.entries(VEHICLES).forEach(([vehicleName, vehicle]) => {
    const canAfford = data.bankBalance >= vehicle.buyPrice;
    const meetsRequirements = checkVehicleRequirements(data, vehicle);
    const isCurrentVehicle = data.vehicle === vehicleName;
    
    let category = 'economy';
    if (vehicle.buyPrice > 30000) category = 'luxury';
    else if (vehicle.buyPrice > 8000) category = 'comfort';
    
    content += `
      <div class="vehicle-listing" data-category="${category}" style="background: white; border: 1px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              ${getVehicleIcon(vehicleName)}
            </div>
            <div>
              <h4 style="margin: 0; color: #495057;">${vehicleName}</h4>
              <p style="margin: 5px 0; color: #6c757d; font-size: 12px;">Happiness: ${vehicle.happiness >= 0 ? '+' : ''}${vehicle.happiness}</p>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="color: #dc3545; font-weight: bold; font-size: 16px;">
              ${vehicle.buyPrice === 0 ? 'Free' : `€${vehicle.buyPrice}`}
            </div>
            <div style="color: #6c757d; font-size: 12px;">€${vehicle.dailyCost}/day</div>
          </div>
        </div>
        <p style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">${vehicle.description}</p>
        
        <div style="margin-bottom: 10px;">
          <strong style="font-size: 12px; color: #495057;">Travel Options:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
            ${vehicle.travelOptions.map(option => 
              `<span style="background: #e9ecef; padding: 2px 8px; border-radius: 10px; font-size: 11px; color: #495057;">${option}</span>`
            ).join('')}
          </div>
        </div>
        
        ${vehicle.requirements.income || vehicle.requirements.netWorth || vehicle.requirements.age ? `
          <div style="margin-bottom: 15px; font-size: 12px; color: #6c757d;">
            Requirements: 
            ${vehicle.requirements.income ? `€${vehicle.requirements.income}/day income` : ''}
            ${vehicle.requirements.netWorth ? `, €${vehicle.requirements.netWorth} net worth` : ''}
            ${vehicle.requirements.age?.min ? `, Age ${vehicle.requirements.age.min}+` : ''}
            ${vehicle.requirements.age?.max ? `, Age under ${vehicle.requirements.age.max}` : ''}
          </div>
        ` : ''}
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${isCurrentVehicle ? 
            `<span style="color: #6f42c1; font-weight: bold;">Current Vehicle</span>` :
            `<button onclick="buyVehicle('${vehicleName}')" 
                     style="padding: 8px 16px; background: ${canAfford && meetsRequirements ? '#28a745' : '#6c757d'}; color: white; border: none; border-radius: 5px; font-size: 14px;" 
                     ${!canAfford || !meetsRequirements ? 'disabled' : ''}>
               ${vehicle.buyPrice === 0 ? 'Switch' : 'Buy'}
             </button>`
          }
          <div style="color: #6c757d; font-size: 12px;">
            ${meetsRequirements && canAfford ? '✓ Qualified' : '✗ Not qualified'}
          </div>
        </div>
      </div>
    `;
  });
  
  content += `
      </div>
      
      ${data.vehicle === 'Walking' ? `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">🚗 Transportation Tips</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
            <li>Better transportation increases happiness and travel options</li>
            <li>Consider daily costs when choosing a vehicle</li>
            <li>Cars unlock weekend trips and vacations</li>
            <li>Electric cars have lower daily costs</li>
            <li>Sports and luxury cars provide major happiness boosts</li>
          </ul>
        </div>
      ` : ''}
      
      ${data.vehicle !== 'Walking' ? `
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 10px; padding: 15px; margin-top: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0c5460;">🗺️ Available Travel Options</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${VEHICLES[data.vehicle]?.travelOptions.map(option => 
              `<button onclick="planTrip('${option}')" style="padding: 8px 12px; background: #17a2b8; color: white; border: none; border-radius: 5px; font-size: 12px;">${option}</button>`
            ).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  return content;
}

function checkVehicleRequirements(data, vehicle) {
  if (vehicle.requirements.income && data.salary < vehicle.requirements.income) {
    return false;
  }
  
  if (vehicle.requirements.netWorth && getNetWorth(data) < vehicle.requirements.netWorth) {
    return false;
  }
  
  if (vehicle.requirements.age) {
    if (vehicle.requirements.age.max && data.age > vehicle.requirements.age.max) {
      return false;
    }
    if (vehicle.requirements.age.min && data.age < vehicle.requirements.age.min) {
      return false;
    }
  }
  
  return true;
}

function filterVehicles(category) {
  const vehicleListings = document.querySelectorAll('.vehicle-listing');
  const categoryBtns = document.querySelectorAll('.category-btn');
  
  // Update active button
  categoryBtns.forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = '#e9ecef';
    btn.style.color = '#495057';
  });
  
  event.target.classList.add('active');
  event.target.style.background = '#667eea';
  event.target.style.color = 'white';
  
  // Filter vehicles
  vehicleListings.forEach(listing => {
    const listingCategory = listing.getAttribute('data-category');
    if (category === 'all' || listingCategory === category) {
      listing.style.display = 'block';
    } else {
      listing.style.display = 'none';
    }
  });
}

function buyVehicle(vehicleName) {
  const data = loadGameData();
  const vehicle = VEHICLES[vehicleName];
  
  if (!vehicle) {
    showToast('Vehicle not found!', 'error');
    return;
  }
  
  if (!checkVehicleRequirements(data, vehicle)) {
    showToast('You don\'t meet the requirements for this vehicle!', 'warning');
    return;
  }
  
  if (data.bankBalance < vehicle.buyPrice) {
    showToast(`You need €${vehicle.buyPrice} to buy this vehicle!`, 'warning');
    return;
  }
  
  if (data.vehicle === vehicleName) {
    showToast('You already have this vehicle!', 'warning');
    return;
  }
  
  // Buy/switch to vehicle
  if (vehicle.buyPrice > 0) {
    data.bankBalance -= vehicle.buyPrice;
  }
  
  // Update vehicle
  const oldVehicle = data.vehicle;
  data.vehicle = vehicleName;
  
  // Update expenses
  const oldVehicleCost = VEHICLES[oldVehicle]?.dailyCost || 0;
  data.expenses = (data.expenses - oldVehicleCost) + vehicle.dailyCost;
  
  // Update happiness
  const oldHappiness = VEHICLES[oldVehicle]?.happiness || 0;
  data.happiness += (vehicle.happiness - oldHappiness);
  data.happiness = Math.max(0, Math.min(100, data.happiness));
  
  // Add to owned vehicles
  if (!data.ownedVehicles) data.ownedVehicles = [];
  if (vehicle.buyPrice > 0 && !data.ownedVehicles.includes(vehicleName)) {
    data.ownedVehicles.push(vehicleName);
  }
  
  // Add event
  data.events.push({
    message: `🚗 ${vehicle.buyPrice > 0 ? `You bought a ${vehicleName} for €${vehicle.buyPrice}` : `You switched to ${vehicleName}`}. Daily cost: €${vehicle.dailyCost}`,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast(`${vehicle.buyPrice > 0 ? 'Congratulations on your new' : 'You switched to'} ${vehicleName}!`, 'success');
  
  // Refresh content
  document.getElementById('modal-body').innerHTML = getCarDealershipContent();
}

function planTrip(tripType) {
  const data = loadGameData();
  
  // Simple trip planning - this could be expanded into a full travel system
  const tripCosts = {
    'Local trips': 0,
    'City trips': 20,
    'Regional trips': 50,
    'Weekend trips': 100,
    'Vacation trips': 300,
    'Adventure trips': 200,
    'Business trips': 150,
    'Racing events': 80,
    'Eco tours': 120
  };
  
  const cost = tripCosts[tripType] || 0;
  
  if (data.bankBalance < cost) {
    showToast(`You need €${cost} for this trip!`, 'warning');
    return;
  }
  
  // Simple trip outcome
  data.bankBalance -= cost;
  const happinessGain = Math.floor(cost / 20) + Math.floor(Math.random() * 10) + 5;
  data.happiness += happinessGain;
  data.happiness = Math.max(0, Math.min(100, data.happiness));
  
  data.events.push({
    message: `🗺️ You went on a ${tripType.toLowerCase()}! Cost: €${cost}, Happiness: +${happinessGain}`,
    date: new Date().toISOString(),
    read: false
  });
  
  saveGameData(data);
  updateAllUI();
  showToast(`Great trip! You gained ${happinessGain} happiness!`, 'success');
}

// Export functions
window.openCarDealership = openCarDealership;
window.filterVehicles = filterVehicles;
window.buyVehicle = buyVehicle;
window.planTrip = planTrip;