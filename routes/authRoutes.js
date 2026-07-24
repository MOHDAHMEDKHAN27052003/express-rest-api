const express = require("express");
const {signup, refreshToken} = require("../controllers/authController");
const router = express.Router();

router.post('/signup', signup);
router.post('/refresh-token', refreshToken)

module.exports = router;