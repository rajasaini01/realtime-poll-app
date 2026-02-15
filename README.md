# 🗳️ PollVault - Real-Time Polling Application

A modern, full-stack polling application with real-time updates, anti-abuse protection, and persistent storage. Built with React, Node.js, and Socket.io.

![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- ✅ **Create Polls** - Easy poll creation with custom questions and options
- ✅ **Shareable Links** - Each poll gets a unique, shareable URL
- ✅ **Real-Time Updates** - See votes come in live without refreshing the page
- ✅ **Anti-Abuse Protection** - Dual-layer system prevents duplicate voting
- ✅ **Persistent Storage** - All polls and votes saved permanently to JSON file
- ✅ **Mobile Responsive** - Beautiful UI that works on all devices
- ✅ **No Authentication Required** - Frictionless voting experience

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/rajasaini01/realtime-poll-app.git
cd realtime-poll-app
```

#### 2️⃣ Setup Backend
Open your **first terminal**:
```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
🚀 Server running on port 3001
📊 Polls loaded: 0
💾 Database: database.json (persistent storage)
```

#### 3️⃣ Setup Frontend
Open a **second terminal** (keep backend running):
```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 4️⃣ Open in Browser
Navigate to: **http://localhost:5173**

🎉 **You're ready to create your first poll!**

---

## 📖 How to Use

### Creating a Poll
1. Click **"Create Your First Poll"**
2. Enter your question (e.g., "What's your favorite programming language?")
3. Add at least 2 options (e.g., "JavaScript", "Python", "TypeScript", "Go")
4. Click **"Create Poll"**
5. You'll be redirected to your new poll!

### Sharing a Poll
1. On the poll page, click the **"🔗 Share"** button
2. The link is copied to your clipboard
3. Share via email, chat, social media, etc.
4. Anyone with the link can vote!

### Voting
1. Open the poll link
2. Select your choice
3. Click **"Submit Vote"**
4. See instant results with percentage breakdowns

### Watching Real-Time Updates
1. Open the same poll in **two different browser tabs**
2. Vote in one tab
3. Watch the other tab **update instantly** without refreshing! ✨

---

## 🏗️ Tech Stack

### Frontend
- **React 18.2** - UI framework
- **React Router 6** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Vite 5** - Build tool and dev server
- **CSS3** - Custom styling with variables

### Backend
- **Node.js** - Runtime environment
- **Express 4.18** - Web framework
- **Socket.io 4.6** - WebSocket server
- **nanoid** - Unique ID generation
- **JSON File Storage** - Persistent data

---

## 🛡️ Anti-Abuse Mechanisms

This application implements **two independent anti-abuse mechanisms** to ensure fair voting:

### 1. Server-Side IP Tracking ✅

**Implementation:** `backend/server.js` + `backend/database.js`

**How it works:**
- Captures the voter's IP address on each vote
- Stores IP with vote record in `database.json`
- Checks if IP has already voted before accepting new votes
- Returns 403 error if duplicate vote detected

**What it prevents:**
- Multiple votes from the same network/device
- Rapid-fire voting attempts
- Basic bot attacks

**Known Limitations:**
- Users behind the same NAT/router share an IP (may block legitimate users)
- VPN/proxy users can change IP addresses to bypass
- Dynamic IPs may allow re-voting after IP reassignment
- Mobile users switching between WiFi/cellular get new IPs

---

### 2. Client-Side Browser Storage ✅

**Implementation:** `frontend/src/utils/storage.js` + `frontend/src/pages/PollView.jsx`

**How it works:**
- Stores poll ID in browser's `localStorage` when user votes
- Checks localStorage before showing voting UI
- Disables vote button if user has already voted
- Provides immediate feedback without server call

**What it prevents:**
- Accidental double-clicking submit button
- Page refresh attempting to vote again
- Same browser session voting twice

**Known Limitations:**
- Users can clear browser data/cookies to bypass
- Different browsers on same device can each vote
- Incognito/private browsing mode bypasses this check
- Does not work if localStorage is disabled

---

### Combined Effectiveness

Together, these mechanisms create a **reasonable barrier** against casual abuse while maintaining a **frictionless user experience**. They effectively block:

✅ Accidental double-clicks  
✅ Page refreshes attempting to re-vote  
✅ Basic repeat voting attempts  
✅ Same device/network voting multiple times  

---

## 📊 API Endpoints

### Create Poll
```http
POST /api/polls
Content-Type: application/json

Request Body:
{
  "question": "What's your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"]
}
```

### Get Poll
```http
GET /api/polls/:pollId
```

### Submit Vote
```http
POST /api/polls/:pollId/vote
Content-Type: application/json

Request Body:
{
  "optionId": "abc123"
}
```

---

## 🚢 Deployment

### Live Demo
- **Frontend:** [Your Vercel URL]
- **Backend:** [Your Render URL]

### Deploy Your Own

**Backend (Render):**
1. Sign up at [render.com](https://render.com)
2. Create New Web Service
3. Connect GitHub repo
4. Set Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`

**Frontend (Vercel):**
1. Sign up at [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Set Root Directory: `frontend`
4. Build Command: `npm run build`
5. Set environment variable: `VITE_API_URL=[Your Render URL]`

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:3001
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: `EADDRINUSE: address already in use`**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

**Error: `Cannot find module`**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### Frontend Issues

**Error: `Failed to fetch` or CORS errors**
1. Verify backend is running
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Check `backend/.env` has correct `FRONTEND_URL`
4. Restart both servers

**Error: Real-time updates not working**
1. Check browser console for Socket.io errors
2. Verify backend shows "Client connected" messages
3. Make sure testing in separate tabs

---

## 📝 Edge Cases Handled

| Edge Case | Solution |
|-----------|----------|
| Poll doesn't exist | Returns 404 with friendly error page |
| Empty/invalid options | Validates minimum 2 options, filters empty strings |
| Duplicate options | Prevents poll creation with duplicate choices |
| Already voted | Shows message, disables voting UI |
| Network failures | Displays error messages with retry capability |
| Character limits | Question (200 chars), Options (100 chars) |
| Connection loss | Socket.io auto-reconnects |
| Zero votes display | Results show 0% gracefully |
| Mobile devices | Responsive layout adapts to screen size |

---

## 📋 Assignment Requirements ✅

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Poll creation with 2+ options | ✅ | `CreatePoll.jsx` with validation |
| Shareable link generation | ✅ | Unique nanoid + URL construction |
| Anyone can vote via link | ✅ | No authentication required |
| Real-time updates | ✅ | Socket.io WebSocket rooms |
| 2 anti-abuse mechanisms | ✅ | IP tracking + localStorage |
| Persistence | ✅ | JSON file storage (database.json) |
| Deployment ready | ✅ | Environment configs included |
| Documentation | ✅ | Complete README |

---

## 🔮 Known Limitations & Future Improvements

### Current Limitations

1. **JSON File Storage** - Works for small-to-medium traffic
2. **Basic Anti-Abuse** - Can be bypassed with technical knowledge
3. **No Authentication** - Anyone can create polls
4. **No Poll Management** - Cannot edit or delete polls
5. **No Analytics** - No view counts or voting patterns

### Planned Improvements

- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] User authentication for poll creators
- [ ] Poll editing and deletion
- [ ] Time-limited polls
- [ ] Multiple choice voting
- [ ] Advanced analytics dashboard
- [ ] Email verification option
- [ ] Export results (CSV/PDF)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this for your projects!

---

## 👨‍💻 Author

**Raja Saini**
- GitHub: [@rajasaini01](https://github.com/rajasaini01)
- Repository: [realtime-poll-app](https://github.com/rajasaini01/realtime-poll-app)

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Real-time powered by [Socket.io](https://socket.io/)
- Styled with custom CSS and [Google Fonts](https://fonts.google.com/)

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

Built with ❤️ using React, Node.js, and Socket.io
