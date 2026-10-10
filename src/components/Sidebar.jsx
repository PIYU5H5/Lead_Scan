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
      {/* Logo */}
      <NavLink to="/" className="sidebar-logo" aria-label="LeadSync home">
        <div className="logo-mark">
          <Zap size={14} aria-hidden="true" />
        </div>
        <span className="logo-wordmark">LeadSync</span>
        <span className="logo-version">v1</span>
      </NavLink>

      {/* Navigation */}
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

      {/* User */}
      <div className="sidebar-footer">
        <div className="user-avatar" aria-hidden="true">AD</div>
        <div>
          <div className="user-name">Admin</div>
          <div className="user-role">Sales Intelligence</div>
        </div>
      </div>
    </aside>
  );
}
