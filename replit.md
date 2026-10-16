# Overview

SmartSim Life is a comprehensive web-based life simulation game that allows players to create and manage a virtual character through various life stages. The game features simplified character creation (name, gender, age), progressive career system, housing progression, vehicle ownership, financial management, multiple casino mini-games, consumable health system, death/restart mechanics, inventory categories, job security risks, burglary events, and achievement tracking. Players start unemployed living with parents and must work their way up through jobs that unlock with experience, eventually being able to rent/buy houses and cars.

## Recent Changes (August 2025)
- Streamlined interface by removing Messages, Social Media, and Statistics apps 
- Reorganized UI layout: Bank moved from quick actions to main app grid
- Profile app moved to quick actions bar and displays current player level (e.g., "Lv.8") instead of "Profile" text
- Removed level display from top-right corner, replaced notification dot with settings gear (⚙️) 
- Fixed critical bug where happiness/addiction values would incorrectly wrap from 0% to 100%
- App count expanded to 10 core apps with addition of dedicated Story app
- **Separated Story System**: Created dedicated Story app instead of integrating with Daily Events to avoid conflicts and bugs
- **Story App Architecture**: Clean separation where Daily Events only handles daily events, Story app manages narrative content
- **Simple Story Triggers**: Stories available on specific milestone days (5, 10, 15, 20, 25, 30) with one-per-day completion system
- **Procedural Story System**: Stories every 5 days (73 total story events per life cycle) with preset early game events and procedurally generated stories based on life stages
- **Life Stage Progression**: Young Adult (1-100), Adult (101-200), Mature (201-300), Elder (301-365) with stage-appropriate story themes
- **New Game Plus System**: Complete life cycle at day 365, keep achievements/skills/half money, start fresh journey with accumulated benefits
- **Choice Consequences**: Story choices directly affect happiness, money, and character traits with clear visual feedback
- **Interactive Skill Tree**: Canvas-based skill tree visualization with 15+ unlockable skills across 4 branches (Social, Professional, Personal, Special)
- **Skill Points System**: Earn points through leveling, story completion, and achievements to unlock and upgrade character abilities
- **Character Progression**: Visual skill tree with prerequisites, upgrade paths, and real-time effects on gameplay stats
- **Enhanced Romance System**: Dynamic relationship events appear randomly in Story app (25% chance on non-main-story days)
- **Progressive Relationship Building**: Four relationship stages (Stranger 0-19, Friend 20-49, Close Friend 50-74, Romantic Partner 75+)
- **Story Integration**: Relationship choices in Story app directly affect Romance app progress and unlock deeper interactions
- **Five Unique NPCs**: Alex (Adventurous), Sam (Intellectual), Jordan (Ambitious), Casey (Creative), Taylor (Caring)
- **Challenging Romance System**: No more simple button clicking - relationships develop naturally through meaningful story choices

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Single Page Application (SPA)**: Built using vanilla HTML, CSS, and JavaScript without external frameworks
- **Mobile-First Design**: Optimized for mobile devices with responsive CSS and touch-friendly interactions
- **Modular JavaScript Structure**: Code organized into separate modules (main.js, character.js, market.js, etc.) with clear separation of concerns
- **Screen-Based Navigation**: Multiple screens managed through DOM manipulation and CSS classes for app-like experience
- **Real-Time Updates**: Dynamic UI updates using JavaScript event listeners and timer-based functions

## Game State Management
- **Local Storage Persistence**: All game data stored in browser's localStorage using JSON serialization
- **Centralized State Management**: Single loadGameData()/saveGameData() pattern for consistent data access
- **Default Value Handling**: Comprehensive fallback system for missing or corrupted data
- **Auto-Save System**: Periodic automatic saves every 30 seconds with user-configurable settings

## Game Systems Architecture
- **Time Progression System**: Day-based advancement with tick.js handling daily calculations and events
- **Achievement System**: Target-based progression tracking with unlock mechanics and XP rewards
- **Inventory Management**: Complete item ownership, depreciation, and trading system
- **Financial Simulation**: Banking, debt, credit score, and expense management
- **Career Progression**: Experience-based job advancement (0, 30, 90, 180, 365, 730+ days) with salary scaling
- **Housing System**: Progressive housing from parents home to luxury properties (rent/buy)
- **Transportation System**: Vehicle ownership from walking to luxury cars with travel options
- **Health & Happiness**: Character wellness metrics affecting gameplay options

## Mini-Games Integration
- **Blackjack**: Full card game implementation with strategy hints and win tracking
- **Kino (Lottery)**: Number selection game with animated drawing, auto-reset after 2 seconds, compact layout, and payout systems
- **Slots**: 3-reel slot machine with 5 symbols (Cherry 50%, Lemon 25%, Orange 15%, Grape 7%, Diamond 3%) achieving 14.46% win rate (1 in 7 spins)
- **Roulette**: European roulette with number betting and color/even/odd options
- **Scratch Cards**: Lottery scratch-off tickets with different themes (Lucky 7's, Cash Cow, Gold Rush) and varying odds/prices
- **Daily Events**: Random event system with choice-based outcomes



## Enhanced Gameplay Systems
- **Consumable Items**: Food and drinks restore 3-25 health points based on price/quality
- **Item Categories**: Inventory organized like market with food, electronics, luxury, vehicles categories
- **Death/Restart System**: Character death at 0% health triggers complete restart preserving achievements
- **Job Security**: 0.5% daily chance of getting fired with severance pay and various reasons
- **Home Security**: Burglary risks based on housing type that can steal money and valuables
- **Health Management**: Items expire after 7 days, consumption prevents death from low health

## UI/UX Design Patterns
- **Phone Frame Simulation**: Mobile device appearance with status bar and app icons
- **Modal System**: Overlay-based screens for detailed interactions
- **Category-Based Navigation**: Tabbed interfaces for organizing content (market, inventory, etc.)
- **Real-Time Statistics**: Live updating displays for money, health, level, and other metrics
- **Dark Mode Support**: Toggle-able theme system with CSS variable management

# External Dependencies

## Server Infrastructure
- **Express.js**: Node.js web server framework for deployment
- **CORS**: Cross-Origin Resource Sharing middleware for API access
- **Node.js**: Runtime environment for server-side execution

## Third-Party Services
- **Font Awesome**: Icon library for UI elements (CDN: cdnjs.cloudflare.com)

## Browser APIs
- **LocalStorage API**: Primary data persistence mechanism
- **Date API**: Time management and day progression calculations
- **DOM API**: Dynamic content rendering and event handling
- **CSS Animations**: Visual feedback and transitions

## Asset Dependencies
- **Custom CSS**: Mobile-optimized styling with responsive design patterns
- **Image Assets**: Product icons and UI graphics (referenced but not included in current codebase)

## Development Tools
- **Vanilla JavaScript**: No external JavaScript frameworks or libraries
- **Modern CSS**: Flexbox, Grid, and CSS custom properties for styling
- **HTML5 Semantic Elements**: Proper document structure and accessibility considerations

## Deployment Configuration
- **server.js**: Express server for Replit deployment with health checks
- **package.json**: Node.js dependencies and scripts (managed by packager tool)
- **Health endpoint**: `/health` route for deployment verification