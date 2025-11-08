import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Lazy load components for better performance
const VMAllocation = React.lazy(() => import('./pages/VMAllocation'));
const ServerStatus = React.lazy(() => import('./pages/ServerStatus'));
const EnergyMetrics = React.lazy(() => import('./pages/EnergyMetrics'));
const AlgorithmComparison = React.lazy(() => import('./pages/AlgorithmComparison'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 font-['Inter',sans-serif]">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                <Route 
                  path="vm-allocation" 
                  element={
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>}>
                      <VMAllocation />
                    </React.Suspense>
                  } 
                />
                
                <Route 
                  path="server-status" 
                  element={
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>}>
                      <ServerStatus />
                    </React.Suspense>
                  } 
                />
                
                <Route 
                  path="energy-metrics" 
                  element={
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>}>
                      <EnergyMetrics />
                    </React.Suspense>
                  } 
                />
                
                <Route 
                  path="algorithm-comparison" 
                  element={
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>}>
                      <AlgorithmComparison />
                    </React.Suspense>
                  } 
                />
                
                <Route 
                  path="settings" 
                  element={
                    <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>}>
                      <Settings />
                    </React.Suspense>
                  } 
                />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#F3F4F6',
                border: '1px solid #374151',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#F3F4F6',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#F3F4F6',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;