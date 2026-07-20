const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require('../controllers/userController');
const signup = require("../controllers/authController");

router.get('/:id', getUser);
router.patch('/:id', updateUser);

module.exports = router;