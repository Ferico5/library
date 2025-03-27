import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservedBook = () => {
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8000/reserve-book')
      .then((response) => {
        setReservedBooks(response.data.reservedBooks);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching reserved books:', error);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this reservation?')) {
      try {
        const response = await axios.put(`http://localhost:8000/reserve-book/${id}`, { status: 'borrowed' });
        alert(response.data.msg);
        setReservedBooks(reservedBooks.filter((book) => book._id !== id));
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this reservation?')) {
      try {
        const response = await axios.put(`http://localhost:8000/reserve-book/${id}`, { status: 'canceled' });
        alert(response.data.msg);
        setReservedBooks(reservedBooks.filter((book) => book._id !== id));
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📖 Reserved Books</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading reserved books...</p>
      ) : reservedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservedBooks.map((book) => (
            <div key={book._id} className="border border-[#1E1E2E] p-4 rounded-lg shadow-md bg-[#2E2E3E] text-white">
              <h3 className="text-lg font-semibold mb-2">{book.id_book.book_title}</h3>
              <p className="text-gray-300 mb-1">Author: {book.id_book.author}</p>
              <p className="text-gray-300 mb-1">Borrower: {book.id_borrower.full_name}</p>
              <p className="text-yellow-600 font-semibold mb-1">Status: Reserved</p>
              <div className='flex gap-2 mt-1'>
                <button onClick={() => handleApprove(book._id)} className="mt-2 w-1/2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 hover:cursor-pointer">
                  Approve
                </button>

                <button onClick={() => handleReject(book._id)} className="mt-2 w-1/2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 hover:cursor-pointer">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No reserved books available.</p>
      )}
    </div>
  );
};

export default ReservedBook;
