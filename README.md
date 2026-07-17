# 🎮 LahiQuest - Learn Philippine History, But Make It Fun

A gamified WebAR learning platform for Philippine history, built as a Grade 10 MAPEH project. Learn your nation's story through immersive quests, AR artifacts, and real Filipino slang.

## ✨ Features

✅ **3 Historical Eras** - Ancient PH, Spanish Colonial, Revolution (24 total questions)
✅ **Progressive Unlocking** - Earn 60% to unlock the next era  
✅ **WebAR Artifacts** - Point your camera at Hiro Marker to see historical 3D models
✅ **Wikipedia Integration** - Learn context facts after correct answers (no API key needed!)
✅ **Hints & Learning** - Every question includes helpful hints
✅ **Offline Support** - Quiz data cached locally, works without internet  
✅ **Mobile Responsive** - Fully optimized for phones & tablets
✅ **Teacher Analytics** - See student progress and performance  

## 🎯 What You Learn

- **Ancient Era:** Baybayin, Lapu-Lapu, Barangays, pre-colonial trade routes
- **Spanish Era:** Encomienda, Jose Rizal, Cavite Mutiny, Galleon Trade
- **Revolution:** Katipunan, Andres Bonifacio, Independence Declaration, Antonio Luna

## 🌐 Live Demo

👉 **https://lahi-quest.vercel.app**

## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/sethdico/LahiQuest.git
cd LahiQuest

# Serve with any HTTP server
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: VS Code Live Server extension

# Then visit http://localhost:8000
```

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **AR:** A-Frame + AR.js (WebAR)
- **Data:** Embedded + Wikipedia API (no auth needed!)
- **Storage:** LocalStorage (offline-first)
- **Deployment:** Vercel

## 📱 Features Breakdown

### Quiz System
- 8 questions per historical era (24 total)
- Hints for every question
- Real-time feedback (correct/wrong with explanations)
- Progress tracking per quest
- LocalStorage for offline play

### AR Artifacts
- **Manunggul Jar** (Ancient Era) - 3D historical burial vessel
- **Baybayin Script** (Ancient Era) - Ancient Filipino writing system  
- **Katipunan Flag** (Revolution) - Symbol of independence

*Scan Hiro Marker with your device to activate AR!*

### Educational Enhancements
- Wikipedia context fetching (works offline with cached data)
- Historically accurate information with sources
- Teacher analytics dashboard
- Mobile-first design

## 💻 API & Data Sources

- **Wikipedia API** - FREE historical context (no API key needed)
- **A-Frame/AR.js** - FREE WebAR framework
- **All quiz data** - Embedded (no external dependencies)

## 🎓 Learning Outcomes

Students will:
- ✅ Understand pre-colonial Philippine society
- ✅ Learn about Spanish colonial impact
- ✅ Study the Philippine Revolution and independence
- ✅ Experience AR technology in education
- ✅ Engage with history through gamification

## 📊 Progress Tracking

- **Score Tracking** - See your performance across all eras
- **Quest Unlocking** - Progress through history linearly
- **Teacher Dashboard** - Class analytics with student stats
- **LocalStorage** - Your progress is saved automatically

## 🐛 Troubleshooting

### 404 Error on Vercel?
The `vercel.json` file handles routing. If you still see errors:
1. Make sure `index.html` is in the root directory
2. Redeploy with `git push`

### AR Not Working?
- Ensure you allow camera permissions
- Use a Hiro Marker (search "Hiro Marker" online)
- Try in landscape mode for better experience

### Offline Mode
- Quiz data is cached in localStorage automatically
- Wikipedia context requires internet but quiz works offline

## 📝 Credits

Built with ❤️ for Philippine history education.
- Quiz data sourced from: Wikipedia, school textbooks, historical archives
- Icons & fonts: Google Fonts, Dicebear Avatars
- AR: A-Frame.io, AR.js

## 📄 License

MIT - Feel free to use, modify, and share!

---

**Made by:** @sethdico  
**Subject:** MAPEH (Music, Arts, Physical Education, Health)  
**Date:** July 16-17, 2026  

"History class, but it's giving main character." 🎮✨
