import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  Zap, 
  Clock, 
  DollarSign,
  Target,
  Brain,
  Settings,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const AlgorithmComparison: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('q-learning');
  const [isRunning, setIsRunning] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any>(null);

  const algorithms = [
    {
      id: 'first-fit',
      name: 'First-Fit',
      description: 'Places VMs on the first server with sufficient resources',
      color: '#EF4444',
      icon: '🎯',
      complexity: 'O(n)',
      type: 'Static'
    },
    {
      id: 'best-fit',
      name: 'Best-Fit',
      description: 'Places VMs on the server with the least remaining resources after allocation',
      color: '#F59E0B',
      icon: '⚖️',
      complexity: 'O(n log n)',
      type: 'Static'
    },
    {
      id: 'q-learning',
      name: 'Q-Learning',
      description: 'Uses reinforcement learning to optimize VM placement dynamically',
      color: '#10B981',
      icon: '🧠',
      complexity: 'O(|S| × |A|)',
      type: 'Dynamic'
    }
  ];

  const performanceMetrics = [
    { 
      algorithm: 'First-Fit', 
      energyEfficiency: 72, 
      placementSuccess: 85, 
      avgResponseTime: 245, 
      cost: 34.1,
      resourceUtilization: 68,
      migrationCount: 12
    },
    { 
      algorithm: 'Best-Fit', 
      energyEfficiency: 78, 
      placementSuccess: 91, 
      avgResponseTime: 198, 
      cost: 30.2,
      resourceUtilization: 74,
      migrationCount: 8
    },
    { 
      algorithm: 'Q-Learning', 
      energyEfficiency: 89, 
      placementSuccess: 96, 
      avgResponseTime: 156, 
      cost: 25.4,
      resourceUtilization: 87,
      migrationCount: 15
    }
  ];

  const radarData = [
    { metric: 'Energy Efficiency', 'First-Fit': 72, 'Best-Fit': 78, 'Q-Learning': 89 },
    { metric: 'Success Rate', 'First-Fit': 85, 'Best-Fit': 91, 'Q-Learning': 96 },
    { metric: 'Resource Utilization', 'First-Fit': 68, 'Best-Fit': 74, 'Q-Learning': 87 },
    { metric: 'Cost Efficiency', 'First-Fit': 65, 'Best-Fit': 72, 'Q-Learning': 85 },
    { metric: 'Adaptability', 'First-Fit': 30, 'Best-Fit': 45, 'Q-Learning': 95 },
  ];

  const timeSeriesData = [
    { time: '00:00', 'First-Fit': 1680, 'Best-Fit': 1520, 'Q-Learning': 1280 },
    { time: '04:00', 'First-Fit': 1590, 'Best-Fit': 1450, 'Q-Learning': 1180 },
    { time: '08:00', 'First-Fit': 1750, 'Best-Fit': 1580, 'Q-Learning': 1320 },
    { time: '12:00', 'First-Fit': 1820, 'Best-Fit': 1650, 'Q-Learning': 1380 },
    { time: '16:00', 'First-Fit': 1780, 'Best-Fit': 1620, 'Q-Learning': 1350 },
    { time: '20:00', 'First-Fit': 1720, 'Best-Fit': 1560, 'Q-Learning': 1290 },
  ];

  const handleRunComparison = () => {
    setIsRunning(true);
    toast.success('Running algorithm comparison...');
    
    // Simulate comparison run
    setTimeout(() => {
      setIsRunning(false);
      setComparisonResults({
        winner: 'Q-Learning',
        improvement: '23%',
        energySaved: '400W',
        costReduction: '$8.70'
      });
      toast.success('Comparison completed! Q-Learning shows best performance.');
    }, 3000);
  };

  const handleReset = () => {
    setComparisonResults(null);
    toast.info('Comparison results cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Algorithm Performance Comparison</h1>
          <p className="text-gray-400 mt-1">Compare VM placement algorithms and optimization strategies</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleRunComparison}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isRunning
                ? 'bg-yellow-600 text-white cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Algorithm Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {algorithms.map((algorithm) => (
            <motion.div
              key={algorithm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedAlgorithm === algorithm.id
                  ? 'border-teal-500 bg-gray-700'
                  : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedAlgorithm(algorithm.id)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{algorithm.icon}</span>
                <div>
                  <h4 className="text-white font-semibold">{algorithm.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    algorithm.type === 'Dynamic' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {algorithm.type}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">{algorithm.description}</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Complexity:</span>
                <span className="text-gray-300 font-mono">{algorithm.complexity}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      <AnimatePresence>
        {comparisonResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Comparison Results</h3>
                <p className="text-green-400">Winner: {comparisonResults.winner}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-sm">Performance Improvement</span>
                </div>
                <p className="text-xl font-bold text-green-400">{comparisonResults.improvement}</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Energy Saved</span>
                </div>
                <p className="text-xl font-bold text-yellow-400">{comparisonResults.energySaved}</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400 text-sm">Cost Reduction</span>
                </div>
                <p className="text-xl font-bold text-blue-400">{comparisonResults.costReduction}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart Comparison */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceMetrics}>
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
              <Bar dataKey="energyEfficiency" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Multi-Dimensional Analysis</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
              />
              <Radar
                name="First-Fit"
                dataKey="First-Fit"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Best-Fit"
                dataKey="Best-Fit"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Q-Learning"
                dataKey="Q-Learning"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Time Series Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Energy Consumption Over Time</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-400">First-Fit</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Best-Fit</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Q-Learning</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
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
              dataKey="First-Fit" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Best-Fit" 
              stroke="#F59E0B" 
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Q-Learning" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detailed Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Detailed Performance Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Algorithm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Energy Efficiency
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Daily Cost
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Resource Utilization
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Migrations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {performanceMetrics.map((metric, index) => (
                <motion.tr
                  key={metric.algorithm}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`hover:bg-gray-700/50 transition-colors ${
                    metric.algorithm === 'Q-Learning' ? 'bg-green-500/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{metric.algorithm}</span>
                      {metric.algorithm === 'Q-Learning' && (
                        <Brain className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-600 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${metric.energyEfficiency}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{metric.energyEfficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{metric.placementSuccess}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{metric.avgResponseTime}ms</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-white">${metric.cost}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{metric.resourceUtilization}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{metric.migrationCount}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AlgorithmComparison;