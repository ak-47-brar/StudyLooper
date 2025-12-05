// Timer variables
let timerInterval = null;
let seconds = 0;
let isRunning = false;
let startTime = null;

// Load sessions from localStorage
function getSessions() {
    const sessions = localStorage.getItem('studySessions');
    return sessions ? JSON.parse(sessions) : [];
}

function saveSessions(sessions) {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
}

// Format time
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Timer functions
function updateDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(seconds);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - (seconds * 1000);
        timerInterval = setInterval(() => {
            seconds = Math.floor((Date.now() - startTime) / 1000);
            updateDisplay();
        }, 100);
        
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';
        document.getElementById('stopBtn').style.display = 'inline-block';
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        document.getElementById('pauseBtn').textContent = 'Resume';
        document.getElementById('pauseBtn').onclick = resumeTimer;
    }
}

function resumeTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - (seconds * 1000);
        timerInterval = setInterval(() => {
            seconds = Math.floor((Date.now() - startTime) / 1000);
            updateDisplay();
        }, 100);
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('pauseBtn').onclick = pauseTimer;
    }
}

function stopTimer() {
    if (seconds > 0) {
        clearInterval(timerInterval);
        isRunning = false;
        
        // Save session
        const sessions = getSessions();
        const sessionName = document.getElementById('sessionName').value || 'Study Session';
        
        const newSession = {
            id: Date.now(),
            name: sessionName,
            duration: seconds,
            date: new Date().toISOString(),
            dateString: new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            timeString: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        sessions.push(newSession);
        saveSessions(sessions);
        
        resetTimer();
        updateAnalytics();
        updateHistory();
        
        // Show success message
        alert(`✅ Session saved!\nDuration: ${formatDuration(newSession.duration)}`);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    isRunning = false;
    updateDisplay();
    
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'none';
    document.getElementById('pauseBtn').textContent = 'Pause';
    document.getElementById('pauseBtn').onclick = pauseTimer;
    document.getElementById('sessionName').value = '';
}

// Tab switching
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'analytics') {
        updateAnalytics();
    } else if (tabName === 'history') {
        updateHistory();
    }
}

// Analytics
function updateAnalytics() {
    const sessions = getSessions();
    
    // Calculate total time
    const totalSeconds = sessions.reduce((sum, session) => sum + session.duration, 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    
    // Total sessions
    const totalSessionsCount = sessions.length;
    
    // Average session
    const avgSeconds = totalSessionsCount > 0 ? totalSeconds / totalSessionsCount : 0;
    const avgMinutes = Math.round(avgSeconds / 60);
    
    // Today's time
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
    const todaySeconds = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    const todayHours = (todaySeconds / 3600).toFixed(1);
    
    // Streak
    const streak = calculateStreak(sessions);
    
    // Update display
    document.getElementById('totalTime').textContent = `${totalHours}h`;
    document.getElementById('totalSessions').textContent = totalSessionsCount;
    document.getElementById('avgSession').textContent = `${avgMinutes}m`;
    document.getElementById('todayTime').textContent = `${todayHours}h`;
    document.getElementById('streakDays').textContent = streak;
    
    // Update charts
    updateWeekChart(sessions);
    updatePieChart(sessions);
}

function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const dates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))];
    dates.sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dates.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        if (dates.includes(checkDate.toDateString())) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

let weekChart = null;
let pieChart = null;

function updateWeekChart(sessions) {
    const canvas = document.getElementById('weekChart');
    const ctx = canvas.getContext('2d');
    
    // Get last 7 days
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        labels.push(dayName);
        
        const daySessions = sessions.filter(s => new Date(s.date).toDateString() === dateString);
        const dayMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
        data.push(Math.round(dayMinutes));
    }
    
    if (weekChart) {
        weekChart.destroy();
    }
    
    weekChart = new Chart(ctx, {
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
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + 'm';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updatePieChart(sessions) {
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    
    // Group by session name
    const grouped = {};
    sessions.forEach(session => {
        const name = session.name;
        if (!grouped[name]) {
            grouped[name] = 0;
        }
        grouped[name] += session.duration;
    });
    
    const labels = Object.keys(grouped);
    const data = Object.values(grouped).map(s => Math.round(s / 60));
    
    if (pieChart) {
        pieChart.destroy();
    }
    
    if (labels.length === 0) {
        labels.push('No data yet');
        data.push(1);
    }
    
    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(237, 100, 166, 0.8)',
                    'rgba(255, 154, 158, 0.8)',
                    'rgba(250, 208, 196, 0.8)',
                    'rgba(52, 211, 153, 0.8)',
                    'rgba(251, 191, 36, 0.8)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' minutes';
                        }
                    }
                }
            }
        }
    });
}

// History
function updateHistory() {
    const sessions = getSessions();
    const listElement = document.getElementById('sessionsList');
    
    if (sessions.length === 0) {
        listElement.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No study sessions recorded yet. Start your first session!</p>';
        return;
    }
    
    // Sort by date (newest first)
    sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    listElement.innerHTML = sessions.map(session => `
        <div class="session-item">
            <h4>${session.name}</h4>
            <p><strong>Duration:</strong> ${formatDuration(session.duration)}</p>
            <p><strong>Date:</strong> ${session.dateString}</p>
            <p><strong>Time:</strong> ${session.timeString}</p>
            <button class="delete-btn" onclick="deleteSession(${session.id})">Delete</button>
        </div>
    `).join('');
}

function deleteSession(id) {
    if (confirm('Are you sure you want to delete this session?')) {
        let sessions = getSessions();
        sessions = sessions.filter(s => s.id !== id);
        saveSessions(sessions);
        updateHistory();
        updateAnalytics();
    }
}

// Initialize
updateDisplay();
updateAnalytics();
updateHistory();