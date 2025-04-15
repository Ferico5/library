const BookModel = require('../models/BookModel.js');
const BorrowedBook = require('../models/BorrowedBookModel.js');

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

const getBookRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Cari semua buku yang sudah pernah dipinjam user
    const userBorrowedBooks = await BorrowedBook.find({ id_borrower: userId }).populate('id_book');

    const borrowedBookIds = userBorrowedBooks.map((borrow) => borrow.id_book._id.toString());
    const borrowedCategories = [...new Set(userBorrowedBooks.map((borrow) => borrow.id_book.category))];

    // Step 2: Cari buku lain dalam kategori yang sama, yang belum pernah dibaca
    let recommendedBooks = await BookModel.find({
      category: { $in: borrowedCategories },
      _id: { $nin: borrowedBookIds },
    }).limit(3);

    // Step 3: Kalau semua buku dalam kategori itu sudah dibaca, ambil random dari semua buku yang belum dibaca
    if (recommendedBooks.length < 3) {
      const remaining = 3 - recommendedBooks.length;
      const additionalBooks = await BookModel.aggregate([{ $match: { _id: { $nin: borrowedBookIds.map((id) => new require('mongoose').Types.ObjectId(id)) } } }, { $sample: { size: remaining } }]);
      recommendedBooks = [...recommendedBooks, ...additionalBooks];
    }

    res.status(200).json({
      msg: 'Book recommendations generated successfully',
      recommendedBooks,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createBook, getBook, getBookById, updateBook, deleteBook, getBookRecommendations };
