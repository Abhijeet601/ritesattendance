import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  Users,
  Calendar,
  Clock,
  LogOut,
  AlertTriangle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('registrations');
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingAttendance, setPendingAttendance] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile_number: '',
    base_location_lat: '',
    base_location_lon: '',
    base_location_name: ''
  });
  const [resetPasswordEmployee, setResetPasswordEmployee] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [adminProfile, setAdminProfile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    mobile_number: ''
  });

  const [filters, setFilters] = useState({
    employee_id: '',
    shift: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    if (activeTab === 'registrations') fetchPendingRegistrations();
    if (activeTab === 'attendance') fetchPendingAttendance();
    if (activeTab === 'employees') fetchEmployees();
    if (activeTab === 'reports') fetchAttendanceReport();
    if (activeTab === 'settings') fetchAdminProfile();
  }, [activeTab]);

  const fetchPendingRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/pending-registrations');
      setPendingRegistrations(res.data.pending_users);
    } catch {
      setError('Failed to fetch pending registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/pending-attendance');
      setPendingAttendance(res.data.pending_attendance);
    } catch {
      setError('Failed to fetch pending attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceReport = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
      const res = await api.get('/api/admin/attendance-report', { params });
      setAttendanceReport(res.data.attendance_data || []);
    } catch {
      setError('Failed to fetch attendance report');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/employees');
      setEmployees(res.data.employees || []);
    } catch {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (employeeId, updatedData) => {
    try {
      await api.put(`/api/admin/employees/${employeeId}`, updatedData);
      fetchEmployees();
      setEditingEmployee(null);
      setEditForm({
        name: '',
        email: '',
        mobile_number: '',
        base_location_lat: '',
        base_location_lon: '',
        base_location_name: ''
      });
    } catch {
      setError('Failed to update employee');
    }
  };

  const startEditing = (employee) => {
    setEditingEmployee(employee.id);
    setEditForm({
      name: employee.name,
      email: employee.email,
      mobile_number: employee.mobile_number,
      base_location_lat: employee.base_location_lat,
      base_location_lon: employee.base_location_lon,
      base_location_name: employee.base_location_name
    });
  };

  const cancelEditing = () => {
    setEditingEmployee(null);
    setEditForm({
      name: '',
      email: '',
      mobile_number: '',
      base_location_lat: '',
      base_location_lon: '',
      base_location_name: ''
    });
  };

  const approveRegistration = async (id, baseLocation) => {
    await api.post('/api/admin/approve-user', {
      user_id: id,
      base_location_lat: baseLocation.lat,
      base_location_lon: baseLocation.lon,
      base_location_name: baseLocation.name
    });
    fetchPendingRegistrations();
  };

  const handleAttendanceAction = async (id, status) => {
    await api.post('/api/admin/approve-attendance', {
      attendance_id: id,
      admin_status: status
    });
    fetchPendingAttendance();
  };

  const exportToCSV = () => {
    const headers = [
      'Employee ID','Name','Check-in Date','Check-in Time',
      'Check-out Time','Work Hours','Shift','System Status','Admin Status'
    ];

    const rows = attendanceReport.map(r => [
      r.employee_id,
      r.name,
      r.check_in_time ? new Date(r.check_in_time).toLocaleDateString() : 'N/A',
      r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString() : 'N/A',
      r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString() : 'N/A',
      r.work_hours || 'N/A',
      r.shift,
      r.system_status,
      r.admin_status
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_report.csv';
    a.click();
  };

  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/profile');
      setAdminProfile(res.data.admin);
      setProfileForm({
        name: res.data.admin.name,
        email: res.data.admin.email,
        mobile_number: res.data.admin.mobile_number
      });
    } catch {
      setError('Failed to fetch admin profile');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    try {
      await api.post('/api/admin/change-password', passwordForm);
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setError('');
      alert('Password changed successfully');
    } catch {
      setError('Failed to change password');
    }
  };

  const updateProfile = async () => {
    try {
      await api.put('/api/admin/profile', profileForm);
      fetchAdminProfile();
      setError('');
      alert('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    }
  };

  const resetPassword = async () => {
    if (!newPassword.trim()) {
      setError('Password cannot be empty');
      return;
    }
    try {
      await api.post('/api/admin/reset-password', {
        user_id: resetPasswordEmployee.id,
        new_password: newPassword
      });
      setResetPasswordEmployee(null);
      setNewPassword('');
      setError('');
      alert('Password reset successfully');
    } catch {
      setError('Failed to reset password');
    }
  };

  const stats = {
    totalEmployees: new Set(attendanceReport.map(r => r.employee_id)).size,
    todayAttendance: attendanceReport.filter(r =>
      r.check_in_time &&
      new Date(r.check_in_time).toDateString() === new Date().toDateString()
    ).length,
    totalRecords: attendanceReport.length
  };

  // Helper functions for charts and alerts
  const getAttendanceTrendData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayRecords = attendanceReport.filter(r =>
        r.check_in_time && r.check_in_time.startsWith(dateStr)
      );
      const present = dayRecords.filter(r => r.admin_status === 'approved').length;
      const late = dayRecords.filter(r => {
        if (!r.check_in_time) return false;
        const checkInTime = new Date(r.check_in_time);
        const shiftStart = r.shift === 'A' ? 9 : r.shift === 'B' ? 14 : r.shift === 'C' ? 22 : 9;
        return checkInTime.getHours() >= shiftStart + 1; // Late if more than 1 hour after shift start
      }).length;
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present,
        late
      });
    }
    return last7Days;
  };

  const getShiftDistributionData = () => {
    const shifts = {};
    attendanceReport.forEach(r => {
      shifts[r.shift] = (shifts[r.shift] || 0) + 1;
    });
    return Object.entries(shifts).map(([shift, count]) => ({
      name: shift.toUpperCase(),
      value: count
    }));
  };

  const getLateAttendanceAlerts = () => {
    return attendanceReport
      .filter(r => {
        if (!r.check_in_time || r.admin_status !== 'approved') return false;
        const checkInTime = new Date(r.check_in_time);
        const shiftStart = r.shift === 'A' ? 9 : r.shift === 'B' ? 14 : r.shift === 'C' ? 22 : 9;
        const lateMinutes = Math.floor((checkInTime.getTime() - new Date(checkInTime).setHours(shiftStart, 0, 0, 0)) / (1000 * 60));
        return lateMinutes > 15; // Late if more than 15 minutes
      })
      .map(r => {
        const checkInTime = new Date(r.check_in_time);
        const shiftStart = r.shift === 'A' ? 9 : r.shift === 'B' ? 14 : r.shift === 'C' ? 22 : 9;
        const lateMinutes = Math.floor((checkInTime.getTime() - new Date(checkInTime).setHours(shiftStart, 0, 0, 0)) / (1000 * 60));
        return {
          ...r,
          lateMinutes
        };
      })
      .slice(0, 10); // Show top 10 late attendances
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
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>

            <div className="flex gap-3">
              {activeTab === 'reports' && (
                <button
                  onClick={exportToCSV}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <Download size={18} className="mr-2" />
                  Export CSV
                </button>
              )}
              <button
                onClick={() => { logout(); navigate('/admin/login'); }}
                className="flex items-center border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          {['registrations', 'attendance', 'employees', 'reports', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-medium transition
                ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white shadow text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* STATS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm">Total Employees</p>
              <p className="text-4xl font-bold">{stats.totalEmployees}</p>
              <Users className="opacity-40 absolute right-6 top-6" size={40} />
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm">Today's Attendance</p>
              <p className="text-4xl font-bold">{stats.todayAttendance}</p>
              <Calendar className="opacity-40 absolute right-6 top-6" size={40} />
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm">Total Records</p>
              <p className="text-4xl font-bold">{stats.totalRecords}</p>
              <Clock className="opacity-40 absolute right-6 top-6" size={40} />
            </div>
          </div>
        )}

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* ================= REGISTRATIONS ================= */}
        {activeTab === 'registrations' && (
          <div className="grid gap-6">
            {pendingRegistrations.map(reg => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><b>Name:</b> {reg.name}</p>
                    <p><b>Employee ID:</b> {reg.employee_id}</p>
                    <p><b>Email:</b> {reg.email}</p>
                    <p><b>Mobile:</b> {reg.mobile_number}</p>
                  </div>

                  <div className="space-y-2">
                    <input
                      placeholder="Location Name"
                      className="w-full border rounded-lg p-2"
                      onChange={e => reg.baseLocationName = e.target.value}
                    />
                    <input
                      placeholder="Latitude"
                      type="number"
                      step="any"
                      className="w-full border rounded-lg p-2"
                      onChange={e => reg.baseLocationLat = e.target.value}
                    />
                    <input
                      placeholder="Longitude"
                      type="number"
                      step="any"
                      className="w-full border rounded-lg p-2"
                      onChange={e => reg.baseLocationLon = e.target.value}
                    />
                    <button
                      onClick={() => approveRegistration(reg.id, {
                        lat: reg.baseLocationLat,
                        lon: reg.baseLocationLon,
                        name: reg.baseLocationName
                      })}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= ATTENDANCE ================= */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <tr>
                  <th className="p-4">Emp ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Check-in</th>
                  <th className="p-4">Check-out</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingAttendance.map(att => (
                  <tr key={att.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{att.employee_id}</td>
                    <td className="p-4">{att.name}</td>
                    <td className="p-4">{new Date(att.check_in_time).toLocaleString()}</td>
                    <td className="p-4">{att.check_out_time ? new Date(att.check_out_time).toLocaleString() : 'Not checked out'}</td>
                    <td className="p-4">{att.system_status}</td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => handleAttendanceAction(att.id, 'approved')}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAttendanceAction(att.id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= EMPLOYEES ================= */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <tr>
                  <th className="p-4">Emp ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Base Location</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{emp.employee_id}</td>
                    <td className="p-4">
                      {editingEmployee === emp.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full border rounded p-1"
                        />
                      ) : (
                        emp.name
                      )}
                    </td>
                    <td className="p-4">
                      {editingEmployee === emp.id ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full border rounded p-1"
                        />
                      ) : (
                        emp.email
                      )}
                    </td>
                    <td className="p-4">
                      {editingEmployee === emp.id ? (
                        <input
                          type="text"
                          value={editForm.mobile_number}
                          onChange={(e) => setEditForm({ ...editForm, mobile_number: e.target.value })}
                          className="w-full border rounded p-1"
                        />
                      ) : (
                        emp.mobile_number
                      )}
                    </td>
                    <td className="p-4">
                      {editingEmployee === emp.id ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            placeholder="Location Name"
                            value={editForm.base_location_name}
                            onChange={(e) => setEditForm({ ...editForm, base_location_name: e.target.value })}
                            className="w-full border rounded p-1 text-sm"
                          />
                          <input
                            type="number"
                            step="any"
                            placeholder="Lat"
                            value={editForm.base_location_lat}
                            onChange={(e) => setEditForm({ ...editForm, base_location_lat: e.target.value })}
                            className="w-full border rounded p-1 text-sm"
                          />
                          <input
                            type="number"
                            step="any"
                            placeholder="Lon"
                            value={editForm.base_location_lon}
                            onChange={(e) => setEditForm({ ...editForm, base_location_lon: e.target.value })}
                            className="w-full border rounded p-1 text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{emp.base_location_name}</p>
                          <p className="text-sm text-gray-600">
                            {emp.base_location_lat}, {emp.base_location_lon}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="p-4 space-x-2">
                      {editingEmployee === emp.id ? (
                        <>
                          <button
                            onClick={() => updateEmployee(emp.id, editForm)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(emp)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setResetPasswordEmployee(emp)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Reset Password
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RESET PASSWORD MODAL */}
        {resetPasswordEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Reset Password for {resetPasswordEmployee.name}</h3>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={resetPassword}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => { setResetPasswordEmployee(null); setNewPassword(''); }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= REPORTS ================= */}
        {activeTab === 'reports' && (
          <>
            {/* QUICK FILTERS */}
            <div className="bg-white p-4 rounded-2xl shadow mb-4">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => {
                    const today = new Date();
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setFilters({
                      ...filters,
                      start_date: weekAgo.toISOString().split('T')[0],
                      end_date: today.toISOString().split('T')[0]
                    });
                    setTimeout(fetchAttendanceReport, 100);
                  }}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition"
                >
                  <Calendar size={16} />
                  This Week
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() + 1);
                    setFilters({
                      ...filters,
                      start_date: monthAgo.toISOString().split('T')[0],
                      end_date: today.toISOString().split('T')[0]
                    });
                    setTimeout(fetchAttendanceReport, 100);
                  }}
                  className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition"
                >
                  <TrendingUp size={16} />
                  This Month
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                <input className="border p-2 rounded" placeholder="Employee ID"
                  onChange={e => setFilters({ ...filters, employee_id: e.target.value })} />
                <select className="border p-2 rounded"
                  onChange={e => setFilters({ ...filters, shift: e.target.value })}>
                  <option value="">All Shifts</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="general">General</option>
                  <option value="01:00-09:30">01:00-09:30</option>
                  <option value="06:00-14:30">06:00-14:30</option>
                  <option value="08:00-16:30">08:00-16:30</option>
                  <option value="09:00-17:30">09:00-17:30</option>
                  <option value="10:00-18:00">10:00-18:00</option>
                  <option value="10:00-18:30">10:00-18:30</option>
                  <option value="14:00-22:30">14:00-22:30</option>
                  <option value="17:00-01:30">17:00-01:30</option>
                  <option value="21:00-05:30">21:00-05:30</option>
                  <option value="22:00-06:30">22:00-06:30</option>
                </select>
                <input type="date" className="border p-2 rounded"
                  onChange={e => setFilters({ ...filters, start_date: e.target.value })} />
                <input type="date" className="border p-2 rounded"
                  onChange={e => setFilters({ ...filters, end_date: e.target.value })} />
                <button onClick={fetchAttendanceReport} className="bg-blue-600 text-white px-4 rounded">
                  Filter
                </button>
              </div>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* ATTENDANCE TREND CHART */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" />
                  Attendance Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getAttendanceTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* SHIFT DISTRIBUTION CHART */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="text-purple-600" />
                  Shift Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getShiftDistributionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getShiftDistributionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* LATE ATTENDANCE ALERTS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-600" />
                Late Attendance Alerts
              </h3>
              <div className="space-y-3">
                {getLateAttendanceAlerts().map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={20} className="text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">{alert.employee_id} - {alert.name}</p>
                        <p className="text-sm text-red-600">Late by {alert.lateMinutes} minutes on {new Date(alert.check_in_time).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-semibold">{alert.shift}</span>
                  </div>
                ))}
                {getLateAttendanceAlerts().length === 0 && (
                  <p className="text-green-600 text-center py-4">No late attendance records found</p>
                )}
              </div>
            </motion.div>
          </>
        )}

        {/* ================= SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="grid gap-6">
            {/* PROFILE UPDATE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={profileForm.mobile_number}
                  onChange={(e) => setProfileForm({ ...profileForm, mobile_number: e.target.value })}
                  className="border rounded-lg p-2"
                />
              </div>
              <button
                onClick={updateProfile}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Profile
              </button>
            </motion.div>

            {/* CHANGE PASSWORD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className="border rounded-lg p-2"
                />
              </div>
              <button
                onClick={changePassword}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Change Password
              </button>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
