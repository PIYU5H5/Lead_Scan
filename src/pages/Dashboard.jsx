import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { CALLS, SENTIMENT_CONFIG } from '../data/callData';
import { StatTile, SentimentChip, ProgressBar } from '../components/UIComponents';

const totalCalls   = CALLS.length;
const avgProb      = totalCalls > 0 ? Math.round(CALLS.reduce((s, c) => s + c.purchaseProbability, 0) / totalCalls) : 0;
const positive     = CALLS.filter(c => c.sentiment === 'positive').length;
const negative     = CALLS.filter(c => c.sentiment === 'negative').length;

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

const AVATAR_COLORS = {
  'Self-Directed Learner': { bg: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: 'var(--accent-border)' },
  'Eager Buyer':           { bg: 'rgba(16,185,129,0.1)', color: 'var(--status-positive)', border: 'var(--status-positive-border)' },
  'Hesitant Prospect':     { bg: 'rgba(245,158,11,0.1)', color: 'var(--status-warning)',  border: 'rgba(245,158,11,0.2)' },
  'Angry Customer':        { bg: 'rgba(244,63,94,0.1)',  color: 'var(--status-negative)', border: 'var(--status-negative-border)' },
  'Neutral Inquiry':       { bg: 'rgba(99,102,241,0.1)', color: 'var(--accent)',           border: 'var(--accent-border)' },
};

function getAvatarColor(archetype) {
  return AVATAR_COLORS[archetype] || { bg: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: 'var(--accent-border)' };
}

export default function Dashboard() {
  return (
    <div className="page-content anim-up">

      {/* ── Page Header ─────────────────────────────── */}
      <header style={{ marginBottom: 'var(--sp-10)' }}>
        <p className="page-eyebrow">Sales Intelligence</p>
        <h1 className="page-title">Overview</h1>
        <div className="page-meta">
          <span className="page-meta-item">
            <Phone size={12} strokeWidth={2} aria-hidden="true" />
            {totalCalls} call recordings
          </span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span className="page-meta-item">
            Analysis complete
          </span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span className="page-meta-item mono">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </header>

      {/* ── KPI Row ─────────────────────────────────── */}
      <div className="grid-4 mb-8">
        <StatTile
          label="Calls Analyzed"
          value={totalCalls}
          sub="All recordings processed"
          delay={1}
          accent={Phone}
        />
        <StatTile
          label="Avg. Purchase Prob."
          value={`${avgProb}%`}
          sub="↑ +12pp vs. baseline"
          subType="positive"
          delay={2}
          accent={TrendingUp}
        />
        <StatTile
          label="Positive Sentiment"
          value={positive}
          sub={`${Math.round((positive / totalCalls) * 100)}% of pipeline`}
          subType="positive"
          delay={3}
          accent={CheckCircle}
        />
        <StatTile
          label="Churn Risk"
          value={negative}
          sub="Immediate action required"
          subType="negative"
          delay={4}
          accent={AlertTriangle}
        />
      </div>

      {/* ── Main Grid ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--sp-6)' }}>

        {/* Call List */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="section-heading">Recent Recordings</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                Select to view AI analysis
              </div>
            </div>
            <Link to="/calls" className="btn btn-ghost btn-sm">
              All recordings <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {CALLS.map((call, i) => {
              const av = getAvatarColor(call.archetype);
              return (
                <Link
                  key={call.id}
                  to={`/calls/${call.id}`}
                  className={`call-row ${call.sentiment} anim-up-${Math.min(i + 1, 4)}`}
                  id={`call-row-${call.id}`}
                >
                  {/* Avatar */}
                  <div
                    className="call-row-avatar"
                    style={{ background: av.bg, color: av.color, borderColor: av.border }}
                  >
                    {initials(call.customerName)}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                      <span className="call-row-name">{call.customerName}</span>
                      <SentimentChip sentiment={call.sentiment} />
                    </div>
                    <div className="call-row-sub">
                      <span>{call.id}</span>
                      <span>·</span>
                      <span>{call.archetype}</span>
                      <span>·</span>
                      <span>{call.agent}</span>
                    </div>
                    <div className="call-row-prob">
                      <ProgressBar value={call.purchaseProbability} variant="auto" height={3} />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                        {call.purchaseProbability}%
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="call-row-meta">
                    <span className="call-row-time">{call.duration}</span>
                    <span className="call-row-time">{call.date}</span>
                    <ArrowRight size={14} strokeWidth={1.5} style={{ color: 'var(--ink-600)', marginTop: 2 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Rail */}
        <div className="flex flex-col gap-4">

          {/* Sentiment Split */}
          <div className="card">
            <div className="card-header">
              <span className="section-heading" style={{ fontSize: 'var(--text-base)' }}>Sentiment Split</span>
            </div>
            <div className="card-body">
              {Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => {
                const count = CALLS.filter(c => c.sentiment === key).length;
                const pct = Math.round((count / totalCalls) * 100);
                return (
                  <div key={key} style={{ marginBottom: 'var(--sp-4)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-300)', fontWeight: 500 }}>
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
                        {count}/{totalCalls}
                      </span>
                    </div>
                    <ProgressBar
                      value={pct}
                      variant={key === 'positive' ? 'positive' : key === 'negative' ? 'negative' : 'accent'}
                      height={3}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Probability Leaderboard */}
          <div className="card">
            <div className="card-header">
              <span className="section-heading" style={{ fontSize: 'var(--text-base)' }}>Purchase Intent</span>
            </div>
            <div style={{ padding: 'var(--sp-2) 0' }}>
              {[...CALLS].sort((a, b) => b.purchaseProbability - a.purchaseProbability).map((call, i) => {
                const av = getAvatarColor(call.archetype);
                return (
                  <Link
                    key={call.id}
                    to={`/calls/${call.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                      padding: 'var(--sp-3) var(--sp-5)',
                      textDecoration: 'none',
                      transition: 'background var(--dur-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--border-0)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', fontFamily: 'var(--font-mono)', width: 16 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: 'var(--r-md)',
                        background: av.bg, color: av.color, border: `1px solid ${av.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {initials(call.customerName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-200)', lineHeight: 1.2 }}>
                        {call.customerName.split(' ')[0]}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                        {call.archetype}
                      </div>
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-200)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                      {call.purchaseProbability}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System health — minimal */}
          <div className="card card-inset" style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>
                AI Pipeline
              </span>
              <span className="chip chip-positive">Operational</span>
            </div>
            {['ASR / Whisper', 'LLM Sentiment', 'Prob. Scorer', 'Insights Engine'].map(s => (
              <div key={s} className="flex justify-between items-center" style={{ padding: '5px 0', borderBottom: '1px solid var(--border-0)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)' }}>{s}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--status-positive)' }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-positive)', fontFamily: 'var(--font-mono)' }}>Online</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
