import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <p className="text-gray-600 font-medium">
            Verifying access…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm">
          <ShieldAlert className="mx-auto mb-4 text-red-500" size={40} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don’t have permission to access this page.
          </p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
