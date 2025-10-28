// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const htmlRoot = document.getElementById('html-root');

// Check saved theme or OS preference
const savedTheme = localStorage.getItem('vidora-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  htmlRoot.setAttribute('data-theme', 'dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  htmlRoot.setAttribute('data-theme', 'light');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlRoot.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    htmlRoot.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('vidora-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('vidora-theme', 'dark');
  }
});

// ===== SIDEBAR TOGGLE =====
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

function openSidebar() {
  sidebar.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Close sidebar on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('active')) {
    closeSidebar();
  }
});

// ===== CREATE BUTTON FUNCTIONALITY =====
// Note: The Create button is now an anchor tag that redirects to signin page
// No JavaScript click handler needed as it uses href attribute

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

// Add search icon to the left of search input
const searchIcon = document.createElement('i');
searchIcon.className = 'fas fa-search search-icon';
searchInput.parentNode.insertBefore(searchIcon, searchInput);

// Search functionality
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.trim();
  if (query) {
    // For now, show alert. Replace with actual search implementation
    alert(`Searching for: ${query}`);
    
    // Future implementation:
    // - Redirect to search results page: window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    // - Or fetch and display search results dynamically
  } else {
    searchInput.focus();
  }
}

// ===== ENHANCED ERROR HANDLING =====
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});

// Safe element selection
function safeSelect(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
  }
  return element;
}