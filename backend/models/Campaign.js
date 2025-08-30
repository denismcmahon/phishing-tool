const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['invoice', 'password-reset', 'hr-alert'] },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, default: 'draft', enum: ['draft', 'running', 'completed'] },
    emails: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            status: { type: String, default: 'sent', enum: ['sent', 'clicked', 'reported', 'ignored'] },

        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);