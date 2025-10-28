// Apply theme on auth pages
const htmlRoot = document.getElementById('html-root');
const savedTheme = localStorage.getItem('vidora-theme');
if (savedTheme) {
  htmlRoot.setAttribute('data-theme', savedTheme);
}

// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const input = this.parentElement.querySelector('input');
    const icon = this.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

// Enhanced form validation
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = '#ff3b30';
  
  let errorElement = field.parentNode.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    field.parentNode.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.color = '#ff3b30';
  errorElement.style.fontSize = '0.875rem';
  errorElement.style.marginTop = '0.25rem';
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('input').forEach(input => {
    input.style.borderColor = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sign Up Form Validation
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value;
  const confirm = document.getElementById('confirm-password').value;
  
  clearErrors();
  
  let isValid = true;
  
  if (name.length < 2) {
    showError('name', 'Name must be at least 2 characters');
    isValid = false;
  }
  
  if (!isValidEmail(email)) {
    showError('signup-email', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (pass.length < 6) {
    showError('signup-password', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (pass !== confirm) {
    showError('confirm-password', 'Passwords do not match');
    isValid = false;
  }
  
  if (isValid) {
    // Simulate successful sign up
    localStorage.setItem('userAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    
    // Check if there's a redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'upload') {
      window.location.href = 'upload.html';
    } else {
      window.location.href = 'index.html';
    }
  }
});

// Sign In Form Validation
document.getElementById('signin-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  clearErrors();
  
  let isValid = true;
  
  if (!isValidEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (password.length < 6) {
    showError('password', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (isValid) {
    // Simulate successful sign in
    localStorage.setItem('userAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    // Check if there's a redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'upload') {
      window.location.href = 'upload.html';
    } else {
      window.location.href = 'index.html';
    }
  }
});

// Check if user is already authenticated and redirect
document.addEventListener('DOMContentLoaded', function() {
  const isAuthenticated = localStorage.getItem('userAuthenticated');
  const currentPage = window.location.pathname;
  
  if (isAuthenticated === 'true' && (currentPage.includes('signin.html') || currentPage.includes('signup.html'))) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'upload') {
      window.location.href = 'upload.html';
    } else {
      window.location.href = 'index.html';
    }
  }
});