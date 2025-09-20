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

    const titleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the title is visible

    document.querySelectorAll('[data-animated]').forEach(el => {
        titleObserver.observe(el);
    });


    // --- Animate Couple Names ---
    function animateCoupleNames() {
        const namesHeading = document.getElementById('couple-names-heading');
        if (!namesHeading) return;

        const text = "Тамерлан и Ясмина";
        namesHeading.innerHTML = ''; // Clear existing content

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            // Use a class for the animation and set delay via style
            span.className = 'char-animate';
            span.style.animationDelay = `${index * 0.07}s`;
            // Handle space character
            if (char === ' ') {
                span.style.width = '0.5em';
            }
            namesHeading.appendChild(span);
        });
    }


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

    // --- Entry Screen & Music Logic ---
    const entryScreen = document.getElementById('entry-screen');
    const entryTrigger = document.getElementById('entry-trigger');
    const ringsImage = document.getElementById('rings-image');
    const musicControl = document.getElementById('music-control');
    const backgroundMusic = document.getElementById('background-music');
    const mainContent = document.querySelector('main');

    function launchFireworks() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2001 }; // z-index to be on top of entry screen

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) { return clearInterval(interval); }
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    if (entryTrigger && entryScreen && backgroundMusic && musicControl) {
        entryTrigger.addEventListener('click', () => {
            // 1. Launch fireworks
            launchFireworks();

            // 2. Animate rings image if it exists
            if (ringsImage) {
                ringsImage.classList.add('hidden');
            }

            // 3. Hide entry screen after a delay
            setTimeout(() => {
                entryScreen.classList.add('hidden');
                if (mainContent) {
                    mainContent.classList.add('fade-in');
                }
                // Animate names when screen is hidden
                animateCoupleNames();
            }, 800); // Adjusted delay for better animation flow

            // 4. Start music
            backgroundMusic.currentTime = 20;
            backgroundMusic.muted = false;
            backgroundMusic.play().then(() => {
                musicControl.classList.add('playing');
            }).catch(error => console.log("Playback was prevented.", error));
        });

        musicControl.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                musicControl.classList.add('playing');
            } else {
                backgroundMusic.pause();
                musicControl.classList.remove('playing');
            }
        });
    }
});
