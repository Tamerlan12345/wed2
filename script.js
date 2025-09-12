document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('name');
  if (guest) {
    document.getElementById('guest-name').textContent = `${guest},`;
  }
});
