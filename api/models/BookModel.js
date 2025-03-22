const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  book_title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  published_date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);
