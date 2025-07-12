import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Lock, 
  Key, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Download,
  Upload,
  RefreshCw,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password changed successfully!');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleGenerateApiKey = () => {
    const newKey = `scro_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    navigator.clipboard.writeText(newKey);
    toast.success('New API key generated and copied to clipboard!');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xl">{user?.name}</h4>
              <p className="text-gray-400">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Shield className="w-4 h-4 text-teal-400" />
                <span className="text-teal-400 text-sm capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleChangePassword}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">JWT Token Management</h3>
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Current Session Token</h4>
              <p className="text-gray-400 text-sm">Token expires in 24 hours</p>
            </div>
            <button
              onClick={() => toast.success('Token refreshed successfully!')}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Token</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          {[
            { id: 'server-alerts', label: 'Server Health Alerts', description: 'Get notified when servers exceed threshold limits' },
            { id: 'vm-migrations', label: 'VM Migration Updates', description: 'Notifications for VM placement and migration events' },
            { id: 'energy-reports', label: 'Energy Consumption Reports', description: 'Daily and weekly energy usage summaries' },
            { id: 'algorithm-updates', label: 'Algorithm Performance', description: 'Updates on Q-Learning optimization progress' },
            { id: 'system-maintenance', label: 'System Maintenance', description: 'Scheduled maintenance and system updates' },
          ].map((notification) => (
            <div key={notification.id} className="flex items-center justify-between py-3 border-b border-gray-600 last:border-b-0">
              <div>
                <h4 className="text-white font-medium">{notification.label}</h4>
                <p className="text-gray-400 text-sm">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Display Preferences</h3>
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <select className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Dark (Current)</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dashboard Refresh Rate
            </label>
            <select className="w-full md:w-1/2 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>Real-time (2s)</option>
              <option>Fast (5s)</option>
              <option>Normal (10s)</option>
              <option>Slow (30s)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">API Key Management</h3>
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-600 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Primary API Key</h4>
              <p className="text-gray-400 text-sm font-mono">scro_••••••••••••••••••••••••••••</p>
              <p className="text-gray-400 text-xs mt-1">Created: Jan 15, 2025 • Last used: 2 hours ago</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('scro_demo_key_12345');
                  toast.success('API key copied to clipboard!');
                }}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-400 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
              <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                Revoke
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-600">
            <div>
              <h4 className="text-white font-medium">Generate New API Key</h4>
              <p className="text-gray-400 text-sm">Create a new API key for accessing SCRO services</p>
            </div>
            <button
              onClick={handleGenerateApiKey}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>Generate Key</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">API Usage</h3>
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400">1,247</p>
              <p className="text-gray-400 text-sm">Requests Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">98.5%</p>
              <p className="text-gray-400 text-sm">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">45ms</p>
              <p className="text-gray-400 text-sm">Avg Response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'security': return renderSecurityTab();
      case 'notifications': return renderNotificationsTab();
      case 'preferences': return renderPreferencesTab();
      case 'api': return renderApiTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl border border-gray-700 p-6"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;