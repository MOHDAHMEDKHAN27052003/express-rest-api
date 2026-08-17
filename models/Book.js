const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
        type: Number
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

bookSchema.plugin(mongoosePaginate);

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;