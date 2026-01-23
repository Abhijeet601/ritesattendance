import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Clock, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    password: '',
    shift: 'general',
  });
  const [showOtherShifts, setShowOtherShifts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/login', formData);

      const userData = {
        employee_id: response.data.user_name,
        role: 'employee',
        shift: response.data.shift,
      };

      login(userData, response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <motion.img
              src="/rites-logo.jpeg"
              alt="Company Logo"
              className="w-40 h-20 rounded-2xl shadow-lg mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="text-2xl font-semibold text-gray-700 mb-1">
              Employee Login
            </h2>
            <p className="text-gray-600 text-center">
              Access your attendance dashboard
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMPLOYEE ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter employee ID"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {/* SHIFT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shift
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={(e) => {
                    handleInputChange(e);
                    setShowOtherShifts(e.target.value === 'other');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="A">Shift A (06:00 - 14:00)</option>
                  <option value="B">Shift B (14:00 - 22:00)</option>
                  <option value="C">Shift C (22:00 - 06:00)</option>
                  <option value="general">General (09:00 - 17:00)</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {showOtherShifts && (
                <div className="mt-2 relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="01:00-09:30">01:00 - 09:30</option>
                    <option value="06:00-14:30">06:00 - 14:30</option>
                    <option value="08:00-16:30">08:00 - 16:30</option>
                    <option value="09:00-17:30">09:00 - 17:30</option>
                    <option value="10:00-18:00">10:00 - 18:00</option>
                    <option value="10:00-18:30">10:00 - 18:30</option>
                    <option value="14:00-22:30">14:00 - 22:30</option>
                    <option value="17:00-01:30">17:00 - 01:30 (Night)</option>
                    <option value="21:00-05:30">21:00 - 05:30 (Night)</option>
                    <option value="22:00-06:30">22:00 - 06:30 (Night)</option>
                  </select>
                </div>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600
                hover:from-blue-700 hover:to-green-700
                text-white py-3 text-lg font-semibold rounded-xl
                shadow-lg hover:shadow-xl transition
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

          {/* LINKS */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-2">
            <Link
              to="/register"
              className="block text-blue-600 hover:text-blue-800 transition"
            >
              Don’t have an account? Register
            </Link>

            <Link
              to="/admin-login"
              className="block text-gray-500 hover:text-gray-800 transition"
            >
              Admin Login
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeLogin;
