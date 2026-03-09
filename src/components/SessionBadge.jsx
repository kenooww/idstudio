import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function SessionBadge() {
  const { session, logout } = useAuth();
  const [remaining, setRemaining] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!session) return;
    const tick = () => setRemaining(Math.max(0, session.expiresAt - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  const pct = (remaining / (8 * 60 * 60 * 1000)) * 100;
  const isLow = remaining < 15 * 60 * 1000; // < 15 min warning
  const tokenPreview = session.token.slice(0, 8) + '...' + session.token.slice(-4);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setShowDetails(!showDetails)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
          background: '#1a1a1a', border: `1px solid ${isLow ? '#e94560' : '#2a2a2a'}`,
          transition: 'all 0.2s',
        }}>
        {/* Avatar */}
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f0c040, #e0a020)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 900, color: '#0a0a0a', flexShrink: 0,
        }}>
          {session.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600, lineHeight: 1.2 }}>{session.name}</div>
          <div style={{ fontSize: '9px', color: isLow ? '#e94560' : '#666', letterSpacing: '0.5px' }}>
            {isLow ? '⚠️ ' : '🟢 '}{formatTime(remaining)} left
          </div>
        </div>

        {/* Mini progress bar */}
        <div style={{ width: '32px', height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: isLow ? '#e94560' : '#f0c040', borderRadius: '2px', transition: 'width 1s linear' }} />
        </div>

        <div style={{ fontSize: '10px', color: '#444' }}>{showDetails ? '▲' : '▼'}</div>
      </div>

      {/* Dropdown details */}
      {showDetails && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
          background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
          padding: '16px', minWidth: '260px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize: '10px', color: '#f0c04088', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Session Info</div>

          {[
            ['User', session.name],
            ['Username', session.username],
            ['Role', session.role],
            ['Token', tokenPreview],
            ['Issued', new Date(session.issuedAt).toLocaleTimeString()],
            ['Expires', new Date(session.expiresAt).toLocaleTimeString()],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#555' }}>{label}</span>
              <span style={{ fontSize: '11px', color: '#fff', fontFamily: label === 'Token' ? 'monospace' : 'inherit' }}>{val}</span>
            </div>
          ))}

          {/* Full token (masked) */}
          <div style={{ margin: '12px 0', padding: '8px 10px', background: '#0d0d0d', borderRadius: '6px', border: '1px solid #1e1e1e' }}>
            <div style={{ fontSize: '9px', color: '#555', marginBottom: '4px', letterSpacing: '1px' }}>SESSION TOKEN</div>
            <div style={{ fontSize: '10px', color: '#f0c040', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5 }}>
              {session.token}
            </div>
          </div>

          {/* Session bar */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#555', marginBottom: '5px' }}>
              <span>Session time remaining</span>
              <span style={{ color: isLow ? '#e94560' : '#95e1a7' }}>{formatTime(remaining)}</span>
            </div>
            <div style={{ height: '5px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: isLow ? '#e94560' : 'linear-gradient(90deg, #f0c040, #95e1a7)', borderRadius: '3px', transition: 'width 1s linear' }} />
            </div>
          </div>

          <button onClick={logout}
            style={{ width: '100%', padding: '9px', borderRadius: '7px', border: '1px solid #e9456033', cursor: 'pointer', background: '#2a0a0a', color: '#e94560', fontWeight: 600, fontSize: '12px' }}>
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
