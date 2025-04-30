import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangeProfile = () => {
  const { user, logout } = useAuth();
  const userId = user._id;
  const [profile, setProfile] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/get-user/${userId}`)
      .then((response) => {
        setProfile(response.data.user);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        localStorage.setItem('previousPage', window.location.pathname);
        navigate('/server-error');
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.full_name || !profile.mobile_number || !profile.email) {
      setMessage('⚠️ All fields must be filled!');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/update-profile/${userId}`, profile);
      setProfile({
        full_name: '',
        mobile_number: '',
        email: '',
      });
      logout();
    } catch (error) {
      console.error('Error updating profile', error);
      localStorage.setItem('previousPage', window.location.pathname);
      navigate('/server-error');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-30 bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">✏️ Change Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="text-gray-300">Full Name:</span>
          <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label>

        <label className="block">
          <span className="text-gray-300">Mobile Number:</span>
          <input type="text" name="mobile_number" value={profile.mobile_number} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label>

        <label className="block">
          <span className="text-gray-300">Email:</span>
          <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label>

        {/* <label className="block">
          <span className="text-gray-300">Password:</span>
          <input type="number" name="stock" value={book.stock} onChange={handleChange} className="w-full p-2 mt-1 rounded-md bg-gray-700 text-white" />
        </label> */}

        {message && <p className="text-yellow-400">{message}</p>}

        <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md hover:cursor-pointer">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default ChangeProfile;
