import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../contexts/AuthContext';
import { VM } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Play, 
  Pause,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Clock,
  ChevronDown,
  X,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const VMAllocation: React.FC = () => {
  const { user } = useAuth();
  const { data, isConnected } = useWebSocket('ws://localhost:3001');
  const [vms, setVms] = useState<VM[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedVMs, setSelectedVMs] = useState<Set<string>>(new Set());

  // Mock VM data
  useEffect(() => {
    const mockVMs: VM[] = [
      { id: 'vm-001', serverId: 'server-1', cpuUsage: 45, ramUsage: 62, status: 'running', createdAt: new Date() },
      { id: 'vm-002', serverId: 'server-2', cpuUsage: 78, ramUsage: 84, status: 'running', createdAt: new Date() },
      { id: 'vm-003', serverId: 'server-1', cpuUsage: 23, ramUsage: 38, status: 'idle', createdAt: new Date() },
      { id: 'vm-004', serverId: 'server-3', cpuUsage: 89, ramUsage: 91, status: 'migrated', createdAt: new Date() },
      { id: 'vm-005', serverId: 'server-2', cpuUsage: 34, ramUsage: 45, status: 'running', createdAt: new Date() },
      { id: 'vm-006', serverId: 'server-4', cpuUsage: 67, ramUsage: 72, status: 'running', createdAt: new Date() },
    ];
    setVms(mockVMs);
  }, []);

  const filteredVMs = vms.filter(vm => {
    const matchesSearch = vm.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vm.serverId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVM = () => {
    if (user?.role !== 'admin') {
      toast.error('Only administrators can add new VMs');
      return;
    }
    setShowAddModal(true);
  };

  const handleSimulateWorkload = () => {
    if (user?.role !== 'admin') {
      toast.error('Only administrators can simulate workloads');
      return;
    }
    
    setIsSimulating(!isSimulating);
    toast.success(isSimulating ? 'Workload simulation stopped' : 'Workload simulation started');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'migrated': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'idle': return 'text-yellow-400';
      case 'migrated': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const handleVMSelection = (vmId: string) => {
    const newSelection = new Set(selectedVMs);
    if (newSelection.has(vmId)) {
      newSelection.delete(vmId);
    } else {
      newSelection.add(vmId);
    }
    setSelectedVMs(newSelection);
  };

  const handleBulkAction = (action: string) => {
    if (user?.role !== 'admin') {
      toast.error('Only administrators can perform bulk actions');
      return;
    }
    
    if (selectedVMs.size === 0) {
      toast.error('Please select VMs first');
      return;
    }
    
    toast.success(`${action} applied to ${selectedVMs.size} VMs`);
    setSelectedVMs(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">VM Allocation Management</h1>
          <p className="text-gray-400 mt-1">Monitor and manage virtual machine deployments</p>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Updates</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total VMs', value: vms.length, color: 'from-blue-500 to-blue-600', icon: Server },
          { label: 'Running', value: vms.filter(vm => vm.status === 'running').length, color: 'from-green-500 to-green-600', icon: Activity },
          { label: 'Migrated', value: vms.filter(vm => vm.status === 'migrated').length, color: 'from-purple-500 to-purple-600', icon: RefreshCw },
          { label: 'Idle', value: vms.filter(vm => vm.status === 'idle').length, color: 'from-yellow-500 to-yellow-600', icon: Pause },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search VMs or servers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="idle">Idle</option>
                <option value="migrated">Migrated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center space-x-3">
            {selectedVMs.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{selectedVMs.size} selected</span>
                <button
                  onClick={() => handleBulkAction('Migrate')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Migrate
                </button>
                <button
                  onClick={() => handleBulkAction('Stop')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  Stop
                </button>
              </div>
            )}
            
            <button
              onClick={handleSimulateWorkload}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isSimulating
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'Stop Simulation' : 'Simulate Workload'}</span>
            </button>

            <button
              onClick={handleAddVM}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add VM</span>
            </button>

            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* VM Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVMs(new Set(filteredVMs.map(vm => vm.id)));
                      } else {
                        setSelectedVMs(new Set());
                      }
                    }}
                    className="rounded border-gray-600 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  VM ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Server
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  CPU Usage
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  RAM Usage
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {filteredVMs.map((vm, index) => (
                  <motion.tr
                    key={vm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVMs.has(vm.id)}
                        onChange={() => handleVMSelection(vm.id)}
                        className="rounded border-gray-600 text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Server className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{vm.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{vm.serverId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              vm.cpuUsage > 80 ? 'bg-red-500' :
                              vm.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${vm.cpuUsage}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium w-10">{vm.cpuUsage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              vm.ramUsage > 80 ? 'bg-red-500' :
                              vm.ramUsage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${vm.ramUsage}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium w-10">{vm.ramUsage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(vm.status)}`}></div>
                        <span className={`text-sm font-medium capitalize ${getStatusTextColor(vm.status)}`}>
                          {vm.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {vm.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {user?.role === 'admin' && (
                          <>
                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                              Migrate
                            </button>
                            <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                              Stop
                            </button>
                          </>
                        )}
                        <button className="text-gray-400 hover:text-gray-300 text-sm font-medium">
                          Details
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredVMs.length === 0 && (
          <div className="text-center py-12">
            <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No VMs found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first VM to get started'
              }
            </p>
            {user?.role === 'admin' && (
              <button
                onClick={handleAddVM}
                className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add VM</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add VM Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Add New VM</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    VM Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter VM name"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Server
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Auto-assign (Recommended)</option>
                    <option>server-1</option>
                    <option>server-2</option>
                    <option>server-3</option>
                    <option>server-4</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CPU Cores
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      defaultValue="2"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      RAM (GB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="64"
                      defaultValue="4"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success('VM created successfully!');
                      setShowAddModal(false);
                    }}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Create VM
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VMAllocation;