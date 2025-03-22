const BookModel = require('../models/BookModel.js');

const createBook = async (req, res) => {
  try {
    const newBook = new BookModel(req.body);
    await newBook.save();

    res.status(201).json({ msg: 'Book created!' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getBook = async (req, res) => {
  try {
    const getBook = await BookModel.find();
    res.status(200).json({ msg: 'Successful getting books', getBook });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getBookById = async (req, res) => {
  try {
    const getBookById = await BookModel.findById(req.params.id);

    if (!getBookById) {
      return res.status(404).json({ msg: 'Book not found!' });
    }

    res.status(200).json({ msg: 'Successful getting book', getBookById });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const updateBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updateBook) {
      return res.status(404).json({ msg: 'Book not found!' });
    }
    res.status(200).json({ msg: 'Book updated!', book: updateBook });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleteBook = await BookModel.findByIdAndDelete(req.params.id);

    if (!deleteBook) {
      return res.status(404).json({ msg: 'Book not found!' });
    }
    res.status(200).json({ msg: 'Book deleted!' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createBook, getBook, getBookById, updateBook, deleteBook };
