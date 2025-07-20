export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};


export interface VM {
  id: string;
  serverId: string;
  cpuUsage: number;
  ramUsage: number;
  status: 'running' | 'migrated' | 'idle';
  createdAt: Date;
}

export interface Server {
  id: string;
  name: string;
  cpuUsage: number;
  ramUsage: number;
  status: 'healthy' | 'warning' | 'overloaded';
  vmCount: number;
  uptime: number;
  energyConsumption: number;
}

export interface EnergyData {
  timestamp: string;
  consumption: number;
  algorithm: string;
}

export interface QTableData {
  state: string;
  action: string;
  value: number;
}

export interface AlgorithmMetrics {
  name: string;
  energyEfficiency: number;
  placementSuccess: number;
  avgResponseTime: number;
  cost: number;
}