const express = require("express");
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { validateUser, handleValidationErrors } = require("../middleware/validation");
const signup = require("../controllers/authController");

router.post('/signup', validateUser, handleValidationErrors, signup);

router.get('/:id', getProfile);

module.exports = router;