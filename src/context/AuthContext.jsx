import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock users — replace with real API calls in production
const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin', name: 'System Administrator' },
  { id: 2, username: 'hrstaff', password: 'hr2024', role: 'HR Staff', name: 'HR Officer' },
];

const SESSION_KEY = 'cardforge_session';
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function saveSession(session) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());

  useEffect(() => {
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) { logout(); return; }
    const timer = setTimeout(() => logout(), remaining);
    return () => clearTimeout(timer);
  }, [session]);

  const login = useCallback((username, password) => {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (!user) return { success: false, message: 'Invalid username or password.' };
    const newSession = {
      token: generateToken(),
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + TOKEN_EXPIRY_MS,
    };
    saveSession(newSession);
    setSession(newSession);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const isAuthenticated = !!session;
  const timeRemaining = session ? Math.max(0, session.expiresAt - Date.now()) : 0;

  return (
    <AuthContext.Provider value={{ session, isAuthenticated, login, logout, timeRemaining }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
