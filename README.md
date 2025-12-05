# 📚 StudyLooper - Comprehensive Study Time Tracker

A powerful, feature-rich web application designed to help students track their study time, analyze patterns, and maintain consistency with cloud synchronization.

## ✨ Features

### 🔐 User Authentication
- Simple username-based login system
- Persistent session storage
- Multi-user support with separate data

### ⏱️ Real-Time Study Timer
- Stopwatch with hours:minutes:seconds format
- Digital monospace display (00:00:00)
- **Start** - Begin new study session
- **Pause** - Temporarily stop without ending
- **Resume** - Continue after pause
- **Stop & Save** - End session and save to database
- Session notes textarea for descriptions
- Auto-updates every second

### 📊 Today's Dashboard
- Total study time for today
- Number of sessions completed
- Current study streak (consecutive days)
- Real-time updates with each session
- Beautiful card layout with emoji icons

### 📈 Advanced Analytics Page
- **Time Range Filters**: 7 days, 30 days, All time
- **Overview Statistics**:
  - Total study time in selected range
  - Total number of sessions
  - Average study time per day
  - Current streak count

### 📊 Visual Data Representations
- **Interactive Bar Chart** (Chart.js):
  - Daily study time visualization
  - Purple gradient colors (#667eea)
  - Responsive design
  - Shows minutes studied per day

- **Color-Coded Continuity Calendar** (42 days):
  - 🔴 Red: No study that day
  - 🔵 Light Blue: Less than 1 hour
  - 🔵 Medium Blue: 1-2 hours
  - 🔵 Dark Blue: 2+ hours
  - 7 columns × 6 rows layout
  - Hover tooltips with exact minutes

### 📝 Recent Sessions List
- Display last 20 study sessions
- Full date and time stamps
- Duration in hours and minutes
- Session notes display
- Scrollable container
- Purple bordered cards

### ☁️ Cloud Synchronization
- **Auto-sync every 30 seconds** to online database
- Manual sync button for immediate updates
- Sync status indicator (last synced time)
- Supports any CORS-enabled JSON API:
  - JSONBin.io
  - PasteBin API
  - Custom REST endpoints
- **No API key required** for basic services
- Graceful online/offline handling
- LocalStorage as offline backup

### 💾 Data Management
- **Export Data**: Download sessions as JSON
  - File naming: `study-data-{username}-{YYYY-MM-DD}.json`
  - Includes username, sessions, export date

- **Import Data**: Upload previously exported JSON
  - File validation before import
  - Merge or replace options
  - Auto-syncs after import

- **Clear All Data**:
  - Double confirmation dialogs
  - Permanently deletes all sessions
  - Updates both localStorage and cloud

### 🎨 Beautiful UI Design
- **Color Scheme**:
  - Purple gradient background (#667eea → #764ba2)
  - White cards with rounded corners
  - Soft drop shadows
  - Color-coded buttons (success, warning, danger)

- **Animations**:
  - Smooth page transitions
  - Button hover effects
  - Pulse animation for sync status
  - Transform effects on cards

- **Responsive Layout**:
  - Desktop, tablet, mobile support
  - Max-width container: 1200px
  - Three main pages with tab navigation
  - Grid-based stat cards

## 🚀 Getting Started

### Quick Setup

1. **Clone or Download** this repository
2. **Open `index.html`** in your browser
3. **Enter your username** to start
4. **Begin tracking** your study time!

### Cloud Sync Setup (Optional)

#### Using JSONBin.io (Free)

1. Go to [JSONBin.io](https://jsonbin.io/)
2. Create a free account
3. Create a new bin
4. Copy the bin URL (format: `https://api.jsonbin.io/v3/b/YOUR_BIN_ID`)
5. In StudyLooper, go to **Sync & Data** tab
6. Paste the URL in **Database Configuration**
7. Click **Save Configuration**
8. Your data will now auto-sync every 30 seconds!

#### Using Other Services

Any CORS-enabled JSON storage service will work:
- Custom REST API endpoints
- Firebase Realtime Database
- Supabase
- Your own server

Just ensure the endpoint accepts POST requests with JSON data.

## 📖 How to Use

### Starting a Study Session

1. Click the **Timer** tab
2. Click **▶ Start** button
3. Study!
4. Add notes in the textarea (optional)
5. Click **⏹ Stop & Save** when done

### Pausing a Session

1. During a session, click **⏸ Pause**
2. Timer stops but doesn't end session
3. Click **▶ Resume** to continue
4. Click **⏹ Stop & Save** to end

### Viewing Analytics

1. Click the **Analytics** tab
2. Select time range (7 days, 30 days, All time)
3. View your:
   - Study time chart
   - Continuity calendar
   - Recent sessions
   - Statistics

### Managing Data

1. Click the **Sync & Data** tab
2. **Export**: Download backup JSON file
3. **Import**: Upload previous exports
4. **Clear**: Delete all data (careful!)
5. **Configure DB**: Set cloud sync URL

## 🛠️ Technical Details

### Files Structure

```
StudyLooper/
├── index.html      # Main HTML structure
├── style.css       # All styling and animations
├── app.js          # Complete application logic
└── README.md       # This file
```

### Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with gradients, animations
- **Vanilla JavaScript** - All functionality
- **Chart.js v4.4.0** - Bar chart visualization
- **LocalStorage API** - Offline data persistence
- **Fetch API** - Cloud synchronization

### Data Format

Each study session is stored as:

```json
{
  "date": "2025-12-05T20:00:00.000Z",
  "duration": 3600,
  "notes": "Math - Algebra Chapter 5",
  "username": "YourName"
}
```

- `date`: ISO 8601 timestamp
- `duration`: Seconds studied
- `notes`: Optional description
- `username`: User identifier

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Use Cases

- **Students**: Track study hours for exams
- **Competitive Exam Prep**: Monitor daily progress (RPSC, RAS, etc.)
- **Online Learners**: Measure course completion time
- **Researchers**: Log research hours
- **Self-Study**: Build consistent study habits

## 🔒 Privacy & Security

- All data stored locally in browser (LocalStorage)
- Cloud sync is **optional** and controlled by you
- No data sent to third parties
- No tracking or analytics
- Username-based, no passwords required

## 📱 Mobile Support

 Fully responsive design works perfectly on:
- 📱 Smartphones (iOS & Android)
- 💻 Tablets
- 🖥️ Desktops

## 🐛 Troubleshooting

### Timer not starting?
- Refresh the page
- Check browser console for errors
- Ensure JavaScript is enabled

### Cloud sync failing?
- Verify internet connection
- Check if DB URL is correct
- Ensure API endpoint accepts POST requests
- Check browser console for CORS errors

### Data not saving?
- Check browser's LocalStorage is enabled
- Ensure you clicked "Stop & Save"
- Try exporting data as backup

## 🚀 Future Enhancements

- [ ] Multiple timers for different subjects
- [ ] Pomodoro timer mode
- [ ] Study goals and targets
- [ ] Weekly/monthly reports
- [ ] Dark mode
- [ ] Mobile app version
- [ ] Social features (study groups)
- [ ] Integration with calendar apps

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share with fellow students!

## 💡 Tips for Best Results

1. **Be Consistent**: Study at the same times daily
2. **Use Notes**: Describe what you studied for better tracking
3. **Check Analytics**: Review your patterns weekly
4. **Set Goals**: Aim for streak maintenance
5. **Export Regularly**: Backup your data monthly
6. **Stay Honest**: Pause when you're not actually studying

---

**Happy Studying! 📚✨**

Made with ❤️ for students everywhere