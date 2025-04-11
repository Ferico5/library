const express = require('express');
const { reserveBook, getReservedBook, updateBorrowStatus, getHistoryBorrowedBooks, getBorrowedBook, getOverdueBook, getBorrowedBookByIdUser, returnBook } = require('../controllers/BorrowedBookController.js');

const router = express.Router();

router.post('/reserve-book', reserveBook);
router.get('/reserve-book', getReservedBook);
router.put('/reserve-book/:id', updateBorrowStatus);
router.get('/history-borrow-book', getHistoryBorrowedBooks);
router.get('/borrow-book', getBorrowedBook);
router.get('/overdue-book', getOverdueBook);
router.get('/borrow-book/:id_borrower', getBorrowedBookByIdUser);
router.put('/borrow-book/:id', returnBook);

module.exports = router;
