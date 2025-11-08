import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'viewer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center border border-gray-700"
        >
          <div className="mb-6">
            <ShieldX className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400">
              You don't have permission to access this page. 
              This feature requires {requiredRole} privileges.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-300">Your Role: 
                <span className="text-teal-400 font-semibold ml-1 capitalize">
                  {user?.role}
                </span>
              </p>
              <p className="text-sm text-gray-300">Required: 
                <span className="text-red-400 font-semibold ml-1 capitalize">
                  {requiredRole}
                </span>
              </p>
            </div>
            
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};