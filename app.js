// ========== FIREBASE INITIALIZATION ==========
let auth, db;
let currentUser = null;

// Timer variables
let timerInterval = null;
let seconds = 0;
let isRunning = false;
let startTime = null;

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    alert('Firebase configuration error. Please check firebase-config.js');
}

// ========== AUTH STATE OBSERVER ==========
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadUserProfile();
        showMainApp();
    } else {
        currentUser = null;
        showAuthScreen();
    }
});

// ========== AUTHENTICATION FUNCTIONS ==========

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    clearMessages();
}

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    clearMessages();
}

function clearMessages() {
    const elements = ['loginError', 'signupError', 'signupSuccess'];
    elements.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.style.display = 'none';
            elem.textContent = '';
        }
    });
}

function showError(elementId, message) {
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.textContent = message;
        elem.style.display = 'block';
    }
}

function showSuccess(elementId, message) {
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.textContent = message;
        elem.style.display = 'block';
    }
}

function disableButton(buttonId, text = 'Please wait...') {
    const btn = document.getElementById(buttonId);
    if (btn) {
        btn.disabled = true;
        btn.textContent = text;
    }
}

function enableButton(buttonId, text) {
    const btn = document.getElementById(buttonId);
    if (btn) {
        btn.disabled = false;
        btn.textContent = text;
    }
}

async function signup() {
    clearMessages();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!name || name.length < 2) {
        showError('signupError', 'Name must be at least 2 characters');
        return;
    }
    
    if (!email || !email.includes('@')) {
        showError('signupError', 'Please enter a valid email');
        return;
    }
    
    if (!password || password.length < 6) {
        showError('signupError', 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('signupError', 'Passwords do not match');
        return;
    }
    
    disableButton('signupBtn', 'Creating account...');
    
    try {
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile with name
        await user.updateProfile({ displayName: name });
        
        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sessions: []
        });
        
        showSuccess('signupSuccess', 'Account created successfully! Redirecting...');
        
        // Clear form
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupConfirmPassword').value = '';
        
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Signup failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please login.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Use at least 6 characters.';
        }
        
        showError('signupError', errorMessage);
    } finally {
        enableButton('signupBtn', 'Create Account');
    }
}

async function login() {
    clearMessages();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showError('loginError', 'Please enter both email and password');
        return;
    }
    
    disableButton('loginBtn', 'Logging in...');
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged will handle the rest
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Invalid email or password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        }
        
        showError('loginError', errorMessage);
        enableButton('loginBtn', 'Login');
    }
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            resetTimer();
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        }
    }
}

// ========== UI FUNCTIONS ==========

function showAuthScreen() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}

async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            const name = userData.name || currentUser.displayName || 'User';
            const email = currentUser.email;
            
            // Update UI
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            document.getElementById('userAvatar').textContent = initials;
            document.getElementById('userName').textContent = name;
            document.getElementById('userEmail').textContent = email;
            document.getElementById('profileAvatar').textContent = initials;
            document.getElementById('profileName').textContent = name;
            document.getElementById('profileEmail').textContent = email;
            document.getElementById('profileId').textContent = currentUser.uid;
            
            if (userData.createdAt) {
                const createdDate = userData.createdAt.toDate();
                document.getElementById('profileJoined').textContent = createdDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        }
        
        // Load sessions
        updateAnalytics();
        updateHistory();
        
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// ========== FIRESTORE DATA FUNCTIONS ==========

async function getSessions() {
    if (!currentUser) return [];
    
    try {
        const sessionsSnapshot = await db.collection('users')
            .doc(currentUser.uid)
            .collection('sessions')
            .orderBy('date', 'desc')
            .get();
        
        return sessionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
}

async function saveSession(sessionData) {
    if (!currentUser) return;
    
    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('sessions')
            .add(sessionData);
        
        console.log('Session saved successfully');
    } catch (error) {
        console.error('Error saving session:', error);
        throw error;
    }
}

async function deleteSession(sessionId) {
    if (!currentUser) return;
    
    try {
        await db.collection('users')
            .doc(currentUser.uid)
            .collection('sessions')
            .doc(sessionId)
            .delete();
        
        console.log('Session deleted successfully');
    } catch (error) {
        console.error('Error deleting session:', error);
        throw error;
    }
}

// ========== TIMER FUNCTIONS ==========

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

async function stopTimer() {
    if (seconds > 0) {
        clearInterval(timerInterval);
        isRunning = false;
        
        const sessionName = document.getElementById('sessionName').value || 'Study Session';
        const now = new Date();
        
        const newSession = {
            name: sessionName,
            duration: seconds,
            date: firebase.firestore.Timestamp.fromDate(now),
            dateString: now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            timeString: now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        try {
            await saveSession(newSession);
            alert(`✅ Session saved!\nDuration: ${formatDuration(seconds)}`);
            resetTimer();
            updateAnalytics();
            updateHistory();
        } catch (error) {
            alert('Error saving session. Please try again.');
        }
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

// ========== TAB MANAGEMENT ==========

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

// ========== ANALYTICS ==========

async function updateAnalytics() {
    const sessions = await getSessions();
    
    const totalSeconds = sessions.reduce((sum, session) => sum + session.duration, 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    const totalSessionsCount = sessions.length;
    const avgSeconds = totalSessionsCount > 0 ? totalSeconds / totalSessionsCount : 0;
    const avgMinutes = Math.round(avgSeconds / 60);
    
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => {
        const sessionDate = s.date.toDate ? s.date.toDate() : new Date(s.date);
        return sessionDate.toDateString() === today;
    });
    const todaySeconds = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    const todayHours = (todaySeconds / 3600).toFixed(1);
    
    const streak = calculateStreak(sessions);
    
    document.getElementById('totalTime').textContent = `${totalHours}h`;
    document.getElementById('totalSessions').textContent = totalSessionsCount;
    document.getElementById('avgSession').textContent = `${avgMinutes}m`;
    document.getElementById('todayTime').textContent = `${todayHours}h`;
    document.getElementById('streakDays').textContent = streak;
    
    updateWeekChart(sessions);
    updatePieChart(sessions);
}

function calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const dates = [...new Set(sessions.map(s => {
        const sessionDate = s.date.toDate ? s.date.toDate() : new Date(s.date);
        return sessionDate.toDateString();
    }))];
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
    
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        labels.push(dayName);
        
        const daySessions = sessions.filter(s => {
            const sessionDate = s.date.toDate ? s.date.toDate() : new Date(s.date);
            return sessionDate.toDateString() === dateString;
        });
        const dayMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
        data.push(Math.round(dayMinutes));
    }
    
    if (weekChart) weekChart.destroy();
    
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
                legend: { display: false }
            }
        }
    });
}

function updatePieChart(sessions) {
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    
    const grouped = {};
    sessions.forEach(session => {
        const name = session.name;
        if (!grouped[name]) grouped[name] = 0;
        grouped[name] += session.duration;
    });
    
    const labels = Object.keys(grouped);
    const data = Object.values(grouped).map(s => Math.round(s / 60));
    
    if (pieChart) pieChart.destroy();
    
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
                legend: { position: 'bottom' },
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

// ========== HISTORY ==========

async function updateHistory() {
    const sessions = await getSessions();
    const listElement = document.getElementById('sessionsList');
    
    if (sessions.length === 0) {
        listElement.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No study sessions recorded yet. Start your first session!</p>';
        return;
    }
    
    listElement.innerHTML = sessions.map(session => `
        <div class="session-item">
            <h4>${session.name}</h4>
            <p><strong>Duration:</strong> ${formatDuration(session.duration)}</p>
            <p><strong>Date:</strong> ${session.dateString}</p>
            <p><strong>Time:</strong> ${session.timeString}</p>
            <button class="delete-btn" onclick="handleDeleteSession('${session.id}')">Delete</button>
        </div>
    `).join('');
}

async function handleDeleteSession(sessionId) {
    if (confirm('Are you sure you want to delete this session?')) {
        try {
            await deleteSession(sessionId);
            updateHistory();
            updateAnalytics();
        } catch (error) {
            alert('Error deleting session. Please try again.');
        }
    }
}

// ========== INITIALIZATION ==========

window.addEventListener('load', () => {
    updateDisplay();
});