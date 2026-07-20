const express = require("express");
const router = express.Router();
const { getUser } = require('../controllers/userController');
const signup = require("../controllers/authController");

router.get('/:id', getUser);

module.exports = router;