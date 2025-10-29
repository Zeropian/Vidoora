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

// ===== LIKED VIDEOS FUNCTIONALITY =====
const likedGrid = document.getElementById('liked-grid');
const emptyState = document.getElementById('empty-state');
const clearLikedBtn = document.getElementById('clear-liked');
const createPlaylistBtn = document.getElementById('create-playlist');
const likedSearch = document.getElementById('liked-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortBy = document.getElementById('sort-by');
const loadMoreContainer = document.getElementById('load-more-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const sidebarSubscriptions = document.getElementById('sidebar-subscriptions');

// Initialize variables
let currentFilter = 'all';
let currentSort = 'newest';
let currentPage = 1;
const videosPerPage = 12;

// Load liked videos from localStorage
function loadLikedVideos() {
  const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
  let likedVideos = [];
  
  if (savedLikedVideos) {
    likedVideos = JSON.parse(savedLikedVideos);
  }
  
  if (likedVideos.length === 0) {
    showEmptyState();
    loadMoreContainer.style.display = 'none';
  } else {
    hideEmptyState();
    renderLikedVideos(likedVideos);
    updateLoadMoreButton(likedVideos);
  }
}

// Render liked videos
function renderLikedVideos(likedVideos) {
  // Clear existing content
  likedGrid.innerHTML = '';
  
  // Filter videos based on current filter
  const filteredVideos = filterVideos(likedVideos);
  
  // Sort videos based on current sort option
  const sortedVideos = sortVideos(filteredVideos);
  
  // Paginate videos
  const paginatedVideos = paginateVideos(sortedVideos);
  
  if (paginatedVideos.length === 0) {
    showEmptyState();
    return;
  }
  
  // Render videos
  paginatedVideos.forEach(video => {
    const likedItem = createLikedItem(video);
    likedGrid.appendChild(likedItem);
  });
}

// Create liked video item
function createLikedItem(video) {
  const likedItem = document.createElement('div');
  likedItem.className = 'liked-item';
  likedItem.setAttribute('data-id', video.id);
  
  likedItem.innerHTML = `
    <div class="liked-thumbnail">
      <img src="${video.thumbnail}" alt="${video.title}" />
      <span class="video-duration">${video.duration}</span>
      <button class="liked-menu-btn" onclick="openLikedMenu(${video.id})">
        <i class="fas fa-ellipsis-v"></i>
      </button>
    </div>
    <div class="liked-info">
      <div class="liked-channel-avatar">${video.channelAvatar}</div>
      <div class="liked-details">
        <h3 class="liked-video-title">${video.title}</h3>
        <p class="liked-channel">${video.channel}</p>
        <div class="liked-meta">
          <span>${video.views}</span>
          <span class="liked-date">
            <i class="far fa-calendar"></i>
            ${formatDate(video.likedDate)}
          </span>
          <span class="like-indicator">
            <i class="fas fa-thumbs-up"></i>
            Liked
          </span>
        </div>
      </div>
    </div>
  `;
  
  // Add click event to navigate to video
  likedItem.addEventListener('click', (e) => {
    if (!e.target.closest('.liked-menu-btn')) {
      playVideo(video.id);
    }
  });
  
  return likedItem;
}

// Filter videos based on current filter
function filterVideos(videos) {
  if (currentFilter === 'all') {
    return videos;
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(today.getMonth() - 1);
  const yearAgo = new Date(today);
  yearAgo.setFullYear(today.getFullYear() - 1);
  
  return videos.filter(video => {
    const videoDate = new Date(video.likedDate);
    
    switch (currentFilter) {
      case 'today':
        return videoDate >= today;
      case 'week':
        return videoDate >= weekAgo;
      case 'month':
        return videoDate >= monthAgo;
      case 'year':
        return videoDate >= yearAgo;
      default:
        return true;
    }
  });
}

// Sort videos based on current sort option
function sortVideos(videos) {
  return [...videos].sort((a, b) => {
    switch (currentSort) {
      case 'newest':
        return new Date(b.likedDate) - new Date(a.likedDate);
      case 'oldest':
        return new Date(a.likedDate) - new Date(b.likedDate);
      case 'popular':
        return parseViews(b.views) - parseViews(a.views);
      default:
        return 0;
    }
  });
}

// Parse view count string to number
function parseViews(viewsString) {
  const views = viewsString.replace(/[^0-9.]/g, '');
  if (viewsString.includes('K')) {
    return parseFloat(views) * 1000;
  } else if (viewsString.includes('M')) {
    return parseFloat(views) * 1000000;
  } else {
    return parseFloat(views);
  }
}

// Paginate videos
function paginateVideos(videos) {
  const startIndex = 0;
  const endIndex = currentPage * videosPerPage;
  return videos.slice(startIndex, endIndex);
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

// Show empty state
function showEmptyState() {
  likedGrid.style.display = 'none';
  emptyState.style.display = 'block';
  loadMoreContainer.style.display = 'none';
}

// Hide empty state
function hideEmptyState() {
  likedGrid.style.display = 'grid';
  emptyState.style.display = 'none';
  loadMoreContainer.style.display = 'block';
}

// Update load more button visibility
function updateLoadMoreButton(likedVideos) {
  const filteredVideos = filterVideos(likedVideos);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  
  if (currentPage >= totalPages) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'inline-flex';
  }
}

// Load more videos
loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
  const likedVideos = savedLikedVideos ? JSON.parse(savedLikedVideos) : [];
  renderLikedVideos(likedVideos);
  updateLoadMoreButton(likedVideos);
});

// Clear all liked videos
clearLikedBtn.addEventListener('click', () => {
  const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
  const likedVideos = savedLikedVideos ? JSON.parse(savedLikedVideos) : [];
  
  if (likedVideos.length === 0) {
    alert('You have no liked videos to clear.');
    return;
  }
  
  if (confirm('Are you sure you want to clear all liked videos? This action cannot be undone.')) {
    localStorage.setItem('vidora-liked-videos', '[]');
    currentPage = 1;
    loadLikedVideos();
  }
});

// Create playlist from liked videos
createPlaylistBtn.addEventListener('click', () => {
  const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
  const likedVideos = savedLikedVideos ? JSON.parse(savedLikedVideos) : [];
  
  if (likedVideos.length === 0) {
    alert('You have no liked videos to create a playlist from.');
    return;
  }
  
  const playlistName = prompt('Enter a name for your playlist:');
  if (playlistName) {
    // In a real app, this would create a playlist
    alert(`Playlist "${playlistName}" created with ${likedVideos.length} videos!`);
  }
});

// Search functionality
likedSearch.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  currentPage = 1;
  
  const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
  const likedVideos = savedLikedVideos ? JSON.parse(savedLikedVideos) : [];
  
  if (searchTerm) {
    const filteredVideos = likedVideos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.channel.toLowerCase().includes(searchTerm)
    );
    
    if (filteredVideos.length === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderLikedVideos(filteredVideos);
      updateLoadMoreButton(filteredVideos);
    }
  } else {
    if (likedVideos.length === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderLikedVideos(likedVideos);
      updateLoadMoreButton(likedVideos);
    }
  }
});

// Filter functionality
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    
    currentFilter = btn.getAttribute('data-filter');
    currentPage = 1;
    
    const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
    const likedVideos = savedLikedVideos ? JSON.parse(savedLikedVideos) : [];
    
    renderLikedVideos(likedVideos);
    updateLoadMoreButton(likedVideos);
  });
});

// Sort functionality
sortBy.addEventListener('change', (e) => {
  currentSort = e.target.value;
  currentPage = 1;
  
  const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
  const likedVideos = savedLikedVideos ? JSON.parse(savedLikedVideos) : [];
  
  renderLikedVideos(likedVideos);
  updateLoadMoreButton(likedVideos);
});

// Liked menu functionality
function openLikedMenu(videoId) {
  // Remove any existing menus
  const existingMenu = document.querySelector('.liked-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Create context menu
  const menu = document.createElement('div');
  menu.className = 'liked-context-menu';
  menu.innerHTML = `
    <button onclick="removeFromLiked(${videoId})">
      <i class="fas fa-times"></i>
      Remove from liked videos
    </button>
    <button onclick="addToWatchLater(${videoId})">
      <i class="fas fa-clock"></i>
      Save to Watch Later
    </button>
    <button onclick="addToPlaylist(${videoId})">
      <i class="fas fa-list"></i>
      Save to playlist
    </button>
    <button onclick="shareVideo(${videoId})">
      <i class="fas fa-share"></i>
      Share
    </button>
  `;
  
  document.body.appendChild(menu);
  
  // Position menu near the clicked button
  const clickedBtn = document.querySelector(`[onclick="openLikedMenu(${videoId})"]`);
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

function removeFromLiked(videoId) {
  const savedLikedVideos = localStorage.getItem('vidora-liked-videos');
  const likedVideos = savedLikedVideos ? JSON.parse(savedLikedVideos) : [];
  const updatedLikedVideos = likedVideos.filter(video => video.id !== videoId);
  
  localStorage.setItem('vidora-liked-videos', JSON.stringify(updatedLikedVideos));
  currentPage = 1;
  renderLikedVideos(updatedLikedVideos);
  updateLoadMoreButton(updatedLikedVideos);
  
  if (updatedLikedVideos.length === 0) {
    showEmptyState();
  }
  
  // Remove context menu
  document.querySelector('.liked-context-menu')?.remove();
}

function addToWatchLater(videoId) {
  // In a real app, this would add to watch later
  alert('Video added to Watch Later!');
  document.querySelector('.liked-context-menu')?.remove();
}

function addToPlaylist(videoId) {
  // In a real app, this would show playlist selection
  alert('Choose playlist for this video');
  document.querySelector('.liked-context-menu')?.remove();
}

function shareVideo(videoId) {
  // In a real app, this would show share options
  alert('Share this video');
  document.querySelector('.liked-context-menu')?.remove();
}

function playVideo(videoId) {
  // In a real app, this would navigate to the video player
  alert(`Playing video with ID: ${videoId}`);
}

// Load subscriptions for sidebar
function loadSidebarSubscriptions() {
  const savedSubscriptions = localStorage.getItem('vidora-subscriptions');
  let subscriptions = [];
  
  if (savedSubscriptions) {
    subscriptions = JSON.parse(savedSubscriptions);
  }
  
  if (subscriptions.length === 0) {
    // Keep the empty state in sidebar
    sidebarSubscriptions.innerHTML = `
      <div class="empty-sidebar-subscriptions">
        <i class="fas fa-users" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
        <p>No subscriptions yet</p>
      </div>
    `;
  } else {
    // Render subscribed channels in sidebar
    sidebarSubscriptions.innerHTML = '';
    subscriptions.forEach(channel => {
      const channelItem = document.createElement('a');
      channelItem.href = '#';
      channelItem.className = 'nav-item channel';
      channelItem.innerHTML = `
        <div class="channel-avatar">${channel.avatar}</div>
        <span class="nav-text">${channel.name}</span>
      `;
      sidebarSubscriptions.appendChild(channelItem);
    });
  }
}

// Check authentication and initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('userAuthenticated');
  if (!isAuthenticated || isAuthenticated !== 'true') {
    // For demo purposes, we'll allow viewing liked videos without auth
    // In real implementation: window.location.href = 'signin.html?redirect=liked-videos';
  }
  
  // Display user info if authenticated
  const userEmail = localStorage.getItem('userEmail');
  const userAvatar = document.getElementById('user-avatar');
  if (userEmail && userAvatar) {
    const firstLetter = userEmail.charAt(0).toUpperCase();
    userAvatar.innerHTML = `<span>${firstLetter}</span>`;
  }
  
  // Load liked videos
  loadLikedVideos();
  
  // Load subscriptions for sidebar
  loadSidebarSubscriptions();
});