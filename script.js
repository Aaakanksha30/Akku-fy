// Sample music data (in a real app, this would come from an API)
const sampleMusic = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        cover: "https://i.scdn.co/image/ab67616d0000b27386ca8e845605b6c9d7e76d54",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷",
        cover: "https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        album: "F*CK LOVE 3: OVER YOU",
        cover: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
];

// DOM Elements
const playlistGrids = document.querySelectorAll('.playlist-grid');
const searchInput = document.querySelector('.search-bar input');
const playButton = document.querySelector('.play-button');
const progressBar = document.querySelector('.progress');
const progressFill = document.querySelector('.progress-fill');
const volumeSlider = document.querySelector('.volume-slider');
const volumeFill = document.querySelector('.volume-fill');
const currentTimeDisplay = document.querySelector('.current-time');
const totalTimeDisplay = document.querySelector('.total-time');
const songNameDisplay = document.querySelector('.song-name');
const artistNameDisplay = document.querySelector('.artist-name');
const albumCoverDisplay = document.querySelector('.album-cover img');

// Audio player
const audio = new Audio();
let currentSong = null;
let isPlaying = false;
let allPlaylistItems = [];

// Initialize the app
function init() {
    // Populate playlists with sample music
    populatePlaylists();
    
    // Add event listeners
    setupEventListeners();
}

// Populate playlists with sample music
function populatePlaylists() {
    playlistGrids.forEach(grid => {
        grid.innerHTML = ''; // Clear existing content
        sampleMusic.forEach(song => {
            const playlistItem = createPlaylistItem(song);
            grid.appendChild(playlistItem);
            allPlaylistItems.push(playlistItem);
        });
    });
}

// Create a playlist item element
function createPlaylistItem(song) {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
        <img src="${song.cover}" alt="${song.album}">
        <div class="playlist-item-info">
            <div class="playlist-item-title">${song.title}</div>
            <div class="playlist-item-artist">${song.artist}</div>
        </div>
    `;
    
    item.addEventListener('click', () => playSong(song));
    return item;
}

// Play a song
function playSong(song) {
    if (currentSong?.id === song.id) {
        togglePlay();
        return;
    }
    
    currentSong = song;
    audio.src = song.audio;
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Error playing audio. Please try again.');
    });
    isPlaying = true;
    
    // Update UI
    updateNowPlaying(song);
    updatePlayButton();
}

// Toggle play/pause
function togglePlay() {
    if (!currentSong) return;
    
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Error playing audio. Please try again.');
        });
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}

// Update play button state
function updatePlayButton() {
    const icon = playButton.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

// Update now playing info
function updateNowPlaying(song) {
    songNameDisplay.textContent = song.title;
    artistNameDisplay.textContent = song.artist;
    albumCoverDisplay.src = song.cover;
}

// Setup event listeners
function setupEventListeners() {
    // Play button
    playButton.addEventListener('click', togglePlay);
    
    // Progress bar
    progressBar.addEventListener('click', (e) => {
        if (!currentSong) return;
        
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audio.currentTime = percentage * audio.duration;
    });
    
    // Volume slider
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audio.volume = percentage;
        volumeFill.style.width = `${percentage * 100}%`;
    });
    
    // Audio events
    audio.addEventListener('timeupdate', () => {
        if (!currentSong) return;
        
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percentage}%`;
        
        // Update time displays
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        totalTimeDisplay.textContent = formatTime(audio.duration);
    });
    
    audio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayButton();
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        allPlaylistItems.forEach(item => {
            const title = item.querySelector('.playlist-item-title').textContent.toLowerCase();
            const artist = item.querySelector('.playlist-item-artist').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize the app
init(); 