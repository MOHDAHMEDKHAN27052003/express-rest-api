const express = require("express");
const {signup, signout} = require("../controllers/authController");
const router = express.Router();

router.post('/signup', signup);
router.post('/signout', signout);

module.exports = router;