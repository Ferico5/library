import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await login(email, password);

        if (response.data.msg === 'Login successful') {
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        } else if (response.data?.msg === 'Invalid email or password!') {
          setMessage('Login failed! Please double check your email and password');
        }
      } else {
        if (password !== confirmPassword) {
          setMessage('Please confirm your password correctly');
          return;
        }

        const response = await axios.post('http://localhost:8000/users', {
          full_name: fullName,
          mobile_number: mobileNumber,
          email,
          password,
        });

        if (response.data.msg === 'User created!') {
          setIsLogin(true);
          setFullName('');
          setMobileNumber('');
          setFullName('');
          setEmail('');
          setPassword('');
          setMessage('');
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.msg === 'Invalid email or password!') {
          setMessage('Login failed! Please double check your email and password');
        } else if (error.response.data.msg === 'Email already exists, try another!') {
          setMessage('Email already exists, try another!');
        } else if (error.response.data.msg === 'Server error') {
          setMessage('Server Error! Please try again later.');
        }
      } else {
        setMessage('Server Error! Please try again later.');
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#313244] to-[#1E1E2E] w-2/3 m-auto flex flex-col justify-center text-white mt-30 px-5 py-3 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">{isLogin ? 'Login' : 'Create An Account'}</h1>

      <form onSubmit={handleLogin}>
        {/* Full Name */}
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
              required
              autoComplete="off"
            />
          </div>
        )}

        {/* Mobile Number */}
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-300">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile_number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
              required
              autoComplete="off"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
            placeholder="Enter your email"
            required
            autoComplete="off"
          />
        </div>

        {/* Password & Confirm Password */}
        <div className={`mb-4 ${isLogin ? '' : 'grid grid-cols-2 gap-4'}`}>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
              placeholder="Enter your password"
              required
              autoComplete="off"
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirm_password" className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
                placeholder="Confirm your password"
                required
                autoComplete="off"
              />
            </div>
          )}
        </div>

        {/* Message */}
        {message && <p className="text-sm text-red-400 font-semibold mb-2">{message}</p>}

        {/* Button */}
        <button className="w-full bg-[#4c59ae] mt-2 font-semibold py-2 px-4 text-white rounded-lg hover:bg-[#5a639c] transition">{isLogin ? 'Login' : 'Register'}</button>
        <p className="mt-4 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
              setFullName('');
              setMobileNumber('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-[#8BE9FD] cursor-pointer ml-2 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
