import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const LABELS = {
  '/': 'Overview',
  '/calls': 'Recordings',
  '/analytics': 'Analytics',
  '/ai-pipeline': 'AI Pipeline',
  '/settings': 'Settings',
};

function useTime() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Topbar() {
  const location = useLocation();
  const time = useTime();
  const { theme, toggleTheme } = useTheme();
  const isDetail = location.pathname.startsWith('/calls/') && location.pathname.length > 7;
  const currentLabel = isDetail ? 'Recordings' : LABELS[location.pathname] || 'Overview';
  const detailId = isDetail ? location.pathname.split('/').pop() : null;

  return (
    <header className="topbar" aria-label="Top navigation">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-item" style={{ textDecoration: 'none', color: 'inherit' }}>
          LeadSync
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>

        {isDetail ? (
          <>
            <Link to="/calls" className="breadcrumb-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              {currentLabel}
            </Link>
            <span className="breadcrumb-sep" aria-hidden="true">/</span>
            <span className="breadcrumb-item is-current mono" aria-current="page" style={{ fontSize: 11 }}>
              {detailId}
            </span>
          </>
        ) : (
          <span className="breadcrumb-item is-current" aria-current="page">
            {currentLabel}
          </span>
        )}
      </nav>

      <div className="topbar-actions">
        {/* Live system clock & status indicator */}
        <div className="topbar-status" aria-label={`System telemetry active, current time ${time.toLocaleTimeString()}`}>
          <span className="status-pip" aria-hidden="true" />
          <span className="mono">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="icon-btn theme-toggle-btn"
          id="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun size={14} strokeWidth={2} style={{ color: 'var(--status-warning)' }} aria-hidden="true" />
          ) : (
            <Moon size={14} strokeWidth={2} style={{ color: 'var(--accent)' }} aria-hidden="true" />
          )}
        </button>

        <Link
          to="/calls"
          className="icon-btn"
          aria-label="Search recordings library"
          title="Search recordings library"
          style={{ textDecoration: 'none' }}
        >
          <Search size={13} strokeWidth={2} aria-hidden="true" />
        </Link>

        <button
          className="icon-btn"
          aria-label="System telemetry notifications"
          title="All systems nominal"
        >
          <Bell size={13} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
