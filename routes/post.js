const express = require("express");
const post = require("../controller/post");
const requireLogin = require("../middlewares/requireLogin");

const router = express.Router();



router.post('/create', requireLogin, post.createPost);


router.get('/all', post.getAllPosts);
router.get('/me', requireLogin, post.getMyPost);
router.get('/followposts', requireLogin, post.getFollowingPosts);


router.delete('/delete/:postId', requireLogin, post.deletePost);

router.put('/like', requireLogin, post.likePost);
router.put('/unlike', requireLogin, post.unLikePost);
router.put('/comment', requireLogin, post.comment);
router.put('/uncomment', requireLogin, post.uncomment);
router.put('/uncomment', requireLogin, post.uncomment);






module.exports = router;