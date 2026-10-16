// character.js - Simplified character creation

// Form elements
const nameEl = document.getElementById('char-name');
const genderEl = document.getElementById('char-gender');
const ageEl = document.getElementById('char-age');
const createBtn = document.getElementById('create-char-btn');

// Initialize character creation
function initCreateCharacter() {
  if (createBtn) {
    createBtn.onclick = saveCharacter;
  }
}

// Save character with simplified data
function saveCharacter() {
  const name = nameEl ? nameEl.value.trim() : '';
  const gender = genderEl ? genderEl.value : 'Other';
  const age = parseInt(ageEl ? ageEl.value : 18);

  if (!name) {
    showToast('Please enter your name!', 'warning');
    return;
  }

  if (name.length < 2) {
    showToast('Name must be at least 2 characters!', 'warning');
    return;
  }

  if (age < 18 || age > 65) {
    showToast('Age must be between 18 and 65!', 'warning');
    return;
  }

  const data = loadGameData();

  // Set basic character data
  data.userName = name;
  data.gender = gender;
  data.age = age;
  
  // Starting conditions - unemployed, living with parents, no car
  data.profession = 'Unemployed';
  data.salary = 0;
  data.workExperience = 0; // Days of work experience
  data.house = 'Parents Home';
  data.vehicle = 'Walking';
  data.expenses = 0; // No expenses when living with parents

  // Enhanced character creation data
  data.startDate = new Date().toISOString();
  data.characterCreatedDay = data.day;
  
  // Initial happiness based on age (younger = more optimistic)
  if (age <= 25) data.happiness += 5;

  // Welcome event
  data.events.push({
    message: `Welcome to SmartSim Life, ${name}! Time to start your journey.`,
    date: new Date().toISOString(),
    read: false
  });

  saveGameData(data);
  showToast(`Welcome to your new life, ${name}!`, 'success');

  // Navigate to main game
  hideAllScreens();
  document.getElementById('main-game').classList.remove('hidden');
  updateAllUI();
}

// Validation functions
function validateCharacterInput() {
  if (!nameEl) return false;
  
  const name = nameEl.value.trim();
  
  // Real-time validation
  nameEl.addEventListener('input', () => {
    const currentName = nameEl.value.trim();
    const createButton = document.getElementById('create-char-btn');
    
    if (currentName.length < 2) {
      nameEl.style.borderColor = '#dc3545';
      if (createButton) createButton.disabled = true;
    } else {
      nameEl.style.borderColor = '#28a745';
      if (createButton) createButton.disabled = false;
    }
  });
  
  return name.length >= 2;
}

// Enhanced character stats calculation
function getCharacterLifestyle(data) {
  let lifestyle = 'Basic';
  
  const netIncome = data.salary - data.expenses;
  
  if (netIncome >= 200) lifestyle = 'Luxury';
  else if (netIncome >= 100) lifestyle = 'Comfortable';
  else if (netIncome >= 50) lifestyle = 'Modest';
  else if (netIncome >= 0) lifestyle = 'Basic';
  else lifestyle = 'Struggling';
  
  return lifestyle;
}

function getCharacterTitle(data) {
  const level = data.level || 1;
  const netWorth = getNetWorth(data);
  
  if (level >= 50) return 'Life Master';
  if (level >= 20) return 'Experienced';
  if (netWorth >= 50000) return 'Wealthy';
  if (netWorth >= 10000) return 'Successful';
  if (data.achievements.surviveDays.progress >= 365) return 'Veteran';
  if (data.achievements.surviveDays.progress >= 100) return 'Survivor';
  
  return 'Newcomer';
}

// 4) Εξαγωγή της init για να τη χρησιμοποιεί το main.js
window.initCreateCharacter = initCreateCharacter;
window.getCharacterLifestyle = getCharacterLifestyle;
window.getCharacterTitle = getCharacterTitle;
