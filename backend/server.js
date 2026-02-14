import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with PostgreSQL/MongoDB for production)
const polls = new Map();
const votes = new Map();

// Helper function to get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.socket.remoteAddress || 
         'unknown';
}

// Helper function to check if IP has voted
function hasIPVoted(pollId, ip) {
  const pollVotes = votes.get(pollId) || [];
  return pollVotes.some(vote => vote.ip === ip);
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', polls: polls.size, totalVotes: votes.size });
});

// Create a new poll
app.post('/api/polls', (req, res) => {
  try {
    const { question, options } = req.body;

    // Validation
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required' });
    }

    // Filter empty options and check for duplicates
    const validOptions = options
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    if (validOptions.length < 2) {
      return res.status(400).json({ error: 'At least 2 valid options are required' });
    }

    const uniqueOptions = [...new Set(validOptions)];
    if (uniqueOptions.length !== validOptions.length) {
      return res.status(400).json({ error: 'Duplicate options are not allowed' });
    }

    // Create poll
    const pollId = nanoid(10);
    const poll = {
      id: pollId,
      question: question.trim(),
      options: validOptions.map(opt => ({
        id: nanoid(8),
        text: opt,
        votes: 0
      })),
      createdAt: new Date().toISOString(),
      totalVotes: 0
    };

    polls.set(pollId, poll);
    votes.set(pollId, []);

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/poll/${pollId}`;

    res.status(201).json({
      pollId,
      shareUrl,
      poll
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

// Get poll by ID
app.get('/api/polls/:pollId', (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = polls.get(pollId);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if this IP has already voted
    const ip = getClientIP(req);
    const hasVoted = hasIPVoted(pollId, ip);

    res.json({
      poll,
      hasVoted
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

// Submit a vote
app.post('/api/polls/:pollId/vote', (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionId } = req.body;
    const ip = getClientIP(req);

    // Get poll
    const poll = polls.get(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Anti-abuse check #1: IP-based voting prevention
    if (hasIPVoted(pollId, ip)) {
      return res.status(403).json({ 
        error: 'You have already voted in this poll',
        code: 'ALREADY_VOTED'
      });
    }

    // Validate option
    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(400).json({ error: 'Invalid option' });
    }

    // Record vote
    option.votes++;
    poll.totalVotes++;

    const voteRecord = {
      optionId,
      ip,
      timestamp: new Date().toISOString()
    };

    const pollVotes = votes.get(pollId);
    pollVotes.push(voteRecord);

    // Emit real-time update to all connected clients watching this poll
    io.to(`poll-${pollId}`).emit('vote-update', {
      poll,
      totalVotes: poll.totalVotes
    });

    res.json({
      success: true,
      poll,
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join a poll room for real-time updates
  socket.on('join-poll', (pollId) => {
    socket.join(`poll-${pollId}`);
    console.log(`Client ${socket.id} joined poll ${pollId}`);
  });

  // Leave a poll room
  socket.on('leave-poll', (pollId) => {
    socket.leave(`poll-${pollId}`);
    console.log(`Client ${socket.id} left poll ${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Polls: ${polls.size}`);
});

export default app;
