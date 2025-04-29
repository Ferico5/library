import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OverdueBook = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8000/history-borrow-book')
      .then((response) => {
        const overdueBooks = response.data.filter((book) => book.status === 'overdue');
        setOverdueBooks(overdueBooks);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching overdue books:', error);
        setLoading(false);
        localStorage.setItem('previousPage', window.location.pathname);
        navigate('/server-error');
      });
  }, []);

  const handleSendReminder = async (borrowerEmail, bookTitle) => {
    try {
      await axios.post('http://localhost:8000/send-reminder-email', {
        email: borrowerEmail,
        bookTitle: bookTitle,
      });
      alert(`Reminder sent to ${borrowerEmail}`);
    } catch (error) {
      console.error('Failed to send reminder:', error);
      alert('Failed to send reminder. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="main-content text-3xl font-bold text-center text-gray-800 mb-6">📅 Overdue Books</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading overdue books...</p>
      ) : overdueBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {overdueBooks.map((book) => (
            <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
              <h3 className="text-lg font-semibold mb-2">{book.id_book.book_title}</h3>
              <p className="text-gray-300 mb-1">Author: {book.id_book.author}</p>
              <p className="text-gray-300 mb-1">
                Borrower: {book.id_borrower.full_name}, {book.id_borrower.email}
              </p>
              <p className="text-red-500 font-semibold mb-1">Status: Overdue</p>
              <p className="text-gray-300 mb-1">Due Date: {new Date(book.due_date).toLocaleDateString()}</p>

              <button onClick={() => handleSendReminder(book.id_borrower.email, book.id_book.book_title)} className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 w-full">
                Send Reminder
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No overdue books available.</p>
      )}
    </div>
  );
};

export default OverdueBook;
