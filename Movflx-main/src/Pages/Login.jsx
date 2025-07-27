import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/login',
        { username: form.username, password: form.password },
        { withCredentials: true }
      );
      if (response.data) {
        setUser(response.data);
        toast.success('Login successful!');
        navigate('/personal');
      } else {
        setError('Invalid username or password');
        toast.error('Invalid username or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100">
      <div className="bg-white bg-opacity-5 p-8 rounded-xl backdrop-blur-lg shadow-lg w-80">
        <h2 className="text-2xl text-center mb-6">Login to your account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="username" className="text-sm mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="yourusername"
            required
            className="p-2 mb-4 bg-gray-700 text-gray-100 rounded-md"
          />
          <label htmlFor="password" className="text-sm mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="p-2 mb-4 bg-gray-700 text-gray-100 rounded-md"
          />
          <button
            type="submit"
            className="p-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-teal-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;