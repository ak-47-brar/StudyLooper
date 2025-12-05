# 🚀 Complete Setup Guide for StudyLooper

This guide will help you set up Firebase and deploy your StudyLooper app in under 10 minutes!

---

## 📊 Overview

**What you'll do:**
1. Create a Firebase project (FREE)
2. Enable Authentication and Firestore
3. Get your Firebase credentials
4. Update the config file
5. Enable GitHub Pages
6. Start tracking your study time!

---

## 🔥 Part 1: Firebase Setup (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `StudyLooper` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (optional, not needed for this app)
6. Click **Create project**
7. Wait for setup to complete, then click **Continue**

### Step 2: Enable Email/Password Authentication

1. In your Firebase project, click **Build** → **Authentication** in left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** switch to ON
6. Click **Save**

✅ Authentication is now enabled!

### Step 3: Create Firestore Database

1. Click **Build** → **Firestore Database** in left sidebar
2. Click **Create database**
3. Select **Start in production mode** (we'll add security rules next)
4. Choose your preferred location (select closest to you):
   - `asia-south1` for India
   - `us-central1` for US
   - `europe-west1` for Europe
5. Click **Enable**
6. Wait for database creation (takes ~30 seconds)

### Step 4: Add Firestore Security Rules

1. In Firestore Database, click **Rules** tab
2. Replace the existing rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can access their own sessions subcollection
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **Publish**

✅ Your database is now secure! Users can only access their own data.

### Step 5: Get Your Firebase Config

1. Click the **gear icon** → **Project settings** (top left)
2. Scroll down to **Your apps** section
3. Click the **</>** (Web) icon
4. Enter app nickname: `StudyLooper Web`
5. **DON'T** check "Also set up Firebase Hosting"
6. Click **Register app**
7. You'll see a code block with `firebaseConfig`. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

8. **COPY THIS ENTIRE CONFIG OBJECT** — you'll need it in the next step!
9. Click **Continue to console**

---

## 💻 Part 2: Update Your Repository (2 minutes)

### Step 1: Edit firebase-config.js

1. Go to your GitHub repository: https://github.com/YOUR_USERNAME/StudyLooper
2. Click on `firebase-config.js` file
3. Click the **pencil icon** (✏️ Edit) in top right
4. Replace the placeholder values with YOUR Firebase config:

**BEFORE (Placeholder):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**AFTER (Your actual values):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123..." // YOUR ACTUAL API KEY
  authDomain: "studylooper-abc123.firebaseapp.com", // YOUR ACTUAL DOMAIN
  projectId: "studylooper-abc123", // YOUR ACTUAL PROJECT ID
  storageBucket: "studylooper-abc123.appspot.com", // YOUR ACTUAL BUCKET
  messagingSenderId: "987654321", // YOUR ACTUAL SENDER ID
  appId: "1:987654321:web:xyz789" // YOUR ACTUAL APP ID
};
```

5. Scroll down and click **Commit changes**
6. Add commit message: "Add Firebase credentials"
7. Click **Commit changes** again

✅ Your app is now connected to Firebase!

---

## 🌐 Part 3: Enable GitHub Pages (1 minute)

1. In your repository, click **Settings** (top right)
2. Click **Pages** in left sidebar
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment

✅ Your site is live!

**Your app URL:** `https://YOUR_USERNAME.github.io/StudyLooper/`

---

## ✅ Part 4: Test Your App (2 minutes)

1. Open your app URL in a browser
2. Click **Sign Up**
3. Enter:
   - Name: Your name
   - Email: your@email.com
   - Password: (minimum 6 characters)
4. Click **Create Account**
5. You should see "Account created successfully!"
6. Login with your credentials
7. Start your first study session!

---

## 🔒 Security Notes

✅ **Your data is secure:**
- Firebase Authentication encrypts passwords
- Firestore rules prevent unauthorized access
- Only you can see your study sessions
- All data transmitted over HTTPS

⚠️ **Important:**
- Your API key in `firebase-config.js` is safe to be public
- Firestore security rules protect your data, not the API key
- Never share your Firebase Console login credentials

---

## 📊 Firebase Free Tier Limits

Your app is completely FREE with these generous limits:

| Resource | Free Tier | Your Usage (estimated) |
|----------|-----------|------------------------|
| **Authentication** | 50,000 users | ~1 user (you) |
| **Firestore Reads** | 50,000/day | ~100/day |
| **Firestore Writes** | 20,000/day | ~20/day |
| **Firestore Storage** | 1 GB | ~0.001 GB |
| **Bandwidth** | 10 GB/month | ~0.1 GB/month |

💚 **Result:** You can use StudyLooper for YEARS without paying anything!

---

## 🚫 Troubleshooting

### Issue: "Firebase initialization error"

**Solution:**
1. Check that you updated `firebase-config.js` with YOUR credentials
2. Make sure you copied the ENTIRE config object
3. Verify there are no typos in the config
4. Clear browser cache and reload

### Issue: "Login failed"

**Solution:**
1. Verify Email/Password authentication is enabled in Firebase Console
2. Check you're using the correct email/password
3. Look for error messages on the screen
4. Check browser console (F12) for detailed errors

### Issue: "Session not saving"

**Solution:**
1. Verify Firestore is created and enabled
2. Check Firestore security rules are correctly set
3. Make sure you're logged in
4. Check browser console for errors

### Issue: "GitHub Pages not working"

**Solution:**
1. Wait 2-3 minutes after enabling Pages
2. Check that branch is set to `main` and folder to `/ (root)`
3. Try accessing the URL in incognito mode
4. Clear browser cache

---

## 🌟 Next Steps

Now that your app is working:

1. ✅ Create your account
2. ✅ Track your first study session
3. ✅ Explore the Analytics tab
4. ✅ Build a study streak!
5. ✅ Share with friends

---

## 📞 Need Help?

If you encounter any issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Open an issue on GitHub
3. Review error messages in browser console (press F12)

---

## 🎉 Congratulations!

You've successfully set up StudyLooper with Firebase! 

Happy studying! 📚🚀

---

**Last Updated:** December 2025