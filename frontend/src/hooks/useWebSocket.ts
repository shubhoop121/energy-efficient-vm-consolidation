import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection with intervals
    setIsConnected(true);
    
    intervalRef.current = setInterval(() => {
      // Generate mock real-time data
      const mockData = {
        timestamp: new Date().toISOString(),
        servers: Array.from({ length: 6 }, (_, i) => ({
          id: `server-${i + 1}`,
          cpuUsage: Math.floor(Math.random() * 100),
          ramUsage: Math.floor(Math.random() * 100),
          energyConsumption: Math.floor(Math.random() * 500) + 100,
        })),
        totalEnergy: Math.floor(Math.random() * 2000) + 1000,
        activeVMs: Math.floor(Math.random() * 50) + 20,
        learningProgress: Math.min(100, Math.floor(Math.random() * 100) + 75),
      };
      
      setData(mockData);
    }, 2000);

    return () => {
      setIsConnected(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [url]);

  return { isConnected, data };
};