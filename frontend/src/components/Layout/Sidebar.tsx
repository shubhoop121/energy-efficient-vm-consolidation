import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Server,
  Activity,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  Cloud,
  Users,
  Shield,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard Overview',
      roles: ['admin', 'viewer']
    },
    { 
      path: '/vm-allocation', 
      icon: Server, 
      label: 'VM Allocation',
      roles: ['admin', 'viewer']
    },
    { 
      path: '/server-status', 
      icon: Activity, 
      label: 'Server Status',
      roles: ['admin', 'viewer']
    },
    { 
      path: '/energy-metrics', 
      icon: Zap, 
      label: 'Energy Metrics',
      roles: ['admin', 'viewer']
    },
    { 
      path: '/algorithm-comparison', 
      icon: BarChart3, 
      label: 'Algorithm Comparison',
      roles: ['admin', 'viewer']
    },
    { 
      path: '/user-management', 
      icon: Users, 
      label: 'User Management',
      roles: ['admin']
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings',
      roles: ['admin', 'viewer']
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'viewer')
  );

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SCRO</h1>
              <p className="text-xs text-gray-400">Smart Cloud Optimizer</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/25'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 w-full group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-white" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;