const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['M', 'N', 'F', 'Fe'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Shift', ShiftSchema);
