import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ListChecks, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Dashboard
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <User size={16} />
            {user.employee_id} | Shift: {user.shift}
          </p>
        </motion.div>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* MARK ATTENDANCE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600
              rounded-2xl shadow-lg p-6 text-white"
          >
            <Clock size={40} className="opacity-40 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Mark Attendance
            </h2>
            <p className="text-blue-100 mb-4">
              Capture your face and location to mark attendance
            </p>

            <Link
              to="/attendance"
              className="inline-block bg-white text-blue-600 font-semibold
                px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition"
            >
              Go to Attendance
            </Link>
          </motion.div>

          {/* MY ATTENDANCE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600
              rounded-2xl shadow-lg p-6 text-white"
          >
            <ListChecks size={40} className="opacity-40 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              My Attendance History
            </h2>
            <p className="text-green-100 mb-4">
              View your past attendance records
            </p>

            <Link
              to="/my-attendance"
              className="inline-block bg-white text-green-600 font-semibold
                px-6 py-3 rounded-xl shadow hover:bg-green-50 transition"
            >
              View History
            </Link>
          </motion.div>

        </div>

        {/* LOGOUT */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2
              border border-red-300 text-red-600
              px-6 py-3 rounded-xl hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
