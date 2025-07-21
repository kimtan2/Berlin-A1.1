# Deutsch in Berlin - Interactive German Learning App

A comprehensive German learning application that simulates real-world conversations in Berlin locations. Learn German through contextual dialogues in bakeries, supermarkets, and parks.

![Berlin German Learning App](https://img.shields.io/badge/German-Learning-blue) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## 🌟 Features

### ✨ **Interactive Berlin Map**
- Visual map of Berlin with clickable location markers
- Progress indicators for each location
- Unlock system - complete visits to access new areas
- Real-time progress tracking with circular progress rings

### 🏪 **Three Authentic Locations**
1. **🥖 Bäckerei (Bakery)** - Learn basic ordering and greetings
2. **🛒 Rewe Supermarket** - Apply skills in grocery shopping context  
3. **🌳 Tiergarten Park** - Practice social conversations and introductions

### 🎯 **Progressive Learning System**
- 17 total visits across all locations
- Each visit builds on previous knowledge
- Skill transfer between locations (bakery → supermarket)
- Graded difficulty from basic greetings to complex transactions

### 💬 **Dialogue-Based Learning**
- Multiple choice responses with instant feedback
- Native speaker audio pronunciation (demo framework ready)
- Contextual vocabulary introduction
- Mistake tracking and scoring system

### 📊 **Progress Tracking**
- Local storage persistence
- Comprehensive statistics dashboard
- Vocabulary collection and review
- Achievement tracking and badges

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd deutsch-berlin-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to `http://localhost:5173` to start learning!

## 📱 User Experience Flow

### 1. **Berlin Map View**
- Interactive map showing 3 location pins
- Progress indicators (🔓 unlocked, 🔒 locked, ✅ completed)
- Click any unlocked location to begin

### 2. **Place Selection**
- View available visits for the selected location
- See learning objectives and new vocabulary
- Track completion status and scores
- Sequential unlock system

### 3. **Visit Experience**
- Introduction screen with vocabulary preview
- Interactive dialogue with native speaker
- Multiple choice responses with feedback
- Progress through conversation steps

### 4. **Progress Tracking**
- Real-time progress updates
- Vocabulary collection
- Achievement unlocks
- Performance statistics

## 🏗️ Technical Architecture

### **Tech Stack**
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: React Context + useReducer
- **Storage**: localStorage with backup/restore
- **Audio**: HTML5 Audio API (ready for integration)
- **Icons**: Lucide React
- **Build**: Vite
- **Routing**: React Router

### **Project Structure**
```
src/
├── components/           # Reusable UI components
│   ├── BerlinMap.tsx    # Interactive map with progress
│   ├── PlaceScreen.tsx  # Place selection interface
│   ├── VisitScreen.tsx  # Individual visit handler
│   ├── DialogueInterface.tsx # Conversation interface
│   └── AudioPlayer.tsx  # Audio pronunciation player
├── context/             # Global state management
│   └── ProgressContext.tsx # Progress tracking context
├── data/               # Content and configuration
│   └── content.json    # All dialogue data and vocabulary
├── pages/              # Route components
│   └── MainApp.tsx     # Main application router
├── types/              # TypeScript definitions
│   └── index.ts        # Comprehensive type system
├── utils/              # Utility functions
│   └── localStorage.ts # Progress persistence utilities
└── hooks/              # Custom React hooks
```

## 📚 Learning Content Structure

### **Bäckerei (Bakery) - 6 Visits**
1. Basic Greeting & Single Item Order
2. Adding Quantities & Politeness  
3. Price Inquiry & Understanding
4. Payment Process & Change
5. Multiple Items & Full Transaction
6. Natural Conversation Flow

### **Rewe Supermarket - 6 Visits** 
1. Basic Greeting & One Item *(applies bakery skills)*
2. Adding Numbers & Politeness *(skill transfer)*
3. Price Questions *(skill transfer)*
4. Payment Process *(skill transfer)*
5. Multiple Items *(skill transfer)*
6. Complete Shopping *(mastery)*

### **Tiergarten Park - 5 Visits**
1. Basic Name Introduction
2. Adding Age Information
3. Where Are You From?
4. How Are You?
5. Complete Social Introduction

## 🎯 Learning Objectives

### **A1.1 German Level Skills**
- **Greetings**: Guten Morgen, Hallo, Auf Wiedersehen
- **Politeness**: sich bedanken, sich entschuldigen
- **Shopping**: Ordering, prices, quantities
- **Numbers**: 1-20 in context
- **Personal Info**: Name, age, origin
- **Basic Questions**: W-Fragen (Was, Wie, Woher)
- **Social Skills**: nach dem Befinden fragen

### **Progressive Difficulty**
- Start with single interactions
- Build to complex multi-step conversations
- Transfer skills between contexts
- Develop natural conversation flow

## 🔧 Customization & Extension

### **Adding New Content**
1. Update `src/data/content.json` with new dialogue
2. Add new vocabulary items
3. Create additional learning objectives
4. Define unlock requirements

### **Audio Integration**
The app is designed for easy audio integration:
```typescript
// Audio files should be placed in public/audio/
// Format: /audio/{speaker}_{context}.mp3
// Example: /audio/baecker_guten_morgen.mp3
```

### **New Locations**
1. Add to `PlaceId` type in `src/types/index.ts`
2. Update content.json with new place data
3. Add map position and styling
4. Define unlock progression

## 📊 Progress System

### **Local Storage Schema**
```typescript
{
  completedVisits: {
    baeckerei: [1, 2, 3], // Completed visit numbers
    rewe: [1],
    park: []
  },
  visitScores: {
    "baeckerei_1": {
      completed: true,
      score: 0.9,
      timeSpent: 120000,
      mistakes: 1,
      completedAt: "2024-01-01T10:00:00Z"
    }
  },
  unlockedPlaces: ["baeckerei", "rewe"],
  overallProgress: 35
}
```

### **Unlock Logic**
- 🥖 **Bäckerei**: Always unlocked (starting point)
- 🌳 **Park**: Unlocked after Bäckerei Visit 2
- 🛒 **Supermarket**: Unlocked after Bäckerei Visit 3

## 🎨 Design System

### **Color Scheme**
- **Primary**: Blue gradients for main UI
- **Bäckerei**: Amber/Orange for bakery theme
- **Rewe**: Red gradients for supermarket
- **Park**: Green/Emerald for nature theme
- **Progress**: Green for completed, Blue for active, Gray for locked

### **Components**
- Consistent card-based layouts
- Progress rings and bars
- Hover animations and transitions
- Mobile-first responsive design
- Accessibility-friendly color contrasts

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
# or
yarn build
```

### **Deploy to Vercel** (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### **Deploy to Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🧪 Testing

### **Component Testing**
```bash
npm run test
```

### **Manual Testing Checklist**
- [ ] Map loads with correct progress indicators
- [ ] Places unlock in correct sequence
- [ ] Dialogues flow properly with feedback
- [ ] Progress persists after page reload
- [ ] Mobile responsive design works
- [ ] Audio player handles missing files gracefully

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Development Guidelines**
- Use TypeScript for all new code
- Follow existing component patterns
- Add proper error handling
- Update types when adding features
- Test on mobile devices
- Maintain accessibility standards

## 🐛 Troubleshooting

### **Common Issues**

**Progress not saving?**
- Check browser localStorage permissions
- Clear localStorage and restart app
- Verify console for error messages

**Audio not playing?**
- Audio files are not included in demo
- Check AudioPlayer component logs
- Verify file paths in content.json

**Build errors?**
- Run `npm install` to update dependencies
- Check TypeScript errors in console
- Verify all imports are correct

**Performance issues?**
- Check browser dev tools performance tab
- Consider lazy loading for large content
- Optimize images and assets

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- German language learning methodology
- Berlin cultural context research
- React community best practices
- Tailwind CSS design system
- Open source component libraries

---

**Ready to start learning German? 🇩🇪**

Visit the app and click on the Bäckerei to begin your journey! Don't forget to turn on your audio for the full experience.

*Viel Erfolg beim Deutschlernen! (Good luck learning German!)*

---

## Original Lovable Project Info

**Lovable Project URL**: https://lovable.dev/projects/08efb76f-6fcc-4937-b501-b93585e92779

This project was enhanced from a basic template into a comprehensive German learning application with custom components, progressive learning system, and interactive features.
