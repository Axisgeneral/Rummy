# Progressive Rummy Game 🃏

A modern, interactive web-based Progressive Rummy card game built with React, featuring beautiful animations, multiple themes, and intelligent AI opponents.

![Progressive Rummy](https://img.shields.io/badge/Game-Progressive%20Rummy-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.1.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-cyan)

## 🎮 Game Features

### Core Gameplay
- **Progressive Rummy Rules**: Classic 7-round progressive rummy with authentic scoring
- **4-Player Game**: You vs 3 intelligent AI opponents with unique personalities
- **Smart AI**: AI players with realistic decision-making and strategic play
- **Auto-Save**: Game state automatically saved and resumed
- **Round Requirements**: Each round has specific meld requirements to advance

### Visual & UX
- **Multiple Themes**: Choose from Classic, Modern, Neon, Ocean, and Forest themes
- **Smooth Animations**: Powered by Framer Motion for fluid card movements
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Intuitive Controls**: Drag-and-drop card arrangement and easy selection
- **Real-time Notifications**: Visual feedback for all game actions

### Advanced Features
- **Buy System**: Strategic buying from discard pile with immediate melding
- **Lay-off Mechanics**: Add cards to existing melds (yours or opponents')
- **Hand Organization**: Sort by suit or rank, manual drag-and-drop reordering
- **Score Tracking**: Comprehensive scoreboard with round-by-round tracking
- **Rules & Help**: Built-in comprehensive game rules and scoring guide

## 🎯 Game Rules Summary

### Objective
Complete 7 progressive rounds with the lowest total score. Each round has specific meld requirements:

1. **Round 1**: 2 Sets of 3
2. **Round 2**: 1 Set of 3 + 1 Run of 4  
3. **Round 3**: 2 Runs of 4
4. **Round 4**: 3 Sets of 3
5. **Round 5**: 2 Sets of 3 + 1 Run of 4
6. **Round 6**: 1 Set of 3 + 2 Runs of 4
7. **Round 7**: 3 Runs of 4

### Meld Types
- **Set**: 3-4 cards of same rank (any suits)
- **Run**: 3+ consecutive cards of same suit
- **Jokers**: Wild cards that can substitute for any card

### Scoring
- **Number cards**: Face value (2-10)
- **Face cards**: 10 points each (J, Q, K)
- **Aces**: 15 points each
- **Jokers**: 50 points each

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Rummy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── rummy/              # Game-specific components
│   │   ├── Card.jsx        # Individual card component
│   │   ├── PlayerHand.jsx  # Player's hand display
│   │   ├── MeldDisplay.jsx # Meld visualization
│   │   ├── BuyWindow.jsx   # Discard pile buying interface
│   │   ├── Scoreboard.jsx  # Score tracking
│   │   └── ThemeSelector.jsx # Theme switching
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── pages/
│   ├── ProgressiveRummy.jsx # Main game page
│   ├── Layout.jsx          # App layout wrapper
│   └── index.jsx           # Page router
├── api/
│   ├── entities.js         # Base44 API entities
│   └── base44Client.js     # API client
├── hooks/
│   └── use-mobile.jsx      # Mobile detection hook
├── lib/
│   └── utils.js            # Utility functions
└── utils/
    └── index.ts            # Additional utilities
```

## 🎨 Themes

The game includes 5 carefully crafted themes:

| Theme | Description |
|-------|-------------|
| **Classic** | Traditional green felt casino look |
| **Modern** | Clean, contemporary design |
| **Neon** | Vibrant cyberpunk-inspired colors |
| **Ocean** | Calming blue oceanic theme |
| **Forest** | Natural green woodland theme |

## 🧠 AI Features

The AI opponents feature:
- **Intelligent Decision Making**: Evaluates hand strength and round requirements
- **Strategic Buying**: Buys from discard when beneficial for melding
- **Adaptive Play**: Adjusts strategy based on game state and round requirements
- **Realistic Timing**: Human-like delays for natural gameplay feel
- **Unique Names**: Random AI names for personality (Ray, Connie, Judy, etc.)

## 🛠️ Technical Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and functional components
- **Vite 6.1.0** - Lightning-fast build tool and dev server
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.4.7** - Production-ready motion library
- **Radix UI** - Accessible, unstyled UI primitives

### Backend Integration
- **Base44 SDK** - Cloud backend for game state persistence
- **Auto-save functionality** - Seamless game continuation across sessions

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - CSS vendor prefix management

## 🎮 Gameplay Tips

### For Beginners
1. **Focus on Requirements**: Always check what the current round requires
2. **Use Jokers Wisely**: Save jokers for completing difficult melds
3. **Watch the Discard**: Monitor what other players discard for clues
4. **Buy Strategically**: Only buy if you can immediately meld

### Advanced Strategies
1. **Count Cards**: Track which cards have been played
2. **Block Opponents**: Discard cards that might help opponents
3. **Hand Management**: Keep cards that work in multiple potential melds
4. **Endgame Planning**: Plan your final meld sequence to go out

## 🔧 Configuration

### Theme Customization
Themes are defined in `src/components/rummy/ThemeSelector.jsx`. Each theme includes:
- Background gradients
- Table colors  
- Card styling
- UI accent colors

### Game Rules Modification
Game logic is centralized in `src/pages/ProgressiveRummy.jsx`:
- Round requirements in `ROUNDS` array
- Scoring values in `endRound()` function
- Meld validation in `isValidSet()` and `isValidRun()`

## 📱 Responsive Design

The game is fully responsive with breakpoints:
- **Mobile**: Optimized touch controls and stacked layout
- **Tablet**: Balanced grid layout with touch-friendly controls  
- **Desktop**: Full feature experience with optimal card sizing

## 🐛 Troubleshooting

### Common Issues

**Game won't start**
- Check browser console for errors
- Ensure Node.js 16+ is installed
- Try clearing browser cache

**Cards not displaying properly**
- Verify TailwindCSS is loading correctly
- Check for conflicting CSS styles
- Ensure all dependencies are installed

**AI not responding**
- Check network connectivity for Base44 API
- Verify game state isn't corrupted
- Try starting a new game

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add JSDoc comments for complex functions
- Test on multiple devices and browsers
- Ensure accessibility standards are met

## 📄 License

This project is part of the Base44 platform. For licensing information, contact Base44 support at app@base44.com.

## 🆘 Support

For technical support or questions:
- **Base44 Support**: app@base44.com
- **Game Issues**: Report via repository issues
- **Feature Requests**: Submit via repository discussions

## 🎯 Roadmap

### Planned Features
- [ ] Tournament mode with multiple games
- [ ] Player statistics and achievements
- [ ] Multiplayer support with real players
- [ ] Custom rule variations
- [ ] Sound effects and music
- [ ] Replay system for reviewing games
- [ ] Advanced AI difficulty settings

### Performance Improvements
- [ ] Card animation optimizations
- [ ] Mobile touch gesture enhancements
- [ ] Offline play capability
- [ ] Progressive Web App (PWA) features

---

**Enjoy playing Progressive Rummy!** 🎉

*Built with ❤️ using React, TailwindCSS, and the Base44 platform*