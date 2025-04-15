import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();
  const role = user.role || 'user';

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/book')
      .then((response) => {
        setBooks(response.data.getBook);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:8000/book/${id}`);
        setBooks(books.filter((book) => book._id !== id));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleReservation = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;

    if (!userId) {
      alert('User is not logged in. Please log in to borrow a book.');
      return;
    }

    if (window.confirm('Are you sure you want to reserve this book?')) {
      try {
        const response = await axios.post('http://localhost:8000/reserve-book', {
          id_book: id,
          id_borrower: userId,
        });

        alert(response.data.msg || 'Book reserved successfully!');
        navigate('/borrowed-book');
      } catch (error) {
        console.error('Error borrowing book:', error);
        alert(error.response?.data?.msg || 'Failed to borrow the book.');
      }
    }
  };

  const filteredBooks = books.filter(
    (book) => book.book_title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()) || book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="main-content relative mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📚 Book List</h1>
        {role === 'admin' && (
          <button className="absolute right-0 top-0 border bg-blue-400 rounded-lg text-sm p-2 font-bold text-gray-800 hover:bg-blue-500 hover:cursor-pointer" onClick={() => navigate('/new-book')}>
            ➕ New Book
          </button>
        )}
      </div>

      {role === 'user' && (
        <div className="flex mb-4">
          <input type="text" placeholder="Search by title, author, or category" className="w-full p-2 border rounded" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
              <h2 className="text-xl font-semibold mb-2">{book.book_title}</h2>
              <p className="text-gray-300 mb-1">Author: {book.author}</p>
              <p className="text-gray-300 mb-1">Category: {book.category}</p>
              <p className="text-gray-300 mb-1">Stock: {book.stock}</p>

              {role === 'admin' ? (
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white rounded w-1/2" onClick={() => navigate(`/edit-book/${book._id}`)}>
                    ✏️ Update
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white rounded w-1/2" onClick={() => handleDelete(book._id)}>
                    🗑️ Delete
                  </button>
                </div>
              ) : (
                <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 hover:cursor-pointer text-white rounded w-full" onClick={() => handleReservation(book._id)}>
                  📖 Reserve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
