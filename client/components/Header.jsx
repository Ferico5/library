import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import libraryLogo from '../assets/library_logo.png';

const Header = () => {
  const [role, setRole] = useState('user');

  return (
    <div className="bg-[#1E1E2E] text-white flex justify-between items-center px-10 shadow-lg">
      {/* Logo */}
      <img src={libraryLogo} alt="icon" className="w-24" />

      {/* Navbar */}
      <nav>
        <ul className="flex gap-10">
          <li>
            <Link to="/dashboard" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          {role === 'admin' ? (
            <>
              <li>
                <Link to="/new-book" className="hover:text-gray-400">
                  New Book
                </Link>
              </li>
              <li>
                <Link to="/overdue-book" className="hover:text-gray-400">
                  Overdue Book
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/borrowed-book" className="hover:text-gray-400">
                  Borrowed Book
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/book-list" className="hover:text-gray-400">
              Book List
            </Link>
          </li>
          <li>
            <Link to="/change-profile" className="hover:text-gray-400">
              Change Password
            </Link>
          </li>
        </ul>
      </nav>

      {/* Nama User */}
      <p className="font-medium">Nama</p>
    </div>
  );
};

export default Header;
