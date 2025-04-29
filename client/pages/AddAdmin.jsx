import React from 'react';

const handleChange = (e) => {
  // delete this line later
  e.preventDefault();
  // setBook({ ...book, [e.target.name]: e.target
};

const handleSubmit = async (e) => {
  e.preventDefault();

  //   if (!book.book_title || !book.author || !book.published_date || !book.category || !book.stock) {
  //     setMessage('⚠️ All fields must be filled!');
  //     return;
  //   }

  //   try {
  //     await axios.post('http://localhost:8000/book', book);
  //     setBook({ book_title: '', author: '', published_date: '', category: '', stock: '' });
  //     navigate('/book-list');
  //   } catch (error) {
  //     console.log(error.message);
  //     localStorage.setItem('previousPage', window.location.pathname);
  //     navigate('/server-error');
  //   }
};

const AddAdmin = () => {
  return (
    <div>
      <div className="max-w-lg mx-auto mt-30 mb-5 bg-gray-800 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">📚 Add New Admin</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-semibold">Full Name</label>
          <input type="text" name="full_name" onChange={handleChange} placeholder="Full Name..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <label className="text-sm font-semibold">Mobile Number</label>
          <input type="text" name="mobile_number" onChange={handleChange} placeholder="Mobile Number..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <label className="text-sm font-semibold">Email</label>
          <input type="email" name="email" onChange={handleChange} placeholder="Email..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <label className="text-sm font-semibold">Password</label>
          <input type="password" name="password" onChange={handleChange} placeholder="Password..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          {/* {message && <p className="text-yellow-400">{message}</p>} */}

          <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold hover:cursor-pointer">
            ➕ Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
