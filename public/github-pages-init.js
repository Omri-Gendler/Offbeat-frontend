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
    }, 1000);
    
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