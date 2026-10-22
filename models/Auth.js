const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Auth', authSchema);