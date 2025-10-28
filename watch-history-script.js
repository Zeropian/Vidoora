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

// ===== WATCH HISTORY FUNCTIONALITY =====
const historyGrid = document.getElementById('history-grid');
const emptyState = document.getElementById('empty-state');
const clearHistoryBtn = document.getElementById('clear-history');
const pauseHistoryBtn = document.getElementById('pause-history');
const historySearch = document.getElementById('history-search');
const filterBtns = document.querySelectorAll('.filter-btn');

// Sample watch history data
const watchHistory = [
  {
    id: 1,
    title: "Amazing Nature Compilation 2024",
    channel: "Nature World",
    views: "125K views",
    timestamp: "2 hours ago",
    duration: "10:25",
    thumbnail: "https://via.placeholder.com/320x180/ff3b30/ffffff?text=Video+1",
    channelAvatar: "N",
    date: "today"
  },
  {
    id: 2,
    title: "Learn JavaScript in 15 Minutes",
    channel: "Code Master",
    views: "89K views",
    timestamp: "5 hours ago",
    duration: "15:42",
    thumbnail: "https://via.placeholder.com/320x180/007bff/ffffff?text=Video+2",
    channelAvatar: "C",
    date: "today"
  },
  {
    id: 3,
    title: "Morning Yoga Routine for Beginners",
    channel: "Yoga Life",
    views: "45K views",
    timestamp: "1 day ago",
    duration: "8:17",
    thumbnail: "https://via.placeholder.com/320x180/28a745/ffffff?text=Video+3",
    channelAvatar: "Y",
    date: "yesterday"
  },
  {
    id: 4,
    title: "Gaming Highlights: Best Moments",
    channel: "Game Pro",
    views: "210K views",
    timestamp: "2 days ago",
    duration: "22:35",
    thumbnail: "https://via.placeholder.com/320x180/ffc107/000000?text=Video+4",
    channelAvatar: "G",
    date: "yesterday"
  },
  {
    id: 5,
    title: "Cooking Italian Pasta at Home",
    channel: "Chef Kitchen",
    views: "67K views",
    timestamp: "3 days ago",
    duration: "12:18",
    thumbnail: "https://via.placeholder.com/320x180/dc3545/ffffff?text=Video+5",
    channelAvatar: "C",
    date: "this week"
  },
  {
    id: 6,
    title: "Travel Vlog: Japan Adventure",
    channel: "Travel Diaries",
    views: "156K views",
    timestamp: "1 week ago",
    duration: "18:42",
    thumbnail: "https://via.placeholder.com/320x180/6f42c1/ffffff?text=Video+6",
    channelAvatar: "T",
    date: "this week"
  }
];

// Load watch history from localStorage or use sample data
function loadWatchHistory() {
  const savedHistory = localStorage.getItem('vidora-watch-history');
  const history = savedHistory ? JSON.parse(savedHistory) : watchHistory;
  
  if (history.length === 0) {
    showEmptyState();
  } else {
    renderHistory(history);
  }
}

// Render history items
function renderHistory(history) {
  historyGrid.innerHTML = '';
  
  history.forEach(item => {
    const historyItem = createHistoryItem(item);
    historyGrid.appendChild(historyItem);
  });
}

// Create history item HTML
function createHistoryItem(item) {
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  historyItem.innerHTML = `
    <div class="history-thumbnail">
      <img src="${item.thumbnail}" alt="${item.title}" />
      <span class="video-duration">${item.duration}</span>
      <button class="history-menu-btn" onclick="openHistoryMenu(${item.id})">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>
    <div class="history-info">
      <div class="history-channel-avatar">${item.channelAvatar}</div>
      <div class="history-details">
        <h3 class="history-title">${item.title}</h3>
        <p class="history-channel">${item.channel}</p>
        <p class="history-meta">${item.views} • ${item.timestamp}</p>
      </div>
    </div>
  `;
  
  // Add click event to navigate to video
  historyItem.addEventListener('click', (e) => {
    if (!e.target.closest('.history-menu-btn')) {
      // Simulate video playback
      alert(`Playing: ${item.title}`);
      // In real implementation: window.location.href = `watch.html?v=${item.id}`;
    }
  });
  
  return historyItem;
}

// Show empty state
function showEmptyState() {
  historyGrid.style.display = 'none';
  emptyState.style.display = 'block';
}

// Hide empty state
function hideEmptyState() {
  historyGrid.style.display = 'grid';
  emptyState.style.display = 'none';
}

// Clear all watch history
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all watch history? This action cannot be undone.')) {
    localStorage.setItem('vidora-watch-history', '[]');
    historyGrid.innerHTML = '';
    showEmptyState();
  }
});

// Pause/Resume watch history
let historyPaused = localStorage.getItem('vidora-history-paused') === 'true';

function updatePauseButton() {
  if (historyPaused) {
    pauseHistoryBtn.innerHTML = '<i class="fas fa-play"></i> Resume watch history';
    pauseHistoryBtn.style.background = 'var(--primary-color)';
    pauseHistoryBtn.style.color = 'white';
  } else {
    pauseHistoryBtn.innerHTML = '<i class="fas fa-pause"></i> Pause watch history';
    pauseHistoryBtn.style.background = '';
    pauseHistoryBtn.style.color = '';
  }
}

pauseHistoryBtn.addEventListener('click', () => {
  historyPaused = !historyPaused;
  localStorage.setItem('vidora-history-paused', historyPaused);
  updatePauseButton();
  
  if (historyPaused) {
    alert('Watch history is now paused. New videos won\'t be added to your history.');
  } else {
    alert('Watch history is now resumed. New videos will be added to your history.');
  }
});

// Search functionality
historySearch.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const savedHistory = localStorage.getItem('vidora-watch-history');
  const history = savedHistory ? JSON.parse(savedHistory) : watchHistory;
  
  if (searchTerm) {
    const filteredHistory = history.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.channel.toLowerCase().includes(searchTerm)
    );
    
    if (filteredHistory.length === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderHistory(filteredHistory);
    }
  } else {
    hideEmptyState();
    renderHistory(history);
  }
});

// Filter functionality
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    
    const filter = btn.textContent.toLowerCase();
    const savedHistory = localStorage.getItem('vidora-watch-history');
    const history = savedHistory ? JSON.parse(savedHistory) : watchHistory;
    
    let filteredHistory;
    if (filter === 'all time') {
      filteredHistory = history;
    } else {
      filteredHistory = history.filter(item => item.date === filter || 
        (filter === 'this week' && (item.date === 'today' || item.date === 'yesterday' || item.date === 'this week')) ||
        (filter === 'this month' && (item.date === 'today' || item.date === 'yesterday' || item.date === 'this week' || item.date === 'this month')));
    }
    
    if (filteredHistory.length === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderHistory(filteredHistory);
    }
  });
});

// History menu functionality
function openHistoryMenu(videoId) {
  // Remove any existing menus
  const existingMenu = document.querySelector('.history-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Create context menu
  const menu = document.createElement('div');
  menu.className = 'history-context-menu';
  menu.innerHTML = `
    <button onclick="removeFromHistory(${videoId})">
      <i class="fas fa-times"></i>
      Remove from history
    </button>
    <button onclick="addToWatchLater(${videoId})">
      <i class="fas fa-clock"></i>
      Save to Watch Later
    </button>
    <button onclick="addToPlaylist(${videoId})">
      <i class="fas fa-list"></i>
      Save to playlist
    </button>
  `;
  
  document.body.appendChild(menu);
  
  // Position menu near the clicked button
  const clickedBtn = document.querySelector(`[onclick="openHistoryMenu(${videoId})"]`);
  const rect = clickedBtn.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY}px`;
  menu.style.left = `${rect.left + window.scrollX - 150}px`;
  
  // Close menu when clicking outside
  const closeMenu = (e) => {
    if (!menu.contains(e.target) && e.target !== clickedBtn) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 0);
}

function removeFromHistory(videoId) {
  const savedHistory = localStorage.getItem('vidora-watch-history');
  const history = savedHistory ? JSON.parse(savedHistory) : watchHistory;
  const updatedHistory = history.filter(item => item.id !== videoId);
  
  localStorage.setItem('vidora-watch-history', JSON.stringify(updatedHistory));
  renderHistory(updatedHistory);
  
  if (updatedHistory.length === 0) {
    showEmptyState();
  }
  
  // Remove context menu
  document.querySelector('.history-context-menu')?.remove();
}

function addToWatchLater(videoId) {
  alert(`Video added to Watch Later!`);
  document.querySelector('.history-context-menu')?.remove();
}

function addToPlaylist(videoId) {
  alert(`Choose playlist for this video`);
  document.querySelector('.history-context-menu')?.remove();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadWatchHistory();
  updatePauseButton();
  
  // Check authentication
  const isAuthenticated = localStorage.getItem('userAuthenticated');
  if (!isAuthenticated || isAuthenticated !== 'true') {
    // For demo purposes, we'll allow viewing history without auth
    // In real implementation: window.location.href = 'signin.html?redirect=watch-history';
  }
  
  // Display user info
  const userEmail = localStorage.getItem('userEmail');
  const userAvatar = document.getElementById('user-avatar');
  if (userEmail && userAvatar) {
    const firstLetter = userEmail.charAt(0).toUpperCase();
    userAvatar.innerHTML = `<span>${firstLetter}</span>`;
  }
});