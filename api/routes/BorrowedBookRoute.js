const express = require('express');
const { borrowBook, getHistoryBorrowedBooks, getBorrowedBook, getBorrowedBookByIdUser, returnBook } = require('../controllers/BorrowedBookController.js');

const router = express.Router();

router.post('/borrow-book', borrowBook);
router.get('/history-borrow-book', getHistoryBorrowedBooks);
router.get('/borrow-book', getBorrowedBook);
router.get('/borrow-book/:id_borrower', getBorrowedBookByIdUser);
router.put('/borrow-book/:id', returnBook);

module.exports = router;
