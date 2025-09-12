document.addEventListener('DOMContentLoaded', () => {

    // --- Personalization from URL ---
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('name');
    if (guestName) {
        const guestElement = document.getElementById('guest-name');
        if (guestElement) {
            guestElement.textContent = `Дорогой(ая) ${decodeURIComponent(guestName.replace(/\+/g, ' '))}!`;
        }
    }

    // --- Countdown Timer ---
    const countdownDate = new Date("2025-10-25T16:00:00").getTime();
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");
        const timerEl = document.getElementById("timer");

        if (distance < 0) {
            clearInterval(timerInterval);
            if (timerEl) {
                timerEl.innerHTML = "<p>Это событие уже состоялось!</p>";
                timerEl.style.fontFamily = "var(--font-secondary)";
            }
            return;
        }

        const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');

        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
    }, 1000);

    // --- Scroll Animations (Intersection Observer) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('main > section, .site-footer').forEach(el => {
        animationObserver.observe(el);
    });

    // --- 2GIS Map Initialization ---
    let map;
    if (typeof DG !== 'undefined') {
        DG.then(function () {
            map = DG.map('map', {
                center: [43.242465, 76.893026],
                zoom: 16
            });
            DG.marker([43.242465, 76.893026]).addTo(map).bindPopup('Мы будем ждать вас здесь!');
        });
    }

    // --- Fireworks Effect ---
    function launchFireworks() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    setTimeout(launchFireworks, 500);

    // --- Entry Screen & Music Logic ---
    const entryScreen = document.getElementById('entry-screen');
    const enterButton = document.getElementById('enter-button');
    const musicControl = document.getElementById('music-control');
    const backgroundMusic = document.getElementById('background-music');

    if (enterButton && entryScreen && backgroundMusic && musicControl) {
        enterButton.addEventListener('click', () => {
            entryScreen.classList.add('hidden');

            backgroundMusic.currentTime = 20; // Start from 20 seconds
            backgroundMusic.muted = false;

            backgroundMusic.play().then(() => {
                // Music is playing
                musicControl.classList.add('playing');
            }).catch(error => {
                console.log("Playback was prevented.", error);
                // In case even user-initiated play fails, we don't show the 'playing' state.
            });
        });

        musicControl.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                musicControl.classList.add('playing');
            } else {
                backgroundMusic.pause();
                musicControl.classList.remove('playing');
            }
            // Note: This is a simple play/pause toggle. The user's request
            // was about unmuting on entry, so this provides further control.
            // A mute/unmute toggle would be:
            // backgroundMusic.muted = !backgroundMusic.muted;
            // musicControl.classList.toggle('playing', !backgroundMusic.muted);
        });
    }
});
