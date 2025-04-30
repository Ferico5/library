import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const [addAdmin, setAddAdmin] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAddAdmin({ ...addAdmin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!addAdmin.full_name || !addAdmin.mobile_number || !addAdmin.email || !addAdmin.password || !addAdmin.role) {
      setMessage('⚠️ All fields must be filled!');
      return;
    }

    try {
      await axios.post('http://localhost:8000/users', addAdmin);
      setAddAdmin({ full_name: '', mobile_number: '', email: '', password: '', role: 'admin' });
      alert('New Admin has been successfully added!');
    } catch (error) {
      console.log(error.message);
      localStorage.setItem('previousPage', window.location.pathname);
      navigate('/server-error');
    }
  };

  return (
    <div>
      <div className="max-w-lg mx-auto mt-30 mb-5 bg-gray-800 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">📚 Add New Admin</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-semibold">Full Name</label>
          <input type="text" name="full_name" value={addAdmin.full_name} onChange={handleChange} placeholder="Full Name..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <label className="text-sm font-semibold">Mobile Number</label>
          <input type="text" name="mobile_number" value={addAdmin.mobile_number} onChange={handleChange} placeholder="Mobile Number..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <label className="text-sm font-semibold">Email</label>
          <input type="email" name="email" value={addAdmin.email} onChange={handleChange} placeholder="Email..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <label className="text-sm font-semibold">Password</label>
          <input type="password" name="password" value={addAdmin.password} onChange={handleChange} placeholder="Password..." className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <label className="text-sm font-semibold">Role</label>
          <select name="role" value={addAdmin.role} onChange={handleChange} className="p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>

          {message && <p className="text-yellow-400">{message}</p>}

          <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold hover:cursor-pointer">
            ➕ Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
