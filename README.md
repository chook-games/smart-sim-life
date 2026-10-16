# SmartSim Life

Life simulation game that runs entirely in the browser. Create a character and build
your life from scratch: work your way up a career, rent or buy houses and cars, manage
your money, play casino mini-games, follow a branching story, unlock skills and chase
achievements across a 365-day life cycle and a New Game+ loop.

## Tech

Vanilla HTML / CSS / JavaScript — static single-page app, no build step, no framework.
Game data is saved in the browser via `localStorage`. Mobile-first, phone-frame UI.

## Run locally

Open `index.html` directly, or serve the folder:

```
npx serve .
```

An optional Express server (`server.js`) is included for deployments that need one.

## Deploy

Hosted as a static site on GitHub Pages (served from the repo root).

## Structure

- `index.html` / `style.css` / `main.js` — app shell, styles and bootstrap
- `state.js`, `tick.js`, `constants.js` — game state, time progression and balancing
- Feature apps: `jobs.js`, `realestate.js`, `cars.js`, `market.js`, `inventory.js`,
  `profile.js`, `stats.js`, `relationships.js`, `romance-enhanced.js`, `skilltree.js`
- Mini-games: `blackjack.js`, `kino.js`, `slots.js`, `roulette.js`, `scratch-cards.js`
- Narrative: `story.js`, `story-app.js`, `events.js`, `daily-events.js`, `newgame-plus.js`
- UI: `ui.js`, `settings.js`, `achievements.js`
- `cards/` — card face images used by blackjack

See `replit.md` for the full original design notes.
