import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
  const { token, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New password and confirm new password do not match');
      return;
    }

    try {
      await axios.put(
        'http://localhost:8000/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password updated successfully! Please login again');
      logout();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Current password is incorrect');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const inputStyle = `w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-white`;

  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1E1E2E] rounded-xl shadow-lg p-8 mt-20">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-5">
          {/* Current Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input type={showCurrent ? 'text' : 'password'} className={inputStyle} placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <button type="button" className="absolute top-[38px] right-3 text-gray-500" onClick={() => setShowCurrent(!showCurrent)} tabIndex={-1}>
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input type="password" className={inputStyle} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input type="password" className={inputStyle} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          {error && <p className="text-red-500 font-semibold mb-4 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300 hover:cursor-pointer">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
