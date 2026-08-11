const express = require("express");
const authenticate = require("../middlewares/auth");
const { getProfile, updateProfile } = require("../controllers/userController");

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

module.exports = router;