import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#313244] to-[#1E1E2E] w-2/3 m-auto flex flex-col justify-center text-white mt-10 px-5 py-3 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">{isLogin ? 'Login' : 'Create An Account'}</h1>

      {/* Full Name */}
      {!isLogin && (
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <input type="text" id="name" placeholder="Enter your full name" className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none" required />
        </div>
      )}

      {/* Mobile Number */}
      {!isLogin && (
        <div className="mb-4">
          <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-300">
            Mobile Number
          </label>
          <input type="text" id="mobile_number" placeholder="Enter your mobile number" className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none" required />
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          Email
        </label>
        <input type="email" id="email" className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none" placeholder="Enter your email" required />
      </div>

      {/* Password & Confirm Password */}
      <div className={`mb-4 ${isLogin ? '' : 'grid grid-cols-2 gap-4'}`}>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <input type="password" id="password" className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none" placeholder="Enter your password" required />
        </div>
        {!isLogin && (
          <div>
            <label htmlFor="confirm_password" className="text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input type="password" id="confirm_password" className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none" placeholder="Confirm your password" required />
          </div>
        )}
      </div>

      {/* Button */}
      <button className="w-full bg-[#4c59ae] mt-2 font-semibold py-2 px-4 text-white rounded-lg hover:bg-[#5a639c] transition">{isLogin ? 'Login' : 'Register'}</button>
      <p className="mt-4 text-center text-sm text-gray-400">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <span onClick={() => setIsLogin(!isLogin)} className="text-[#8BE9FD] cursor-pointer ml-2 hover:underline">
          {isLogin ? 'Sign Up' : 'Login'}
        </span>
      </p>
    </div>
  );
};

export default Auth;
