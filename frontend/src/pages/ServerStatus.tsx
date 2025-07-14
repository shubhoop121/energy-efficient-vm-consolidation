import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWebSocket } from '../hooks/useWebSocket';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Zap, 
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

const ServerStatus: React.FC = () => {
  const { data, isConnected } = useWebSocket('ws://localhost:3001');
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const mockServers = [
    { id: 'server-1', name: 'Web Server 01', cpuUsage: 45, ramUsage: 62, temperature: 45, uptime: 1450, vmCount: 8, energyConsumption: 285 },
    { id: 'server-2', name: 'Database Server', cpuUsage: 78, ramUsage: 84, temperature: 52, uptime: 2890, vmCount: 12, energyConsumption: 342 },
    { id: 'server-3', name: 'App Server 01', cpuUsage: 23, ramUsage: 38, temperature: 38, uptime: 850, vmCount: 5, energyConsumption: 198 },
    { id: 'server-4', name: 'Cache Server', cpuUsage: 89, ramUsage: 91, temperature: 58, uptime: 3200, vmCount: 15, energyConsumption: 398 },
    { id: 'server-5', name: 'Storage Server', cpuUsage: 34, ramUsage: 56, temperature: 42, uptime: 1920, vmCount: 7, energyConsumption: 256 },
    { id: 'server-6', name: 'Backup Server', cpuUsage: 12, ramUsage: 28, temperature: 35, uptime: 5400, vmCount: 3, energyConsumption: 145 },
  ];

  const getServerStatus = (cpuUsage: number, ramUsage: number, temperature: number) => {
    if (cpuUsage > 85 || ramUsage > 85 || temperature > 55) {
      return { status: 'critical', color: 'bg-red-500', textColor: 'text-red-400', icon: AlertTriangle };
    } else if (cpuUsage > 70 || ramUsage > 70 || temperature > 50) {
      return { status: 'warning', color: 'bg-yellow-500', textColor: 'text-yellow-400', icon: AlertTriangle };
    } else {
      return { status: 'healthy', color: 'bg-green-500', textColor: 'text-green-400', icon: CheckCircle };
    }
  };

  const formatUptime = (minutes: number) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Server Status Monitor</h1>
          <p className="text-gray-400 mt-1">Real-time server health and performance monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Monitoring</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Servers', value: mockServers.length, color: 'from-blue-500 to-blue-600', icon: Server },
          { label: 'Healthy', value: mockServers.filter(s => getServerStatus(s.cpuUsage, s.ramUsage, s.temperature).status === 'healthy').length, color: 'from-green-500 to-green-600', icon: CheckCircle },
          { label: 'Warning', value: mockServers.filter(s => getServerStatus(s.cpuUsage, s.ramUsage, s.temperature).status === 'warning').length, color: 'from-yellow-500 to-yellow-600', icon: AlertTriangle },
          { label: 'Critical', value: mockServers.filter(s => getServerStatus(s.cpuUsage, s.ramUsage, s.temperature).status === 'critical').length, color: 'from-red-500 to-red-600', icon: AlertTriangle },
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

      {/* Interactive Server Rack */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">Interactive Server Rack</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockServers.map((server, index) => {
            const serverStatus = getServerStatus(server.cpuUsage, server.ramUsage, server.temperature);
            const isSelected = selectedServer === server.id;
            
            return (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all border-2 ${
                  isSelected ? 'border-teal-500 bg-gray-600' : 'border-transparent hover:bg-gray-600'
                }`}
                onClick={() => setSelectedServer(isSelected ? null : server.id)}
              >
                {/* Server Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-gray-400" />
                    <h4 className="text-white font-medium">{server.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${serverStatus.color}`}></div>
                    <serverStatus.icon className={`w-4 h-4 ${serverStatus.textColor}`} />
                  </div>
                </div>

                {/* Resource Bars */}
                <div className="space-y-3">
                  {/* CPU Usage */}
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
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full transition-all ${
                          server.cpuUsage > 85 ? 'bg-red-500' :
                          server.cpuUsage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* RAM Usage */}
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
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full transition-all ${
                          server.ramUsage > 85 ? 'bg-red-500' :
                          server.ramUsage > 70 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400 flex items-center">
                        <Thermometer className="w-3 h-3 mr-1" />
                        Temp
                      </span>
                      <span className="text-sm text-white">{server.temperature}°C</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(server.temperature / 70) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full transition-all ${
                          server.temperature > 55 ? 'bg-red-500' :
                          server.temperature > 50 ? 'bg-orange-500' : 'bg-cyan-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Server Stats */}
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">VMs</div>
                      <div className="text-white font-semibold">{server.vmCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Uptime</div>
                      <div className="text-white font-semibold">{formatUptime(server.uptime)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Power</div>
                      <div className="text-white font-semibold">{server.energyConsumption}W</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed Server Info */}
      {selectedServer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          {(() => {
            const server = mockServers.find(s => s.id === selectedServer);
            if (!server) return null;
            
            const serverStatus = getServerStatus(server.cpuUsage, server.ramUsage, server.temperature);
            
            return (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      serverStatus.status === 'critical' ? 'from-red-500 to-red-600' :
                      serverStatus.status === 'warning' ? 'from-yellow-500 to-yellow-600' :
                      'from-green-500 to-green-600'
                    }`}>
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{server.name}</h3>
                      <p className={`text-sm font-medium capitalize ${serverStatus.textColor}`}>
                        {serverStatus.status}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedServer(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'CPU Usage', value: `${server.cpuUsage}%`, icon: Cpu, color: server.cpuUsage > 70 ? 'text-red-400' : 'text-green-400' },
                    { label: 'RAM Usage', value: `${server.ramUsage}%`, icon: HardDrive, color: server.ramUsage > 70 ? 'text-red-400' : 'text-blue-400' },
                    { label: 'Temperature', value: `${server.temperature}°C`, icon: Thermometer, color: server.temperature > 50 ? 'text-red-400' : 'text-cyan-400' },
                    { label: 'Energy', value: `${server.energyConsumption}W`, icon: Zap, color: 'text-yellow-400' },
                  ].map((metric, index) => (
                    <div key={metric.label} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{metric.label}</p>
                          <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                        </div>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <h4 className="text-white font-medium">Active VMs</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">{server.vmCount}</p>
                    <p className="text-gray-400 text-sm">Virtual machines running</p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-medium">Uptime</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-400">{formatUptime(server.uptime)}</p>
                    <p className="text-gray-400 text-sm">System availability</p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-white font-medium">Power Draw</h4>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400">{server.energyConsumption}W</p>
                    <p className="text-gray-400 text-sm">Current consumption</p>
                  </div>
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default ServerStatus;