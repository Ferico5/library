import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewBook = () => {
  const navigate = useNavigate();

  const [book, setBook] = useState({
    book_title: '',
    author: '',
    published_date: '',
    category: '',
    stock: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book.book_title || !book.author || !book.published_date || !book.category || !book.stock) {
      setMessage('⚠️ All fields must be filled!');
      return;
    }

    try {
      await axios.post('http://localhost:8000/book', book);
      setBook({ book_title: '', author: '', published_date: '', category: '', stock: '' });
      navigate('/book-list');
    } catch (error) {
      console.log(error.message);
      setMessage('❌ Failed to Added New Book!');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">📚 Add New Book</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-semibold">Book Title</label>
        <input type="text" name="book_title" value={book.book_title} onChange={handleChange} placeholder="Enter book title" className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="text-sm font-semibold">Author</label>
        <input type="text" name="author" value={book.author} onChange={handleChange} placeholder="Enter author's name" className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="text-sm font-semibold">Published Date</label>
        <input type="date" name="published_date" value={book.published_date} onChange={handleChange} className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="text-sm font-semibold">Category</label>
        <input type="text" name="category" value={book.category} onChange={handleChange} placeholder="Enter category" className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label className="text-sm font-semibold">Stock</label>
        <input type="number" name="stock" value={book.stock} onChange={handleChange} placeholder="Enter stock quantity" className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

        {message && <p className="text-yellow-400">{message}</p>}

        <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold">
          ➕ Add Book
        </button>
      </form>
    </div>
  );
};

export default NewBook;
