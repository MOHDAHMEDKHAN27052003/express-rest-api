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
        const limit = parseInt(req.query.limit) || 4;

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

module.exports = {
    createBook,
    getAllBooks
};