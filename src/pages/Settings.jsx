import { Info, Database, Shield, Sliders, CheckCircle2, Server, Terminal, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [audioSimulation, setAudioSimulation] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(65);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  return (
    <div className="page-content anim-up">
      {/* ── Page Header ─────────────────────────────── */}
      <header style={{ marginBottom: 'var(--sp-10)' }}>
        <p className="page-eyebrow">System & Configuration</p>
        <h1 className="page-title">Settings</h1>
        <div className="page-meta">
          <span className="page-meta-item mono">v1.2.0-prod</span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span className="page-meta-item">
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--status-positive)', marginRight: 6 }} />
            All systems nominal
          </span>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)', maxWidth: 840 }}>
        {/* ── Appearance & Theme ─────────────────────────────── */}
        <section className="card" style={{ padding: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-2)' }}>
                {theme === 'dark' ? <Moon size={16} color="var(--accent)" /> : <Sun size={16} color="var(--status-warning)" />}
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-100)' }}>Appearance & Theme</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Select your preferred workspace aesthetic</p>
              </div>
            </div>
            <span className="chip chip-sm" style={{ background: 'var(--surface-3)', border: '1px solid var(--border-2)', color: 'var(--ink-300)', fontFamily: 'var(--font-mono)' }}>
              {theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-4)' }}>
            {/* Dark Theme Option Card */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              style={{
                background: theme === 'dark' ? 'var(--accent-dim)' : 'var(--surface-2)',
                border: `1.5px solid ${theme === 'dark' ? 'var(--accent)' : 'var(--border-1)'}`,
                borderRadius: 'var(--r-lg)',
                padding: 'var(--sp-5)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                transition: 'all var(--dur-fast) ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Moon size={16} color={theme === 'dark' ? 'var(--accent)' : 'var(--ink-400)'} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: theme === 'dark' ? 'var(--ink-100)' : 'var(--ink-300)' }}>
                    Obsidian Dark
                  </span>
                </div>
                {theme === 'dark' && <CheckCircle2 size={16} color="var(--accent)" />}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', lineHeight: 1.4, margin: 0 }}>
                Low-fatigue dark studio canvas with subtle luminescence and crisp contrasts.
              </p>
            </button>

            {/* Light Theme Option Card */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              style={{
                background: theme === 'light' ? 'var(--accent-dim)' : 'var(--surface-2)',
                border: `1.5px solid ${theme === 'light' ? 'var(--accent)' : 'var(--border-1)'}`,
                borderRadius: 'var(--r-lg)',
                padding: 'var(--sp-5)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                transition: 'all var(--dur-fast) ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sun size={16} color={theme === 'light' ? 'var(--accent)' : 'var(--ink-400)'} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: theme === 'light' ? 'var(--ink-100)' : 'var(--ink-300)' }}>
                    Editorial Porcelain
                  </span>
                </div>
                {theme === 'light' && <CheckCircle2 size={16} color="var(--accent)" />}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', lineHeight: 1.4, margin: 0 }}>
                High-clarity paper white background with crisp slate typography and sharp boundaries.
              </p>
            </button>
          </div>
        </section>

        {/* ── Pipeline Configuration ─────────────────────────────── */}
        <section className="card" style={{ padding: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-2)' }}>
                <Sliders size={16} color="var(--ink-200)" />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-100)' }}>Inference & Pipeline Controls</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Adjust heuristics and runtime parameters</p>
              </div>
            </div>
            <span className="chip chip-sm" style={{ background: 'var(--surface-3)', border: '1px solid var(--border-2)', color: 'var(--ink-300)', fontFamily: 'var(--font-mono)' }}>
              ACTIVE SESSION
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            {/* Audio fallback simulation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border-0)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink-200)', marginBottom: 2 }}>Synthetic Audio Generator Fallback</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Generate audio synthesizers if cloud storage assets fail to load</div>
              </div>
              <button
                type="button"
                onClick={() => setAudioSimulation(!audioSimulation)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: audioSimulation ? 'var(--accent)' : 'var(--surface-4)',
                  border: '1px solid var(--border-2)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background var(--dur-fast) ease',
                  padding: 2
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    transform: audioSimulation ? 'translateX(20px)' : 'translateX(0)',
                    transition: 'transform var(--dur-fast) ease',
                  }}
                />
              </button>
            </div>

            {/* Confidence Threshold */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border-0)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink-200)', marginBottom: 2 }}>Sentiment Confidence Floor</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Low confidence detections below this trigger secondary LLM re-prompting</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer', width: 120 }}
                />
                <span className="mono" style={{ fontSize: 'var(--text-xs)', width: 36, textAlign: 'right', color: 'var(--ink-200)' }}>
                  {confidenceThreshold}%
                </span>
              </div>
            </div>

            {/* Model Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--ink-200)', marginBottom: 2 }}>Classification Foundation Model</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Active model used for zero-shot prompt evaluations</div>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border-2)',
                  color: 'var(--ink-200)',
                  borderRadius: 'var(--r-sm)',
                  padding: '6px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Default)</option>
                <option value="gpt-4o">gpt-4o (High-Precision)</option>
                <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── System Diagnostics ─────────────────────────────── */}
        <section className="card" style={{ padding: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-2)' }}>
              <Server size={16} color="var(--ink-200)" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-100)' }}>Diagnostics & Environments</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Runtime and dependency telemetry</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
            {[
              ['Framework', 'Vite 8 · React 18', 'Framework runtime'],
              ['Engine Target', 'ES2022', 'Output compilation'],
              ['Audio Engine', 'Web Audio API (Synthesizer)', 'Multi-track playback'],
              ['Document Generator', 'jsPDF 2.5 + AutoTable', 'Client-side PDF render'],
              ['Data Store', 'Static Mock Records (4 Archetypes)', 'Zero latency serving'],
              ['AI Inference Time', '320ms avg / call', 'Simulated benchmark'],
            ].map(([title, val, desc]) => (
              <div
                key={title}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-1)',
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--sp-4)',
                }}
              >
                <p style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', color: 'var(--ink-400)', textTransform: 'uppercase', marginBottom: 4 }}>
                  {title}
                </p>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-100)', marginBottom: 2 }}>
                  {val}
                </p>
                <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-500)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture Specification ─────────────────────────────── */}
        <section
          className="card"
          style={{
            padding: 'var(--sp-6)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.04), var(--surface-1))',
            borderColor: 'var(--border-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--accent-dim)', display: 'grid', placeItems: 'center', border: '1px solid var(--accent-border)' }}>
              <Shield size={16} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-100)' }}>Specification & Architecture</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Full-stack AI call intelligence prototype</p>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-300)', lineHeight: 1.7, marginBottom: 'var(--sp-4)' }}>
            LeadSync is designed as a sales telemetry and conversation intelligence hub. It consumes unstructured customer sales call audio, executes multi-stage transcription and classification pipelines, and translates unstructured sentiment into high-confidence quantitative purchase probabilities and actionable objections for sales leadership.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--status-positive)', fontFamily: 'var(--font-mono)' }}>
              <CheckCircle2 size={13} /> STT Transcriber Ready
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--status-positive)', fontFamily: 'var(--font-mono)' }}>
              <CheckCircle2 size={13} /> Zero-Shot Classifier Ready
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--status-positive)', fontFamily: 'var(--font-mono)' }}>
              <CheckCircle2 size={13} /> Client PDF Engine Ready
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
