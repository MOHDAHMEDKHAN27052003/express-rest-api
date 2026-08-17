const Book = require('../models/Book');
const errorResponse = require('../utils/serverError');

const createBook = async (req, res) => {
    try {
        const { 
            title, 
            author, 
            ISBN, 
            publicationYear,
            genre, 
            quantity 
        } = req.body;

        const existingBook = await Book.findOne({ ISBN });
        if (existingBook) {
            return res.status(400).json({
                success: false,
                message: 'Book with this ISBN already exists'
            });
        }

        const book = new Book({
            title,
            author,
            ISBN,
            publicationYear,
            genre,
            quantity,
            createdBy: req.user._id
        });

        await book.save();

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });

    } catch (error) {
        errorResponse(res, error);
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        
        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        errorResponse(res, error);
    }
};

module.exports = {
    createBook,
    getAllBooks
};