# 📚 StudyLooper - Study Time Tracker

A modern web application to track your real study time with Firebase authentication and cloud storage.

## 🚀 Features

- ⏱️ **Real-time Stopwatch** - Track study sessions with start, pause, and resume
- 🔐 **Secure Authentication** - Firebase-powered email/password login
- ☁️ **Cloud Storage** - All data synced to Firestore (accessible from any device)
- 📊 **Analytics Dashboard** - Visualize study patterns with charts
- 🔥 **Study Streaks** - Track consecutive study days
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🌙 **Dark Mode** - Eye-friendly theme for night studying
- 📈 **Progress Tracking** - Monitor total time, sessions, and averages

## 🛠️ Setup Instructions

### 1. Firebase Setup (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
4. Enable **Firestore Database**:
   - Go to Firestore Database → Create Database
   - Start in **Production mode**
   - Choose your preferred location
5. Add Firestore Security Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

6. Get your Firebase config:
   - Go to Project Settings → General → Your apps
   - Click "</> Web"
   - Copy the configuration object

7. Update `firebase-config.js` with your credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### 2. Deploy to GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `/ (root)`
4. Save

### 3. Access Your App

Your app will be live at: `https://YOUR_USERNAME.github.io/StudyLooper/`

## 📖 How to Use

1. **Sign Up**: Create an account with email and password
2. **Login**: Access your account from any device
3. **Start Timer**: Click "Start" to begin tracking study time
4. **Add Session Name**: Optionally name your session (e.g., "Math Chapter 5")
5. **Stop & Save**: Click "Stop & Save" to record the session
6. **View Analytics**: Check your progress in the Analytics tab
7. **Review History**: See all past sessions in the History tab

## 🔒 Security

- Passwords are encrypted by Firebase Authentication
- Firestore rules ensure users can only access their own data
- All data transmitted over HTTPS
- No sensitive data stored in localStorage

## 💾 Data Structure

Each user's data is stored in Firestore:
```
users/{userId}/
  - profile: { name, email, createdAt }
  - sessions: [
      { id, name, duration, date, ... }
    ]
```

## 🌟 Future Enhancements

- [ ] Google Sign-In
- [ ] Study goals and reminders
- [ ] Pomodoro timer integration
- [ ] Team/group study tracking
- [ ] Export data to PDF/CSV
- [ ] Mobile app (PWA)

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

**Note**: Remember to add your Firebase configuration in `firebase-config.js` before deploying!