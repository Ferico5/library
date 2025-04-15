const express = require('express');
const { createBook, getBook, getBookById, updateBook, deleteBook, getBookRecommendations } = require('../controllers/BookController.js');

const router = express.Router();

router.post('/book', createBook);
router.get('/book', getBook);
router.get('/book/:id', getBookById);
router.put('/book/:id', updateBook);
router.delete('/book/:id', deleteBook);
router.get('/recommendation/:id', getBookRecommendations);

module.exports = router;
