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

    if (book.stock <= 0) {
      return res.status(400).json({ msg: 'Book is out of stock!' });
    }

    // jika berhasil maka kurangi 1 dari stok
    book.stock -= 1;
    await book.save();

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

const getBorrowedBookByIdUser = async (req, res) => {
  try {
    const { id_borrower } = req.params;

    const borrowedBooks = await BorrowedBook.find({ id_borrower, status: 'borrowed' }).populate('id_book', 'book_title author category').sort({ borrowed_date: -1 });

    const returnedBooks = await BorrowedBook.find({ id_borrower, status: 'returned' }).populate('id_book', 'book_title author category').sort({ return_date: -1 });

    res.status(200).json({
      msg: 'Successfully retrieved borrowed books',
      borrowed: borrowedBooks,
      returned: returnedBooks,
    });
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

    if (borrowedBook.status === 'returned') {
      return res.status(400).json({ msg: 'This book has already been returned!' });
    }

    const book = await Book.findById(borrowedBook.id_book);
    if (!book) {
      return res.status(404).json({ msg: 'Book record not found!' });
    }

    borrowedBook.status = 'returned';
    borrowedBook.return_date = new Date();

    // kembalikan jumlah stok seperti semula
    book.stock += 1;
    await book.save();
    await borrowedBook.save();
    res.status(200).json({ msg: 'Book returned successfully!', borrowedBook });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { borrowBook, getHistoryBorrowedBooks, getBorrowedBook, getBorrowedBookByIdUser, returnBook };
