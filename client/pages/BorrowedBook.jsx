import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BorrowedBook = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCancel = async (bookId) => {
    if (window.confirm('Are you sure you want to cancel the reservation?')) {
      try {
        await axios.put(`http://localhost:8000/reserve-book/${bookId}`, { status: 'canceled' });
        setReservedBooks(reservedBooks.filter((book) => book._id !== bookId));
        alert('Reservation canceled successfully!');
      } catch (error) {
        console.error('Error canceling reservation:', error);
      }
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;

    if (!userId) {
      alert('User is not logged in. Please log in to see borrowed books.');
      return;
    }

    axios
      .get(`http://localhost:8000/borrow-book/${userId}`)
      .then((response) => {
        setReservedBooks(response.data.reserved || []);
        setBorrowedBooks(response.data.borrowed || []);
        setReturnedBooks(response.data.returned || []);
        setOverdueBooks(response.data.overdue || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching borrowed books:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📚 Borrowed Books</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading borrowed books...</p>
      ) : (
        <>
          {/* Reserved Books */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Reserved Books</h2>
            {reservedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservedBooks.map((book) => (
                  <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
                    <h3 className="text-lg font-semibold mb-2">{book.id_book.book_title}</h3>
                    <p className="text-gray-300 mb-1">Author: {book.id_book.author}</p>
                    <p className="text-yellow-400 font-semibold mb-1">Status: Reserved</p>
                    <button onClick={() => handleCancel(book._id)} className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 hover:cursor-pointer transition">
                      Cancel Reservation
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You have no reserved books.</p>
            )}
          </section>

          {/* Borrowed Books */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Currently Borrowed Books</h2>
            {borrowedBooks.length > 0 || overdueBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* status borrowed */}
                {borrowedBooks.map((book) => (
                  <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
                    <h3 className="text-lg font-semibold mb-2">{book.id_book.book_title}</h3>
                    <p className="text-gray-300 mb-1">Author: {book.id_book.author}</p>
                    <p className="text-gray-300 mb-1">Borrowed on: {new Date(book.borrow_date).toLocaleDateString()}</p>
                    <p className="text-yellow-400 font-semibold mb-1">Due date: {new Date(book.due_date).toLocaleDateString()}</p>
                  </div>
                ))}

                {/* status overdue */}
                {overdueBooks.map((book) => (
                  <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
                    <h3 className="text-lg font-semibold mb-2">{book.id_book.book_title}</h3>
                    <p className="text-gray-300 mb-1">Author: {book.id_book.author}</p>
                    <p className="text-gray-300 mb-1">Borrowed on: {new Date(book.borrow_date).toLocaleDateString()}</p>
                    <p className="text-red-500 font-semibold mb-1">Status: Overdue</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You haven't borrowed any books.</p>
            )}
          </section>

          {/* Returned Books */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Returned Books</h2>
            {returnedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {returnedBooks.map((book) => (
                  <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
                    <h3 className="text-lg font-semibold mb-2">{book.id_book.book_title}</h3>
                    <p className="text-gray-300 mb-1">Author: {book.id_book.author}</p>
                    <p className="text-gray-300 mb-1">Returned on: {new Date(book.return_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No books have been returned yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default BorrowedBook;
