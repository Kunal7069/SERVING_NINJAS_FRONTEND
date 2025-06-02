import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Assuming backend returns role in response
        if (data.role === 'doctor') {
          navigate('/doctorpanel');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.message || 'Sign in failed.');
      }
    } catch (err) {
      setError('Sign in failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
      <h2 className="text-4xl font-bold mb-6">Sign In</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-black  w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-black w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
          Sign In
        </button>
      </form>
      <footer className="bg-gray-800 text-white py-4 w-full text-center mt-auto">
        <p className="text-sm">&copy; 2023 Service Website. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default SignIn;