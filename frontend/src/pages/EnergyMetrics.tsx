import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useWebSocket } from '../hooks/useWebSocket';
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Leaf, 
  DollarSign,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';

const EnergyMetrics: React.FC = () => {
  const { data, isConnected } = useWebSocket('ws://localhost:3001');
  const [timeRange, setTimeRange] = useState('24h');

  const energyData = [
    { time: '00:00', consumption: 1200, efficiency: 85, cost: 24.5 },
    { time: '02:00', consumption: 1080, efficiency: 88, cost: 22.1 },
    { time: '04:00', consumption: 980, efficiency: 92, cost: 20.3 },
    { time: '06:00', consumption: 1150, efficiency: 87,  cost: 23.8 },
    { time: '08:00', consumption: 1450, efficiency: 78, cost: 29.2 },
    { time: '10:00', consumption: 1620, efficiency: 75, cost: 32.8 },
    { time: '12:00', consumption: 1680, efficiency: 82, cost: 34.1 },
    { time: '14:00', consumption: 1590, efficiency: 84, cost: 31.9 },
    { time: '16:00', consumption: 1520, efficiency: 88, cost: 30.2 },
    { time: '18:00', consumption: 1380, efficiency: 89, cost: 27.6 },
    { time: '20:00', consumption: 1340, efficiency: 90, cost: 26.8 },
    { time: '22:00', consumption: 1280, efficiency: 87, cost: 25.4 },
  ];

  const algorithmComparison = [
    { algorithm: 'First-Fit', energy: 1680, efficiency: 72, cost: 34.1 },
    { algorithm: 'Best-Fit', energy: 1520, efficiency: 78, cost: 30.2 },
    { algorithm: 'Q-Learning', energy: 1280, efficiency: 89, cost: 25.4 },
  ];

  const serverEnergyBreakdown = [
    { name: 'Web Servers', value: 35, color: '#3B82F6' },
    { name: 'Database', value: 28, color: '#10B981' },
    { name: 'Storage', value: 20, color: '#F59E0B' },
    { name: 'Cache', value: 12, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

  const qTableData = Array.from({ length: 10 }, (_, i) => 
    Array.from({ length: 8 }, (_, j) => ({
      state: i,
      action: j,
      value: Math.random() * 2 - 1, // Q-values between -1 and 1
    }))
  ).flat();

  const getQValueColor = (value: number) => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return `rgba(16, 185, 129, ${intensity})`; // Green for positive values
    } else {
      return `rgba(239, 68, 68, ${intensity})`; // Red for negative values
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Energy Consumption Analytics</h1>
          <p className="text-gray-400 mt-1">Monitor power usage, efficiency metrics, and RL optimization</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Data</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Current Consumption', 
            value: `${data?.totalEnergy || 1450}W`, 
            change: '-8.2%', 
            changeType: 'positive', 
            icon: Zap, 
            color: 'from-yellow-500 to-yellow-600' 
          },
          { 
            label: 'Efficiency Score', 
            value: '89%', 
            change: '+5.3%', 
            changeType: 'positive', 
            icon: Target, 
            color: 'from-green-500 to-green-600' 
          },
          { 
            label: 'Daily Cost', 
            value: '$28.40', 
            change: '-12.1%', 
            changeType: 'positive', 
            icon: DollarSign, 
            color: 'from-blue-500 to-blue-600' 
          },
          { 
            label: 'CO₂ Saved', 
            value: '2.4kg', 
            change: '+18.7%', 
            changeType: 'positive', 
            icon: Leaf, 
            color: 'from-emerald-500 to-emerald-600' 
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{metric.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.changeType === 'positive' ? (
                    <TrendingDown className="w-4 h-4 mr-1 text-green-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-1 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">vs yesterday</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Energy Consumption */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Energy Consumption Trend</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Consumption (W)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Efficiency (%)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="consumption" 
                stroke="#EAB308" 
                strokeWidth={3}
                dot={{ fill: '#EAB308', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EAB308', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Algorithm Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Algorithm Performance</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={algorithmComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="algorithm" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="energy" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {algorithmComparison.map((alg) => (
              <div key={alg.algorithm} className="text-center">
                <p className="text-xs text-gray-400">{alg.algorithm}</p>
                <p className="text-sm font-semibold text-white">{alg.efficiency}% efficient</p>
                <p className="text-xs text-gray-400">${alg.cost}/day</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Energy Distribution</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={serverEnergyBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serverEnergyBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {serverEnergyBreakdown.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="text-sm text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Q-Learning Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">RL Learning Progress</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Training Active</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Cumulative Reward</span>
              <span className="text-white font-semibold">+2,847</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data?.learningProgress || 89}%` }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-purple-400 font-semibold">{data?.learningProgress || 89}%</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white mb-3">Recent Optimizations</h4>
            <div className="space-y-2">
              {[
                { action: 'VM Migration', saving: '12W', time: '2 min ago' },
                { action: 'Load Balancing', saving: '8W', time: '5 min ago' },
                { action: 'Resource Scaling', saving: '15W', time: '8 min ago' },
              ].map((opt, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div>
                    <p className="text-white text-sm font-medium">{opt.action}</p>
                    <p className="text-gray-400 text-xs">{opt.time}</p>
                  </div>
                  <div className="text-green-400 text-sm font-semibold">-{opt.saving}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Q-Table Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Q-Table Heatmap</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Positive Q-values</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Negative Q-values</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-1 min-w-max">
            {Array.from({ length: 8 }, (_, actionIndex) => (
              <div key={actionIndex} className="text-center">
                <div className="text-xs text-gray-400 mb-2">Action {actionIndex + 1}</div>
                <div className="space-y-1">
                  {Array.from({ length: 10 }, (_, stateIndex) => {
                    const qValue = qTableData.find(
                      item => item.state === stateIndex && item.action === actionIndex
                    )?.value || 0;
                    
                    return (
                      <motion.div
                        key={`${stateIndex}-${actionIndex}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + (stateIndex * actionIndex) * 0.01 }}
                        className="w-8 h-8 rounded flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: getQValueColor(qValue) }}
                        title={`State ${stateIndex}, Action ${actionIndex}: ${qValue.toFixed(3)}`}
                      >
                        {qValue.toFixed(1)}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Hover over cells to see detailed Q-values. Darker colors indicate stronger learned preferences.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default EnergyMetrics;