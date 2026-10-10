import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, PhoneCall, BarChart3,
  Settings, Cpu, Zap
} from 'lucide-react';
import { CALLS } from '../data/callData';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/calls', icon: PhoneCall, label: 'Recordings', count: CALLS.length },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/ai-pipeline', icon: Cpu, label: 'AI Pipeline' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      {/* Brand Header */}
      <NavLink to="/" className="sidebar-logo" aria-label="LeadSync home">
        <div className="logo-mark" aria-hidden="true">
          <Zap size={14} />
        </div>
        <span className="logo-wordmark">LeadSync</span>
        <span className="logo-version">PROD</span>
      </NavLink>

      {/* Main Navigation */}
      <nav className="sidebar-nav" aria-label="Main menu">
        <span className="sidebar-section-label">Workspace</span>
        {NAV.map(({ to, icon: Icon, label, count }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon className="nav-icon" strokeWidth={1.75} aria-hidden="true" />
            {label}
            {count !== undefined && (
              <span className="nav-pill">{count}</span>
            )}
          </NavLink>
        ))}

        <span className="sidebar-section-label" style={{ marginTop: 'auto' }}>System</span>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Settings className="nav-icon" strokeWidth={1.75} aria-hidden="true" />
          Settings
        </NavLink>
      </nav>

      {/* Workspace Operator Profile */}
      <div className="sidebar-footer">
        <div className="user-avatar" aria-hidden="true">AD</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="user-name">Admin Console</div>
          <div className="user-role flex items-center gap-1">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--status-positive)', display: 'inline-block' }} aria-hidden="true" />
            <span>Telemetry Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
