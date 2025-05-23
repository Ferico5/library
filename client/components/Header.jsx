import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import libraryLogo from '../assets/library_logo.png';

const Header = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-[#1E1E2E] text-white flex justify-between items-center px-10 shadow-lg fixed w-full top-0">
      {/* Logo */}
      <img src={libraryLogo} alt="icon" className="w-24" />

      {/* Navbar */}
      {token && (
        <nav>
          <ul className="flex gap-10">
            <li>
              <Link to="/dashboard" className="hover:text-gray-400">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/book-list" className="hover:text-gray-400">
                Book List
              </Link>
            </li>
            <li>
              <Link to="/borrowed-book" className="hover:text-gray-400">
                Borrowed Book
              </Link>
            </li>
            {user && (user.role === 'admin' || user.role === 'superadmin') ? (
              <>
                <li>
                  <Link to="/reserved-book" className="hover:text-gray-400">
                    Reserved Book
                  </Link>
                </li>
                <li>
                  <Link to="/overdue-book" className="hover:text-gray-400">
                    Overdue Book
                  </Link>
                </li>
              </>
            ) : null}
            <li>
              <Link to="/change-password" className="hover:text-gray-400">
                Change Password
              </Link>
            </li>
            <li>
              <Link to="/change-profile" className="hover:text-gray-400">
                Change Profile
              </Link>
            </li>
            {user && user.role === 'superadmin' ? (
              <li>
              <Link to="/add-admin" className="hover:text-gray-400">
                Add Admin
              </Link>
            </li>
            ) : null}
          </ul>
        </nav>
      )}

      <div className="flex items-center">
        {/* Nama User */}
        {token && user && <p className="font-medium mr-10">{user?.full_name}</p>}
        {token && user && (
          <button onClick={() => logout(navigate)} className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 hover:cursor-pointer">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
