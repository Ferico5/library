const BorrowedBook = require('../models/BorrowedBookModel.js');
const Book = require('../models/BookModel.js');
const User = require('../models/UserModel.js');

const reserveBook = async (req, res) => {
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

    const newReservation = new BorrowedBook({
      id_book,
      id_borrower,
      status: 'reserved',
      borrow_date: null,
      due_date: null,
    });

    await newReservation.save();
    res.status(201).json({ msg: 'Book reserved successfully!', newReservation });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getReservedBook = async (req, res) => {
  try {
    const reservedBooks = await BorrowedBook.find({ status: 'reserved' }).populate('id_book', 'book_title author').populate('id_borrower', 'full_name');

    if (!reservedBooks) {
      return res.status(404).json({ msg: 'Reserve record not found!' });
    }

    res.status(200).json({ msg: 'Successfully retrieved reserved books', reservedBooks });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateBorrowStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const borrowedBook = await BorrowedBook.findById(id);
    if (!borrowedBook) {
      return res.status(404).json({ msg: 'Borrow record not found!' });
    }

    if (status === 'borrowed') {
      if (borrowedBook.status !== 'reserved') {
        return res.status(400).json({ msg: 'Cannot change status to borrowed!' });
      }

      const book = await Book.findById(borrowedBook.id_book);
      if (!book || book.stock <= 0) {
        return res.status(400).json({ msg: 'Book is out of stock!' });
      }

      book.stock -= 1;
      await book.save();

      borrowedBook.status = 'borrowed';
      borrowedBook.borrow_date = new Date(Date.now());
      borrowedBook.due_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await borrowedBook.save();
    } else if (status === 'canceled') {
      if (borrowedBook.status !== 'reserved') {
        return res.status(400).json({ msg: 'Only reserved books can be canceled!' });
      }

      borrowedBook.status = 'canceled';
      await borrowedBook.save();
    } else {
      borrowedBook.status = status;
      await borrowedBook.save();
    }

    res.status(200).json({ msg: `Status updated to ${status}`, borrowedBook });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getHistoryBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find().populate('id_book', 'book_title author category').populate('id_borrower', 'full_name email');

    borrowedBooks.forEach(async (borrow) => {
      if (borrow.status === 'borrowed' && borrow.due_date && new Date() > borrow.due_date && !borrow.return_date) {
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

// const getBorrowedBook = async (req, res) => {
//   try {
//     const borrowedBooks = await BorrowedBook.find({ status: { $ne: 'returned', } })
//       .populate('id_book', 'book_title author category')
//       .populate('id_borrower', 'full_name email');

//     res.status(200).json(borrowedBooks);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

const getBorrowedBookByIdUser = async (req, res) => {
  try {
    const { id_borrower } = req.params;

    const reservedBooks = await BorrowedBook.find({ id_borrower, status: 'reserved' }).populate('id_book', 'book_title author category');

    const borrowedBooks = await BorrowedBook.find({ id_borrower, status: 'borrowed' }).populate('id_book', 'book_title author category').sort({ borrowed_date: -1 });

    const returnedBooks = await BorrowedBook.find({ id_borrower, status: 'returned' }).populate('id_book', 'book_title author category').sort({ return_date: -1 });

    const overdueBooks = await BorrowedBook.find({ id_borrower, status: 'overdue' }).populate('id_book', 'book_title author category');

    res.status(200).json({
      msg: 'Successfully retrieved borrowed books',
      reserved: reservedBooks,
      borrowed: borrowedBooks,
      returned: returnedBooks,
      overdue: overdueBooks,
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

    if (borrowedBook.status !== 'borrowed') {
      return res.status(400).json({ msg: 'Only borrowed books can be returned!' });
    }

    const book = await Book.findById(borrowedBook.id_book);
    if (!book) {
      return res.status(404).json({ msg: 'Book record not found!' });
    }

    book.stock += 1;
    await book.save();

    borrowedBook.status = 'returned';
    borrowedBook.return_date = new Date();
    await borrowedBook.save();

    res.status(200).json({ msg: 'Book returned successfully!', borrowedBook });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { reserveBook, getReservedBook, updateBorrowStatus, getHistoryBorrowedBooks, getBorrowedBookByIdUser, returnBook };
