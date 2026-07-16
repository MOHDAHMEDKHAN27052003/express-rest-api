const express = require("express");
const router = express.Router();
const { signupUser } = require('../controllers/userController');
const { validateUser, handleValidationErrors } = require("../middleware/validation");

router.post('/signup', validateUser, handleValidationErrors, signupUser);

module.exports = router;