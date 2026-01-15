import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, User, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post(
        '/api/auth/admin/login',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      login(
        {
          employee_id: response.data.user.username,
          name: response.data.user.name,
          role: 'admin',
        },
        response.data.token
      );

      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Geo Attendance System</title>
        <meta
          name="description"
          content="Administrator login portal for geo-location attendance management"
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="/rites-logo.jpeg"
                alt="RITES Logo"
                className="h-16 w-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-600 text-center">
                Secure access to attendance management
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="Enter employee ID"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600
                  hover:from-blue-700 hover:to-green-700
                  text-white py-3 text-lg font-semibold rounded-lg
                  transition-all shadow-lg hover:shadow-xl
                  disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2" size={20} />
                    Login
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/login"
                className="w-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition"
              >
                <User className="mr-2" size={18} />
                Employee Login
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
