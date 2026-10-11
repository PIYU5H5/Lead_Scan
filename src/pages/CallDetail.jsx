import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Phone, Clock, User, Calendar, ChevronDown, ChevronUp,
  Search, Trash2, Sparkles
} from 'lucide-react';
import { SENTIMENT_CONFIG } from '../data/callData';
import { useCalls } from '../context/CallsContext';
import { SentimentChip, RadialProgress, ProgressBar } from '../components/UIComponents';
import AudioPlayer from '../components/AudioPlayer';
import ReportDownload from '../components/ReportDownload';

const INSIGHT_TYPES = {
  '🟢': { cls: 'positive', label: 'Positive Signal' },
  '🔴': { cls: 'negative', label: 'Critical Risk' },
  '🟡': { cls: 'warning',  label: 'Caution / Barrier' },
  '🔵': { cls: 'info',     label: 'Action Item' },
};

function parseInsight(raw) {
  const first = [...raw][0];
  const type = INSIGHT_TYPES[first] || { cls: 'info', label: 'Note' };
  const text = raw.replace(/^[🟢🔴🟡🔵]\s*\*\*([^*]+)\*\*:\s*/, (_, title) => `${title}: `).replace(/\*\*/g, '');
  return { ...type, text };
}

function getProbColor(p) {
  if (p >= 70) return 'var(--status-positive)';
  if (p >= 40) return 'var(--status-warning)';
  return 'var(--status-negative)';
}

const AVATAR_COLORS = {
  'Self-Directed Learner': { bg: 'rgba(99,102,241,0.08)', color: 'var(--accent)', border: 'var(--accent-border)' },
  'Eager Buyer':           { bg: 'rgba(16,185,129,0.08)', color: 'var(--status-positive)', border: 'var(--status-positive-border)' },
  'Hesitant Prospect':     { bg: 'rgba(245,158,11,0.08)', color: 'var(--status-warning)',  border: 'rgba(245,158,11,0.2)' },
  'Angry Customer':        { bg: 'rgba(239,68,68,0.08)',  color: 'var(--status-negative)', border: 'var(--status-negative-border)' },
  'Neutral Inquiry':       { bg: 'rgba(99,102,241,0.08)', color: 'var(--accent)',           border: 'var(--accent-border)' },
};

function getAvatarColor(archetype) {
  return AVATAR_COLORS[archetype] || { bg: 'rgba(99,102,241,0.08)', color: 'var(--accent)', border: 'var(--accent-border)' };
}

function initials(n) { return n.split(' ').map(w => w[0]).join('').slice(0, 2); }

export default function CallDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCallById, deleteCall } = useCalls();
  const call = getCallById(id);
  const [expanded, setExpanded] = useState(false);
  const [speakerFilter, setSpeakerFilter] = useState('All');
  const [transcriptSearch, setTranscriptSearch] = useState('');

  if (!call) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-icon"><Phone size={20} strokeWidth={1.5} /></div>
          <div className="empty-title">Recording not found</div>
          <div className="empty-desc">The call ID "{id}" does not exist in the active dataset.</div>
          <Link to="/calls" className="btn btn-ghost" style={{ marginTop: 'var(--sp-4)' }}>
            <ArrowLeft size={13} /> Return to Recordings
          </Link>
        </div>
      </div>
    );
  }

  const sentCfg = SENTIMENT_CONFIG[call.sentiment];
  const av = getAvatarColor(call.archetype);
  const probColor = getProbColor(call.purchaseProbability);

  const filteredTranscript = call.transcript.filter(line => {
    const speakerMatch = speakerFilter === 'All' || line.speaker.toLowerCase() === speakerFilter.toLowerCase();
    const textMatch = !transcriptSearch || line.text.toLowerCase().includes(transcriptSearch.toLowerCase());
    return speakerMatch && textMatch;
  });

  const visibleLines = expanded ? filteredTranscript : filteredTranscript.slice(0, 8);

  return (
    <div className="page-content anim-up">

      {/* ── Top Navigation Bar ─────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(-1)}
          id="btn-back"
          aria-label="Back to previous page"
        >
          <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" /> Back
        </button>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
          Session ID: {call.id}
        </span>
      </div>

      {/* ── Executive Customer Header Card ─────────── */}
      <div className="card mb-6" style={{ padding: 'var(--sp-5)' }}>
        <div className="flex items-start justify-between gap-4" style={{ flexWrap: 'wrap' }}>
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 48, height: 48, borderRadius: 'var(--r-md)',
                background: av.bg, color: av.color,
                border: `1px solid ${av.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {initials(call.customerName)}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink-100)', lineHeight: 1.2 }}>
                  {call.customerName}
                </h1>
                <SentimentChip sentiment={call.sentiment} />
                <span className="chip chip-ghost">
                  {call.archetype}
                </span>
                {call.isCustom && (
                  <span className="chip chip-positive" style={{ fontSize: 10, padding: '2px 8px', gap: 4 }}>
                    <Sparkles size={10} /> {call.isRealAiAnalysis ? 'Live AI Ingested' : 'Ingested Recording'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-2)', flexWrap: 'wrap' }}>
                <span className="page-meta-item">
                  <User size={12} strokeWidth={2} aria-hidden="true" /> Agent: {call.agent}
                </span>
                <span className="page-meta-item">
                  <Clock size={12} strokeWidth={2} aria-hidden="true" /> Duration: {call.duration}
                </span>
                <span className="page-meta-item">
                  <Calendar size={12} strokeWidth={2} aria-hidden="true" /> Date: {call.date}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {call.isCustom && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--status-negative)', borderColor: 'var(--status-negative-border)', gap: 6 }}
                onClick={async () => {
                  if (window.confirm(`Delete custom recording ${call.id} (${call.customerName})?`)) {
                    await deleteCall(call.id);
                    navigate('/calls');
                  }
                }}
                id="btn-delete-call"
                title="Delete this custom uploaded recording"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            )}
            <ReportDownload call={call} />
          </div>
        </div>
      </div>

      {/* ── AI Assessment Score Grid ───────────────── */}
      <div className="grid-3 mb-6">

        {/* Sentiment Confidence */}
        <div className="card">
          <div className="card-header">
            <span className="section-label">Acoustic Sentiment</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>GPT-4o-mini</span>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-4">
              <RadialProgress
                value={call.sentimentScore}
                size={76}
                stroke={6}
                color={call.sentiment === 'positive'
                  ? 'var(--status-positive)'
                  : call.sentiment === 'negative'
                    ? 'var(--status-negative)'
                    : 'var(--status-neutral)'}
                sub="conf."
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink-100)', lineHeight: 1.2 }}>
                  {sentCfg.label}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {call.sentimentScore}% model certainty
                </div>
                <div style={{ marginTop: 'var(--sp-3)' }}>
                  <ProgressBar
                    value={call.sentimentScore}
                    variant={call.sentiment === 'positive' ? 'positive' : call.sentiment === 'negative' ? 'negative' : 'accent'}
                    height={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Intent Probability */}
        <div className="card">
          <div className="card-header">
            <span className="section-label">Purchase Probability</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>Heuristic Engine</span>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-4">
              <RadialProgress
                value={call.purchaseProbability}
                size={76}
                stroke={6}
                color={probColor}
                sub="prob."
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: probColor, lineHeight: 1.2 }}>
                  {call.purchaseProbability >= 70 ? 'High Intent' : call.purchaseProbability >= 30 ? 'Moderate' : 'Low / Risk'}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {call.purchaseProbability}% conversion probability
                </div>
                <div style={{ marginTop: 'var(--sp-3)' }}>
                  <ProgressBar
                    value={call.purchaseProbability}
                    variant={call.purchaseProbability >= 70 ? 'positive' : call.purchaseProbability >= 40 ? 'warning' : 'negative'}
                    height={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Intelligence Metrics */}
        <div className="card">
          <div className="card-header">
            <span className="section-label">Dialogue Breakdown</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{call.transcript.length} turns</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {[
                ['Customer dialogue turns', call.transcript.filter(t => t.speaker === 'Customer').length],
                ['Agent dialogue turns', call.transcript.filter(t => t.speaker === 'Agent').length],
                ['Key behavioral signals', call.keyInsights.length],
              ].map(([lbl, num]) => (
                <div key={lbl} className="flex justify-between items-center" style={{ padding: '2px 0' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)' }}>{lbl}</span>
                  <span className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-100)' }}>
                    {num}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Audio Playback Workstation ─────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">Acoustic Audio Playback</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>16kHz Mono Stream</span>
        </div>
        <AudioPlayer
          audioFile={call.audioFile}
          durationSeconds={call.durationSeconds}
          title={`${call.customerName} — ${call.id}`}
        />
      </div>

      {/* ── Two-Column Analysis Deck ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 'var(--sp-5)' }}>

        {/* Left Column: Interactive Full Transcript */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">Interactive Transcript</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
              {filteredTranscript.length} lines matching
            </span>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Transcript toolbar */}
            <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border-1)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
              <div className="filter-tabs">
                {['All', 'Customer', 'Agent'].map(spk => (
                  <button
                    key={spk}
                    className={`filter-tab${speakerFilter === spk ? ' active' : ''}`}
                    onClick={() => setSpeakerFilter(spk)}
                  >
                    {spk}
                  </button>
                ))}
              </div>

              <div className="search-wrap" style={{ flex: 1 }}>
                <Search size={12} className="search-icon" aria-hidden="true" />
                <input
                  type="search"
                  className="search-input"
                  placeholder="Filter dialogue text…"
                  value={transcriptSearch}
                  onChange={e => setTranscriptSearch(e.target.value)}
                  style={{ height: 28, fontSize: 11 }}
                  aria-label="Filter transcript text"
                />
              </div>
            </div>

            {/* Transcript turns */}
            <div className="transcript-list" style={{ padding: 'var(--sp-2) 0', maxHeight: expanded ? 'none' : '420px', overflowY: 'auto' }}>
              {visibleLines.length === 0 ? (
                <div style={{ padding: 'var(--sp-6)', textAlign: 'center', color: 'var(--ink-500)', fontSize: 'var(--text-xs)' }}>
                  No dialogue matches filter criteria.
                </div>
              ) : (
                visibleLines.map((line, i) => (
                  <div
                    key={i}
                    className={`transcript-turn${line.speaker === 'Customer' ? ' customer-turn' : ''}`}
                  >
                    <span className={`turn-speaker ${line.speaker === 'Agent' ? 'is-agent' : 'is-customer'}`}>
                      {line.speaker}
                    </span>
                    <span className={`turn-text${line.speaker === 'Customer' ? ' is-customer' : ''}`}>
                      {line.text}
                    </span>
                  </div>
                ))
              )}
            </div>

            {filteredTranscript.length > 8 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setExpanded(e => !e)}
                style={{ width: '100%', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}
                id="btn-expand-transcript"
                aria-expanded={expanded}
                aria-label={expanded ? 'Collapse transcript lines' : `Show all ${filteredTranscript.length} transcript lines`}
              >
                {expanded
                  ? <><ChevronUp size={13} aria-hidden="true" /> Show Less</>
                  : <><ChevronDown size={13} aria-hidden="true" /> Show All {filteredTranscript.length} Dialogue Turns</>
                }
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Key Behavioral Insights & Executive Summary */}
        <div className="flex flex-col gap-4">

          {/* Key Extracted Signals */}
          <div className="card">
            <div className="card-header">
              <span className="section-heading" style={{ fontSize: 'var(--text-sm)' }}>Key Behavioral Signals</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
                {call.keyInsights.length} detected
              </span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              {call.keyInsights.map((raw, i) => {
                const { cls, text } = parseInsight(raw);
                return (
                  <div key={i} className="insight-row">
                    <div>
                      <div className={`insight-dot ${cls}`} />
                    </div>
                    <p className="insight-text" style={{ fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive Behavioral Summary */}
          <div className="card">
            <div className="card-header">
              <span className="section-heading" style={{ fontSize: 'var(--text-sm)' }}>Behavioral Profiling</span>
            </div>
            <div className="card-body">
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-300)', lineHeight: 1.6, margin: 0 }}>
                {call.behavioralSummary}
              </p>
            </div>
          </div>

          {/* Purchase Probability Rationale */}
          <div className="card" style={{ borderColor: `${probColor}33` }}>
            <div className="card-header" style={{ background: `${probColor}08` }}>
              <span className="section-heading" style={{ fontSize: 'var(--text-sm)', color: probColor }}>
                Probability Assessment Rationale
              </span>
              <span className="mono" style={{ fontSize: 11, color: probColor, fontWeight: 700 }}>
                {call.purchaseProbability}%
              </span>
            </div>
            <div className="card-body">
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-300)', lineHeight: 1.55, margin: 0 }}>
                {call.purchaseJustification}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
