import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServerError = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    const previousPage = localStorage.getItem('previousPage');
    if (previousPage) {
      localStorage.removeItem('previousPage');
      navigate(previousPage);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-600">500 - Server Error</h1>
      <p className="text-lg mb-6">Oops! Something went wrong on our end. Please contact our staff for this problem.</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer" onClick={handleRefresh}>
        Refresh
      </button>
    </div>
  );
};

export default ServerError;
