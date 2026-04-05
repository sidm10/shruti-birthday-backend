require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const LeaderboardEntry = require('./models/LeaderboardEntry');
const Wish = require('./models/Wish');
const HuntEntry = require('./models/HuntEntry');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// ============================================================
// LEADERBOARD
// ============================================================

// Get top 20 scores
app.get('/api/leaderboard', async (req, res) => {
    try {
        const entries = await LeaderboardEntry.find()
            .sort({ score: -1, createdAt: 1 })
            .limit(20);
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// Submit a score
app.post('/api/leaderboard', async (req, res) => {
    try {
        const { playerName, score } = req.body;
        if (!playerName || score === undefined) {
            return res.status(400).json({ error: 'playerName and score are required' });
        }
        const entry = await LeaderboardEntry.create({ playerName, score });
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// ============================================================
// WISHES
// ============================================================

// Get all wishes
app.get('/api/wishes', async (req, res) => {
    try {
        const wishes = await Wish.find().sort({ createdAt: -1 });
        res.json(wishes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wishes' });
    }
});

// Post a wish
app.post('/api/wishes', async (req, res) => {
    try {
        const { name, message } = req.body;
        if (!name || !message) {
            return res.status(400).json({ error: 'name and message are required' });
        }
        const wish = await Wish.create({ name, message });
        res.status(201).json(wish);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save wish' });
    }
});

// ============================================================
// SCAVENGER HUNT
// ============================================================

// Submit hunt entry
app.post('/api/hunt', async (req, res) => {
    try {
        const { hunter, items } = req.body;
        if (!hunter || !items) {
            return res.status(400).json({ error: 'hunter and items are required' });
        }
        const entry = await HuntEntry.create({ hunter, items });
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save hunt entry' });
    }
});

// Get hunt entries (host only, PIN protected)
app.get('/api/hunt', async (req, res) => {
    try {
        const pin = req.headers['x-host-pin'];
        if (pin !== process.env.HOST_PIN) {
            return res.status(401).json({ error: 'Invalid PIN' });
        }
        const entries = await HuntEntry.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch hunt entries' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});