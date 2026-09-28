import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Pedhi } from '../types/index.ts';
import { api, getStoredToken, setStoredToken, getStoredActivePedhiId, setStoredActivePedhiId } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  currentPedhi: Pedhi | null;
  pedhis: Pedhi[];
  isLoading: boolean;
  isAuthenticated: boolean;
  currentRole: string;
  login: (mobile: string, pass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchPedhi: (pedhiId: string) => void;
  refreshPedhis: () => Promise<void>;
  updateCurrentPedhiState: (pedhi: Pedhi) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPedhi, setCurrentPedhi] = useState<Pedhi | null>(null);
  const [pedhis, setPedhis] = useState<Pedhi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    setIsLoading(true);
    const token = getStoredToken();
    try {
      if (token) {
        const res = await api.getMe();
        setUser(res.user);
        setPedhis(res.pedhis || []);

        const savedPedhiId = getStoredActivePedhiId();
        const found = res.pedhis.find((p) => p._id === savedPedhiId);
        if (found) {
          setCurrentPedhi(found);
        } else if (res.pedhis.length > 0) {
          setCurrentPedhi(res.pedhis[0]);
          setStoredActivePedhiId(res.pedhis[0]._id);
        }
      } else {
        // Automatically attempt demo login so the reviewer lands straight into the rich system!
        try {
          const res = await api.demoLogin();
          setUser(res.user);
          setPedhis(res.pedhis || []);
          setCurrentPedhi(res.currentPedhi);
        } catch (e) {
          // If demo login fails (e.g. initial start), wait for user
          console.log('[Auth] Waiting for login or initial seed');
        }
      }
    } catch (err) {
      console.warn('[Auth Init]:', err);
      setStoredToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (mobile: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(mobile, pass);
      setUser(res.user);
      setPedhis(res.pedhis || []);
      setCurrentPedhi(res.currentPedhi);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin();
      setUser(res.user);
      setPedhis(res.pedhis || []);
      setCurrentPedhi(res.currentPedhi);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      setUser(res.user);
      if (res.currentPedhi) {
        setPedhis([res.currentPedhi]);
        setCurrentPedhi(res.currentPedhi);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
    setCurrentPedhi(null);
    setPedhis([]);
  };

  const switchPedhi = (pedhiId: string) => {
    const selected = pedhis.find((p) => p._id === pedhiId);
    if (selected) {
      setCurrentPedhi(selected);
      setStoredActivePedhiId(selected._id);
    }
  };

  const refreshPedhis = async () => {
    try {
      const res = await api.getPedhis();
      setPedhis(res.pedhis || []);
      if (currentPedhi) {
        const refreshed = res.pedhis.find((p) => p._id === currentPedhi._id);
        if (refreshed) setCurrentPedhi(refreshed);
      }
    } catch (err) {
      console.error('[Refresh Pedhis Failed]:', err);
    }
  };

  const updateCurrentPedhiState = (pedhi: Pedhi) => {
    setCurrentPedhi(pedhi);
    setPedhis((prev) => prev.map((p) => (p._id === pedhi._id ? pedhi : p)));
  };

  // Find user's role in the current pedhi
  const currentRole = React.useMemo(() => {
    if (!user || !currentPedhi) return 'Super Admin';
    const match = user.pedhis?.find((p) => p.pedhiId === currentPedhi._id);
    return match ? match.role : 'Super Admin';
  }, [user, currentPedhi]);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentPedhi,
        pedhis,
        isLoading,
        isAuthenticated: !!user,
        currentRole,
        login,
        demoLogin,
        register,
        logout,
        switchPedhi,
        refreshPedhis,
        updateCurrentPedhiState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
