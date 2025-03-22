const express = require('express');
const { borrowBook, getHistoryBorrowedBooks, getBorrowedBook, returnBook } = require('../controllers/BorrowedBookController.js');

const router = express.Router();

router.post('/borrow-book', borrowBook);
router.get('/history-borrow-book', getHistoryBorrowedBooks);
router.get('/borrow-book', getBorrowedBook);
router.put('/borrow-book/:id', returnBook);

module.exports = router;
