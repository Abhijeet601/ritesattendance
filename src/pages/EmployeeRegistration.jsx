import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Video,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import api from '../api/axios';
import CameraCapture from '../components/CameraCapture';

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    email: '',
    mobile_number: '',
    password: '',
  });
  const [faceVideo, setFaceVideo] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFaceVideo(file);
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) setDocument(file);
  };

  const handleVideoCapture = (blob) => {
    setFaceVideo(new File([blob], 'face_capture.mp4', { type: 'video/mp4' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!faceVideo) {
      setError('Face video is required');
      setLoading(false);
      return;
    }

    if (!document) {
      setError('Document is required');
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append('face_video', faceVideo);
      fd.append('document', document);

      const res = await api.post('/api/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Show success popup instead of message
      setShowSuccessPopup(true);

      setFormData({
        name: '',
        employee_id: '',
        email: '',
        mobile_number: '',
        password: '',
      });
      setFaceVideo(null);
      setDocument(null);
      if (videoInputRef.current) videoInputRef.current.value = '';
      if (documentInputRef.current) documentInputRef.current.value = '';

    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/rites-logo.jpeg"
              alt="RITES Logo"
              className="h-16 w-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Registration
            </h1>
            <p className="text-gray-600 text-center">
              Register with face verification
            </p>
          </div>

          {/* MESSAGES */}
          {message && (
            <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle size={18} />
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* EMPLOYEE ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* MOBILE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* FACE VIDEO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Face Video (Required)
              </label>
              <CameraCapture onCapture={handleVideoCapture} buttonText="Record Face Video" />
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                onChange={handleVideoUpload}
                className="mt-2 w-full border rounded-lg px-3 py-2"
              />
              {faceVideo && (
                <p className="text-green-600 text-sm mt-1">
                  ✓ {faceVideo.name}
                </p>
              )}
            </div>

            {/* DOCUMENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document (Required)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="file"
                  ref={documentInputRef}
                  onChange={handleDocumentUpload}
                  required
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                />
              </div>
              {document && (
                <p className="text-green-600 text-sm mt-1">
                  ✓ {document.name}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600
                hover:from-blue-700 hover:to-green-700
                text-white py-3 rounded-xl font-semibold shadow-lg
                disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 pt-6 border-t text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Already have an account? Login
            </Link>
          </div>

        </div>
      </motion.div>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              You have registered successfully. Please wait for admin approval.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-gradient-to-r from-blue-600 to-green-600
                hover:from-blue-700 hover:to-green-700
                text-white px-6 py-2 rounded-lg font-semibold"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default EmployeeRegistration;
