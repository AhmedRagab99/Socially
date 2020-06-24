const User = require('../models/user');
const Post = require('../models/post');




// get user and posts by passes the userid
exports.getUser = (req, res) => {
    User.findOne({
            _id: req.params.userId
        })
        .select("name pic createdAt pic _id followers following")
        .then(user => {
            Post.find({
                    user: req.params.userId
                })
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({
                            error: err
                        })
                    }
                    res.json({
                        user,
                        posts
                    })
                })
        }).catch(err => {
            return res.status(404).json({
                error: err
            })
        })
};



exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(users);
    });
};


// follow and unfollow


exports.followUser = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {
            followers: req.user._id
        }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: req.body.followId
            }

        }, {
            new: true
        }).then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({
                error: err
            })
        })

    })
};


exports.unFollowUser = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {
            followers: req.user._id
        }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: req.body.unfollowId
            }

        }, {
            new: true
        }).then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({
                error: err
            })
        })

    })
};

// search users
exports.searchUser = (req, res) => {
    // for search 
    let userPattern = new RegExp(req.body.name)
    User.find({
            name: {
                $regex: userPattern
            }
        })
        .select("_id name pic email")
        .then(user => {
            res.status(200).json({
                user
            })
        })
        .catch(err => {
            console.log(err);
        })
};