import React, { useState } from 'react';

const Dashboard = () => {
  const [role, setRole] = useState('admin');

  return (
    <div className="flex">
      {/* sidebar */}

      {/* content */}
      <div className="px-4 pt-3 mt-5 ml-5 w-full">
        <h2 className="mb-4">📚 {role === 'admin' ? 'Admin' : 'User'} Dashboard</h2>

        {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <>
      {/* Quick Summary */}
      <div className="flex gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h5 className="text-lg font-semibold">Total Books</h5>
          <p className="text-xl">1,250</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <h5 className="text-lg font-semibold">Borrowed Books</h5>
          <p className="text-xl">300</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
          <h5 className="text-lg font-semibold">Overdue Books</h5>
          <p className="text-xl">15</p>
        </div>
      </div>

      {/* Recently Borrowed Books */}
      <h4 className="mt-6 text-xl font-semibold flex items-center gap-2">📌 Recently Borrowed Books</h4>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3 text-left border border-gray-700">Book Title</th>
              <th className="p-3 text-left border border-gray-700">Borrower</th>
              <th className="p-3 text-left border border-gray-700">Borrow Date</th>
              <th className="p-3 text-left border border-gray-700">Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-gray-900 even:bg-gray-800 text-gray-200">
              <td className="p-3 border border-gray-700">Harry Potter</td>
              <td className="p-3 border border-gray-700">John Doe</td>
              <td className="p-3 border border-gray-700">2025-03-10</td>
              <td className="p-3 border border-gray-700">2025-03-20</td>
            </tr>
            <tr className="odd:bg-gray-900 even:bg-gray-800 text-gray-200">
              <td className="p-3 border border-gray-700">The Hobbit</td>
              <td className="p-3 border border-gray-700">Jane Smith</td>
              <td className="p-3 border border-gray-700">2025-03-08</td>
              <td className="p-3 border border-gray-700">2025-03-18</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Overdue Books Alert */}
      <h4 className="mt-6 text-xl font-semibold text-red-500 flex items-center gap-2">⚠️ Overdue Books Alert</h4>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left border border-gray-700">Book Title</th>
              <th className="p-3 text-left border border-gray-700">Borrower</th>
              <th className="p-3 text-left border border-gray-700">Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-gray-900 even:bg-gray-800 text-gray-200">
              <td className="p-3 border border-gray-700">1984</td>
              <td className="p-3 border border-gray-700">Michael Brown</td>
              <td className="p-3 border border-gray-700 text-red-400 font-semibold">2025-03-05</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <h4 className="mt-6 text-xl font-semibold flex items-center gap-2">🚀 Quick Actions</h4>

      <div className="mt-4 flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">📚 Add New Book</button>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">🔍 View Borrowed Books</button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">👥 Manage Members</button>
      </div>
    </>
  );
};

export default Dashboard;
