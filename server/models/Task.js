const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // e.g., "14:30"
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'High'],
        default: 'Low'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
