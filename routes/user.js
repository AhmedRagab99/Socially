const express = require('express');
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const user = require('../controller/user');


router.get('/:userId', requireLogin, user.getUser);
router.get('/', requireLogin, user.allUsers);


router.put('/follow', requireLogin, user.followUser);
router.put('/unfollow', requireLogin, user.unFollowUser);


router.post('/search', requireLogin, user.searchUser);

module.exports = router