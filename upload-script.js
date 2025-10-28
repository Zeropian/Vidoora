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

// ===== AUTHENTICATION CHECK =====
document.addEventListener('DOMContentLoaded', function() {
  const isAuthenticated = localStorage.getItem('userAuthenticated');
  
  if (!isAuthenticated || isAuthenticated !== 'true') {
    window.location.href = 'signin.html?redirect=upload';
    return;
  }
  
  // Display user info
  const userEmail = localStorage.getItem('userEmail');
  const userAvatar = document.getElementById('user-avatar');
  if (userEmail && userAvatar) {
    const firstLetter = userEmail.charAt(0).toUpperCase();
    userAvatar.innerHTML = `<span>${firstLetter}</span>`;
  }
});

// ===== UPLOAD FUNCTIONALITY =====
const uploadBox = document.getElementById('upload-box');
const videoFileInput = document.getElementById('video-file');
const selectFilesBtn = document.getElementById('select-files-btn');
const uploadProgress = document.getElementById('upload-progress');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const videoPreview = document.getElementById('video-preview');
const previewVideo = document.getElementById('preview-video');
const videoFilename = document.getElementById('video-filename');
const videoSize = document.getElementById('video-size');
const publishBtn = document.getElementById('publish-btn');

// Character counters
const titleInput = document.getElementById('video-title');
const descriptionInput = document.getElementById('video-description');
const titleChars = document.getElementById('title-chars');
const descriptionChars = document.getElementById('description-chars');

titleInput.addEventListener('input', function() {
  titleChars.textContent = this.value.length;
  validateForm();
});

descriptionInput.addEventListener('input', function() {
  descriptionChars.textContent = this.value.length;
});

// File selection
selectFilesBtn.addEventListener('click', () => {
  videoFileInput.click();
});

videoFileInput.addEventListener('change', handleFileSelect);

// Drag and drop functionality
uploadBox.addEventListener('dragover', function(e) {
  e.preventDefault();
  this.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', function(e) {
  e.preventDefault();
  this.classList.remove('dragover');
});

uploadBox.addEventListener('drop', function(e) {
  e.preventDefault();
  this.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith('video/')) {
    handleFile(files[0]);
  } else {
    alert('Please select a video file.');
  }
});

uploadBox.addEventListener('click', () => {
  videoFileInput.click();
});

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    handleFile(file);
  } else {
    alert('Please select a valid video file.');
  }
}

function handleFile(file) {
  // Show video preview
  const videoURL = URL.createObjectURL(file);
  previewVideo.src = videoURL;
  videoFilename.textContent = file.name;
  videoSize.textContent = formatFileSize(file.size);
  
  // Show preview and hide upload box
  uploadBox.style.display = 'none';
  videoPreview.style.display = 'block';
  
  // Enable publish button when title is filled
  validateForm();
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Thumbnail upload
const thumbnailBtn = document.getElementById('thumbnail-btn');
const thumbnailInput = document.getElementById('video-thumbnail');
const thumbnailPreview = document.getElementById('thumbnail-preview');

thumbnailBtn.addEventListener('click', () => {
  thumbnailInput.click();
});

thumbnailInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      thumbnailPreview.innerHTML = `<img src="${e.target.result}" alt="Thumbnail preview" />`;
    };
    reader.readAsDataURL(file);
  }
});

// Form validation
function validateForm() {
  const hasVideo = videoPreview.style.display !== 'none';
  const hasTitle = titleInput.value.trim().length > 0;
  
  publishBtn.disabled = !(hasVideo && hasTitle);
}

// Form submission
const videoForm = document.getElementById('video-details-form');
videoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  if (!publishBtn.disabled) {
    // Simulate upload process
    simulateUpload();
  }
});

function simulateUpload() {
  // Show upload progress
  uploadProgress.style.display = 'block';
  progressFill.style.width = '0%';
  progressText.textContent = '0%';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Upload complete
      setTimeout(() => {
        alert('Video uploaded successfully!');
        window.location.href = 'index.html';
      }, 500);
    }
    
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '%';
  }, 200);
}

// Save draft functionality
const saveDraftBtn = document.getElementById('save-draft-btn');
saveDraftBtn.addEventListener('click', function() {
  const videoData = {
    title: titleInput.value,
    description: descriptionInput.value,
    category: document.getElementById('video-category').value,
    tags: document.getElementById('video-tags').value,
    privacy: document.getElementById('video-privacy').value,
    timestamp: new Date().toISOString()
  };
  
  // Save to localStorage
  const drafts = JSON.parse(localStorage.getItem('videoDrafts') || '[]');
  drafts.push(videoData);
  localStorage.setItem('videoDrafts', JSON.stringify(drafts));
  
  alert('Draft saved successfully!');
});

// Search functionality
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
    alert(`Searching for: ${query}`);
    // Future implementation: Redirect to search results
    // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  } else {
    searchInput.focus();
  }
}