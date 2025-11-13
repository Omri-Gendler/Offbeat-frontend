// This file is no longer needed - demo data initialization is handled in the main app
// Keeping this as a backup manual initializer

(function() {
    console.log('🚀 GitHub Pages Demo Data Initializer (Backup)');
    
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (!isGitHubPages) {
        console.log('Not on GitHub Pages, skipping initialization');
        return;
    }
    
    // Wait for the app to load, then check if we have demo data
    setTimeout(() => {
        const stations = localStorage.getItem('stationDB');
        const stationData = stations ? JSON.parse(stations) : [];
        
        if (!stations || stationData.length === 0) {
            console.log('📊 No demo data found, creating basic stations...');
            createBasicDemoData();
        } else {
            console.log('✅ Demo data already exists:', stationData.length, 'stations');
        }
        
        // Also check if the main React app loaded
        checkAppLoad();
    }, 1000);
    
    function checkAppLoad() {
        setTimeout(() => {
            const root = document.getElementById('root');
            if (root && root.children.length === 0) {
                console.warn('⚠️ Main app did not load, showing fallback UI');
                showFallbackUI();
            }
        }, 5000); // Wait 5 seconds for app to load
    }
    
    function showFallbackUI() {
        const root = document.getElementById('root');
        if (root) {
            root.innerHTML = `
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    font-family: 'Plus Jakarta Sans', Arial, sans-serif;
                    background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
                    color: white;
                    text-align: center;
                    padding: 20px;
                ">
                    <div style="
                        background: rgba(255,255,255,0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                    ">
                        <h1 style="margin: 0 0 20px 0; font-size: 48px;">🎵</h1>
                        <h2 style="margin: 0 0 10px 0; color: #1ed760;">Offbeat Music</h2>
                        <p style="margin: 0 0 20px 0; opacity: 0.8;">Your music streaming experience is loading...</p>
                        <div style="margin: 20px 0;">
                            <div style="
                                display: inline-block;
                                width: 12px;
                                height: 12px;
                                background: #1ed760;
                                border-radius: 50%;
                                margin: 0 4px;
                                animation: pulse 1.4s ease-in-out infinite both;
                            "></div>
                            <div style="
                                display: inline-block;
                                width: 12px;
                                height: 12px;
                                background: #1ed760;
                                border-radius: 50%;
                                margin: 0 4px;
                                animation: pulse 1.4s ease-in-out 0.2s infinite both;
                            "></div>
                            <div style="
                                display: inline-block;
                                width: 12px;
                                height: 12px;
                                background: #1ed760;
                                border-radius: 50%;
                                margin: 0 4px;
                                animation: pulse 1.4s ease-in-out 0.4s infinite both;
                            "></div>
                        </div>
                        <button onclick="window.location.reload()" style="
                            margin-top: 20px;
                            padding: 12px 24px;
                            background: #1ed760;
                            color: #121212;
                            border: none;
                            border-radius: 25px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 16px;
                            transition: background 0.3s ease;
                        " onmouseover="this.style.background='#1db954'" onmouseout="this.style.background='#1ed760'">
                            Refresh Page
                        </button>
                    </div>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                    }
                </style>
            `;
        }
    }
    
    function createBasicDemoData() {
        const baseUrl = window.location.pathname.includes('/Offbeat-frontend/') 
            ? '/Offbeat-frontend/' 
            : '/';
            
        const demoStations = [
            {
                _id: 'liked-songs-station',
                name: 'Liked Songs',
                songs: [],
                imgUrl: baseUrl + 'img/liked-songs.jpeg',
                isLikedSongs: true,
                createdBy: { fullname: 'You' }
            },
            {
                _id: 'demo_station_1',
                name: 'Today\'s Top Hits',
                description: 'The hottest tracks right now',
                imgUrl: 'https://i.scdn.co/image/ab67706f00000002ea546f8c6250aa17529644f7',
                createdBy: { _id: 'guest', fullname: 'Spotify' },
                songs: [
                    {
                        id: 'demo_song_1',
                        title: 'Sample Song 1',
                        artists: 'Demo Artist',
                        album: 'Demo Album',
                        durationMs: 210000,
                        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273c9b6c7bb3dade2ce0c8c4239',
                        addedAt: Date.now(),
                        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                    }
                ],
                likedByUsers: []
            },
            {
                _id: 'demo_station_2',
                name: 'Chill Vibes',
                description: 'Relaxing music for any mood',
                imgUrl: 'https://i.scdn.co/image/ab67706f000000026b30471dcc036d254dcc8041',
                createdBy: { _id: 'guest', fullname: 'Spotify' },
                songs: [
                    {
                        id: 'demo_song_2',
                        title: 'Chill Track',
                        artists: 'Relaxing Artist',
                        album: 'Calm Album',
                        durationMs: 240000,
                        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273c9b6c7bb3dade2ce0c8c4239',
                        addedAt: Date.now(),
                        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
                    }
                ],
                likedByUsers: []
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('stationDB', JSON.stringify(demoStations));
        localStorage.setItem('likedSongsStation', JSON.stringify(demoStations[0]));
        
        console.log('✅ Basic demo data created! Refreshing page...');
        
        // Refresh the page to load the new data
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    
    // Make helper functions available globally
    window.initGitHubPagesData = createBasicDemoData;
})();