const mongoose = require("mongoose");
const moment = require('moment');

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: "no photo",
  },
  creteAt: {
    type: Date,
    default: moment().format('YYYY-MM-DD'),
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, ],
  comments: [{
    text: String,
    pic: {
      type: String,
      default: "no photo",
    },
    created: {
      type: Date,
      default: moment().format('YYYY-MM-DD'),
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", postSchema);