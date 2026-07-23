const express = require("express");
const router = express.Router();
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const signup = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

router.get('/profile', authenticate, getUser);
router.patch('/profile', authenticate, updateUser);
router.delete('/profile', authenticate, deleteUser);

module.exports = router;