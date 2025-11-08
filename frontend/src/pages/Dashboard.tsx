import React from 'react';
import { motion } from 'framer-motion';
import { useWebSocket } from '../hooks/useWebSocket';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Zap, 
  TrendingUp, 
  Activity,
  Cloud,
  Brain,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, isConnected } = useWebSocket('ws://localhost:3001');

  const mockEnergyData = [
    { time: '00:00', consumption: 1200, efficiency: 85 },
    { time: '04:00', consumption: 980, efficiency: 92 },
    { time: '08:00', consumption: 1450, efficiency: 78 },
    { time: '12:00', consumption: 1680, efficiency: 82 },
    { time: '16:00', consumption: 1520, efficiency: 88 },
    { time: '20:00', consumption: 1340, efficiency: 90 },
  ];

  const mockVMData = [
    { time: '00:00', active: 45, migrated: 8 },
    { time: '04:00', active: 38, migrated: 12 },
    { time: '08:00', active: 52, migrated: 15 },
    { time: '12:00', active: 48, migrated: 18 },
    { time: '16:00', active: 44, migrated: 22 },
    { time: '20:00', active: 41, migrated: 25 },
  ];

  const statCards = [
    {
      title: 'Active Servers',
      value: data?.servers?.length || 6,
      change: '+2.5%',
      changeType: 'positive',
      icon: Server,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Running VMs',
      value: data?.activeVMs || 42,
      change: '+12.3%',
      changeType: 'positive',
      icon: Cloud,
      color: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Energy Consumption',
      value: `${data?.totalEnergy || 1450}W`,
      change: '-8.2%',
      changeType: 'positive',
      icon: Zap,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'RL Learning Progress',
      value: `${data?.learningProgress || 89}%`,
      change: '+1.8%',
      changeType: 'positive',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Real-time cloud resource monitoring and optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Stealth Data</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">vs last hour</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Consumption Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Energy Consumption</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Watts</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockEnergyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* VM Allocation Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">VM Allocation Trends</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Migrated</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockVMData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#14B8A6" 
                strokeWidth={3}
                dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="migrated" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Server Status Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Live Server Health</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-400">Critical</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.servers?.slice(0, 6).map((server: any, index: number) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Server-{index + 1}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  server.cpuUsage < 70 ? 'bg-green-400' :
                  server.cpuUsage < 90 ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center">
                      <Cpu className="w-3 h-3 mr-1" />
                      CPU
                    </span>
                    <span className="text-sm text-white">{server.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${server.cpuUsage}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      className={`h-2 rounded-full transition-all ${
                        server.cpuUsage < 70 ? 'bg-green-400' :
                        server.cpuUsage < 90 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center">
                      <HardDrive className="w-3 h-3 mr-1" />
                      RAM
                    </span>
                    <span className="text-sm text-white">{server.ramUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${server.ramUsage}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                      className={`h-2 rounded-full transition-all ${
                        server.ramUsage < 70 ? 'bg-blue-400' :
                        server.ramUsage < 90 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )) || Array.from({ length: 6 }, (_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Server-{index + 1}</h4>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center">
                      <Cpu className="w-3 h-3 mr-1" />
                      CPU
                    </span>
                    <span className="text-sm text-white">{Math.floor(Math.random() * 80) + 10}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="w-1/2 h-2 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center">
                      <HardDrive className="w-3 h-3 mr-1" />
                      RAM
                    </span>
                    <span className="text-sm text-white">{Math.floor(Math.random() * 70) + 15}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="w-1/3 h-2 rounded-full bg-blue-400"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;