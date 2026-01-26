import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Clock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const REQUIRED_WORK_MINUTES = 8 * 60 + 30; // ✅ 510 minutes = 8:30

const SHIFT_MAP = {
  A: { label: 'Shift A (06:00 - 14:30)', time: '06:00-14:30' },   // ✅ 8:30
  B: { label: 'Shift B (14:00 - 22:30)', time: '14:00-22:30' },   // ✅ 8:30
  C: { label: 'Shift C (22:00 - 06:30)', time: '22:00-06:30' },   // ✅ 8:30
  general: { label: 'General (09:00 - 17:30)', time: '09:00-17:30' }, // ✅ 8:30
  other: { label: 'Other (Choose timing)', time: null },
};

const OTHER_SHIFT_OPTIONS = [
  // ✅ keep 8:30 options at top
  { label: '06:00 - 14:30 (8:30)', value: '06:00-14:30' },
  { label: '08:00 - 16:30 (8:30)', value: '08:00-16:30' },
  { label: '09:00 - 17:30 (8:30)', value: '09:00-17:30' },
  { label: '10:00 - 18:30 (8:30)', value: '10:00-18:30' },
  { label: '14:00 - 22:30 (8:30)', value: '14:00-22:30' },
  { label: '17:00 - 01:30 (Night) (8:30)', value: '17:00-01:30' },
  { label: '21:00 - 05:30 (Night) (8:30)', value: '21:00-05:30' },
  { label: '22:00 - 06:30 (Night) (8:30)', value: '22:00-06:30' },

  // If you want ONLY 8:30 options, remove any non-8:30 entries.
];

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    password: '',
    shift_type: 'general',       // A | B | C | general | other
    custom_shift: '09:00-17:30', // used only when shift_type === other
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // shift_type changed
      if (name === 'shift_type') {
        // When switching away from "other", keep custom_shift but it won't be used.
        // When switching to "other", ensure custom_shift has a default.
        return {
          ...prev,
          shift_type: value,
          custom_shift: value === 'other' ? (prev.custom_shift || '09:00-17:30') : prev.custom_shift,
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const getSelectedShiftTime = () => {
    // If other: use custom shift timing
    if (formData.shift_type === 'other') return formData.custom_shift;

    // For A/B/C/general: mapped 8:30 timings
    return SHIFT_MAP[formData.shift_type]?.time || '09:00-17:30';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedShiftTime = getSelectedShiftTime();

      // ✅ Recommended payload (login should validate only id+password)
      const payload = {
        employee_id: formData.employee_id,
        password: formData.password,
      };

      // ✅ If your backend needs shift at login, use this payload instead:
      // const payload = {
      //   employee_id: formData.employee_id,
      //   password: formData.password,
      //   shift_type: formData.shift_type,
      //   shift_time: selectedShiftTime, // e.g. "09:00-17:30"
      //   required_work_minutes: REQUIRED_WORK_MINUTES, // 510
      // };

      const response = await api.post('/api/login', payload);

      // ✅ Save shift info locally for whole app usage
      const userData = {
        employee_id: response.data.user_name,
        role: 'employee',

        // store shift selection
        shift_type: formData.shift_type,
        shift_time: selectedShiftTime, // ✅ always 8:30 timing selected

        // store required working hours
        required_work_minutes: REQUIRED_WORK_MINUTES, // ✅ 510 (8:30)
      };

      login(userData, response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const showOther = formData.shift_type === 'other';

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

            {/* ✅ Always show working hours rule */}
            <p className="mt-2 text-xs text-gray-500">
              Working hours required: <span className="font-semibold">8:30</span> (510 minutes)
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

            {/* SHIFT TYPE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shift Type
              </label>

              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="shift_type"
                  value={formData.shift_type}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="A">{SHIFT_MAP.A.label}</option>
                  <option value="B">{SHIFT_MAP.B.label}</option>
                  <option value="C">{SHIFT_MAP.C.label}</option>
                  <option value="general">{SHIFT_MAP.general.label}</option>
                  <option value="other">{SHIFT_MAP.other.label}</option>
                </select>
              </div>

              {/* OTHER SHIFT TIMINGS */}
              {showOther && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Shift Timing
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      name="custom_shift"
                      value={formData.custom_shift}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      {OTHER_SHIFT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Preview */}
              <p className="mt-2 text-xs text-gray-500">
                Selected shift timing: <span className="font-semibold">{getSelectedShiftTime()}</span> (8:30)
              </p>
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
            <Link to="/register" className="block text-blue-600 hover:text-blue-800 transition">
              Don’t have an account? Register
            </Link>

            <Link to="/admin-login" className="block text-gray-500 hover:text-gray-800 transition">
              Admin Login
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeLogin;
