// Firebase Configuration
// ⚠️ IMPORTANT: Replace these values with your own Firebase project credentials
// Get them from: Firebase Console → Project Settings → General → Your apps

const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Instructions:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project (or create new one)
// 3. Click the gear icon → Project settings
// 4. Scroll down to "Your apps" section
// 5. Click "</> Web" to add a web app
// 6. Copy the config object and replace the values above
// 7. Enable Authentication (Email/Password) in Firebase Console
// 8. Enable Firestore Database in Firebase Console
// 9. Add Firestore Security Rules (see README.md)

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
}