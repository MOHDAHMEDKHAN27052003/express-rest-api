const express = require("express");
const router = express.Router();
const { signupUser, userProfile } = require('../controllers/userController');
const { validateUser, handleValidationErrors } = require("../middleware/validation");

router.post('/signup', validateUser, handleValidationErrors, signupUser);

router.get('/:id', userProfile);

module.exports = router;