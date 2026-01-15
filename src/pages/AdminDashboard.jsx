import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, Eye, LogOut, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingAttendance, setPendingAttendance] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    employee_id: '',
    shift: '',
    start_date: '',
    end_date: ''
  });
  const [selectedImages, setSelectedImages] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'pending-users') fetchPendingUsers();
    if (activeTab === 'pending-attendance') fetchPendingAttendance();
    if (activeTab === 'reports') fetchAttendanceReport();
    if (activeTab === 'employees') fetchEmployees();
  }, [activeTab]);

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get('/api/admin/pending-registrations');
      setPendingUsers(res.data.pending_users);
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
    }
  };

  const fetchPendingAttendance = async () => {
    try {
      const res = await api.get('/api/admin/pending-attendance');
      setPendingAttendance(res.data.pending_attendance);
    } catch (err) {
      console.error('Failed to fetch pending attendance:', err);
    }
  };

  const fetchAttendanceReport = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await api.get(`/api/admin/attendance-report?${params}`);
      setAttendanceReport(res.data.attendance_data);
    } catch (err) {
      console.error('Failed to fetch attendance report:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/admin/employees');
      setEmployees(res.data.employees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleApproveUser = async (userId, baseLocation) => {
    try {
      await api.post('/api/admin/approve-user', {
        user_id: userId,
        base_location_lat: baseLocation.lat,
        base_location_lon: baseLocation.lng,
        base_location_name: baseLocation.name
      });
      fetchPendingUsers();
    } catch (err) {
      console.error('Failed to approve user:', err);
    }
  };

  const handleAttendanceApproval = async (attendanceId, status, remarks = '') => {
    try {
      await api.post('/api/admin/approve-attendance', {
        attendance_id: attendanceId,
        admin_status: status,
        remarks
      });
      fetchPendingAttendance();
    } catch (err) {
      console.error('Failed to approve attendance:', err);
    }
  };

  const handleViewImages = (record) => {
    setSelectedImages({
      checkInImage: record.check_in_image_path ? `${api.defaults.baseURL}${record.check_in_image_path}` : null,
      checkOutImage: record.check_out_image_path ? `${api.defaults.baseURL}${record.check_out_image_path}` : null,
      dailyPhoto: record.daily_photo_path ? `${api.defaults.baseURL}${record.daily_photo_path}` : null,
      employeeId: record.employee_id,
      name: record.name,
      date: record.check_in_time ? new Date(record.check_in_time).toLocaleDateString() : 'N/A'
    });
    setShowImageModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'pending-users', label: 'Pending Users', icon: Users },
    { id: 'pending-attendance', label: 'Pending Attendance', icon: CheckCircle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'employees', label: 'Employees', icon: Users }
  ];

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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.name}
          </p>
        </motion.div>

        {/* TABS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <Users className="text-blue-600 mb-2" size={24} />
                <h3 className="text-lg font-semibold">Total Employees</h3>
                <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl">
                <FileText className="text-yellow-600 mb-2" size={24} />
                <h3 className="text-lg font-semibold">Pending Users</h3>
                <p className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl">
                <CheckCircle className="text-orange-600 mb-2" size={24} />
                <h3 className="text-lg font-semibold">Pending Attendance</h3>
                <p className="text-2xl font-bold text-orange-600">{pendingAttendance.length}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <Calendar className="text-green-600 mb-2" size={24} />
                <h3 className="text-lg font-semibold">Total Records</h3>
                <p className="text-2xl font-bold text-green-600">{attendanceReport.length}</p>
              </div>
            </div>
          )}

          {/* PENDING USERS */}
          {activeTab === 'pending-users' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Pending User Registrations</h2>
              {pendingUsers.length === 0 ? (
                <p className="text-gray-500">No pending registrations</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-gray-600">ID: {user.employee_id}</p>
                          <p className="text-gray-600">Email: {user.email}</p>
                          <p className="text-gray-600">Mobile: {user.mobile_number}</p>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleApproveUser(user.id, {
                              lat: 28.6139, lng: 77.2090, name: 'Delhi, India'
                            })}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PENDING ATTENDANCE */}
          {activeTab === 'pending-attendance' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Pending Attendance Approvals</h2>
              {pendingAttendance.length === 0 ? (
                <p className="text-gray-500">No pending attendance</p>
              ) : (
                <div className="space-y-4">
                  {pendingAttendance.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{record.name} ({record.employee_id})</h3>
                          <p className="text-gray-600">Check-in: {new Date(record.check_in_time).toLocaleString()}</p>
                          {record.check_out_time && (
                            <p className="text-gray-600">Check-out: {new Date(record.check_out_time).toLocaleString()}</p>
                          )}
                          <p className="text-gray-600">Shift: {record.shift}</p>
                          {record.work_hours && (
                            <p className="text-gray-600">Work Hours: {record.work_hours}</p>
                          )}
                          {record.warning_message && (
                            <p className="text-red-600">Warning: {record.warning_message}</p>
                          )}
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleAttendanceApproval(record.id, 'approved')}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAttendanceApproval(record.id, 'rejected')}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORTS */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Attendance Reports</h2>

              {/* FILTERS */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={filters.employee_id}
                    onChange={(e) => setFilters({...filters, employee_id: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={filters.shift}
                    onChange={(e) => setFilters({...filters, shift: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">All Shifts</option>
                    <option value="A">Shift A</option>
                    <option value="B">Shift B</option>
                    <option value="C">Shift C</option>
                    <option value="general">General</option>
                  </select>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => setFilters({...filters, start_date: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => setFilters({...filters, end_date: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <button
                  onClick={fetchAttendanceReport}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>

              {/* REPORT TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">Employee</th>
                      <th className="border p-3 text-left">Check-in</th>
                      <th className="border p-3 text-left">Check-out</th>
                      <th className="border p-3 text-left">Shift</th>
                      <th className="border p-3 text-left">Work Hours</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceReport.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="border p-3">
                          <div>
                            <div className="font-semibold">{record.name}</div>
                            <div className="text-gray-600">{record.employee_id}</div>
                          </div>
                        </td>
                        <td className="border p-3">
                          {record.check_in_time ? new Date(record.check_in_time).toLocaleString() : 'N/A'}
                        </td>
                        <td className="border p-3">
                          {record.check_out_time ? new Date(record.check_out_time).toLocaleString() : 'N/A'}
                        </td>
                        <td className="border p-3">{record.shift}</td>
                        <td className="border p-3">{record.work_hours || 'N/A'}</td>
                        <td className="border p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            record.admin_status === 'approved' ? 'bg-green-100 text-green-800' :
                            record.admin_status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.admin_status || record.system_status}
                          </span>
                        </td>
                        <td className="border p-3">
                          <button
                            onClick={() => handleViewImages(record)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex items-center gap-1"
                          >
                            <Eye size={14} />
                            View Images
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EMPLOYEES */}
          {activeTab === 'employees' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Employee Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">Employee ID</th>
                      <th className="border p-3 text-left">Name</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Base Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="border p-3">{emp.employee_id}</td>
                        <td className="border p-3">{emp.name}</td>
                        <td className="border p-3">{emp.email}</td>
                        <td className="border p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            emp.registration_status === 'approved' ? 'bg-green-100 text-green-800' :
                            emp.registration_status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emp.registration_status}
                          </span>
                        </td>
                        <td className="border p-3">
                          {emp.base_location_name ? `${emp.base_location_name} (${emp.base_location_lat?.toFixed(4)}, ${emp.base_location_lon?.toFixed(4)})` : 'Not set'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </motion.div>

        {/* IMAGE MODAL */}
        {showImageModal && selectedImages && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  Images for {selectedImages.name} ({selectedImages.employeeId}) - {selectedImages.date}
                </h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedImages.checkInImage && (
                  <div>
                    <h4 className="font-semibold mb-2">Check-in Face Image</h4>
                    <img
                      src={selectedImages.checkInImage}
                      alt="Check-in"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}

                {selectedImages.dailyPhoto && (
                  <div>
                    <h4 className="font-semibold mb-2">Daily Photo</h4>
                    <img
                      src={selectedImages.dailyPhoto}
                      alt="Daily Photo"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}

                {selectedImages.checkOutImage && (
                  <div>
                    <h4 className="font-semibold mb-2">Check-out Face Image</h4>
                    <img
                      src={selectedImages.checkOutImage}
                      alt="Check-out"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {(!selectedImages.checkInImage && !selectedImages.dailyPhoto && !selectedImages.checkOutImage) && (
                <p className="text-gray-500 text-center py-8">No images available for this record</p>
              )}
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-red-300 text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
