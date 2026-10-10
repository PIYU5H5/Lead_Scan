import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Phone, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { CALLS, SENTIMENT_CONFIG } from '../data/callData';
import { StatTile, SentimentChip, ProgressBar } from '../components/UIComponents';

const totalCalls = CALLS.length;
const avgProb    = totalCalls > 0 ? Math.round(CALLS.reduce((s, c) => s + c.purchaseProbability, 0) / totalCalls) : 0;
const positive   = CALLS.filter(c => c.sentiment === 'positive').length;
const negative   = CALLS.filter(c => c.sentiment === 'negative').length;

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
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

export default function Dashboard() {
  return (
    <div className="page-content anim-up">

      {/* ── Page Header ─────────────────────────────── */}
      <header style={{ marginBottom: 'var(--sp-7)' }}>
        <p className="page-eyebrow">Intelligence Platform</p>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <h1 className="page-title">Sales Intelligence Overview</h1>
            <div className="page-meta">
              <span className="page-meta-item">
                <Phone size={13} strokeWidth={2} aria-hidden="true" />
                {totalCalls} call recordings
              </span>
              <span style={{ color: 'var(--border-2)' }}>·</span>
              <span className="page-meta-item">
                <span className="status-pip" style={{ marginRight: 4 }} aria-hidden="true" />
                Inference synchronized
              </span>
              <span style={{ color: 'var(--border-2)' }}>·</span>
              <span className="page-meta-item mono">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/calls" className="btn btn-ghost">
              Browse Recordings
            </Link>
            <Link to="/analytics" className="btn btn-primary">
              Full Analytics <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── KPI Row ─────────────────────────────────── */}
      <div className="grid-4 mb-6">
        <StatTile
          label="Processed Calls"
          value={totalCalls}
          sub="3 models evaluated"
          delay={1}
          accent={Phone}
        />
        <StatTile
          label="Avg. Purchase Prob."
          value={`${avgProb}%`}
          sub="↑ +12pp baseline"
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
          sub="Requires escalation"
          subType="negative"
          delay={4}
          accent={AlertTriangle}
        />
      </div>

      {/* ── Main Layout Grid ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-5)' }}>

        {/* Left Column: Call Recordings Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="section-heading">Analyzed Customer Recordings</div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', marginTop: 2 }}>
                Transcripts, acoustic sentiment, and buying probability scores
              </p>
            </div>
            <Link to="/calls" className="btn btn-ghost btn-sm">
              View All ({totalCalls}) <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
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
                  {/* Customer Avatar */}
                  <div
                    className="call-row-avatar"
                    style={{ background: av.bg, color: av.color, borderColor: av.border }}
                    aria-hidden="true"
                  >
                    {initials(call.customerName)}
                  </div>

                  {/* Primary Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                      <span className="call-row-name">{call.customerName}</span>
                      <SentimentChip sentiment={call.sentiment} />
                      <span className="chip chip-ghost" style={{ fontSize: 10, padding: '1px 6px' }}>
                        {call.archetype}
                      </span>
                    </div>

                    <div className="call-row-sub">
                      <span>{call.id}</span>
                      <span>·</span>
                      <span>Agent: {call.agent}</span>
                    </div>

                    <div className="call-row-prob">
                      <ProgressBar value={call.purchaseProbability} variant="auto" height={3} />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', flexShrink: 0, fontWeight: 600 }}>
                        {call.purchaseProbability}% prob.
                      </span>
                    </div>
                  </div>

                  {/* Meta & Navigation */}
                  <div className="call-row-meta">
                    <span className="call-row-time">{call.duration}</span>
                    <span className="call-row-time">{call.date}</span>
                    <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pipeline Breakdown & Critical Signals */}
        <div className="flex flex-col gap-4">

          {/* Sentiment Distribution Card */}
          <div className="card">
            <div className="card-header">
              <span className="section-heading" style={{ fontSize: 'var(--text-sm)' }}>Pipeline Sentiment Split</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>100% evaluated</span>
            </div>
            <div className="card-body">
              {Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => {
                const count = CALLS.filter(c => c.sentiment === key).length;
                const pct = Math.round((count / totalCalls) * 100);
                return (
                  <div key={key} style={{ marginBottom: 'var(--sp-3)' }}>
                    <div className="flex justify-between items-center mb-1">
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-200)', fontWeight: 500 }}>
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--ink-400)', fontFamily: 'var(--font-mono)' }}>
                        {count} call{count !== 1 ? 's' : ''} ({pct}%)
                      </span>
                    </div>
                    <ProgressBar
                      value={pct}
                      variant={key === 'positive' ? 'positive' : key === 'negative' ? 'negative' : 'accent'}
                      height={4}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Intelligence Actions */}
          <div className="card">
            <div className="card-header">
              <span className="section-heading" style={{ fontSize: 'var(--text-sm)' }}>Priority Action Signals</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', padding: 'var(--sp-4)' }}>
              
              {/* High Converter Alert */}
              <div style={{ padding: 'var(--sp-3)', borderRadius: 'var(--r-md)', background: 'var(--status-positive-bg)', border: '1px solid var(--status-positive-border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} color="var(--status-positive)" aria-hidden="true" />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-positive)' }}>
                    High-Intent Close Ready
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-300)', lineHeight: 1.4, margin: '0 0 8px 0' }}>
                  <strong>Sidharth</strong> (98% prob): Customer requested payment details and immediate deployment timeline.
                </p>
                <Link to="/calls/CALL-2026-002" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', background: 'var(--surface-1)' }}>
                  View Sidharth's Brief →
                </Link>
              </div>

              {/* Churn Threat Alert */}
              <div style={{ padding: 'var(--sp-3)', borderRadius: 'var(--r-md)', background: 'var(--status-negative-bg)', border: '1px solid var(--status-negative-border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert size={14} color="var(--status-negative)" aria-hidden="true" />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-negative)' }}>
                    Immediate DNC Escalation
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--ink-300)', lineHeight: 1.4, margin: '0 0 8px 0' }}>
                  <strong>Samir</strong> (0% prob): Hard rejection with Do-Not-Call threat. Remove from CRM outbound lists.
                </p>
                <Link to="/calls/CALL-2026-003" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', background: 'var(--surface-1)' }}>
                  Review Samir's Call →
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
