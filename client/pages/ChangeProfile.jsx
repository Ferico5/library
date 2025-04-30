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

  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

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

    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/update-profile/${userId}`, { ...profile, password: password });
      setProfile({
        full_name: '',
        mobile_number: '',
        email: '',
      });
      setShowModal(false);
      logout();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.msg === 'Current password is incorrect') {
        setMessage('Current password is incorrect');
      } else if (error.response && error.response.status === 400 && error.response.data.msg === 'Email is already in use') {
        setMessage('Email is already in use');
      } else {
        console.error('Error updating profile', error);
        localStorage.setItem('previousPage', window.location.pathname);
        navigate('/server-error');
      }
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

        {message && <p className="text-yellow-400">{message}</p>}

        <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md hover:cursor-pointer">
          💾 Save Changes
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">🔐 Confirm Password</h3>
            <p className="mb-2">Enter your current password to update profile:</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white" />

            {message && <p className="text-yellow-400 mb-2">{message}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false), setMessage(''), setPassword('');
                }}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button onClick={handleConfirmSubmit} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeProfile;
