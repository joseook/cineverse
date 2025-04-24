# CineVerse - IMDb Movie App

![CineVerse Logo](assets/icon.png)

A modern React Native mobile application for browsing movies and TV shows, with a beautiful UI inspired by IMDb and popular streaming platforms.

## ✨ Features

- **Movie Exploration**
  - Browse popular, trending, and top-rated movies
  - View comprehensive movie details including cast, ratings, and plot
  - Discover similar movie recommendations

- **TV Shows**
  - Explore popular TV series across different categories
  - Featured shows with detailed information
  - Season information and ratings

- **User Experience**
  - Sleek, modern UI with smooth animations
  - Gesture-based interactions for a native feel
  - Dark theme optimized for OLED screens

- **Content Management**
  - Personal watchlist functionality
  - Search capabilities across the movie database
  - Genre-based content exploration

## 📱 Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="assets/screenshots/home.png" alt="Home Screen" width="200"/>
  <img src="assets/screenshots/movie-details.png" alt="Movie Details" width="200"/>
  <img src="assets/screenshots/tv-shows.png" alt="TV Shows" width="200"/>
  <img src="assets/screenshots/watchlist.png" alt="Watchlist" width="200"/>
</div>

(Note: Replace with actual screenshots once the app is running)

## 🚀 Recent Updates

- **TV Shows Integration**
  - Added dedicated TV Shows screen with categorized content
  - Implemented featured show section with detailed information
  - Added season tracking and ratings

- **Enhanced Movie Details**
  - Improved movie details screen with similar movie recommendations
  - Added fallback mechanisms for missing images and data
  - Enhanced UI for better readability and user experience

- **Gesture Support**
  - Implemented swipeable components for the watchlist
  - Added proper gesture handler integration for smoother interactions

- **Bug Fixes**
  - Fixed navigation issues between screens
  - Resolved React key prop warnings for list components
  - Improved error handling for API failures

## 🛠️ Technologies Used

- **Frontend**
  - React Native (v0.76.9)
  - Expo (v52)
  - TypeScript
  - React Navigation v7

- **UI/UX**
  - Expo Linear Gradient
  - React Native Gesture Handler
  - React Native Paper
  - Expo Vector Icons

- **State Management & Data Fetching**
  - React Context API
  - Axios for API requests
  - AsyncStorage for local persistence

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio or Xcode for emulators (optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/joseook/cineverse
   cd cineverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device or emulator**
   - For iOS: Press `i` in the terminal or run on iOS simulator
   - For Android: Press `a` in the terminal or run on Android emulator
   - Scan the QR code with the Expo Go app on your physical device

## 📁 Project Structure

```
cineverse/
├── assets/               # Static assets and images
├── src/
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Application screens
│   │   ├── HomeScreen.tsx           # Main landing screen
│   │   ├── MovieDetailsScreen.tsx   # Movie details view
│   │   ├── TVShowsScreen.tsx        # TV shows browsing
│   │   ├── WatchlistScreen.tsx      # User's saved content
│   │   └── ...
│   ├── services/         # API and data services
│   ├── utils/            # Utility functions and types
│   └── hooks/            # Custom React hooks
├── App.tsx               # Main application component
└── package.json          # Project dependencies
```

## 🔍 API Integration

The app uses a movie database API to fetch movie and TV show information. The API configuration is handled in the `src/services/api.ts` file.

## 🔮 Future Enhancements

- User authentication and profiles
- Trailer playback functionality
- Offline mode with data caching
- Social sharing features
- Personalized recommendations
- Dark/Light theme toggle

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- Your Name (@yourusername)

---

Made with ❤️ by joseok