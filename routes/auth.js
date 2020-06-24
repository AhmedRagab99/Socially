const express = require("express");
const auth = require("../controller/auth");

const router = express.Router();

router.post("/signup", auth.signUp);
router.post("/signin", auth.signIn);

module.exports = router;