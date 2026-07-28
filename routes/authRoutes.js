const express = require("express");
const {signup, signout, signin, updateTokens} = require("../controllers/authController");
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.post('/update-tokens', updateTokens);

module.exports = router;