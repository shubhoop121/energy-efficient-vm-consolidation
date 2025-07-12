import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@scro.com', password: 'admin123', role: 'admin' as const },
  { id: '2', name: 'Viewer User', email: 'viewer@scro.com', password: 'viewer123', role: 'viewer' as const },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored JWT token on mount
    const token = localStorage.getItem('scro_token');
    const userData = localStorage.getItem('scro_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('scro_token');
        localStorage.removeItem('scro_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      
      // Simulate JWT token
      const token = `mock_jwt_${foundUser.id}_${Date.now()}`;
      
      localStorage.setItem('scro_token', token);
      localStorage.setItem('scro_user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }
    
    // Create new user (in real app, this would be sent to backend)
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
      role: 'viewer' as const, // Default role
    };
    
    mockUsers.push(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('scro_token');
    localStorage.removeItem('scro_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};