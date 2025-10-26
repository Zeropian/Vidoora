// Apply theme on auth pages
const htmlRoot = document.getElementById('html-root');
const savedTheme = localStorage.getItem('vidora-theme');
if (savedTheme) {
  htmlRoot.setAttribute('data-theme', savedTheme);
}

// Optional: Add basic form validation (you can expand later)
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
  const pass = document.getElementById('signup-password').value;
  const confirm = document.getElementById('confirm-password').value;
  if (pass !== confirm) {
    e.preventDefault();
    alert('Passwords do not match!');
  }
});

// You can add real auth logic later (Firebase, etc.)