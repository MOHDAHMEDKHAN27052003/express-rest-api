const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String
    },
    author: { 
        type: String 
    },
    ISBN: { 
        type: Number, 
        unique: true
    },
    publicationYear: { 
        type: Date 
    },
    genre: { 
        type: String,
        enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Biography', 'History', 'Science', 'Poetry', 'Drama', 'Adventure', 'Young Adult', 'Children']
    },
    quantity: { 
        type: Number
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;