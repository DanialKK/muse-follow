// Application state
const state = {
    isPlaying: false,
    currentTime: 47.38,
    totalTime: 112.32,
    volume: 0.8,
    searchQuery: "",
    navigationItems: ["Profile", "Podcasts", "Contact Us"],

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.updateUI();
    },

    skipBackward() {
        this.currentTime = Math.max(0, this.currentTime - 10);
        this.updateUI();
    },

    skipForward() {
        this.currentTime = Math.min(this.totalTime, this.currentTime + 10);
        this.updateUI();
    },

    updateSearch(value) {
        this.searchQuery = value;
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds);
        const secs = Math.floor((seconds % 1) * 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    updateUI() {
        this.updatePlayButton();
        this.updateProgressBar();
        this.updateTimeDisplay();
        this.updateControls();
    },

    updatePlayButton() {
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        const playButton = document.getElementById('playButton');

        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playButton.setAttribute('aria-label', 'Pause video');
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playButton.setAttribute('aria-label', 'Play video');
        }
    },

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const progressBar = document.getElementById('progressBar');
        const percentage = (this.currentTime / this.totalTime) * 100;

        progressFill.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', this.totalTime.toString());
        progressBar.setAttribute('aria-valuenow', this.currentTime.toString());
    },

    updateTimeDisplay() {
        document.getElementById('currentTime').textContent = this.formatTime(this.currentTime);
        document.getElementById('totalTime').textContent = this.formatTime(this.totalTime);
    },

    updateControls() {
        this.renderLeftControls();
        this.renderRightControls();
    },

    renderLeftControls() {
        const leftControls = document.getElementById('leftControls');
        const controls = [
            {
                icon: this.isPlaying ? 'pause' : 'play',
                action: () => this.togglePlay(),
                label: this.isPlaying ? 'Pause' : 'Play'
            },
            {
                icon: 'skipBack',
                action: () => this.skipBackward(),
                label: 'Skip backward 10 seconds'
            },
            {
                icon: 'skipForward',
                action: () => this.skipForward(),
                label: 'Skip forward 10 seconds'
            }
        ];

        leftControls.innerHTML = '';
        controls.forEach(control => {
            const button = this.createControlButton(control);
            leftControls.appendChild(button);
        });
    },

    renderRightControls() {
        const rightControls = document.getElementById('rightControls');
        const controls = [
            { icon: 'volume', label: 'Volume control' },
            { icon: 'subtitles', label: 'Toggle subtitles' },
            { icon: 'fullscreen', label: 'Enter fullscreen' },
            { icon: 'more', label: 'More options' }
        ];

        rightControls.innerHTML = '';
        controls.forEach(control => {
            const button = this.createControlButton(control);
            rightControls.appendChild(button);
        });
    },

    createControlButton(control) {
        const button = document.createElement('button');
        button.className = 'control-btn flex justify-center items-center w-6 h-6 rounded transition-all cursor-pointer border-none duration-200 ease-in-out bg-transparent';
        button.setAttribute('aria-label', control.label);
        button.setAttribute('tabindex', '0');

        if (control.action) {
            button.addEventListener('click', control.action);
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    control.action();
                }
            });
        } else {
            button.addEventListener('click', () => {
                console.log(`${control.icon} clicked`);
            });
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log(`${control.icon} clicked`);
                }
            });
        }

        button.innerHTML = this.getControlIcon(control.icon);
        return button;
    },

    getControlIcon(iconType) {
        const icons = {
            pause: `<svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M7.56603 1.78639C7.56603 1.47343 7.82698 1.21973 8.14888 1.21973H9.89746C10.2194 1.21973 10.4803 1.47343 10.4803 1.78639V10.8531C10.4803 11.166 10.2194 11.4197 9.89746 11.4197H8.14888C7.82698 11.4197 7.56603 11.166 7.56603 10.8531V1.78639Z" fill="white"></path>
                <path d="M2.32031 1.78639C2.32031 1.47343 2.58127 1.21973 2.90317 1.21973H4.65174C4.97364 1.21973 5.2346 1.47343 5.2346 1.78639V10.8531C5.2346 11.166 4.97364 11.4197 4.65174 11.4197H2.90317C2.58127 11.4197 2.32031 11.166 2.32031 10.8531V1.78639Z" fill="white"></path>
            </svg>`,
            play: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M0 1.5C0 0.4 1.2 -0.3 2.1 0.3L10.5 5.3C11.4 5.9 11.4 7.1 10.5 7.7L2.1 12.7C1.2 13.3 0 12.6 0 11.5V1.5Z" fill="white"></path>
            </svg>`,
            skipBack: `<svg width="12" height="12" viewBox="0 0 14 13" fill="none">
                <path d="M2.96526 5.60684L10.401 1.43808C11.1382 1.02482 12.0596 1.54139 12.0596 2.36792V10.2715C12.0596 11.0981 11.1382 11.6146 10.401 11.2014L2.96526 7.03262V5.60684Z" fill="white"></path>
                <path d="M2.96526 1.75657C2.96526 1.46008 2.71774 1.21973 2.41241 1.21973C2.10709 1.21973 1.85957 1.46008 1.85957 1.75657V10.8829C1.85957 11.1794 2.10709 11.4197 2.41241 11.4197C2.71774 11.4197 2.96526 11.1794 2.96526 10.8829V1.75657Z" fill="white"></path>
            </svg>`,
            skipForward: `<svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M10.5152 5.60684L3.07944 1.43808C2.34231 1.02482 1.4209 1.54139 1.4209 2.36792V10.2715C1.4209 11.0981 2.34231 11.6146 3.07944 11.2014L10.5152 7.03262V5.60684Z" fill="white"></path>
                <path d="M10.5152 1.75657C10.5152 1.46008 10.7627 1.21973 11.0681 1.21973C11.3734 1.21973 11.6209 1.46008 11.6209 1.75657V10.8829C11.6209 11.1794 11.3734 11.4197 11.0681 11.4197C10.7627 11.4197 10.5152 11.1794 10.5152 10.8829V1.75657Z" fill="white"></path>
            </svg>`,
            volume: `<svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M11.4395 4.27979C11.5061 4.95075 11.5402 5.63129 11.5402 6.31979C11.5402 7.00828 11.5061 7.68882 11.4395 8.35979" stroke="white" stroke-width="0.765" stroke-linecap="round"></path>
                <path d="M9.4375 4.78955C9.47912 5.29404 9.50034 5.80432 9.50034 6.31955C9.50034 6.83478 9.47912 7.34506 9.4375 7.84955" stroke="white" stroke-width="0.765" stroke-linecap="round"></path>
                <path d="M6.95008 6.31998C6.95008 5.02363 6.84036 3.75473 6.63032 2.52337C6.5673 2.1539 6.13548 1.99172 5.837 2.21842L4.16357 3.4894C3.98614 3.62417 3.76945 3.69712 3.54664 3.69712H1.85008C1.28675 3.69712 0.830078 4.15379 0.830078 4.71712V7.92284C0.830078 8.48617 1.28675 8.94284 1.85008 8.94284H3.54664C3.76945 8.94284 3.98614 9.0158 4.16357 9.15056L5.837 10.4215C6.13548 10.6482 6.5673 10.4861 6.63032 10.1166C6.84036 8.88523 6.95008 7.61633 6.95008 6.31998Z" fill="white" stroke="white" stroke-width="0.51" stroke-linejoin="round"></path>
            </svg>`,
            subtitles: `<svg width="12" height="12" viewBox="0 0 14 13" fill="none">
                <path d="M7.00016 10.91C9.53514 10.91 11.5902 8.85497 11.5902 6.31998C11.5902 3.78499 9.53514 1.72998 7.00016 1.72998C4.46517 1.72998 2.41016 3.78499 2.41016 6.31998C2.41016 7.07867 2.59423 7.79437 2.92016 8.42485L2.41016 10.91L4.89528 10.4C5.52577 10.7259 6.24146 10.91 7.00016 10.91Z" stroke="white" stroke-width="1.02" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>`,
            fullscreen: `<svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M2.48027 4.78955L2.48027 3.25955C2.48027 2.69622 2.93694 2.23955 3.50027 2.23955L5.03027 2.23955" stroke="white" stroke-width="1.02" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M10.6408 7.84961V9.37961C10.6408 9.94294 10.1842 10.3996 9.62082 10.3996H8.09082" stroke="white" stroke-width="1.02" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M8.09082 2.23955L9.62082 2.23955C10.1842 2.23955 10.6408 2.69622 10.6408 3.25955L10.6408 4.78955" stroke="white" stroke-width="1.02" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M5.03027 10.3996L3.50027 10.3996C2.93694 10.3996 2.48027 9.94294 2.48027 9.37961L2.48027 7.84961" stroke="white" stroke-width="1.02" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>`,
            more: `<svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                <circle cx="5.11961" cy="1.74998" r="1.02" fill="white"></circle>
                <circle cx="5.11961" cy="5.3198" r="1.02" fill="white"></circle>
                <circle cx="5.11961" cy="8.88963" r="1.02" fill="white"></circle>
            </svg>`
        };
        return icons[iconType] || '';
    },

    init() {
        this.renderNavigation();
        this.setupEventListeners();
        this.updateUI();
    },

    renderNavigation() {
        const navigation = document.getElementById('navigation');
        navigation.innerHTML = '';

        this.navigationItems.forEach(item => {
            const button = document.createElement('button');
            button.className = 'nav-button flex items-center px-2 py-3 text-base font-bold text-gray-200 rounded transition-all cursor-pointer border-none duration-200 ease-in-out bg-transparent';
            button.setAttribute('aria-label', `Navigate to ${item}`);
            button.setAttribute('tabindex', '0');
            button.textContent = item;

            button.addEventListener('click', () => {
                console.log(`Navigate to ${item}`);
            });

            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log(`Navigate to ${item}`);
                }
            });

            navigation.appendChild(button);
        });
    },

    setupEventListeners() {
        // Play button
        const playButton = document.getElementById('playButton');
        playButton.addEventListener('click', () => this.togglePlay());
        playButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.togglePlay();
            }
        });

        // Progress bar
        progressBar.parentElement.addEventListener("click", (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            video.currentTime = percent * video.duration;
        });
        
        

        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.updateSearch(e.target.value);
        });

        // Notification button
        const notificationBtn = document.querySelector('.notification-btn');
        notificationBtn.addEventListener('click', () => {
            console.log('Show notifications');
        });
        notificationBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('Show notifications');
            }
        });

        // Profile button
        const profileBtn = document.querySelector('.profile-btn');
        profileBtn.addEventListener('click', () => {
            console.log('Show user menu');
        });
        profileBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('Show user menu');
            }
        });
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    state.init();
});


const follower = document.getElementById("follower");
const player = document.getElementById("player");

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;
let angle = 0;
let isHovering = false;


const offset = 30;

player.addEventListener("mouseenter", () => {
    isHovering = true;
    follower.style.display = "flex";
});

player.addEventListener("mouseleave", () => {
    isHovering = false;
    follower.style.display = "none";
});

document.addEventListener("mousemove", e => {
    const rect = player.getBoundingClientRect();
    mouseX = e.clientX - rect.left + offset;
    mouseY = e.clientY - rect.top + offset;
});

function animate() {
    if(isHovering) {
        
        currentX += (mouseX - currentX) * 0.2;
        currentY += (mouseY - currentY) * 0.2;

        angle += 0.75;

        follower.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${angle}deg)`;
        
    }

    requestAnimationFrame(animate);
}

animate();


    