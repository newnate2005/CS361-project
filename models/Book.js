const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    length: String,
    timesRead: { type: Number, default: 0 },
    review: String,
    genre: String,
    image: String  // You could store an image URL or file path here
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;

