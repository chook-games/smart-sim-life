// constants.js - Game constants and configuration

// Profession configurations
window.PROF_SALARY = {
    'Unemployed': 0,
    'FastFood': 45,
    'Cashier': 60,
    'Clerk': 80,
    'Teacher': 120,
    'Engineer': 180,
    'Doctor': 250,
    'Lawyer': 300
};

// Housing expenses
window.HOUSE_EXPENSES = {
    'Studio': 25,
    'Apartment': 45,
    'House': 80,
    'Mansion': 150
};

// Vehicle expenses
window.VEHICLE_EXPENSES = {
    'Walking': 0,
    'Bike': 5,
    'PublicTransport': 15,
    'UsedCar': 35,
    'NewCar': 60,
    'LuxuryCar': 120
};

// Market items configuration
window.MARKET_ITEMS = {
    electronics: [
        { id: 'smartphone', name: 'Smartphone', icon: '📱', price: 800, category: 'electronics' },
        { id: 'laptop', name: 'Laptop', icon: '💻', price: 1200, category: 'electronics' },
        { id: 'tablet', name: 'Tablet', icon: '📟', price: 500, category: 'electronics' },
        { id: 'smartwatch', name: 'Smart Watch', icon: '⌚', price: 300, category: 'electronics' },
        { id: 'headphones', name: 'Headphones', icon: '🎧', price: 150, category: 'electronics' },
        { id: 'gaming_console', name: 'Gaming Console', icon: '🎮', price: 400, category: 'electronics' }
    ],
    clothing: [
        { id: 'shirt', name: 'Designer Shirt', icon: '👔', price: 80, category: 'clothing' },
        { id: 'jeans', name: 'Premium Jeans', icon: '👖', price: 120, category: 'clothing' },
        { id: 'sneakers', name: 'Designer Sneakers', icon: '👟', price: 200, category: 'clothing' },
        { id: 'jacket', name: 'Leather Jacket', icon: '🧥', price: 300, category: 'clothing' },
        { id: 'dress', name: 'Evening Dress', icon: '👗', price: 250, category: 'clothing' },
        { id: 'suit', name: 'Business Suit', icon: '🤵', price: 500, category: 'clothing' }
    ],
    home: [
        { id: 'sofa', name: 'Luxury Sofa', icon: '🛋️', price: 1500, category: 'home' },
        { id: 'tv', name: '4K TV', icon: '📺', price: 800, category: 'home' },
        { id: 'bed', name: 'King Size Bed', icon: '🛏️', price: 1200, category: 'home' },
        { id: 'refrigerator', name: 'Smart Fridge', icon: '🧊', price: 1800, category: 'home' },
        { id: 'washing_machine', name: 'Washing Machine', icon: '🧺', price: 600, category: 'home' },
        { id: 'microwave', name: 'Microwave', icon: '📻', price: 200, category: 'home' }
    ],
    luxury: [
        { id: 'rolex', name: 'Luxury Watch', icon: '⌚', price: 5000, category: 'luxury' },
        { id: 'diamond_ring', name: 'Diamond Ring', icon: '💍', price: 3000, category: 'luxury' },
        { id: 'art_painting', name: 'Art Painting', icon: '🖼️', price: 2500, category: 'luxury' },
        { id: 'wine_collection', name: 'Wine Collection', icon: '🍷', price: 1500, category: 'luxury' },
        { id: 'yacht_share', name: 'Yacht Share', icon: '🛥️', price: 10000, category: 'luxury' },
        { id: 'private_jet_hour', name: 'Private Jet Hour', icon: '✈️', price: 8000, category: 'luxury' }
    ],
    food: [
        { id: 'coffee', name: 'Premium Coffee', icon: '☕', price: 15, category: 'food' },
        { id: 'tea', name: 'Green Tea', icon: '🍵', price: 8, category: 'food' },
        { id: 'energy_drink', name: 'Energy Drink', icon: '⚡', price: 5, category: 'food' },
        { id: 'soda', name: 'Premium Soda', icon: '🥤', price: 3, category: 'food' },
        { id: 'juice', name: 'Fresh Juice', icon: '🧃', price: 6, category: 'food' },
        { id: 'water', name: 'Mineral Water', icon: '💧', price: 2, category: 'food' },
        { id: 'sandwich', name: 'Gourmet Sandwich', icon: '🥪', price: 12, category: 'food' },
        { id: 'pizza', name: 'Artisan Pizza', icon: '🍕', price: 18, category: 'food' },
        { id: 'burger', name: 'Premium Burger', icon: '🍔', price: 15, category: 'food' },
        { id: 'salad', name: 'Fresh Salad', icon: '🥗', price: 10, category: 'food' },
        { id: 'wine', name: 'Bottle of Wine', icon: '🍷', price: 50, category: 'food' },
        { id: 'chocolate', name: 'Swiss Chocolate', icon: '🍫', price: 25, category: 'food' },
        { id: 'steak', name: 'Wagyu Steak', icon: '🥩', price: 80, category: 'food' },
        { id: 'caviar', name: 'Caviar', icon: '🐟', price: 200, category: 'food' },
        { id: 'truffle', name: 'Black Truffle', icon: '🍄', price: 150, category: 'food' }
    ]
};

// Daily events configuration
window.DAILY_EVENTS = [
    {
        id: 'lottery_ticket',
        title: 'Lucky Lottery Ticket',
        description: 'You found a lottery ticket on the ground. Do you want to scratch it?',
        icon: '🎫',
        choices: [
            {
                text: 'Scratch it!',
                outcomes: [
                    { chance: 0.7, reward: { money: 0 }, message: 'No luck this time!' },
                    { chance: 0.2, reward: { money: 50 }, message: 'Won €50!' },
                    { chance: 0.08, reward: { money: 200 }, message: 'Lucky! Won €200!' },
                    { chance: 0.02, reward: { money: 1000 }, message: 'JACKPOT! Won €1000!' }
                ]
            },
            {
                text: 'Throw it away',
                outcomes: [
                    { chance: 1.0, reward: { xp: 5 }, message: 'You did the responsible thing. +5 XP' }
                ]
            }
        ]
    },
    {
        id: 'street_performer',
        title: 'Street Performer',
        description: 'A talented musician is performing on the street. Their hat has some coins.',
        icon: '🎵',
        choices: [
            {
                text: 'Give €10 tip',
                cost: { money: 10 },
                outcomes: [
                    { chance: 1.0, reward: { happiness: 15, xp: 10 }, message: 'The music was beautiful! You feel happier.' }
                ]
            },
            {
                text: 'Just listen',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 5, xp: 5 }, message: 'You enjoyed the free concert!' }
                ]
            }
        ]
    },
    {
        id: 'job_opportunity',
        title: 'Freelance Opportunity',
        description: 'Someone offers you a small freelance job for the day.',
        icon: '💼',
        choices: [
            {
                text: 'Accept the job',
                outcomes: [
                    { chance: 0.8, reward: { money: 100, xp: 15 }, message: 'Job completed successfully! Earned €100' },
                    { chance: 0.2, reward: { money: 50, xp: 10 }, message: 'Job was harder than expected, but you earned €50' }
                ]
            },
            {
                text: 'Decline politely',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 5 }, message: 'You enjoyed your free time instead.' }
                ]
            }
        ]
    },
    {
        id: 'lost_wallet',
        title: 'Lost Wallet Found',
        description: 'You found a wallet with €200 inside and an ID. What do you do?',
        icon: '💳',
        choices: [
            {
                text: 'Return to owner',
                outcomes: [
                    { chance: 0.7, reward: { money: 50, happiness: 20, xp: 25 }, message: 'Owner was grateful and gave you €50 reward!' },
                    { chance: 0.3, reward: { happiness: 15, xp: 20 }, message: 'Owner was thankful. You feel good about doing the right thing.' }
                ]
            },
            {
                text: 'Keep the money',
                outcomes: [
                    { chance: 1.0, reward: { money: 200, happiness: -10 }, message: 'You got €200 but feel guilty about it.' }
                ]
            }
        ]
    },
    {
        id: 'food_truck',
        title: 'New Food Truck',
        description: 'A new food truck is giving away free samples to promote their business.',
        icon: '🚚',
        choices: [
            {
                text: 'Try the food',
                outcomes: [
                    { chance: 0.8, reward: { happiness: 10, health: 5, xp: 5 }, message: 'Delicious! You feel energized.' },
                    { chance: 0.2, reward: { happiness: -5, health: -10 }, message: 'The food didnt agree with you...' }
                ]
            },
            {
                text: 'Pass by',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'You continued with your day.' }
                ]
            }
        ]
    },
    {
        id: 'gym_trial',
        title: 'Free Gym Trial',
        description: 'A new gym is offering a free trial day. Want to work out?',
        icon: '🏋️',
        choices: [
            {
                text: 'Work out',
                outcomes: [
                    { chance: 1.0, reward: { health: 15, happiness: 10, xp: 10 }, message: 'Great workout! You feel stronger and happier.' }
                ]
            },
            {
                text: 'Not today',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'Maybe next time.' }
                ]
            }
        ]
    },
    {
        id: 'book_sale',
        title: 'Used Book Sale',
        description: 'Theres a used book sale with some interesting titles.',
        icon: '📚',
        choices: [
            {
                text: 'Buy a book (€20)',
                cost: { money: 20 },
                outcomes: [
                    { chance: 1.0, reward: { happiness: 10, xp: 15 }, message: 'You bought an interesting book. Reading time!' }
                ]
            },
            {
                text: 'Just browse',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 5, xp: 5 }, message: 'You enjoyed browsing the books.' }
                ]
            }
        ]
    },
    {
        id: 'tech_gadget',
        title: 'Discounted Gadget',
        description: 'An electronics store is having a flash sale on a gadget you wanted.',
        icon: '📱',
        choices: [
            {
                text: 'Buy it (€150)',
                cost: { money: 150 },
                outcomes: [
                    { chance: 1.0, reward: { happiness: 20, xp: 10 }, message: 'Great purchase! You love your new gadget.', item: { name: 'Discounted Gadget', icon: '📱', value: 180 } }
                ]
            },
            {
                text: 'Save your money',
                outcomes: [
                    { chance: 1.0, reward: { xp: 5 }, message: 'You showed financial discipline.' }
                ]
            }
        ]
    },
    {
        id: 'friend_loan',
        title: 'Friend Needs Money',
        description: 'A close friend asks to borrow €100. They promise to pay you back with interest.',
        icon: '👥',
        choices: [
            {
                text: 'Lend the money',
                cost: { money: 100 },
                outcomes: [
                    { chance: 0.7, reward: { money: 120, happiness: 10, xp: 10 }, message: 'Your friend paid you back €120! Good deed rewarded.' },
                    { chance: 0.2, reward: { money: 100, happiness: -5 }, message: 'Your friend returned exactly what they owed.' },
                    { chance: 0.1, reward: { happiness: -15, xp: 5 }, message: 'Your friend disappeared... Lesson learned about lending money.' }
                ]
            },
            {
                text: 'Politely decline',
                outcomes: [
                    { chance: 1.0, reward: { xp: 5 }, message: 'You kept your money safe. A wise financial decision.' }
                ]
            }
        ]
    },
    {
        id: 'weekend_trip',
        title: 'Weekend Getaway',
        description: 'Friends invite you on a weekend trip to the mountains. It costs €200 but looks amazing!',
        icon: '🏔️',
        choices: [
            {
                text: 'Join the trip',
                cost: { money: 200 },
                outcomes: [
                    { chance: 1.0, reward: { happiness: 25, health: 10, xp: 20 }, message: 'Amazing trip! You feel refreshed and made great memories.' }
                ]
            },
            {
                text: 'Stay home',
                outcomes: [
                    { chance: 1.0, reward: { happiness: -5, xp: 3 }, message: 'You saved money but feel like you missed out.' }
                ]
            }
        ]
    },
    {
        id: 'volunteer_opportunity',
        title: 'Volunteer at Animal Shelter',
        description: 'The local animal shelter needs volunteers for the day. No pay, but helping animals feels good.',
        icon: '🐕',
        choices: [
            {
                text: 'Volunteer',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 20, health: 5, xp: 15 }, message: 'You spent the day helping animals. Very fulfilling!' }
                ]
            },
            {
                text: 'Too busy today',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'Maybe another time.' }
                ]
            }
        ]
    },
    {
        id: 'cooking_class',
        title: 'Free Cooking Class',
        description: 'A local chef is offering a free cooking class at the community center.',
        icon: '👨‍🍳',
        choices: [
            {
                text: 'Attend class',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 15, health: 10, xp: 12 }, message: 'You learned to cook a delicious meal! New skills acquired.' }
                ]
            },
            {
                text: 'Skip it',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'You missed the class.' }
                ]
            }
        ]
    },
    {
        id: 'lost_wallet',
        title: 'Found Wallet',
        description: 'You found a wallet on the street with €150 inside and an ID card.',
        icon: '👛',
        choices: [
            {
                text: 'Return to police',
                outcomes: [
                    { chance: 0.8, reward: { happiness: 20, xp: 20 }, message: 'The owner got their wallet back and thanked you!' },
                    { chance: 0.2, reward: { money: 50, happiness: 15, xp: 15 }, message: 'The grateful owner gave you €50 as a reward!' }
                ]
            },
            {
                text: 'Keep the money',
                outcomes: [
                    { chance: 0.7, reward: { money: 150, happiness: -10, xp: 5 }, message: 'You kept the money but feel guilty about it.' },
                    { chance: 0.3, reward: { money: -100, happiness: -20 }, message: 'Someone saw you! You had to pay a fine.' }
                ]
            }
        ]
    },
    {
        id: 'concert_tickets',
        title: 'Last-Minute Concert',
        description: 'Your favorite band is playing tonight! Scalpers are selling tickets for €80.',
        icon: '🎵',
        choices: [
            {
                text: 'Buy tickets',
                cost: { money: 80 },
                outcomes: [
                    { chance: 1.0, reward: { happiness: 30, xp: 15 }, message: 'Incredible concert! Best night in ages!' }
                ]
            },
            {
                text: 'Save money',
                outcomes: [
                    { chance: 1.0, reward: { happiness: -10, xp: 3 }, message: 'You saved money but feel like you missed something special.' }
                ]
            }
        ]
    },
    {
        id: 'garage_sale',
        title: 'Neighbor\'s Garage Sale',
        description: 'Your neighbor is selling some interesting items at great prices.',
        icon: '🏠',
        choices: [
            {
                text: 'Browse items',
                outcomes: [
                    { chance: 0.6, reward: { happiness: 10, xp: 5 }, message: 'You found some nice things but didn\'t buy anything.' },
                    { chance: 0.4, reward: { happiness: 15, xp: 10, money: -25 }, message: 'You found a great deal and bought something useful!', item: { name: 'Garage Sale Find', icon: '📦', value: 40 } }
                ]
            },
            {
                text: 'Not interested',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'You walked past.' }
                ]
            }
        ]
    },
    {
        id: 'medical_checkup',
        title: 'Free Health Screening',
        description: 'A mobile health clinic is offering free basic health screenings today.',
        icon: '🏥',
        choices: [
            {
                text: 'Get checked',
                outcomes: [
                    { chance: 0.8, reward: { health: 15, happiness: 10, xp: 10 }, message: 'All clear! You\'re in good health.' },
                    { chance: 0.2, reward: { health: 5, happiness: -5, xp: 15 }, message: 'Minor concerns found. Good thing you got checked.' }
                ]
            },
            {
                text: 'Skip it',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'You avoided the health screening.' }
                ]
            }
        ]
    },
    {
        id: 'language_exchange',
        title: 'Language Exchange Event',
        description: 'A cultural center is hosting a language exchange. Meet people and practice languages!',
        icon: '🗣️',
        choices: [
            {
                text: 'Participate',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 18, xp: 15 }, message: 'You met interesting people and learned new phrases!' }
                ]
            },
            {
                text: 'Not today',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'Maybe next time.' }
                ]
            }
        ]
    },
    {
        id: 'lost_pet',
        title: 'Help Find Lost Pet',
        description: 'Someone posted about their lost cat in your neighborhood. They\'re offering a €50 reward.',
        icon: '🐱',
        choices: [
            {
                text: 'Help search',
                outcomes: [
                    { chance: 0.3, reward: { money: 50, happiness: 25, xp: 20 }, message: 'You found the cat! The owner was so grateful.' },
                    { chance: 0.7, reward: { happiness: 10, xp: 10 }, message: 'No luck finding the cat, but you tried to help.' }
                ]
            },
            {
                text: 'Too busy',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'You continued with your day.' }
                ]
            }
        ]
    },
    {
        id: 'online_course',
        title: 'Free Online Course',
        description: 'A university is offering a free online course in a subject you\'re interested in.',
        icon: '💻',
        choices: [
            {
                text: 'Enroll',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 12, xp: 25 }, message: 'You completed the course and gained valuable knowledge!' }
                ]
            },
            {
                text: 'Maybe later',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'You bookmarked it for later.' }
                ]
            }
        ]
    },
    {
        id: 'community_garden',
        title: 'Community Garden Work',
        description: 'The local community garden needs volunteers to help plant vegetables.',
        icon: '🌱',
        choices: [
            {
                text: 'Help out',
                outcomes: [
                    { chance: 1.0, reward: { happiness: 20, health: 8, xp: 12 }, message: 'Great workout in fresh air! You feel connected to nature.' }
                ]
            },
            {
                text: 'Not interested',
                outcomes: [
                    { chance: 1.0, reward: { xp: 2 }, message: 'You kept walking.' }
                ]
            }
        ]
    }
];

// Achievement configurations
window.ACHIEVEMENT_CONFIGS = {
    surviveDays: {
        name: 'Survivor',
        description: 'Survive for multiple days',
        icon: '🗓️',
        targets: [10, 30, 100, 365, 1000],
        rewards: [50, 100, 250, 500, 1000]
    },
    kinoWins: {
        name: 'Lucky Numbers',
        description: 'Win Kino games',
        icon: '🎰',
        targets: [5, 25, 100, 500],
        rewards: [25, 75, 200, 500]
    },
    blackjackWins: {
        name: 'Card Sharp',
        description: 'Win Blackjack games',
        icon: '🃏',
        targets: [5, 25, 100, 500],
        rewards: [25, 75, 200, 500]
    },
    slotsWins: {
        name: 'Slot Master',
        description: 'Win at slot machines',
        icon: '🎰',
        targets: [10, 50, 200, 1000],
        rewards: [30, 100, 300, 800]
    },
    itemsBought: {
        name: 'Shopaholic',
        description: 'Purchase items from the market',
        icon: '🛒',
        targets: [10, 50, 100, 250],
        rewards: [50, 150, 300, 750]
    },
    moneyEarned: {
        name: 'Wealth Builder',
        description: 'Earn money through work',
        icon: '💰',
        targets: [1000, 5000, 10000, 50000],
        rewards: [100, 300, 600, 1500]
    },
    levelReached: {
        name: 'Experience Master',
        description: 'Reach higher levels',
        icon: '⭐',
        targets: [5, 10, 20, 50],
        rewards: [50, 150, 400, 1000]
    }
};

// Level system
window.LEVEL_SYSTEM = {
    getRequiredXP: (level) => level * 100,
    getLevelFromXP: (xp) => Math.floor(xp / 100) + 1,
    getXPProgress: (xp) => xp % 100
};

// Game balance constants
window.GAME_BALANCE = {
    MAX_DAILY_PROGRESSION: 7, // Maximum days that can auto-advance
    HEALTH_DAILY_DROP: { min: 2, max: 10 },
    HAPPINESS_DAILY_DROP: { min: 2, max: 10 },
    DEBT_INTEREST_RATE: 0.05, // 5% annual rate
    BANKRUPTCY_THRESHOLD: -5000,
    ITEM_DEPRECIATION_RATE: 0.1, // 10% per 10 days
    MIN_ITEM_VALUE_RATIO: 0.1 // Items can't go below 10% of original value
};

// UI Constants
window.UI_CONFIG = {
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 300,
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    CLOCK_UPDATE_INTERVAL: 1000
};
