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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;

        const { genre, author, publicationYear } = req.query;
        const filter = {};

        if (genre) filter.genre = genre;
        if (author) filter.author = author;
        if (publicationYear) filter.publicationYear = publicationYear;

        const options = {
            page: page,
            limit: limit,
            sort: { createdAt: -1 }
        };

        const result = await Book.paginate(filter, options);

        res.status(200).json({
            success: true,
            data: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalItems: result.totalDocs,
                itemsPerPage: result.limit,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                nextPage: result.nextPage,
                prevPage: result.prevPage
            }
        });

    } catch (error) {
        errorResponse(res, error);
    }
};

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }

        errorResponse(res, error);
    }
};

const deleteBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBook = await Book.findByIdAndDelete(id);

        // Check if book exists
        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }
        
        errorResponse(res, error);
    }
};

const updateBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const allowedFields = [
            'title',
            'author',
            'publicationYear',
            'genre',
            'quantity'
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: `No valid fields provided. Allowed fields: ${allowedFields.join(', ')}`
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                returnDocument: 'after',
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }

        errorResponse(res, error)
    }
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    deleteBookById,
    updateBookById
};