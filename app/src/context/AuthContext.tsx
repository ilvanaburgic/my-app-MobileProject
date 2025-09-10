import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

// Type definition for the user object used across the application
export type User = {
  id: number;
  name: string;
  email: string;
  role?: 'user' | 'admin';
} | null;

// Interface that defines all functions and data available through AuthContext
interface AuthCtx {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<{ name: string; email: string }>) => Promise<void>;
}

// Creating a React context for authentication
const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // On cold start, do not restore the user from AsyncStorage
    (async () => {
      await AsyncStorage.removeItem('user'); // Clear any existing session to ensure the app starts at Login
      setUser(null);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(data.user);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const updateUser = async (patch: Partial<{ name: string; email: string }>) => {
    if (!user) return;
    const { data } = await api.patch(`/users/${user.id}`, patch);
    setUser(data.user);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  };

  return (
    // Ctx.Provider makes the user object and auth functions available to all child components
    <Ctx.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

// Custom React hook that simplifies the usage of AuthContext
export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
