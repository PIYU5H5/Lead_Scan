import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import CallList from './pages/CallList';
import CallDetail from './pages/CallDetail';
import Analytics from './pages/Analytics';
import AIPipeline from './pages/AIPipeline';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="app-shell">
          <Sidebar />
          <div className="main-area">
            <Topbar />
            <main id="main-content" tabIndex="-1" style={{ flex: 1, display: 'flex', flexDirection: 'column', outline: 'none' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calls" element={<CallList />} />
                <Route path="/calls/:id" element={<CallDetail />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ai-pipeline" element={<AIPipeline />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
