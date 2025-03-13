import React from 'react';
import libraryLogo from '../assets/library_logo.png';

const Header = () => {
  return (
    <div className="bg-[#1E1E2E] text-white flex justify-between items-center px-10">
      <img src={libraryLogo} alt="icon" className="w-22 pt-1" />
      <p>Nama</p>
    </div>
  );
};

export default Header;
