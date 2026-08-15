# Reaction Hunter

A fast-paced reaction-time game built with React. Click the target as quickly and accurately as possible before it disappears.

## Live Demo

[Play Reaction Hunter](https://reaction-hunter-chiru.netlify.app/)

## Features

- Three difficulty levels: Easy, Medium, and Hard
- Random target positioning
- Target timeout system
- Lives system
- 30-second game timer
- 3-second start countdown
- Reaction-time tracking
- Score system
- Difficulty-based scoring
- Streak system
- Score multipliers
- Best streak tracking
- Accuracy calculation
- Best reaction-time tracking
- Per-difficulty high scores
- New high-score detection
- Hit, miss, and timeout feedback
- Sound effects
- Complete game history stored locally
- Recent 5 games displayed
- Overall statistics
- Statistics separated by difficulty
- Persistent data using browser `localStorage`
- Responsive UI

## Difficulty Levels

| Difficulty | Target Size | Lives | Target Timeout | Base Points |
|------------|-------------|-------|----------------|-------------|
| Easy | 60px | 5 | 2.5 seconds | 1 |
| Medium | 50px | 3 | 2 seconds | 2 |
| Hard | 40px | 2 | 1.5 seconds | 3 |

## Scoring

The score multiplier increases with consecutive successful hits:

| Streak | Multiplier |
|--------|------------|
| 0–4 | ×1 |
| 5–9 | ×2 |
| 10–14 | ×3 |
| 15+ | ×4 |

The final score depends on both the selected difficulty and the current streak multiplier.

## Performance Tracking

Reaction Hunter tracks:

- Score
- Hits
- Misses
- Accuracy
- Current streak
- Best streak
- Best reaction time
- Average reaction time
- High score
- Game rating

### Rating System

| Rating | Requirement |
|--------|-------------|
| LEGENDARY | < 300 ms and ≥ 90% accuracy |
| EXCELLENT | < 400 ms and ≥ 80% accuracy |
| GREAT | < 500 ms and ≥ 70% accuracy |
| GOOD | < 700 ms |
| KEEP PRACTICING | 700 ms+ |

## Statistics

The game stores all completed games locally and calculates statistics from the complete history.

The statistics include:

- Total games played
- Total hits
- Total misses
- Best score
- Best streak
- Best reaction time
- Average reaction time
- Average accuracy

Statistics are also separated by:

- Easy
- Medium
- Hard

The game history interface displays only the five most recent games to keep the UI clean while retaining the complete history for statistics.

## Data Persistence

The project uses browser `localStorage` for persistence.

Stored data includes:

```text
reactionHunterHighScores
reactionHunterGameHistory
```

No backend or database is required.

## Tech Stack

- React
- JavaScript
- HTML5
- CSS3
- Webpack
- Babel
- Webpack Dev Server
- npm
- Browser localStorage

## Project Structure

```text
reaction_hunter/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx
│   │   ├── GameBoard.jsx
│   │   ├── GameStats.jsx
│   │   ├── Feedback.jsx
│   │   ├── ResultsScreen.jsx
│   │   ├── GameHistory.jsx
│   │   ├── Statistics.jsx
│   │   └── DifficultyStats.jsx
│   │
│   ├── hooks/
│   │   ├── useGame.js
│   │   └── useSound.js
│   │
│   ├── App.jsx
│   ├── index.js
│   └── styles.css
│
├── package.json
├── webpack.config.js
├── babel.config.js
└── README.md
```

The exact structure may evolve as the project is developed.

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/chiranjeevi-kodimela/reaction_hunter.git
```

### 2. Enter the project

```bash
cd reaction_hunter
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm start
```

The development server runs at:

```text
http://localhost:3000
```

## How to Play

1. Select Easy, Medium, or Hard.
2. Click **Start Game**.
3. Wait for the countdown.
4. Click the target as quickly as possible.
5. Avoid clicking outside the target.
6. Hit the target before its timeout.
7. Build a streak to increase your multiplier.
8. Try to beat your difficulty-specific high score.
9. Review your results and statistics after the game.

## Architecture

The application uses a component-based React architecture.

The main game logic is centralized in a custom React Hook:

```text
src/hooks/useGame.js
```

UI responsibilities are separated into reusable components:

```text
StartScreen
GameBoard
GameStats
Feedback
ResultsScreen
GameHistory
Statistics
DifficultyStats
```

This keeps the main application component focused on composition while the custom hook handles game state, timers, scoring, statistics, and persistence.

## Learning Objectives

This project demonstrates practical experience with:

- React functional components
- React Hooks
- Custom Hooks
- State management
- Event handling
- Conditional rendering
- Component-based architecture
- JavaScript timers
- Browser localStorage
- Game-state management
- Dynamic UI updates
- CSS animations
- Responsive design
- Webpack configuration
- Babel

## Future Improvements

Potential future additions:

- Global online leaderboard
- User accounts
- Cloud-based statistics
- Multiplayer mode
- Additional game modes
- Custom game durations
- Mobile touch optimization
- Accessibility improvements
- Advanced performance analytics

## Author

**Chiranjeevi Kodimela**

Computer Science & Engineering

GitHub: https://github.com/chiranjeevi-kodimela

## License

This project is available under the MIT License.
