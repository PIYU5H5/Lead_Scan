import { useLocation } from 'react-router-dom';
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
  const currentLabel = isDetail ? 'Recording' : LABELS[location.pathname] || 'Overview';
  const detailId = isDetail ? location.pathname.split('/').pop() : null;

  return (
    <header className="topbar" aria-label="Top navigation">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <span className="breadcrumb-item">LeadSync</span>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span className="breadcrumb-item is-current" aria-current="page">{currentLabel}</span>
        {detailId && (
          <>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span className="breadcrumb-item is-current mono" style={{ fontSize: 11 }} aria-current="page">{detailId}</span>
          </>
        )}
      </nav>

      <div className="topbar-actions">
        <div className="topbar-status" aria-label={`Current system time ${time.toLocaleTimeString()}`}>
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
            <Sun size={15} strokeWidth={2} style={{ color: 'var(--status-warning)' }} aria-hidden="true" />
          ) : (
            <Moon size={15} strokeWidth={2} style={{ color: 'var(--accent)' }} aria-hidden="true" />
          )}
        </button>

        <button className="icon-btn" aria-label="Search recordings" title="Search recordings">
          <Search size={14} strokeWidth={2} aria-hidden="true" />
        </button>
        <button className="icon-btn" aria-label="System notifications" title="System notifications">
          <Bell size={14} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
