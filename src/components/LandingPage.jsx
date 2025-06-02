import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LandingPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('none'); // 'none' | 'signup-user' | 'signin-user' | 'signup-provider' | 'signin-provider'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default role
  });
  const [roleOptions, setRoleOptions] = useState(['user']); // for dropdown
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = (type) => {
    console.log(type)
    let defaultRole = 'user';
    let options = ['user'];
    if (type.includes('provider')) {
      defaultRole = 'doctor';
      options = ['doctor', 'tiffin'];
    }
    setMode(type);
    setForm({ name: '', email: '', password: '', role: defaultRole });
    setError('');
    setSuccessMsg('');
    setRoleOptions(options);
  };

  const handleClose = () => {
    setMode('none');
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      if (mode.startsWith('signup')) {
        await axios.post('https://serving-ninjas.onrender.com/user/', {
          name :form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setSuccessMsg('Sign up successful! Please sign in.');
        setMode(mode.replace('signup', 'signin'));
        setForm({ name: '', email: '', password: '', role: form.role });
      } else {
        const res = await axios.post('https://serving-ninjas.onrender.com/user/login', {
          email: form.email,
          password: form.password,
  
        });
        console.log('Sign in response:', res.data);
        localStorage.setItem('userData', JSON.stringify(res.data));
        setSuccessMsg('Sign in successful!');
        if (onAuthSuccess) onAuthSuccess(res.data);
        localStorage.setItem('user', JSON.stringify(res?.data?.user || res?.data?.name));
        if (res.data.role === 'doctor') {
          navigate('/doctorpanel');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (mode.startsWith('signup') ? 'Sign up failed.' : 'Sign in failed.')
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 px-4">
      {/* Branding */}
      <div className="flex flex-col items-center mb-12 animate-fade-in">
        <div className="flex items-center space-x-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Serving Ninjas Logo"
            className="w-16 h-16 rounded-full shadow-lg border-2 border-blue-300 bg-white"
          />
          <span className="text-5xl font-extrabold text-blue-800 drop-shadow-lg tracking-wide font-ninja">
            Serving Ninjas
          </span>
        </div>
        <p className="mt-4 text-lg text-blue-700 max-w-2xl text-center font-medium">
          Welcome to <span className="font-bold text-cyan-700">Serving Ninjas</span> — your one-stop platform for seamless tiffin and doctor services. Sign up to discover, book, and manage essential services with ease. Fast, reliable, and always at your service!
        </p>
      </div>

      {/* Call to Action Buttons */}
      {mode === 'none' && (
        <div className="flex flex-col items-center space-y-6 w-full max-w-md">
          <div className="w-full">
            <div className="text-center text-blue-800 font-bold mb-2 text-lg">As a User</div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleOpen('user')}
                className="w-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl hover:from-cyan-400 hover:to-blue-500 transition duration-300 ease-in-out text-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleOpen('signin-user')}
                className="w-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-bold py-3 rounded-full shadow-lg hover:shadow-xl hover:from-orange-400 hover:to-yellow-400 transition duration-300 ease-in-out text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="w-full">
            <div className="text-center text-blue-800 font-bold mb-2 text-lg">As a Service Provider</div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleOpen('provider')}
                className="w-1/2 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl hover:from-teal-400 hover:to-green-400 transition duration-300 ease-in-out text-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleOpen('signin-provider')}
                className="w-1/2 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl hover:from-purple-400 hover:to-pink-400 transition duration-300 ease-in-out text-lg"
              >
                Sign In
              </button>
            </div> 
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {mode !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center animate-fade-in relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-blue-600 transition"
              aria-label="Close"
            >
              &times;
            </button>
            <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow-lg">
              {mode.startsWith('signup')
                ? `Sign Up as ${roleOptions.length > 1 ? 'Service Provider' : 'User'}`
                : `Sign In as ${roleOptions.length > 1 ? 'Service Provider' : 'User'}`}
            </h1>
            <p className="text-blue-600 mb-6 text-center">
              {mode.startsWith('signup')
                ? `Create your ${roleOptions.length > 1 ? 'provider' : 'user'} account to get started!`
                : `Sign in to your ${roleOptions.length > 1 ? 'provider' : 'user'} dashboard.`}
            </p>
            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              {mode.startsWith('signup') && (
                <div>
                  <label className="block text-blue-700 font-semibold mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out bg-blue-50 text-black"
                    placeholder="Your Name"
                  />
                </div>
              )}
              <div>
                <label className="block text-blue-700 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out bg-blue-50 text-black"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out bg-blue-50 text-black"
                  placeholder="At least 6 characters"
                />
              </div>
              {/* Role selector for provider */}
              {roleOptions.length > 1 && (
                <div>
                  <label className="block text-blue-700 font-semibold mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out bg-blue-50 text-black"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="tiffinProvider">Tiffin Provider</option>
                  </select>
                </div>
              )}
              {error && (
                <div className="text-red-500 text-center font-semibold">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="text-green-600 text-center font-semibold">
                  {successMsg}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  mode.startsWith('signup')
                    ? roleOptions.length > 1
                      ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                    : roleOptions.length > 1
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900'
                } font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out mt-2 text-lg`}
              >
                {loading
                  ? mode.startsWith('signup')
                    ? 'Signing Up...'
                    : 'Signing In...'
                  : mode.startsWith('signup')
                  ? 'Sign Up'
                  : 'Sign In'}
              </button>
            </form>
            <div className="mt-6 text-blue-700">
              {mode.startsWith('signup') ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => handleOpen(`signin-${roleOptions.length > 1 ? 'provider' : 'user'}`)}
                    className="font-bold underline hover:text-cyan-600 transition-colors"
                  >
                    Sign In as {roleOptions.length > 1 ? 'Service Provider' : 'User'}
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button
                    onClick={() => handleOpen(`signup-${roleOptions.length > 1 ? 'provider' : 'user'}`)}
                    className="font-bold underline hover:text-cyan-600 transition-colors"
                  >
                    Sign Up as {roleOptions.length > 1 ? 'Service Provider' : 'User'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-blue-700 text-sm">
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:underline hover:text-cyan-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline hover:text-cyan-600 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:underline hover:text-cyan-600 transition-colors">
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;