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
git clone https://github.com/poll-app.git
cd poll-app
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

## 📁 Project Structure

```
poll-app/
│
├── backend/                      # Node.js + Express + Socket.io
│   ├── server.js                # Main server (API + WebSocket)
│   ├── database.js              # JSON file storage handler
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment template
│   └── database.json            # Auto-created (stores all data)
│
├── frontend/                     # React + Vite
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   └── Header.css
│   │   ├── pages/               # Route pages
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Home.css
│   │   │   ├── CreatePoll.jsx   # Poll creation form
│   │   │   ├── CreatePoll.css
│   │   │   ├── PollView.jsx     # Voting & results page
│   │   │   └── PollView.css
│   │   ├── utils/               # Helper utilities
│   │   │   ├── api.js           # Backend API client
│   │   │   └── storage.js       # localStorage utilities
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html               # HTML entry point
│   ├── vite.config.js           # Vite configuration
│   ├── package.json             # Frontend dependencies
│   └── .env.example             # Environment template
│
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

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

**Code Example:**
```javascript
const ip = getClientIP(req);
if (await db.hasIPVoted(pollId, ip)) {
  return res.status(403).json({ 
    error: 'You have already voted in this poll',
    code: 'ALREADY_VOTED'
  });
}
```

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

**Code Example:**
```javascript
// Check if already voted
if (storage.hasVoted(pollId)) {
  setHasVoted(true);
}

// After successful vote
storage.markAsVoted(pollId);
```

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

They do **NOT** prevent determined attackers with technical knowledge (VPNs, multiple devices, browser automation), but this is acceptable for most polling use cases where the goal is casual abuse prevention, not enterprise-grade security.

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

Response (201):
{
  "pollId": "xK9mP2vQw1",
  "shareUrl": "http://localhost:5173/poll/xK9mP2vQw1",
  "poll": {
    "id": "xK9mP2vQw1",
    "question": "What's your favorite color?",
    "options": [
      { "id": "abc123", "text": "Red", "votes": 0 },
      { "id": "def456", "text": "Blue", "votes": 0 },
      { "id": "ghi789", "text": "Green", "votes": 0 },
      { "id": "jkl012", "text": "Yellow", "votes": 0 }
    ],
    "totalVotes": 0,
    "createdAt": "2026-02-14T10:30:00.000Z"
  }
}
```

### Get Poll
```http
GET /api/polls/:pollId

Response (200):
{
  "poll": { /* poll object */ },
  "hasVoted": false  // true if IP already voted
}

Response (404):
{
  "error": "Poll not found"
}
```

### Submit Vote
```http
POST /api/polls/:pollId/vote
Content-Type: application/json

Request Body:
{
  "optionId": "abc123"
}

Response (200):
{
  "success": true,
  "poll": { /* updated poll with new vote counts */ },
  "message": "Vote recorded successfully"
}

Response (403):
{
  "error": "You have already voted in this poll",
  "code": "ALREADY_VOTED"
}
```

### Health Check
```http
GET /api/health

Response (200):
{
  "status": "ok",
  "polls": 5  // number of polls in database
}
```

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

---

## 🚢 Deployment

### Recommended Platforms

| Service | Type | Free Tier | Best For |
|---------|------|-----------|----------|
| **Railway** | Backend | ✅ $5 credit/month | Node.js apps |
| **Render** | Backend | ✅ 750 hrs/month | Full-stack apps |
| **Vercel** | Frontend | ✅ Unlimited | React/Next.js |
| **Netlify** | Frontend | ✅ 100GB bandwidth | Static sites |

### Quick Deploy Guide

#### 1️⃣ Deploy Backend (Railway)

```bash
# Install Railway CLI
npm install -g railway

# Login and deploy
cd backend
railway login
railway init
railway up
```

Set environment variables in Railway dashboard:
- `FRONTEND_URL` = Your Vercel URL (e.g., `https://poll-app.vercel.app`)
- `NODE_ENV` = `production`

Copy your Railway backend URL (e.g., `https://poll-app-production.up.railway.app`)

#### 2️⃣ Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL` = Your Railway backend URL

#### 3️⃣ Update CORS

Update `backend/.env` with your final frontend URL and redeploy.

---

## 🧪 Testing

### Manual Testing Checklist

#### Poll Creation
- [ ] Create poll with 2 options → Success
- [ ] Create poll with 10 options → Success
- [ ] Try creating with 1 option → Error message shown
- [ ] Try empty question → Error message shown
- [ ] Try duplicate options → Error message shown

#### Voting
- [ ] Vote on a poll → Results update
- [ ] Try voting again → Blocked with message
- [ ] Clear localStorage → Still blocked (IP check)
- [ ] Open in incognito → Can vote again

#### Real-Time Updates
- [ ] Open poll in 2 browser tabs
- [ ] Vote in tab 1 → Tab 2 updates instantly
- [ ] No page refresh needed

#### Persistence
- [ ] Create poll
- [ ] Stop backend server
- [ ] Restart backend server
- [ ] Poll still exists and accessible

#### Shareable Links
- [ ] Copy share link
- [ ] Open in new tab → Poll loads
- [ ] Share with another device → Works

---

## 🐛 Troubleshooting

### Backend Issues

**Error: `EADDRINUSE: address already in use :::3001`**

Solution 1 - Kill the process:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

Solution 2 - Change port:
```bash
# Edit backend/.env
PORT=3002
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
3. Make sure testing in separate tabs (not same tab refreshed)

---

## 📝 Edge Cases Handled

This application properly handles the following edge cases:

| Edge Case | Solution |
|-----------|----------|
| Poll doesn't exist | Returns 404 with friendly error page |
| Empty/invalid options | Validates minimum 2 options, filters empty strings |
| Duplicate options | Prevents poll creation with duplicate choices |
| Already voted | Shows message, disables voting UI |
| Network failures | Displays error messages with retry capability |
| Character limits | Question (200 chars), Options (100 chars) |
| Connection loss | Socket.io auto-reconnects, updates resume |
| Concurrent votes | Server-side locking prevents race conditions |
| Zero votes display | Results show 0% gracefully |
| Mobile devices | Responsive layout adapts to screen size |

---

## 📋 Assignment Requirements ✅

This project fulfills all assignment criteria:

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Poll creation with 2+ options | ✅ | `CreatePoll.jsx` with validation |
| Shareable link generation | ✅ | Unique nanoid + URL construction |
| Anyone can vote via link | ✅ | No authentication required |
| Real-time updates | ✅ | Socket.io WebSocket rooms |
| 2 anti-abuse mechanisms | ✅ | IP tracking + localStorage |
| Persistence | ✅ | JSON file storage (database.json) |
| Deployment ready | ✅ | Environment configs included |
| Documentation | ✅ | Complete README + inline comments |

---

## 🔮 Known Limitations & Future Improvements

### Current Limitations

1. **JSON File Storage** - Works well for small-to-medium traffic, but PostgreSQL/MongoDB recommended for heavy use
2. **Basic Anti-Abuse** - Determined users with technical knowledge can bypass protections
3. **No Authentication** - Anyone can create polls (simple but limits advanced features)
4. **No Poll Management** - Creators cannot edit or delete polls after creation
5. **No Analytics** - No view counts, unique visitors, or voting patterns
6. **No Rate Limiting** - High-frequency poll creation not throttled

### Planned Improvements

- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] User authentication (optional accounts for creators)
- [ ] Poll editing and deletion
- [ ] Time-limited polls (auto-close after deadline)
- [ ] Multiple choice voting (select multiple options)
- [ ] Results privacy (hide until voting closes)
- [ ] Advanced analytics dashboard
- [ ] Email verification for high-security polls
- [ ] Poll templates and categories
- [ ] Export results (CSV/PDF)
- [ ] Custom themes and branding
- [ ] Webhooks for vote notifications

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Real-time powered by [Socket.io](https://socket.io/)
- Styled with custom CSS and [Google Fonts](https://fonts.google.com/)
- Icons from Unicode emojis

---

## 📚 Learning Resources

This project is perfect for learning:
- Full-stack JavaScript development
- WebSocket real-time communication
- RESTful API design
- React hooks and component architecture
- Client-server architecture patterns
- Anti-abuse and security patterns
- File-based data persistence

---

## 💬 Support

If you have any questions or run into issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Edge Cases](#-edge-cases-handled) documentation
3. Open a GitHub Issue with:
   - Your environment (OS, Node version)
   - Steps to reproduce the problem
   - Error messages (if any)

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

Built with ❤️ using React, Node.js, and Socket.io
