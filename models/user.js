const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
    },
    email: {
        type: String,
        trim: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    pic: {
        type: String,
        default: "https://tse2.mm.bing.net/th?id=OIP.PB3QCTk1kCZZ6ZvvVqpM5gHaHa&pid=Api&P=0&w=300&h=300"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});
module.exports = mongoose.model("User", userSchema);