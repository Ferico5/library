import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = ({ userRole }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

//   const handleBorrow = async (id) => {
//     // TO-DO LIST
//     // const userId = localStorage.getItem('user_id');

//     // if (!userId) {
//     //   alert('User is not logged in. Please log in to borrow a book.');
//     //   return;
//     // }

//     // try {
//     //   const response = await axios.post('http://localhost:8000/borrow', {
//     //     id_book: id,
//     //     id_borrower: userId, // Gunakan ID pengguna yang valid
//     //   });

//     //   alert(response.data.msg || 'Book borrowed successfully!');
//     // } catch (error) {
//     //   console.error('Error borrowing book:', error);
//     //   alert(error.response?.data?.msg || 'Failed to borrow the book.');
//     // }
//   };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 p-4">📚 Book List</h1>

      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
              <h2 className="text-xl font-semibold mb-2">{book.book_title}</h2>
              <p className="text-gray-300 mb-1">Author: {book.author}</p>
              <p className="text-gray-300 mb-1">Category: {book.category}</p>
              <p className="text-gray-300 mb-1">Stock: {book.stock}</p>

              {userRole === 'admin' ? (
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white rounded w-1/2" onClick={() => alert('Update feature coming soon!')}>
                    ✏️ Update
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white rounded w-1/2" onClick={() => handleDelete(book._id)}>
                    🗑️ Delete
                  </button>
                </div>
              ) : (
                <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 hover:cursor-pointer text-white rounded w-full" onClick={() => alert('Borrow feature coming soon!')}>
                  📖 Borrow
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
