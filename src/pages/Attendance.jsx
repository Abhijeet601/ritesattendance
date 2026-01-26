import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import CameraCapture from '../components/CameraCapture';
import Navbar from '../components/Navbar';

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  // avoid state updates after unmount
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ================= LOCATION =================
  const getLocation = useCallback((setState = true) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        if (isMountedRef.current) {
          setLocationError('Geolocation is not supported by this browser.');
        }
        reject(new Error('Geolocation not supported'));
        return;
      }

      if (isMountedRef.current) setLocationError('');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          if (setState && isMountedRef.current) setLocation(loc);
          resolve(loc);
        },
        () => {
          if (isMountedRef.current) {
            setLocationError('Unable to retrieve your location. Please enable location services.');
          }
          reject(new Error('Location permission / retrieval failed'));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  useEffect(() => {
    getLocation().catch(() => {
      // locationError already set inside getLocation
    });
  }, [getLocation]);

  const handleImageCapture = useCallback((blob) => {
    setCapturedImage(blob);
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = useCallback(async () => {
    if (!capturedImage) {
      setError('Please capture your face image first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const currentLocation = await getLocation(false);

      const formData = new FormData();
      formData.append('live_image', capturedImage, 'attendance.jpg');
      formData.append('latitude', String(currentLocation.latitude));
      formData.append('longitude', String(currentLocation.longitude));

      const res = await api.post('/api/attendance/mark', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const msgParts = [];
      if (res?.data?.message) msgParts.push(res.data.message);
      if (res?.data?.work_hours) msgParts.push(`Work Hours: ${res.data.work_hours}`);
      if (res?.data?.warning) msgParts.push(`Warning: ${res.data.warning}`);

      setMessage(msgParts.join(' | '));

      setCapturedImage(null);

      // refresh visible location
      getLocation().catch(() => {
        // ignore; locationError handled
      });

      // Navigate to dashboard after successful attendance marking
      window.setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Attendance marking failed';
      setError(detail);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [capturedImage, getLocation, navigate]);

  if (!user) return null;

  const canSubmit = !loading && !!capturedImage && !!location;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800">Mark Attendance</h1>
          <p className="text-gray-600">
            Employee ID: {user.employee_id} | Shift: {user.shift}
          </p>
        </motion.div>

        {/* MESSAGE */}
        {message && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <CheckCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LOCATION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="text-blue-600" /> Location Verification
            </h2>

            {location ? (
              <div className="text-green-600">
                ✓ Location Captured
                <p className="text-sm text-gray-500 mt-1">
                  Lat: {Number(location.latitude).toFixed(6)} | Lng: {Number(location.longitude).toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="text-red-600">
                {locationError || 'Fetching location...'}
                <button
                  onClick={() => getLocation().catch(() => {})}
                  className="block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm"
                >
                  Retry Location
                </button>
              </div>
            )}
          </motion.div>

          {/* FACE VERIFICATION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Camera className="text-purple-600" /> Face Verification
            </h2>

            <div className="space-y-4">
              <CameraCapture onCapture={handleImageCapture} buttonText="Capture Face" />
              {capturedImage && (
                <p className="text-green-600 mt-2">✓ Face image captured successfully</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* SUBMIT */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-gradient-to-r from-blue-600 to-green-600
              hover:from-blue-700 hover:to-green-700
              text-white font-semibold px-8 py-3 rounded-xl shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Marking Attendance...' : 'Mark Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
