import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBook = () => {
  const { id_book } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    book_title: '',
    author: '',
    category: '',
    stock: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/book/${id_book}`)
      .then((response) => {
        setBook(response.data.getBookById);
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
      });
  }, [id_book]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/book/${id_book}`, book);
      setMessage('✅ Book updated successfully!');
      navigate('/book-list')
    } catch (error) {
      console.error('Error updating book:', error);
      setMessage('❌ Failed to update book!');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-30 bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">✏️ Edit Book</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="text-gray-300">Book Title:</span>
          <input type="text" name="book_title" value={book.book_title} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label>

        <label className="block">
          <span className="text-gray-300">Author:</span>
          <input type="text" name="author" value={book.author} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label>

        <label className="block">
          <span className="text-gray-300">Category:</span>
          <input type="text" name="category" value={book.category} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label>

        <label className="block">
          <span className="text-gray-300">Stock:</span>
          <input type="number" name="stock" value={book.stock} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label>

        {message && <p className="text-yellow-400">{message}</p>}

        <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBook;
