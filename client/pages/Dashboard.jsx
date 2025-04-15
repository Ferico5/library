import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const role = user.role || 'user';
  const userId = user._id;

  return (
    <div className="flex">
      {/* content */}
      <div className="px-4 pt-3 mt-5 ml-5 w-full">
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">📚 {role === 'admin' ? 'Admin' : 'User'} Dashboard</h2>

        {role === 'admin' ? <AdminDashboard /> : <UserDashboard userId={userId} />}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [totalBooks, setTotalBooks] = useState('');
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8000/book')
      .then((response) => {
        setTotalBooks(response.data.getBook);
      })
      .catch((error) => {
        console.error('Error fecthing books:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8000/borrow-book')
      .then((response) => {
        setBorrowedBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8000/overdue-book')
      .then((response) => {
        setOverdueBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []);

  useEffect(() => {
    if (showModal) {
      const handleClickOutside = (event) => {
        const modal = document.getElementById('modal');
        if (modal && !modal.contains(event.target)) {
          setShowModal(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showModal]);

  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  return (
    <>
      {/* Quick Summary */}
      <div className="flex gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md w-1/3 text-center">
          <h5 className="text-lg font-semibold">Total Books</h5>
          <p className="text-xl">{totalBooks.length}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md w-1/3 text-center">
          <h5 className="text-lg font-semibold">Borrowed Books</h5>
          <p className="text-xl">{borrowedBooks.length}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md w-1/3 text-center">
          <h5 className="text-lg font-semibold">Overdue Books</h5>
          <p className="text-xl">{overdueBooks.length}</p>
        </div>
      </div>

      {/* Recently Borrowed Books */}
      <h4 className="mt-6 text-xl font-semibold flex items-center gap-2">📌 Recently Borrowed Books</h4>

      <div className="mt-4 overflow-x-auto">
        {borrowedBooks.length === 0 ? (
          <p className="mt-2 border bg-gray-700 text-white py-2 px-3">No borrowed books found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left border border-gray-700">Book Title</th>
                <th className="p-3 text-left border border-gray-700">Borrower</th>
                <th className="p-3 text-left border border-gray-700">Borrow Date</th>
                <th className="p-3 text-left border border-gray-700">Due Date</th>
                <th className="p-3 text-left border border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book) => (
                <tr key={book._id} className="odd:bg-gray-900 even:bg-gray-800 text-gray-200">
                  <td className="p-3 border border-gray-700">{book.id_book.book_title}</td>
                  <td className="p-3 border border-gray-700">{book.id_borrower.full_name}</td>
                  <td className="p-3 border border-gray-700">{book.borrow_date.slice(0, 10)}</td>
                  <td className="p-3 border border-gray-700">{book.due_date.slice(0, 10)}</td>
                  <td className="p-3 border border-gray-700">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-md hover:cursor-pointer" onClick={() => handleShowDetail(book)}>
                      Show Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Overdue Books Alert */}
      <h4 className="mt-6 text-xl font-semibold text-red-500 flex items-center gap-2">⚠️ Overdue Books Alert</h4>

      <div className="mt-4 overflow-x-auto">
        {overdueBooks.length === 0 ? (
          <p className="mt-2 border bg-gray-700 text-white py-2 px-3">No overdue books found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-700">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-3 text-left border border-gray-700">Book Title</th>
                <th className="p-3 text-left border border-gray-700">Borrower</th>
                <th className="p-3 text-left border border-gray-700">Due Date</th>
                <th className="p-3 text-left border border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {overdueBooks.map((book) => (
                <tr key={book._id} className="odd:bg-gray-900 even:bg-gray-800 text-gray-200">
                  <td className="p-3 border border-gray-700">{book.id_book.book_title}</td>
                  <td className="p-3 border border-gray-700">{book.id_borrower.full_name}</td>
                  <td className="p-3 border border-gray-700 text-red-400 font-semibold">{book.due_date.slice(0, 10)}</td>
                  <td className="p-3 border border-gray-700">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-md hover:cursor-pointer" onClick={() => handleShowDetail(book)}>
                      Show Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div id='modal' className="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md z-60 relative">
            <h3 className="text-lg font-bold mb-4">📄 Borrow Details</h3>
            <p>
              <strong>Borrower Name:</strong> {selectedBook.id_borrower.full_name}
            </p>
            <p>
              <strong>Email:</strong> {selectedBook.id_borrower.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBook.id_borrower.mobile_number}
            </p>
            <hr className="my-4" />
            <p>
              <strong>Book Title:</strong> {selectedBook.id_book.book_title}
            </p>
            <p>
              <strong>Author:</strong> {selectedBook.id_book.author}
            </p>
            <div className="mt-4 text-right">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 hover:cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const UserDashboard = ({ userId }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    totalReserved: 0,
    totalOverdue: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      return;
    }

    axios
      .get(`http://localhost:8000/borrow-book/${userId}`)
      .then((response) => {
        setBorrowedBooks(response.data.borrowed);
        setOverdueBooks(response.data.overdue);
        setReservedBooks(response.data.reserved);
        setStats({
          totalBorrowed: response.data.borrowed.length,
          totalReserved: response.data.reserved.length,
          totalOverdue: response.data.overdue.length,
        });
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8000/recommendation/${userId}`)
      .then((res) => {
        setRecommendedBooks(res.data.recommendedBooks);
      })
      .catch((err) => {
        console.error('Error fetching recommended books:', err);
      });
  }, [userId]);

  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'overdue':
        return '⚠️ Overdue';
      case 'borrowed':
        return '📚 Borrowed';
      case 'returned':
        return '✅ Returned';
      case 'reserved':
        return '📅 Reserved';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getUpcomingDueBook = () => {
    const upcoming = [...borrowedBooks, ...overdueBooks].filter((b) => b.status === 'borrowed').sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    return upcoming[0];
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

  return (
    <>
      <div className="flex gap-4 my-4">
        <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-md w-1/3 text-center">
          <h5 className="text-md font-semibold">Total Borrowed</h5>
          <p className="text-xl font-bold">{stats.totalBorrowed}</p>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-md w-1/3 text-center">
          <h5 className="text-md font-semibold">Overdue</h5>
          <p className="text-xl font-bold">{stats.totalOverdue}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-md w-1/3 text-center">
          <h5 className="text-md font-semibold">Reserved</h5>
          <p className="text-xl font-bold">{stats.totalReserved}</p>
        </div>
      </div>

      {/* Upcoming Due Date */}
      <div className="mt-4 bg-yellow-300 text-gray-900 px-4 py-3 rounded-lg shadow-md w-fit">
        <h4 className="text-md font-semibold mb-1">⏰ Upcoming Due Date</h4>
        {getUpcomingDueBook() ? (
          <p className="text-sm">
            <strong>{getUpcomingDueBook().id_book.book_title}</strong> is due on <strong>{getUpcomingDueBook().due_date.slice(0, 10)}</strong>. Don’t forget to return it on time! 📅
          </p>
        ) : (
          <p className="text-sm">You don’t have any upcoming due books right now. Chill. 😌</p>
        )}
      </div>

      {/* Recommended Books Section */}
      <h4 className="mt-6 text-xl font-semibold flex items-center gap-2 text-purple-400">💡 Recommended for You</h4>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendedBooks.length === 0 ? (
          <p className="text-gray-400 w-250">No recommendations available right now. Try borrowing some books to get personalized suggestions! 😉</p>
        ) : (
          recommendedBooks.map((book) => (
            <div key={book._id} className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-600">
              <h5 className="text-lg font-semibold">{book.book_title}</h5>
              <p className="text-sm text-gray-400 mt-2">
                Author: <span className="text-indigo-300">{book.author}</span>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Category: <span className="text-indigo-300">{book.category}</span>
              </p>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 px-3 rounded-md hover:cursor-pointer" onClick={() => handleReservation(book._id)}>
                📖 Reserve
              </button>
            </div>
          ))
        )}
      </div>

      {/* User's Borrowed Books */}
      <h4 className="mt-6 text-xl font-semibold flex items-center gap-2">📌 Your Borrowed Books</h4>

      <div className="mt-4 overflow-x-auto">
        {borrowedBooks.length === 0 && overdueBooks.length === 0 ? (
          <p className="border bg-gray-700 text-white py-2 px-3">You haven't borrowed any books yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-700">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="p-3 text-left border border-gray-700">Book Title</th>
                <th className="p-3 text-left border border-gray-700">Borrow Date</th>
                <th className="p-3 text-left border border-gray-700">Due Date</th>
                <th className="p-3 text-left border border-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {overdueBooks.map((book) => (
                <tr className="odd:bg-gray-900 even:bg-gray-800 text-gray-200">
                  <td className="p-3 border border-gray-700">{book.id_book.book_title}</td>
                  <td className="p-3 border border-gray-700">{book.borrow_date.slice(0, 10)}</td>
                  <td className="p-3 border border-gray-700">{book.due_date.slice(0, 10)}</td>
                  <td className="p-3 border border-gray-700 text-red-400 font-semibold">{formatStatus(book.status)}</td>
                </tr>
              ))}
              {borrowedBooks.map((book) => (
                <tr className="odd:bg-gray-900 even:bg-gray-800 text-gray-200">
                  <td className="p-3 border border-gray-700">{book.id_book.book_title}</td>
                  <td className="p-3 border border-gray-700">{book.borrow_date.slice(0, 10)}</td>
                  <td className="p-3 border border-gray-700">{book.due_date.slice(0, 10)}</td>
                  <td className="p-3 border border-gray-700 text-sky-400 font-semibold">{formatStatus(book.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User's Notifications */}
      <h4 className="mt-6 text-xl font-semibold flex items-center gap-2 text-blue-400">🔔 Notifications</h4>
      <ul className="mt-4 space-y-3">
        {overdueBooks.map((book) => (
          <li key={book._id} className="bg-gray-800 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 border border-red-600 mb-2">
            ⚠️ <span className="font-medium">"{book.id_book.book_title}"</span> is overdue. Please return it ASAP!
          </li>
        ))}

        {reservedBooks.map((book) => (
          <li key={book._id} className="bg-gray-800 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 border border-green-600 mb-2">
            ✅ Your reservation for <span className="font-medium">"{book.id_book.book_title}"</span> is confirmed. Please come to the library to take the book.
          </li>
        ))}

        {overdueBooks.length === 0 && reservedBooks.length === 0 && <li className="border bg-gray-700 text-white py-2 px-3 mb-2">No notifications at the moment. You're all caught up!</li>}
      </ul>
    </>
  );
};

export default Dashboard;
