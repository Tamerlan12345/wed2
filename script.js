document.addEventListener('DOMContentLoaded', () => {
  // 1. Personalization from URL parameter
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('name');
  if (guest) {
    // A more personal and grammatically correct touch
    const guestNameElement = document.getElementById('guest-name');
    if (guestNameElement) {
        // Replacing the default "Дорогие друзья и близкие!"
        guestNameElement.textContent = `Дорогой(ая) ${decodeURIComponent(guest)}!`;
    }
  }

  // 2. Countdown Timer
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
      if(timerEl) timerEl.innerHTML = "<p>Это событие уже состоялось!</p>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

  }, 1000);

  // 3. Scroll Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of the element is visible
  });

  // Observe all sections and the footer
  document.querySelectorAll('section, footer').forEach(el => {
    observer.observe(el);
  });
});
