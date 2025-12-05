// Global Variables
let currentUser = null;
let studySessions = [];
let timerInterval = null;
let currentSessionStart = null;
let elapsedSeconds = 0;
let isPaused = false;
let dbUrl = '';
let syncInterval = null;
let myChart = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');

const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');
const sessionNotes = document.getElementById('sessionNotes');

const tabBtns = document.querySelectorAll('.tab-btn');
const contentPages = document.querySelectorAll('.content-page');

const todayTime = document.getElementById('todayTime');
const todaySessions = document.getElementById('todaySessions');
const currentStreak = document.getElementById('currentStreak');

const filterBtns = document.querySelectorAll('.filter-btn');
const totalTime = document.getElementById('totalTime');
const totalSessions = document.getElementById('totalSessions');
const avgTime = document.getElementById('avgTime');
const streakCount = document.getElementById('streakCount');
const studyChart = document.getElementById('studyChart');
const continuityCalendar = document.getElementById('continuityCalendar');
const recentSessions = document.getElementById('recentSessions');

const syncStatus = document.getElementById('syncStatus');
const lastSyncTime = document.getElementById('lastSyncTime');
const manualSyncBtn = document.getElementById('manualSyncBtn');
const onlineStatus = document.getElementById('onlineStatus');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const clearBtn = document.getElementById('clearBtn');
const dbConfigForm = document.getElementById('dbConfigForm');
const dbUrlInput = document.getElementById('dbUrl');

// Initialize App
function init() {
    loadUserData();
    setupEventListeners();
    
    if (currentUser) {
        showMainApp();
    }
    
    // Check online status
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Event Listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resumeBtn.addEventListener('click', resumeTimer);
    stopBtn.addEventListener('click', stopTimer);
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.page));
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => filterAnalytics(btn.dataset.days));
    });
    
    manualSyncBtn.addEventListener('click', syncToCloud);
    exportBtn.addEventListener('click', exportData);
    importFile.addEventListener('change', importData);
    clearBtn.addEventListener('click', clearAllData);
    dbConfigForm.addEventListener('submit', saveDbConfig);
}

// Login/Logout
function handleLogin(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        showMainApp();
    }
}

function handleLogout() {
    if (timerInterval) {
        stopTimer();
    }
    currentUser = null;
    localStorage.removeItem('currentUser');
    loginPage.classList.add('active');
    mainApp.classList.remove('active');
    usernameInput.value = '';
    
    if (syncInterval) {
        clearInterval(syncInterval);
    }
}

function showMainApp() {
    loginPage.classList.remove('active');
    mainApp.classList.add('active');
    usernameDisplay.textContent = currentUser;
    loadSessions();
    updateDashboard();
    updateAnalytics();
    
    // Start auto-sync
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(syncToCloud, 30000); // Every 30 seconds
}

// Tab Navigation
function switchTab(pageId) {
    tabBtns.forEach(btn => btn.classList.remove('active'));
    contentPages.forEach(page => page.classList.remove('active'));
    
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'analyticsPage') {
        updateAnalytics();
    }
}

// Timer Functions
function startTimer() {
    currentSessionStart = Date.now();
    elapsedSeconds = 0;
    isPaused = false;
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline-block';
    resumeBtn.disabled = false;
}

function resumeTimer() {
    isPaused = false;
    currentSessionStart = Date.now() - (elapsedSeconds * 1000);
    resumeBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
    if (!currentSessionStart) return;
    
    clearInterval(timerInterval);
    
    const session = {
        date: new Date().toISOString(),
        duration: elapsedSeconds,
        notes: sessionNotes.value.trim(),
        username: currentUser
    };
    
    studySessions.push(session);
    saveSessions();
    syncToCloud();
    
    // Reset
    currentSessionStart = null;
    elapsedSeconds = 0;
    isPaused = false;
    timerDisplay.textContent = '00:00:00';
    sessionNotes.value = '';
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.style.display = 'inline-block';
    resumeBtn.disabled = true;
    resumeBtn.style.display = 'none';
    stopBtn.disabled = true;
    
    updateDashboard();
    updateAnalytics();
}

function updateTimerDisplay() {
    if (!isPaused) {
        elapsedSeconds = Math.floor((Date.now() - currentSessionStart) / 1000);
    }
    
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    
    timerDisplay.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Data Management
function loadUserData() {
    currentUser = localStorage.getItem('currentUser');
    dbUrl = localStorage.getItem('dbUrl') || '';
    dbUrlInput.value = dbUrl;
}

function loadSessions() {
    const stored = localStorage.getItem(`sessions_${currentUser}`);
    studySessions = stored ? JSON.parse(stored) : [];
}

function saveSessions() {
    localStorage.setItem(`sessions_${currentUser}`, JSON.stringify(studySessions));
}

// Cloud Sync
async function syncToCloud() {
    if (!dbUrl) {
        updateSyncStatus('No DB configured', 'error');
        return;
    }
    
    updateSyncStatus('Syncing...', 'syncing');
    
    try {
        const data = {
            username: currentUser,
            sessions: studySessions,
            lastSync: new Date().toISOString()
        };
        
        const response = await fetch(dbUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            updateSyncStatus('Synced', 'synced');
            lastSyncTime.textContent = `Last synced: ${new Date().toLocaleTimeString()}`;
        } else {
            updateSyncStatus('Sync failed', 'error');
        }
    } catch (error) {
        console.error('Sync error:', error);
        updateSyncStatus('Offline', 'error');
    }
}

function updateSyncStatus(text, status) {
    const syncText = syncStatus.querySelector('.sync-text');
    syncText.textContent = text;
    
    syncStatus.classList.remove('syncing', 'error');
    if (status === 'syncing') syncStatus.classList.add('syncing');
    if (status === 'error') syncStatus.classList.add('error');
}

function updateOnlineStatus() {
    if (navigator.onLine) {
        onlineStatus.textContent = '🟢 Online';
        onlineStatus.className = 'status-online';
    } else {
        onlineStatus.textContent = '🔴 Offline';
        onlineStatus.className = 'status-offline';
    }
}

function saveDbConfig(e) {
    e.preventDefault();
    dbUrl = dbUrlInput.value.trim();
    localStorage.setItem('dbUrl', dbUrl);
    alert('Database configuration saved!');
    syncToCloud();
}

// Dashboard Updates
function updateDashboard() {
    const today = new Date().toDateString();
    const todaysSessions = studySessions.filter(s => 
        new Date(s.date).toDateString() === today
    );
    
    const todayMinutes = todaysSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    todayTime.textContent = formatTime(todayMinutes);
    todaySessions.textContent = todaysSessions.length;
    
    const streak = calculateStreak();
    currentStreak.textContent = streak;
}

function calculateStreak() {
    if (studySessions.length === 0) return 0;
    
    const dates = [...new Set(studySessions.map(s => new Date(s.date).toDateString()))].sort((a, b) => 
        new Date(b) - new Date(a)
    );
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let dateStr of dates) {
        const date = new Date(dateStr);
        const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === streak) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// Analytics
function filterAnalytics(days) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-days="${days}"]`).classList.add('active');
    updateAnalytics(days);
}

function updateAnalytics(filterDays = '7') {
    let filteredSessions = studySessions;
    
    if (filterDays !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(filterDays));
        filteredSessions = studySessions.filter(s => new Date(s.date) >= daysAgo);
    }
    
    // Stats
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    totalTime.textContent = formatTime(totalMinutes);
    totalSessions.textContent = filteredSessions.length;
    
    const uniqueDays = new Set(filteredSessions.map(s => new Date(s.date).toDateString())).size;
    const avgMinutes = uniqueDays > 0 ? totalMinutes / uniqueDays : 0;
    avgTime.textContent = `${Math.round(avgMinutes)} min`;
    
    streakCount.textContent = calculateStreak();
    
    // Chart
    updateChart(filteredSessions, filterDays);
    
    // Calendar
    updateCalendar();
    
    // Recent Sessions
    updateRecentSessions();
}

function updateChart(sessions, filterDays) {
    const days = filterDays === 'all' ? 30 : parseInt(filterDays);
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const dayMinutes = sessions
            .filter(s => new Date(s.date).toDateString() === dateStr)
            .reduce((sum, s) => sum + s.duration, 0) / 60;
        
        data.push(Math.round(dayMinutes));
    }
    
    if (myChart) {
        myChart.destroy();
    }
    
    myChart = new Chart(studyChart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Minutes Studied',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

function updateCalendar() {
    continuityCalendar.innerHTML = '';
    
    for (let i = 41; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const dayMinutes = studySessions
            .filter(s => new Date(s.date).toDateString() === dateStr)
            .reduce((sum, s) => sum + s.duration, 0) / 60;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = date.getDate();
        dayDiv.title = `${dateStr}: ${Math.round(dayMinutes)} min`;
        
        if (dayMinutes === 0) {
            dayDiv.style.background = '#ef4444';
        } else if (dayMinutes < 60) {
            dayDiv.style.background = '#93c5fd';
        } else if (dayMinutes < 120) {
            dayDiv.style.background = '#3b82f6';
        } else {
            dayDiv.style.background = '#1e40af';
        }
        
        continuityCalendar.appendChild(dayDiv);
    }
}

function updateRecentSessions() {
    const recent = studySessions.slice(-20).reverse();
    
    if (recent.length === 0) {
        recentSessions.innerHTML = '<div class="empty-message">No sessions recorded yet</div>';
        return;
    }
    
    recentSessions.innerHTML = recent.map(session => `
        <div class="session-item">
            <div class="session-date">${new Date(session.date).toLocaleString()}</div>
            <div class="session-duration">Duration: ${formatTime(session.duration / 60)}</div>
            ${session.notes ? `<div class="session-notes-display">${session.notes}</div>` : ''}
        </div>
    `).join('');
}

// Data Export/Import
function exportData() {
    const data = {
        username: currentUser,
        sessions: studySessions,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-data-${currentUser}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            if (confirm('Merge with existing data? (Cancel to replace)')) {
                studySessions = [...studySessions, ...data.sessions];
            } else {
                studySessions = data.sessions;
            }
            
            // Sort by date
            studySessions.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            saveSessions();
            syncToCloud();
            updateDashboard();
            updateAnalytics();
            
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

function clearAllData() {
    if (!confirm('Are you sure you want to delete ALL study sessions? This cannot be undone!')) {
        return;
    }
    
    if (!confirm('Final confirmation: This will permanently delete all your data!')) {
        return;
    }
    
    studySessions = [];
    saveSessions();
    syncToCloud();
    updateDashboard();
    updateAnalytics();
    
    alert('All data has been cleared.');
}

// Utility Functions
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
}

// Start the app
init();