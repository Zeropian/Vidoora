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
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

function openMobileSidebar() {
  mobileSidebar.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
  mobileSidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileSidebar);
closeBtn.addEventListener('click', closeMobileSidebar);
overlay.addEventListener('click', closeMobileSidebar);

// Close mobile sidebar on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
    closeMobileSidebar();
  }
});

// ===== DESKTOP SIDEBAR EXPAND/COLLAPSE =====
const desktopSidebar = document.getElementById('desktop-sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mainContent = document.getElementById('main-content');

// Check saved sidebar state
const savedSidebarState = localStorage.getItem('vidora-sidebar-expanded');

if (savedSidebarState === 'true') {
  desktopSidebar.classList.add('expanded');
  document.body.classList.add('sidebar-expanded');
} else {
  desktopSidebar.classList.remove('expanded');
  document.body.classList.remove('sidebar-expanded');
}

sidebarToggle.addEventListener('click', () => {
  const isExpanded = desktopSidebar.classList.contains('expanded');
  
  if (isExpanded) {
    desktopSidebar.classList.remove('expanded');
    document.body.classList.remove('sidebar-expanded');
    localStorage.setItem('vidora-sidebar-expanded', 'false');
  } else {
    desktopSidebar.classList.add('expanded');
    document.body.classList.add('sidebar-expanded');
    localStorage.setItem('vidora-sidebar-expanded', 'true');
  }
});

// Auto-expand sidebar on hover (optional)
desktopSidebar.addEventListener('mouseenter', () => {
  if (window.innerWidth > 768) {
    desktopSidebar.classList.add('expanded');
    document.body.classList.add('sidebar-expanded');
  }
});

desktopSidebar.addEventListener('mouseleave', () => {
  if (window.innerWidth > 768) {
    const isExpanded = localStorage.getItem('vidora-sidebar-expanded') === 'true';
    if (!isExpanded) {
      desktopSidebar.classList.remove('expanded');
      document.body.classList.remove('sidebar-expanded');
    }
  }
});

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

// ===== VIDEO CARD INTERACTIONS =====
document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', function() {
    // Simulate video click - in real implementation, this would open the video player
    const videoTitle = this.querySelector('.video-title').textContent;
    alert(`Playing: ${videoTitle}`);
  });
});

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

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Vidora platform loaded successfully!');
});