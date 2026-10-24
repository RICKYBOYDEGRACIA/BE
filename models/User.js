const mongoose = require('mongoose');

const userModel = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: [2],
        },
        middleName: {
            type: String,
            required: true,
            trim: true,
            minLength: [2],
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minLength: [2],
        },
        age: {
            type: Number,
            required: true,
            min: [18, "Minimum required age should be 18+"],
        },
        location: {
            city: {
                type: String,
                required: true,
                trim: true
            },
            barangay: {
                type: String,
                required: true,
                trim: true
            }
        },
        role:{
            type: String,
            default: 'user',
            enum:['user', 'admin'],
            index: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userModel)