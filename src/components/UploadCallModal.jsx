import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, UploadCloud, FileAudio,
  Sparkles, AlertCircle, ChevronDown, ChevronUp, Cpu, Key, CheckCircle2
} from 'lucide-react';
import { useCalls } from '../context/CallsContext';
import { PRESET_SCENARIOS, runIngestionPipeline, formatDuration, getAudioDuration } from '../utils/aiSimulator';

const SAVED_KEY_STORAGE = 'leadsync_user_ai_key';

export default function UploadCallModal() {
  const { isUploadModalOpen, closeUploadModal, addCall } = useCalls();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioMeta, setAudioMeta] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [agentName, setAgentName] = useState('Rahul (TechUp Academy)');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [scenarioKey, setScenarioKey] = useState('eager-buyer');
  const [analysisMode, setAnalysisMode] = useState('ai'); // 'ai' | 'simulation'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(SAVED_KEY_STORAGE) || '');
  const [showKeyField, setShowKeyField] = useState(false);

  // Server health state
  const [serverStatus, setServerStatus] = useState({ online: false, hasKey: false });

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState({ pct: 0, label: '', detail: '' });
  const [error, setError] = useState('');

  // Check backend availability on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setServerStatus({
            online: true,
            hasKey: data.hasGeminiKey || data.hasOpenAIKey,
          });
          if (!data.hasGeminiKey && !data.hasOpenAIKey && !apiKey) {
            setShowKeyField(true);
          }
        }
      } catch {
        setServerStatus({ online: false, hasKey: false });
      }
    }
    if (isUploadModalOpen) {
      checkHealth();
    }
  }, [isUploadModalOpen, apiKey]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isUploadModalOpen && !isProcessing) {
        closeUploadModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUploadModalOpen, isProcessing, closeUploadModal]);

  if (!isUploadModalOpen) return null;

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name)) {
      setError('Please select a valid audio file (.mp3, .wav, .m4a, .ogg)');
      return;
    }
    setError('');
    setAudioFile(file);

    try {
      const dur = await getAudioDuration(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setAudioMeta({ duration: dur, sizeMB });
      if (!customerName) {
        const cleaned = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setCustomerName(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
      }
    } catch {
      setAudioMeta({ duration: 180, sizeMB: '3.2' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCust = customerName.trim() || 'Aarav Patel';
    const finalAgent = agentName.trim() || 'Sales Representative';

    setIsProcessing(true);
    setError('');

    // Save key to localStorage if entered
    if (apiKey.trim()) {
      localStorage.setItem(SAVED_KEY_STORAGE, apiKey.trim());
    }

    try {
      let finalCallRecord = null;

      // ── Path 1: Real AI Transcription & Scoring via Backend ──────────────────
      if (analysisMode === 'ai' && audioFile && (serverStatus.online || apiKey)) {
        setPipelineProgress({
          pct: 20,
          label: 'Stage 01: Streaming Audio Ingestion',
          detail: 'Uploading audio stream to transcription engine...',
        });

        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('customerName', finalCust);
        formData.append('agentName', finalAgent);
        formData.append('phone', phone.trim() || '+91 98450 12890');
        if (apiKey) formData.append('apiKey', apiKey.trim());

        // Update progress indication while network request is underway
        const progressTimer = setTimeout(() => {
          setPipelineProgress({
            pct: 55,
            label: 'Stage 02: Real Speech Transcription & Turn Diarization',
            detail: 'Gemini / Whisper model transcribing acoustic dialogue turns...',
          });
        }, 1200);

        const scoringTimer = setTimeout(() => {
          setPipelineProgress({
            pct: 85,
            label: 'Stage 03: Sales Intent & Deal Telemetry Scoring',
            detail: 'Evaluating buying objections, sentiment confidence & summary...',
          });
        }, 3200);

        const res = await fetch('/api/analyze-call', {
          method: 'POST',
          body: formData,
        });

        clearTimeout(progressTimer);
        clearTimeout(scoringTimer);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (errData.error === 'NO_API_KEY') {
            setShowKeyField(true);
            throw new Error('Please enter a Gemini or OpenAI API key below or set GEMINI_API_KEY in your server .env file.');
          }
          throw new Error(errData.message || 'Server failed to analyze the audio file.');
        }

        const data = await res.json();
        finalCallRecord = data.call;

        // Supplement audio duration from actual file decoding
        if (audioMeta?.duration) {
          finalCallRecord.durationSeconds = audioMeta.duration;
          finalCallRecord.duration = formatDuration(audioMeta.duration);
        }

        setPipelineProgress({
          pct: 100,
          label: 'Inference Complete',
          detail: 'Call transcribed and intelligence synchronized.',
        });
      } else {
        // ── Path 2: In-Browser Simulated Pipeline (Zero-Key Mode) ───────────
        finalCallRecord = await runIngestionPipeline({
          customerName: finalCust,
          agentName: finalAgent,
          phone: phone.trim() || '+91 98450 12890',
          scenarioKey,
          customTranscriptText: null,
          audioFile,
          onProgress: (step) => {
            setPipelineProgress(step);
          },
        });
      }

      // Commit to IndexedDB + state
      const readyCall = await addCall(finalCallRecord, audioFile);

      // Brief delay to let the user see the 100% completion
      setTimeout(() => {
        setIsProcessing(false);
        closeUploadModal();
        // Reset form
        setAudioFile(null);
        setAudioMeta(null);
        setCustomerName('');
        // Navigate directly to the newly ingested call
        navigate(`/calls/${readyCall.id}`);
      }, 500);
    } catch (err) {
      console.error('[UploadModal] Ingestion error:', err);
      setError(err.message || 'An error occurred during audio processing. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={!isProcessing ? closeUploadModal : undefined}>
      <div
        className="modal-dialog anim-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="page-eyebrow">Audio Ingestion Engine</span>
            <h2 id="modal-title" className="modal-title">
              Ingest & Analyze Call Recording
            </h2>
          </div>
          {!isProcessing && (
            <button
              className="icon-btn"
              onClick={closeUploadModal}
              aria-label="Close modal"
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Processing State */}
        {isProcessing ? (
          <div className="modal-body" style={{ padding: 'var(--sp-6) var(--sp-5)', textAlign: 'center' }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto var(--sp-4)',
              }}
            >
              <Cpu size={26} color="var(--accent)" className="anim-pulse" />
            </div>

            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink-100)', marginBottom: 'var(--sp-2)' }}>
              {pipelineProgress.label || 'Processing Audio Stream...'}
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', marginBottom: 'var(--sp-5)', minHeight: 20 }}>
              {pipelineProgress.detail || 'Executing speech transcription and scoring telemetry...'}
            </p>

            {/* Stepper Bar */}
            <div className="progress-track" style={{ height: 6, marginBottom: 'var(--sp-3)' }}>
              <div
                className="progress-fill fill-accent"
                style={{ width: `${pipelineProgress.pct}%`, transition: 'width 0.4s ease' }}
              />
            </div>
            <div className="flex justify-between items-center mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
              <span>Whisper / Gemini Native Speech Model</span>
              <span>{pipelineProgress.pct}%</span>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div
                  style={{
                    padding: 'var(--sp-3)',
                    background: 'var(--status-negative-bg)',
                    border: '1px solid var(--status-negative-border)',
                    borderRadius: 'var(--r-md)',
                    color: 'var(--status-negative)',
                    fontSize: 'var(--text-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Mode Selector Tabs */}
              <div className="modal-mode-tabs">
                <button
                  type="button"
                  className={`btn ${analysisMode === 'ai' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setAnalysisMode('ai')}
                  style={{ fontSize: 11, padding: '7px 10px', justifyContent: 'center' }}
                >
                  <Sparkles size={13} />
                  <span>Live AI Model (Gemini/Whisper)</span>
                </button>
                <button
                  type="button"
                  className={`btn ${analysisMode === 'simulation' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setAnalysisMode('simulation')}
                  style={{ fontSize: 11, padding: '7px 10px', justifyContent: 'center' }}
                >
                  <Cpu size={13} />
                  <span>Simulation Benchmark</span>
                </button>
              </div>

              {/* Audio Dropzone */}
              <div
                className={`dropzone ${isDragging ? 'is-dragging' : ''} ${audioFile ? 'has-file' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                role="button"
                aria-label="Upload audio recording"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />

                {audioFile ? (
                  <div className="flex items-center justify-between" style={{ width: '100%' }}>
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 'var(--r-md)',
                          background: 'var(--accent-dim)',
                          border: '1px solid var(--accent-border)',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <FileAudio size={18} color="var(--accent)" />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-100)' }}>
                          {audioFile.name}
                        </div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)' }}>
                          {audioMeta?.sizeMB} MB · Duration ~{formatDuration(audioMeta?.duration || 180)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAudioFile(null);
                        setAudioMeta(null);
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'var(--surface-3)',
                        border: '1px solid var(--border-2)',
                        display: 'grid',
                        placeItems: 'center',
                        margin: '0 auto var(--sp-3)',
                      }}
                    >
                      <UploadCloud size={20} color="var(--accent)" />
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-100)' }}>
                      Drag & drop call audio file, or <span style={{ color: 'var(--accent)' }}>browse files</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 4 }}>
                      Supports MP3, WAV, M4A, OGG up to 50MB
                    </div>
                  </div>
                )}
              </div>

              {/* API Key Drawer (if in AI mode) */}
              {analysisMode === 'ai' && (
                <div style={{ marginTop: 'var(--sp-3)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <button
                      type="button"
                      className="flex items-center gap-1"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--ink-400)',
                        fontSize: 'var(--text-xs)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      onClick={() => setShowKeyField(!showKeyField)}
                    >
                      <Key size={12} color="var(--accent)" />
                      <span>{showKeyField ? 'Hide API Key Settings' : 'AI API Key Settings (Gemini / OpenAI)'}</span>
                    </button>

                    {serverStatus.hasKey && (
                      <span className="mono" style={{ fontSize: 10, color: 'var(--status-positive)' }}>
                        ✓ Server .env Key Active
                      </span>
                    )}
                  </div>

                  {showKeyField && (
                    <div style={{ padding: 'var(--sp-3)', background: 'var(--surface-1)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-1)', marginTop: 4 }}>
                      <label className="field-label" htmlFor="user-api-key">
                        Gemini or OpenAI API Key
                      </label>
                      <input
                        id="user-api-key"
                        type="password"
                        className="text-input"
                        placeholder="AIzaSy... or sk-proj-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <div style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 4 }}>
                        Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Google AI Studio</a>. Saved locally in browser for future uploads.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Call Metadata Fields */}
              <div className="modal-field-grid">
                <div>
                  <label className="field-label" htmlFor="cust-name">
                    Customer Name <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    id="cust-name"
                    type="text"
                    className="text-input"
                    placeholder="e.g. Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="agent-name">
                    Sales Agent
                  </label>
                  <input
                    id="agent-name"
                    type="text"
                    className="text-input"
                    placeholder="e.g. Rahul (TechUp)"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 'var(--sp-3)' }}>
                <label className="field-label" htmlFor="phone-num">
                  Contact Phone Number
                </label>
                <input
                  id="phone-num"
                  type="text"
                  className="text-input"
                  placeholder="+91 98450 12890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Archetype Selector (Only in Simulation Mode) */}
              {analysisMode === 'simulation' && (
                <div style={{ marginTop: 'var(--sp-4)' }}>
                  <label className="field-label" htmlFor="scenario-select">
                    Simulation Sales Archetype
                  </label>
                  <select
                    id="scenario-select"
                    className="text-input"
                    value={scenarioKey}
                    onChange={(e) => setScenarioKey(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    {Object.entries(PRESET_SCENARIOS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeUploadModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                id="btn-confirm-upload"
              >
                <Sparkles size={14} strokeWidth={2} />
                {analysisMode === 'ai' ? 'Transcribe & Score Call' : 'Run Benchmark Ingestion'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
