const mongoose = require('mongoose');

const activeSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Optional: Automatically delete expired sessions from the DB
activeSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ActiveSession', activeSessionSchema);