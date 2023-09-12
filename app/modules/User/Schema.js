var mongoose = require('mongoose');
var schema = mongoose.Schema;
const _ = require("lodash");

var user = new schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    emailId: { type: String, unique: true },
    password: { type: Buffer },
    photo: { type: String, required: false },
    emailVerificationStatus: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    mobile: { type: String },
    verificationToken: { type: String },
    verificationTokenCreationTime: { type: Date },
    fbId: { type: String },
    googleId: { type: String },
    twitterId: { type: String },
    instagramId: { type: String },
    forgotToken: { type: String },
    forgotTokenCreationTime: { type: Date },
    deviceToken: { type: String },
    device: { type: String },
    role: { type: String },
    previouslyUsedPasswords: [{ type: Buffer }],
    passwordUpdatedAt: { type: Date },
    lastSeen: { type: Date },
    failedAttempts: [{ ip: { type: String }, attempts: { type: Number }, blockedDate: { type: Date }, isBlocked: { type: Boolean, default: false } }]
}, {
    timestamps: true
});


let Users = mongoose.model('User', user);
module.exports = {
    Users,
    user
}