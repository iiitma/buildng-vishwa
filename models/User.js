const mongoose = require('mongoose');
const Roles = require('./Roles');

const UserSchema =  new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 255,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 255,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 255,
    },
    hash_password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    role: {
        type: String,
        default: Roles.USER,
        enum: Roles.ALL
    },
    profile: {},
    isApproved: {
        type: Boolean,  
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true,
});

const User = mongoose.model('User', UserSchema)

module.exports = User