const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
    playerName: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);