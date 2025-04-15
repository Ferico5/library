import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const BorrowedBook = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);

  const { user } = useAuth();
  const userId = user._id;
  const role = user.role || 'admin';

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
    if (!userId) {
      alert('User is not logged in. Please log in to see borrowed books.');
      return;
    }

    if (role === 'user') {
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
    } else if (role === 'admin') {
      axios
        .get('http://localhost:8000/history-borrow-book')
        .then((response) => {
          setHistory(response.data);
          setFilteredHistory(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching borrowed books:', error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      if (searchQuery.trim() === '') {
        setFilteredHistory(history);
      } else {
        setFilteredHistory(
          history.filter(
            (entry) =>
              entry.id_book.book_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.id_book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.id_borrower.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              entry.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
              new Date(entry.borrow_date).toLocaleDateString().includes(searchQuery) ||
              new Date(entry.due_date).toLocaleDateString().includes(searchQuery) ||
              new Date(entry.return_date).toLocaleDateString().includes(searchQuery)
          )
        );
      }
    }
  }, [searchQuery, history, role]);

  const handleReturnBook = async (bookId) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      try {
        const response = await axios.put(`http://localhost:8000/borrow-book/${bookId}`, {
          return_date: new Date().toISOString(),
        });

        alert(response.data.msg || 'Book returned successfully!');

        const updatedHistory = history.map((entry) => (entry._id === bookId ? { ...entry, status: 'returned', return_date: new Date() } : entry));
        setHistory(updatedHistory);
        setFilteredHistory(updatedHistory);
      } catch (error) {
        console.error('Error returning book:', error);
        alert('Failed to return the book.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📚 Borrowed Books</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading borrowed books...</p>
      ) : role === 'admin' ? (
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">All Borrowed Books</h2>
          <div className="flex mb-4">
            <input type="text" placeholder="Search by title, author, borrower, status, or date" className="w-full p-2 border rounded" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">No</th>
                  <th className="py-2 px-4 border">Book Title</th>
                  <th className="py-2 px-4 border">Author</th>
                  <th className="py-2 px-4 border">Borrower</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Borrow Date</th>
                  <th className="py-2 px-4 border">Due Date</th>
                  <th className="py-2 px-4 border">Return Date</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((entry, index) => (
                    <tr key={entry._id} className="border">
                      <td className="py-2 px-4 border text-center">{index + 1}</td>
                      <td className="py-2 px-4 border">{entry.id_book.book_title}</td>
                      <td className="py-2 px-4 border">{entry.id_book.author}</td>
                      <td className="py-2 px-4 border">{entry.id_borrower.full_name}</td>
                      <td className="py-2 px-4 border font-semibold text-{entry.status === 'overdue' ? 'red-500' : 'green-500'}">{entry.status}</td>
                      <td className="py-2 px-4 border">{entry.borrow_date ? new Date(entry.borrow_date).toLocaleDateString() : '-'}</td>
                      <td className="py-2 px-4 border">{entry.due_date ? new Date(entry.due_date).toLocaleDateString() : '-'}</td>
                      <td className="py-2 px-4 border">{entry.return_date ? new Date(entry.return_date).toLocaleDateString() : '-'}</td>
                      <td className="py-2 px-4 border text-center">
                        {entry.status === 'borrowed' || entry.status === 'overdue' ? (
                          <button
                            onClick={() => handleReturnBook(entry._id)}
                            className={`px-3 py-1 ${entry.status === 'overdue' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} font-semibold text-white rounded transition hover:cursor-pointer`}
                          >
                            Return Book
                          </button>
                        ) : (
                          <span className="text-gray-500 italic">No action required</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-600">
                      No borrowing history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
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
              <p className="border bg-gray-700 text-white py-2 px-3">You have no reserved books.</p>
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
              <p className="border bg-gray-700 text-white py-2 px-3">You haven't borrowed any books.</p>
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
              <p className="border bg-gray-700 text-white py-2 px-3">No books have been returned yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default BorrowedBook;
