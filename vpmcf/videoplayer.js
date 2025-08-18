// videoplayer.js

// ویدیو
const video = document.createElement('video');
video.src = 'your-video.mp4';
video.id = 'video-player';
video.style.width = '100%';
video.style.display = 'block';

// اضافه کردن ویدیو به بالای کنترلرها
const playerSection = document.querySelector('.player-controllers');
playerSection.prepend(video);

// عناصر کنترل
const playBtnImg = document.querySelector('.PLAY img');
const progressBar = document.querySelector('.rectangle');
const progressContainer = document.querySelector('.progress');
const timeDisplay = document.querySelector('.time');
const cursorMouse = document.querySelector('.cursor-mouse');
const player = document.querySelector('.player-controllers');

// Play / Pause
playBtnImg.addEventListener('click', () => {
  if(video.paused) {
    video.play();
    playBtnImg.src = './img/PAUSE.png';
  } else {
    video.pause();
    playBtnImg.src = './img/PLAY.png';
  }
});

// Update progress bar and time
video.addEventListener('timeupdate', () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = percent + '%';
  updateTime();
});

// Click on progress bar to seek
progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  video.currentTime = pos * video.duration;
});

// Update time display
function updateTime() {
  const current = formatTime(video.currentTime);
  const duration = formatTime(video.duration);
  timeDisplay.textContent = `${current} / ${duration}`;
}

function formatTime(time) {
  if(isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
}

player.addEventListener('mousemove', e => {
    const rect = player.getBoundingClientRect();
  
    // موقعیت موس نسبت به پلیر
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
  
    // محدود کردن موس به محدوده پلیر
    x = Math.max(0, Math.min(x, rect.width - cursorMouse.offsetWidth));
    y = Math.max(0, Math.min(y, rect.height - cursorMouse.offsetHeight));
  
    cursorMouse.style.transform = `translate(${x}px, ${y}px)`;
    cursorMouse.style.transition = 'transform 0.02s ease-out'; // خیلی نرم
  });