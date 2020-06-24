const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "no photo"
    },
    creteAt: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        text: String,
        created: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


module.exports = mongoose.model("Post", postSchema);