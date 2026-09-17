const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { createBook, getAllBooks, getBookById, deleteBookById, updateBookById } = require('../controllers/bookController');
const authorize = require('../middlewares/authorize');

router.get('/', getAllBooks);
router.post('/create', authenticate, authorize, createBook);
router.get('/:id', getBookById);
router.delete('/:id', authenticate, authorize, deleteBookById);
router.patch('/:id', authenticate, authorize, updateBookById);

module.exports = router;