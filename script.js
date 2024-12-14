// Fetch data from the JSON file and populate the sections
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Function to populate album lists dynamically
        function populateAlbumSection(sectionId, dataArray) {
            const container = document.getElementById(sectionId);
            dataArray.forEach(item => {
                const div = document.createElement('div');
                div.className = 'album';
                div.textContent = item;
                container.appendChild(div);
            });
        }

        // Populating sections with album data
        populateAlbumSection('trendingAlbums', data.trending);
        populateAlbumSection('topChartsAlbums', data.topCharts);
        populateAlbumSection('newReleasesAlbums', data.newReleases);
        populateAlbumSection('latestAlbums', data.latestAlbums);
        populateAlbumSection('genresList', data.genres);
        populateAlbumSection('oldSongsList', data.oldSongs);
        populateAlbumSection('topArtists', data.topArtists);
        populateAlbumSection('languagesList', data.languages);
        populateAlbumSection('topSearchedSongs', data.topSearched);

        // Update image sources for gallery images
        const galleryImages = ['Place.jpg', 'Place2.jpg', 'Place3.jpg', 'Place4.jpg'];
        const galleryContainer = document.getElementById('galleryImages');
        galleryImages.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = `images/${image}`;
            img.className = 'gallery-image';
            img.alt = `Image of ${image.split('.')[0].replace('_', ' ')}`;
            galleryContainer.appendChild(img);
        });

        // Add click event listeners to album elements after they are added to the DOM
        document.querySelectorAll('.album').forEach(album => {
            album.addEventListener('click', function() {
                const songTitle = this.textContent;
                const songImageSrc = `images/Place${(Math.floor(Math.random() * 4) + 1)}.jpg`;  // Randomly select an image

                document.getElementById('selected-song').textContent = `You selected: ${songTitle}`;
                document.getElementById('song-image').src = songImageSrc;
                toggleModal('listen-download-modal', true);
            });
        });

        // Check login status on page load
        checkLoginStatus();
    })
    .catch(error => console.error('Error loading data.json:', error));

// Listen button action
document.getElementById('listen-btn').addEventListener('click', function() {
    document.getElementById('music-player').style.display = 'block';
    const audioSource = `path/to/your/audio/file.mp3`;  // Replace with the actual path to the audio file
    document.getElementById('audio-source').src = audioSource;
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.load();
    audioPlayer.style.display = 'block';
    document.getElementById('listening-prompt').style.display = 'block';
    document.getElementById('listen-btn').style.display = 'none';  // Hide the Listen button after it's clicked
});

// Download button action
document.getElementById('download-btn').addEventListener('click', function() {
    const isLoggedIn = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));

    if (isLoggedIn) {
        showDownloadPrompt('Downloading your song...');
    } else {
        alert('You need to log in to download this song.');
        window.scrollTo(0, 0);  // Scroll to the top of the page
    }
});

// Function to show download prompt
function showDownloadPrompt(message) {
    const downloadPrompt = document.createElement('div');
    downloadPrompt.id = 'download-prompt';
    downloadPrompt.textContent = message;
    document.body.appendChild(downloadPrompt);

    downloadPrompt.style.display = 'block';

    // Hide the prompt after 3 seconds
    setTimeout(() => {
        downloadPrompt.style.display = 'none';
        document.body.removeChild(downloadPrompt);
    }, 3000);
}

// Function to close modals when clicking outside
window.addEventListener('click', event => {
    if (event.target.classList.contains('modal')) {
        toggleModal(event.target.id, false);
    }
});

function toggleModal(modalId, show = true) {
    const modal = document.getElementById(modalId);
    modal.style.display = show ? 'flex' : 'none';
}

// Check login status and update UI
function checkLoginStatus() {
    const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));

    if (userData) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('user-name').textContent = userData.username;
        document.getElementById('user-status-indicator').style.display = 'block';
    } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('user-status-indicator').style.display = 'none';
    }
}

// Logout button action
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    checkLoginStatus();
    alert('You have been logged out.');
});

// Update the visitor count from localStorage or set to 0 initially
let visitorCount = localStorage.getItem('visitorCount') || 0;
visitorCount = parseInt(visitorCount) + 1;
localStorage.setItem('visitorCount', visitorCount);

// Update the visitor count on the page
const visitorElement = document.getElementById('visitorCount');
visitorElement.textContent = visitorCount;

// Scrolling ticker with current date, time, and location
const apiKey = 'YOUR_OPENCAGE_API_KEY'; // Replace with your OpenCage API key
function reverseGeocode(lat, lon) {
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const location = data.results[0]?.formatted || 'Unknown Location';
            const date = new Date();
            const ticker = document.getElementById('ticker');
            ticker.textContent = `Date: ${date.toLocaleDateString()} | Time: ${date.toLocaleTimeString()} | Location: ${location}`;
        })
        .catch(() => {
            const ticker = document.getElementById('ticker');
            ticker.textContent = 'Error fetching location';
        });
}

function updateTicker() {
    const date = new Date();
    const ticker = document.getElementById('ticker');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => reverseGeocode(position.coords.latitude, position.coords.longitude),
            () => {
                ticker.textContent = `Date: ${date.toLocaleDateString()} | Time: ${date.toLocaleTimeString()} | Location: Unable to fetch location`;
            }
        );
    } else {
        ticker.textContent = `Date: ${date.toLocaleDateString()} | Time: ${date.toLocaleTimeString()} | Location: Geolocation not supported`;
    }
}
setInterval(updateTicker, 1000);

// Modularized modal functions
function toggleModal(modalId, show = true) {
    const modal = document.getElementById(modalId);
    modal.style.display = show ? 'flex' : 'none';
}

// Event listeners for Register and Login buttons
document.getElementById('register-btn').addEventListener('click', () => toggleModal('register-modal', true));
document.getElementById('login-btn').addEventListener('click', () => toggleModal('login-modal', true));

// Close modals when clicking outside
window.addEventListener('click', event => {
    if (event.target.classList.contains('modal')) {
        toggleModal(event.target.id, false);
    }
});

// Function to close modals when clicking the Close button
function closeModal(modalId) {
    toggleModal(modalId, false);  // Calls the toggleModal function to hide the modal
}

// Register form submission
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const storageOption = document.getElementById('storage-option').value;

    if (username && password) {
        const userData = { username, password };
        if (storageOption === 'local') {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }

        document.getElementById('register-feedback').textContent = 'Successfully Registered!';
        toggleModal('register-modal', false);
        checkLoginStatus();  // Update the login status after registration
    } else {
        document.getElementById('register-feedback').textContent = 'Please fill out all fields!';
    }
});

// Login form submission
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const storedUser = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
        document.getElementById('login-feedback').textContent = 'Login Successful!';
        document.getElementById('user-status').textContent = `Logged in as ${username}`;
        toggleModal('login-modal', false);
        checkLoginStatus();  // Update the login status after login
    } else {
        document.getElementById('login-feedback').textContent = 'Invalid Username or Password!';
    }
});

// Google Maps API integration
function initMap() {
    const location = { lat: 37.7749, lng: -122.4194 }; // Replace with your desired location
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location,
    });
    new google.maps.Marker({
        position: location,
        map: map,
    });
}

// Wait for the window to load fully
window.addEventListener('load', function () {
    // Wait for 3 seconds (3000 milliseconds) before removing the loading screen
    setTimeout(function () {
        // Fade out the loading screen
        document.getElementById('loading-screen').style.opacity = '0';
        // Wait for the fade-out animation to complete before removing it
        setTimeout(function () {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500); // Matches the fade-out duration
    }, 3000); // 3000 milliseconds = 3 seconds
});


// Toggle navigation menu on small screens
document.getElementById('navbar-toggle').addEventListener('click', function() {
    const navbarMenu = document.querySelector('.navbar-menu');
    navbarMenu.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', (event) => {
    const toggleSwitch = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});
