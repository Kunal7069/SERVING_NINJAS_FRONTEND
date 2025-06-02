import React, { useState } from 'react';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Sign up successful! Please sign in.');
        setName('');
        setEmail('');
        setPassword('');
        setRole('user');
      } else {
        setError(data.message || 'Sign up failed.');
      }
    } catch (err) {
      setError('Sign up failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-teal-600 text-white p-8">
      <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-black w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-black w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-black w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="text-black w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
          <option value="tiffinProvider">Tiffin Provider</option>
        </select>
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-center">{success}</div>}
        <button type="submit" className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300">
          Sign Up
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

export default SignUp;