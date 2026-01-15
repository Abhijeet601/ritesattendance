import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const MyAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ start_date: '', end_date: '' });
  const { user } = useAuth();

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const res = await api.get('/api/user/my-attendance', { params });
      setAttendanceRecords(res.data.attendance_records);
    } catch {
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const badge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'approved':
        return `${base} bg-green-100 text-green-700`;
      case 'pending':
        return `${base} bg-yellow-100 text-yellow-700`;
      case 'rejected':
      case 'flagged':
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            My Attendance
          </h1>
          <p className="text-gray-600">
            View and track your attendance history
          </p>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Calendar size={18} />
            Filter Records
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {['start_date', 'end_date'].map((f) => (
              <div key={f}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {f === 'start_date' ? 'Start Date' : 'End Date'}
                </label>
                <input
                  type="date"
                  name={f}
                  value={filters[f]}
                  onChange={(e) =>
                    setFilters({ ...filters, [e.target.name]: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    outline-none transition"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">
              Loading attendance records...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-red-600 flex items-center justify-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No attendance records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Date',
                      'Check-in',
                      'Check-out',
                      'Shift',
                      'Hours',
                      'System',
                      'Admin',
                      'Warning',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {attendanceRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {r.check_in_time
                          ? new Date(r.check_in_time).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {r.check_in_time
                          ? new Date(r.check_in_time).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {r.check_out_time
                          ? new Date(r.check_out_time).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-6 py-4">{r.shift}</td>
                      <td className="px-6 py-4">
                        {r.work_hours ? `${r.work_hours.toFixed(2)}h` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={badge(r.system_status)}>
                          {r.system_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={badge(r.admin_status || 'pending')}>
                          {r.admin_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {r.warning_message || 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default MyAttendance;
