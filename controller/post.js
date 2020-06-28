const Post = require("../models/post");
const postValidator = require("../validator/post");
const user = require("../models/user");

exports.createPost = (req, res) => {
    const {
        text,
        pic
    } = req.body;
    if (!text) {
        return res.status(422).json({
            error: "please  add text to post ",
        });
    }
    req.user.password = undefined;
    const {
        errors,
        isValid
    } = postValidator(req.body);

    if (!isValid) {
        return res.status(422).json({
            error: errors,
        });
    }

    const userref = req.user;
    console.log(userref);
    const post = new Post({
        text,
        pic,
        createAt: Date.now,
        user: userref,
    });
    console.log(post);

    post
        .save()
        .then((post) => {
            res.status(200).json({
                post,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};






exports.getAllPosts = (req, res) => {
    Post.find()
        .populate("user", "name email _id pic createdAt")
        .then((posts) => {
            res.status(200).json({
                count: posts.length,

                posts: posts,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getMyPost = (req, res) => {
    Post.find({
            user: req.user._id,
        })
        .populate("user", "name email _id pic likes comment")
        .sort({
            creteAt: -1,
        })
        .then((myPosts) => {
            res
                .status(200)
                .json({
                    count: myPosts.length,
                    posts: myPosts,
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            return res.status(422).json({
                error: err,
            });
        });
};

exports.getFollowingPosts = (req, res) => {
    // check for the user in following
    Post.find({
            user: {
                $in: req.user.following,
            },
        })
        .populate("user", "name email _id pic likes comment")
        .sort({
            creteAt: -1,
        })
        .then((myPosts) => {
            res
                .status(200)
                .json({
                    count: myPosts.length,
                    posts: myPosts,
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            return res.status(422).json({
                error: err,
            });
        });
};

exports.deletePost = (req, res) => {
    Post.findOne({
            _id: req.params.postId,
        })
        .populate("user", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({
                    error: "cannot delete post Please try again",
                });
            }
            if (post.user._id.toString() === req.user._id.toString()) {
                post
                    .remove()
                    .then((result) => {
                        res.status(200).json({
                            message: "post deleted successfully",
                        });
                    })
                    .catch((err) => {
                        return res.status(422).json({
                            error: err,
                        });
                    });
            }
        });
};

exports.likePost = (req, res) => {
    Post.findByIdAndUpdate(
            req.body.postId, {
                $push: {
                    likes: [req.user._id],
                },
            }, {
                new: true,
            }
        )
        //let users = users.$push(req.user)
        .populate("user", "name email _id pic ")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    message: err,
                });
            } else {
                res.json(result);
            }
        });
};

exports.unLikePost = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId, {
            $pull: {
                likes: req.user._id,
            },
        }, {
            new: true,
        }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        } else {
            res.json(result);
        }
    });
};

exports.comment = (req, res) => {
    const comments = {
        text: req.body.text,
        user: [req.user._id],
    };
    //let users = users.$push(comments.user)
    Post.findOneAndUpdate(
            req.body.postId, {
                $push: {
                    comments: comments,
                },
            }, {
                new: true,
            }
        )

        .populate("comments.user", "name _id pic ")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    message: err,
                });
            } else {
                res.json(result);
            }
        });
};

exports.uncomment = (req, res) => {
    const comments = {
        text: req.body.text,
        user: [req.user._id],
    };
    Post.findOneAndUpdate(
            req.body.postId, {
                $pull: {
                    comments: comments,
                },
            }, {
                new: true,
            }
        )
        .populate("user", "name  _id ")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    message: err,
                });
            } else {
                res.json(result);
            }
        });
};

// with pagination
exports.getPosts = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 6;
    let totalItems;

    const posts = await Post.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then((count) => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate("comments", "text created")
                .populate("comments.postedBy", "_id name")
                .populate("postedBy", "_id name")
                .select("_id title body created likes")
                .limit(perPage)
                .sort({
                    created: -1,
                });
        })
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((err) => console.log(err));
};