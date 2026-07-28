const express = require("express");
const {signup, signout, signin} = require("../controllers/authController");
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

module.exports = router;