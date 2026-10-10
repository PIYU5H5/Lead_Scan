import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Phone, Clock, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { getCallById, SENTIMENT_CONFIG } from '../data/callData';
import { SentimentChip, RadialProgress, ProgressBar } from '../components/UIComponents';
import AudioPlayer from '../components/AudioPlayer';
import ReportDownload from '../components/ReportDownload';

const INSIGHT_TYPES = {
  '🟢': { cls: 'positive', label: 'Positive' },
  '🔴': { cls: 'negative', label: 'Risk' },
  '🟡': { cls: 'warning',  label: 'Caution' },
  '🔵': { cls: 'info',     label: 'Action' },
};

function parseInsight(raw) {
  const first = [...raw][0];
  const type = INSIGHT_TYPES[first] || { cls: 'info', label: '' };
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
  'Angry Customer':        { bg: 'rgba(244,63,94,0.08)',  color: 'var(--status-negative)', border: 'var(--status-negative-border)' },
  'Neutral Inquiry':       { bg: 'rgba(99,102,241,0.08)', color: 'var(--accent)',           border: 'var(--accent-border)' },
};

function getAvatarColor(archetype) {
  return AVATAR_COLORS[archetype] || { bg: 'rgba(99,102,241,0.08)', color: 'var(--accent)', border: 'var(--accent-border)' };
}

function initials(n) { return n.split(' ').map(w => w[0]).join('').slice(0, 2); }

export default function CallDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const call = getCallById(id);
  const [expanded, setExpanded] = useState(false);

  if (!call) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-icon"><Phone size={22} strokeWidth={1.5} /></div>
          <div className="empty-title">Recording not found</div>
          <div className="empty-desc">The call ID "{id}" does not exist.</div>
          <Link to="/calls" className="btn btn-ghost" style={{ marginTop: 'var(--sp-5)' }}>
            <ArrowLeft size={14} /> Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const sentCfg = SENTIMENT_CONFIG[call.sentiment];
  const av = getAvatarColor(call.archetype);
  const probColor = getProbColor(call.purchaseProbability);
  const visibleLines = expanded ? call.transcript : call.transcript.slice(0, 7);

  return (
    <div className="page-content anim-up">

      {/* ── Back + Header ─────────────────────────── */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 'var(--sp-6)' }}
        id="btn-back"
      >
        <ArrowLeft size={13} strokeWidth={2} /> Back
      </button>

      <div className="flex items-start justify-between gap-4 mb-8" style={{ flexWrap: 'wrap' }}>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            style={{
              width: 56, height: 56, borderRadius: 'var(--r-xl)',
              background: av.bg, color: av.color,
              border: `1px solid ${av.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, flexShrink: 0,
            }}
          >
            {initials(call.customerName)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.6px', color: 'var(--ink-100)', lineHeight: 1.1 }}>
                {call.customerName}
              </h1>
              <SentimentChip sentiment={call.sentiment} size="lg" />
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-2)', flexWrap: 'wrap' }}>
              {[
                [Phone, call.id],
                [User, call.agent],
                [Clock, call.duration],
                [Calendar, call.date],
              ].map(([Icon, val]) => (
                <span key={val} className="page-meta-item">
                  <Icon size={11} strokeWidth={2} /> {val}
                </span>
              ))}
              <span className="chip chip-ghost">{call.archetype}</span>
            </div>
          </div>
        </div>
        <ReportDownload call={call} />
      </div>

      {/* ── Score Row ──────────────────────────────── */}
      <div className="grid-3 mb-8">

        {/* Sentiment */}
        <div className="card">
          <div className="card-header">
            <span className="section-label">Sentiment</span>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-4">
              <RadialProgress
                value={call.sentimentScore}
                size={88}
                stroke={7}
                color={call.sentiment === 'positive'
                  ? 'var(--status-positive)'
                  : call.sentiment === 'negative'
                    ? 'var(--status-negative)'
                    : 'var(--status-neutral)'}
                sub="conf."
              />
              <div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--ink-100)', lineHeight: 1.1 }}>
                  {sentCfg.label}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  {call.sentimentScore}% confidence
                </div>
                <div style={{ marginTop: 'var(--sp-3)' }}>
                  <ProgressBar
                    value={call.sentimentScore}
                    variant={call.sentiment === 'positive' ? 'positive' : call.sentiment === 'negative' ? 'negative' : 'accent'}
                    height={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Probability */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="card-header" style={{ width: '100%' }}>
            <span className="section-label">Purchase Probability</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-3)', width: '100%' }}>
            <RadialProgress
              value={call.purchaseProbability}
              size={100}
              stroke={8}
              color={probColor}
              sub="prob."
            />
          </div>
        </div>

        {/* Intelligence */}
        <div className="card">
          <div className="card-header">
            <span className="section-label">Call Intelligence</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[
                ['Total turns',   call.transcript.length],
                ['Customer lines', call.transcript.filter(t => t.speaker === 'Customer').length],
                ['Agent lines',   call.transcript.filter(t => t.speaker === 'Agent').length],
                ['Key signals',   call.keyInsights.length],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)' }}>{label}</span>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink-100)', fontFamily: 'var(--font-mono)' }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Audio Player ───────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="section-label">Audio Playback</span>
        </div>
        <AudioPlayer
          audioFile={call.audioFile}
          durationSeconds={call.durationSeconds}
          title={`${call.customerName} — ${call.id}`}
        />
      </div>

      {/* ── Transcript + Insights ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--sp-6)' }}>

        {/* Transcript */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">Transcript</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', fontFamily: 'var(--font-mono)' }}>
              {call.transcript.length} turns
            </span>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="transcript-list" style={{ padding: 'var(--sp-3) 0' }}>
              {visibleLines.map((line, i) => (
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
              ))}
            </div>
            {call.transcript.length > 7 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setExpanded(e => !e)}
                style={{ margin: 'var(--sp-3) var(--sp-4)', width: 'calc(100% - var(--sp-8))' }}
                id="btn-expand-transcript"
                aria-expanded={expanded}
                aria-label={expanded ? 'Collapse transcript lines' : `Show all ${call.transcript.length} transcript lines`}
              >
                {expanded
                  ? <><ChevronUp size={13} aria-hidden="true" /> Collapse</>
                  : <><ChevronDown size={13} aria-hidden="true" /> Show all {call.transcript.length} lines</>
                }
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Key Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Key Signals</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', fontFamily: 'var(--font-mono)' }}>
                {call.keyInsights.length} signals
              </span>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {call.keyInsights.map((raw, i) => {
                const { cls, text } = parseInsight(raw);
                return (
                  <div key={i} className="insight-row">
                    <div style={{ paddingTop: 6 }}>
                      <div className={`insight-dot ${cls}`} />
                    </div>
                    <p className="insight-text">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Behavioral Summary */}
          <div>
            <div className="flex items-center mb-4">
              <span className="section-label">Behavioral Summary</span>
            </div>
            <div className="card card-inset" style={{ padding: 'var(--sp-5)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-300)', lineHeight: 1.75 }}>
                {call.behavioralSummary}
              </p>
            </div>
          </div>

          {/* Probability Rationale */}
          <div>
            <div className="flex items-center mb-4">
              <span className="section-label">Probability Rationale</span>
            </div>
            <div className="card card-inset" style={{ padding: 'var(--sp-5)', borderColor: `${probColor}25` }}>
              <div className="flex items-baseline gap-3 mb-3">
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1.5px', color: probColor, fontFamily: 'var(--font-mono)' }}>
                  {call.purchaseProbability}%
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)' }}>likelihood of purchase</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-400)', lineHeight: 1.65 }}>
                {call.purchaseJustification}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
