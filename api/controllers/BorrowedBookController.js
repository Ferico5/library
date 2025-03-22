const BorrowedBook = require('../models/BorrowedBookModel.js');
const Book = require('../models/BookModel.js');
const User = require('../models/UserModel.js');

const borrowBook = async (req, res) => {
  try {
    const { id_book, id_borrower } = req.body;

    const book = await Book.findById(id_book);
    if (!book) {
      return res.status(404).json({ msg: 'Book not found!' });
    }

    const user = await User.findById(id_borrower);
    if (!user) {
      return res.status(404).json({ msg: 'User not found!' });
    }

    const newBorrow = new BorrowedBook({
      id_book,
      id_borrower,
    });

    await newBorrow.save();
    res.status(201).json({ msg: 'Book borrowed successfully!', newBorrow });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getHistoryBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find().populate('id_book', 'book_title author category').populate('id_borrower', 'full_name email');

    // Update status overdue jika due_date sudah terlewati
    borrowedBooks.forEach(async (borrow) => {
      if (!borrow.return_date && new Date() > borrow.due_date) {
        borrow.status = 'overdue';
        await borrow.save();
      }
    });

    res.status(200).json(borrowedBooks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getBorrowedBook = async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find({ status: { $ne: 'returned' } })
      .populate('id_book', 'book_title author category')
      .populate('id_borrower', 'full_name email');

    res.status(200).json(borrowedBooks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    const borrowedBook = await BorrowedBook.findById(id);
    if (!borrowedBook) {
      return res.status(404).json({ msg: 'Borrow record not found!' });
    }

    borrowedBook.status = 'returned';
    borrowedBook.return_date = new Date();

    await borrowedBook.save();
    res.status(200).json({ msg: 'Book returned successfully!', borrowedBook });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { borrowBook, getHistoryBorrowedBooks, getBorrowedBook, returnBook };
