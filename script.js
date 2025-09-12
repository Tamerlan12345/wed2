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

    // --- Parallax Effect ---
    const parallaxBg = document.querySelector('.hero-bg-parallax');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            parallaxBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        });
    }

});
