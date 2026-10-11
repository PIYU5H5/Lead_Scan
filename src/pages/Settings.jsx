import { Database, Shield, Sliders, CheckCircle2, Server, Sun, Moon, UploadCloud, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCalls } from '../context/CallsContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { calls, openUploadModal, resetToDefault } = useCalls();
  const [audioSimulation, setAudioSimulation] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(65);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const customCount = calls.filter(c => c.isCustom).length;

  return (
    <div className="page-content anim-up">
      {/* ── Page Header ─────────────────────────────── */}
      <header style={{ marginBottom: 'var(--sp-7)' }}>
        <p className="page-eyebrow">System Workspace</p>
        <h1 className="page-title">Platform Settings</h1>
        <div className="page-meta">
          <span className="page-meta-item mono">v1.2.0-enterprise</span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span className="page-meta-item">
            <span className="status-pip" style={{ marginRight: 4 }} aria-hidden="true" />
            All telemetry operational
          </span>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)', maxWidth: 840 }}>
        {/* ── Appearance & Theme ─────────────────────────────── */}
        <section className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-1)' }}>
                {theme === 'dark' ? <Moon size={14} color="var(--accent)" aria-hidden="true" /> : <Sun size={14} color="var(--status-warning)" aria-hidden="true" />}
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-100)' }}>Theme & Visual Style</h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Select between low-fatigue studio canvas and high-contrast editorial porcelain</p>
              </div>
            </div>
            <span className="chip chip-ghost mono" style={{ fontSize: 10 }}>
              {theme === 'dark' ? 'DARK' : 'LIGHT'}
            </span>
          </div>

          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
              {/* Dark Theme Option Card */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                style={{
                  background: theme === 'dark' ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: `1px solid ${theme === 'dark' ? 'var(--accent)' : 'var(--border-1)'}`,
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--sp-4)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-2)',
                  transition: 'background-color var(--dur-fast) ease, border-color var(--dur-fast) ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Moon size={14} color={theme === 'dark' ? 'var(--accent)' : 'var(--ink-400)'} aria-hidden="true" />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: theme === 'dark' ? 'var(--ink-100)' : 'var(--ink-300)' }}>
                      Obsidian Slate (Dark)
                    </span>
                  </div>
                  {theme === 'dark' && <CheckCircle2 size={14} color="var(--accent)" aria-hidden="true" />}
                </div>
                <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-400)', lineHeight: 1.45, margin: 0 }}>
                  Engineered dark canvas optimized for sustained data review with sharp contrast.
                </p>
              </button>

              {/* Light Theme Option Card */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                style={{
                  background: theme === 'light' ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: `1px solid ${theme === 'light' ? 'var(--accent)' : 'var(--border-1)'}`,
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--sp-4)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-2)',
                  transition: 'background-color var(--dur-fast) ease, border-color var(--dur-fast) ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sun size={14} color={theme === 'light' ? 'var(--accent)' : 'var(--ink-400)'} aria-hidden="true" />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: theme === 'light' ? 'var(--ink-100)' : 'var(--ink-300)' }}>
                      Porcelain (Light)
                    </span>
                  </div>
                  {theme === 'light' && <CheckCircle2 size={14} color="var(--accent)" aria-hidden="true" />}
                </div>
                <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-400)', lineHeight: 1.45, margin: 0 }}>
                  High-clarity paper white background with crisp typography and subtle boundaries.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* ── Pipeline Configuration ─────────────────────────────── */}
        <section className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-1)' }}>
                <Sliders size={14} color="var(--ink-300)" aria-hidden="true" />
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-100)' }}>Inference & Pipeline Controls</h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Runtime parameters and heuristic thresholds</p>
              </div>
            </div>
            <span className="chip chip-positive" style={{ fontSize: 10 }}>
              LIVE
            </span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {/* Audio fallback simulation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--sp-3)', borderBottom: '1px solid var(--border-1)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-100)', marginBottom: 2 }}>Synthetic Audio Generator Fallback</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-400)' }}>Fallback audio player if remote storage assets fail to stream</div>
              </div>
              <button
                type="button"
                onClick={() => setAudioSimulation(!audioSimulation)}
                style={{
                  width: 38,
                  height: 20,
                  borderRadius: 10,
                  background: audioSimulation ? 'var(--accent)' : 'var(--surface-4)',
                  border: '1px solid var(--border-2)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color var(--dur-fast) ease',
                  padding: 2
                }}
                aria-label="Toggle synthetic audio generator fallback"
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: '#fff',
                    transform: audioSimulation ? 'translateX(18px)' : 'translateX(0)',
                    transition: 'transform var(--dur-fast) ease',
                  }}
                />
              </button>
            </div>

            {/* Confidence Threshold */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--sp-3)', borderBottom: '1px solid var(--border-1)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-100)', marginBottom: 2 }}>Sentiment Confidence Floor</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-400)' }}>Inferences below this threshold prompt secondary verification passes</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer', width: 100 }}
                  aria-label="Sentiment confidence floor threshold"
                />
                <span className="mono" style={{ fontSize: 11, width: 32, textAlign: 'right', color: 'var(--ink-200)', fontWeight: 600 }}>
                  {confidenceThreshold}%
                </span>
              </div>
            </div>

            {/* Model Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-100)', marginBottom: 2 }}>Classification Foundation Model</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-400)' }}>Zero-shot evaluation model currently deployed</div>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-2)',
                  color: 'var(--ink-100)',
                  borderRadius: 'var(--r-sm)',
                  padding: '5px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  outline: 'none',
                  cursor: 'pointer'
                }}
                aria-label="Select classification foundation model"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Optimized)</option>
                <option value="gpt-4o">gpt-4o (High-Precision)</option>
                <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── System Diagnostics ─────────────────────────────── */}
        <section className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-1)' }}>
                <Server size={14} color="var(--ink-300)" aria-hidden="true" />
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-100)' }}>Environment Telemetry</h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Runtime and dependency specifications</p>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-3)' }}>
              {[
                ['Framework', 'Vite 8 · React 18', 'Client app runtime'],
                ['Compilation Target', 'ES2022', 'Modern browser build'],
                ['Audio Architecture', 'HTML5 Audio API', '16kHz mono stream'],
                ['Report Generator', 'jsPDF 2.5 + AutoTable', 'High-contrast client PDF'],
                ['Dataset Pipeline', 'Pre-computed JSON', 'Sub-20ms load latency'],
                ['Inference Model', 'Whisper Large v3 + GPT-4o', 'Diarization & scoring'],
              ].map(([title, val, desc]) => (
                <div
                  key={title}
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-1)',
                    borderRadius: 'var(--r-md)',
                    padding: 'var(--sp-3)',
                  }}
                >
                  <p style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 2 }}>
                    {title}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-100)', marginBottom: 2 }}>
                    {val}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--ink-400)', margin: 0 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ingested Dataset & In-Browser Storage ─────────────────────────────── */}
        <section className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', display: 'grid', placeItems: 'center', border: '1px solid var(--border-1)' }}>
                <Database size={14} color="var(--accent)" aria-hidden="true" />
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-100)' }}>Local Dataset & Audio Store</h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>In-browser IndexedDB & LocalStorage audio cache</p>
              </div>
            </div>
            <span className="chip chip-ghost mono" style={{ fontSize: 10 }}>
              {calls.length} RECORDINGS ({customCount} CUSTOM)
            </span>
          </div>

          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-200)', fontWeight: 500, margin: '0 0 2px 0' }}>
                  Persistent Client-Side Speech Cache
                </p>
                <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-400)', margin: 0 }}>
                  Binary audio streams are stored directly in high-capacity IndexedDB, surviving browser refreshes without server dependency.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={openUploadModal}
                  style={{ gap: 6 }}
                >
                  <UploadCloud size={13} />
                  <span>Ingest Recording</span>
                </button>

                {customCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--status-negative)', borderColor: 'var(--status-negative-border)', gap: 6 }}
                    onClick={() => {
                      if (window.confirm('Reset workspace and purge all custom uploaded recordings?')) {
                        resetToDefault();
                      }
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>Reset to Benchmark Dataset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Architecture Specification ─────────────────────────────── */}
        <section className="card" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--accent-dim)', display: 'grid', placeItems: 'center', border: '1px solid var(--accent-border)' }}>
              <Shield size={14} color="var(--accent)" aria-hidden="true" />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-100)' }}>Enterprise SLA & Telemetry</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>Production-grade sales intelligence contract</p>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-300)', lineHeight: 1.6, marginBottom: 'var(--sp-3)' }}>
            LeadSync is designed as a secure conversation intelligence telemetry hub. Ingested audio calls are processed through transcription and acoustic sentiment models, translating raw voice into structured purchase probabilities and executive deal summaries without data leakage.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--status-positive)', fontFamily: 'var(--font-mono)' }}>
              <CheckCircle2 size={13} aria-hidden="true" /> Whisper ASR Active
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--status-positive)', fontFamily: 'var(--font-mono)' }}>
              <CheckCircle2 size={13} aria-hidden="true" /> Zero-Shot Classifier Active
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--status-positive)', fontFamily: 'var(--font-mono)' }}>
              <CheckCircle2 size={13} aria-hidden="true" /> Executive Brief Export Active
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
