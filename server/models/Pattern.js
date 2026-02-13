const mongoose = require('mongoose');

const PatternSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pattern: [{
        type: {
            type: String,
            enum: ['M', 'N', 'F', 'Fe'],
            required: true
        },
        days: {
            type: Number,
            required: true,
            min: 1,
            max: 15
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Pattern', PatternSchema);
