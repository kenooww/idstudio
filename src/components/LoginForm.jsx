import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setError(''); setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    const result = login(username.trim(), password);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  const inp = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    background: '#0d0d0d', border: '1px solid #2a2a2a',
    color: '#fff', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Trebuchet MS', sans-serif", padding: '24px',
    }}>
      {/* Background pattern */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${200 + i * 80}px`, height: `${200 + i * 80}px`,
            borderRadius: '50%',
            border: '1px solid #f0c04008',
            top: `${10 + i * 8}%`, left: `${5 + i * 12}%`,
          }} />
        ))}
      </div>

      <div style={{
        width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #f0c040, #e0a020)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 8px 24px #f0c04033',
          }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#0a0a0a' }}>CF</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>CardForge</div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', letterSpacing: '1px' }}>ID CARD STUDIO</div>
        </div>

        {/* Card */}
        <div style={{
          background: '#111', border: '1px solid #1e1e1e',
          borderRadius: '16px', padding: '32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Welcome back</div>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '28px' }}>Sign in to your account to continue</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username */}
            <div>
              <label style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '7px' }}>Username</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username" autoComplete="username"
                style={inp}
                onFocus={e => e.target.style.borderColor = '#f0c040'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '11px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '7px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" autoComplete="current-password"
                  style={{ ...inp, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = '#f0c040'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '15px' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#2a0a0a', border: '1px solid #e9456033', borderRadius: '8px', padding: '10px 14px', color: '#e94560', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#333' : 'linear-gradient(135deg, #f0c040, #e0a020)',
                color: '#0a0a0a', fontWeight: 700, fontSize: '14px',
                marginTop: '4px', transition: 'all 0.2s',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? '⏳  Signing in...' : '→  Sign In'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={{ marginTop: '24px', padding: '12px', background: '#0d1a0d', border: '1px solid #1b4332', borderRadius: '8px', fontSize: '11px', color: '#95e1a7', lineHeight: 1.8 }}>
            <div style={{ fontWeight: 700, marginBottom: '4px', color: '#f0c040' }}>Demo Credentials</div>
            <div>👤 <strong>admin</strong> / admin123 — Admin</div>
            <div>👤 <strong>hrstaff</strong> / hr2024 — HR Staff</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#333' }}>
          Session expires after 8 hours of inactivity
        </div>
      </div>
    </div>
  );
}
