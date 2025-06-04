import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch {
        setUser(userData);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-100 text-gray-800 p-8 min-h-screen relative">
      {/* Greeting at top right */}
      {user && (
        <div className="absolute top-6 right-8 flex flex-col items-end z-10 animate-fade-in">
          <div className="flex items-center space-x-2 bg-white bg-opacity-90 rounded-xl shadow-lg px-6 py-3 border border-blue-200">
            <span className="text-2xl font-bold text-blue-700">👋 Hi, <span className="text-cyan-600">{user.name || user}</span>!</span>
          </div>
          {user.email && (
            <span className="mt-1 text-blue-600 text-sm bg-white bg-opacity-80 px-3 py-1 rounded shadow">{user.email}</span>
          )}
        </div>
      )}
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg tracking-wide text-blue-900">Welcome to Serving Ninjas!</h1>
      <p className="text-xl mb-10 max-w-xl text-center text-blue-800">Choose a service to get started and explore our offerings. We provide the best education , guidance and doctor services in your city!</p>
      <div className="flex flex-wrap justify-center gap-10 mt-4">
        <Link to="/tiffin" className="flex flex-col items-center group">
          <div className="bg-white rounded-2xl shadow-xl border border-yellow-100 p-6 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
              alt="Tiffin Service"
              className="w-56 h-56 mb-4 rounded-xl shadow-md border-2 border-yellow-200 object-cover"
            />
            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 font-bold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 mt-2 hover:from-yellow-300 hover:to-yellow-400">
              Education Service
            </button>
          </div>
        </Link>
        <Link to="/doctor" className="flex flex-col items-center group">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4aLoK_tr6pKK469DDx0iVCgGjIulkjbgkA&s"
              alt="Hospital Service"
              className="w-56 h-56 mb-4 rounded-xl shadow-md border-2 border-blue-200 object-cover"
            />
            <button className="w-full bg-gradient-to-r from-blue-400 to-cyan-300 text-blue-900 font-bold py-2 px-4 rounded-full shadow hover:shadow-lg transition duration-300 mt-2 hover:from-cyan-300 hover:to-blue-400">
              Hospital Service
            </button>
          </div>
        </Link>
      </div>
      <footer className="bg-blue-900 text-white py-4 w-full text-center absolute bottom-0 border-t border-blue-200">
        <p className="text-sm">&copy; 2023 Service Website. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline hover:text-cyan-200 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-cyan-200 transition-colors">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-cyan-200 transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;