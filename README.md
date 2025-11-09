# Offbeat - Music Streaming Platform 🎵

A modern music streaming web application built with React and Vite, featuring Spotify integration, YouTube playback, real-time features, and a dynamic user interface inspired by popular music platforms.

## ✨ Features

- 🎵 **Music Streaming** - Stream music from YouTube with integrated player
- 🎨 **Dynamic UI** - Color-adaptive interface based on album artwork
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🔍 **Search & Discovery** - Search songs, artists, and albums with auto-complete
- 📚 **Station Management** - Create, edit, and manage custom playlists
- 👤 **User Authentication** - Login/signup with user profiles
- 🎛️ **Audio Controls** - Volume control, equalizer, and playback queue
- 🔄 **Real-time Updates** - Live synchronization using WebSockets
- 📊 **Admin Dashboard** - Content management and analytics
- 💾 **Local Storage** - Offline playlist management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Spotify API credentials
- YouTube Data API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Omri-Gendler/Offbeat-frontend.git
cd Offbeat-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory with:
```env
VITE_SPOTIFY_API_KEY=your_spotify_client_id
VITE_SPOTIFY_API_KEY_SECRET=your_spotify_client_secret
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_LOCAL=true
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── assets/
│   └── styles/        # SCSS styling
│       ├── basics/    # Base styles and variables
│       ├── cmps/      # Component-specific styles
│       └── setup/     # SCSS configuration
├── cmps/              # Reusable components
│   ├── AppHeader.jsx          # Navigation header
│   ├── MusicPlayer.jsx        # Main audio player
│   ├── LeftSideBar.jsx        # Navigation sidebar
│   ├── StationList.jsx        # Playlist components
│   └── YouTubePlayer.jsx      # YouTube integration
├── pages/             # Route components
│   ├── HomePage.jsx           # Landing page
│   ├── StationDetails.jsx     # Playlist details
│   ├── Browser.jsx            # Search and discovery
│   └── UserDetails.jsx        # User profile
├── services/          # API and utility services
│   ├── youtube.service.js     # YouTube API integration
│   ├── spotify.service.js     # Spotify API integration
│   ├── socket.service.js      # WebSocket connection
│   └── station/               # Station management
└── store/            # Redux state management
    ├── actions/      # Action creators
    ├── reducers/     # State reducers
    └── selectors/    # State selectors
```

## 🎨 Key Components

### Core Components
- **`MusicPlayer`** - Main audio player with controls and queue
- **`YouTubePlayer`** - YouTube video integration for music playback
- **`LeftSideBar`** - Navigation with library and playlists
- **`StationDetails`** - Detailed playlist view with song management
- **`Browser`** - Search interface with categories and results
- **`AudioEqualizer`** - Visual equalizer animation

### Pages
- **`HomePage`** - Featured content and recently played
- **`StationIndex`** - User's playlist library
- **`Browser`** - Music discovery and search
- **`UserDetails`** - User profile and statistics
- **`AdminIndex`** - Admin dashboard for content management

## 🔄 State Management

Using Redux with modular state management:

```javascript
// Station module - Playlist management
const stations = useSelector(state => state.stationModule.stations)
dispatch(loadStations())

// User module - Authentication and profiles
const user = useSelector(state => state.userModule.user)
dispatch(login(credentials))

// Player module - Audio playback state
const currentSong = useSelector(state => state.playerModule.currentSong)
dispatch(playSong(song))
```

## 🎯 Services

### API Integration
- **`youtube.service`** - YouTube Data API for search and metadata
- **`spotify.service`** - Spotify Web API for music discovery
- **`station.service`** - Playlist CRUD operations
- **`user.service`** - Authentication and user management

### Utility Services
- **`socket.service`** - Real-time WebSocket communication
- **`event-bus.service`** - Event-driven communication
- **`upload.service`** - File upload handling
- **`util.service`** - Common utility functions

## 🎨 Styling Features

- **Dynamic theming** based on album artwork colors
- **CSS Grid** layouts for responsive design
- **Flexbox** for component alignment
- **SCSS modules** with component-scoped styles
- **CSS Custom Properties** for dynamic color schemes
- **Mobile-first** responsive breakpoints

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (local mode)
npm run dev:remote       # Start dev server (remote mode)
npm run dev:local        # Start dev server (local mode - explicit)

# Production
npm run build            # Create production build
npm run preview          # Preview production build
npm run start            # Start production server

# Development Tools
npm run lint             # Run ESLint
```

## 🌐 Deployment

The application is configured for deployment on Render.com:

```yaml
# render.yaml
services:
  - type: web
    name: offbeat-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
```

### Environment Setup
- Set `VITE_SPOTIFY_API_KEY` and `VITE_SPOTIFY_API_KEY_SECRET`
- Configure `VITE_YOUTUBE_API_KEY` with proper restrictions
- Set up CORS for your domain

## 🔑 API Setup

### YouTube API
1. Create a project in Google Cloud Console
2. Enable YouTube Data API v3
3. Create an API key with proper restrictions
4. See `YOUTUBE_API_SETUP.md` for detailed instructions

### Spotify API
1. Create an app in Spotify Developer Dashboard
2. Get Client ID and Client Secret
3. Configure redirect URIs for your domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Links

- **Live Demo**: [https://offbeat-frontend.onrender.com](https://offbeat-frontend.onrender.com)
- **Backend Repository**: [Offbeat Backend](https://github.com/Omri-Gendler/Offbeat-backend)

---

Built with ❤️ by [Omri Gendler](https://github.com/Omri-Gendler) using React, Vite, and modern web technologies.


