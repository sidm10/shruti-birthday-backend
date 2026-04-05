const mongoose = require('mongoose');

const huntEntrySchema = new mongoose.Schema({
    hunter: { type: String, required: true, trim: true },
    items: { type: Map, of: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HuntEntry', huntEntrySchema);