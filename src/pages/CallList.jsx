import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Clock, User } from 'lucide-react';
import { CALLS } from '../data/callData';
import { SentimentChip, ProgressBar } from '../components/UIComponents';

const FILTERS = ['All', 'Positive', 'Neutral', 'Negative'];

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

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export default function CallList() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery]   = useState('');

  const visible = CALLS.filter(c => {
    const fMatch = filter === 'All' || c.sentiment === filter.toLowerCase();
    const q = query.toLowerCase();
    const qMatch = !q || c.customerName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.archetype.toLowerCase().includes(q);
    return fMatch && qMatch;
  });

  return (
    <div className="page-content anim-up">

      {/* Header */}
      <header style={{ marginBottom: 'var(--sp-8)' }}>
        <p className="page-eyebrow">Recordings</p>
        <h1 className="page-title">Call Library</h1>
        <div className="page-meta">
          <span className="page-meta-item">
            <Phone size={12} strokeWidth={2} aria-hidden="true" />
            {CALLS.length} recordings · {visible.length} shown
          </span>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="search-wrap" style={{ maxWidth: 280, flex: '1 1 180px' }}>
          <svg className="search-icon" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="search-input"
            type="search"
            placeholder="Search calls…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            id="call-search"
            aria-label="Search call recordings"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
              id={`filter-${f.toLowerCase()}`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Phone size={22} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className="empty-title">No recordings found</div>
          <div className="empty-desc">Try clearing your search or adjusting the filter.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((call, i) => {
            const av = getAvatarColor(call.archetype);
            return (
              <Link
                key={call.id}
                to={`/calls/${call.id}`}
                className={`call-row ${call.sentiment} anim-up-${Math.min(i + 1, 4)}`}
                id={`call-list-${call.id}`}
              >
                {/* Avatar */}
                <div
                  className="call-row-avatar"
                  style={{ width: 44, height: 44, background: av.bg, color: av.color, borderColor: av.border }}
                >
                  {initials(call.customerName)}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                    <span className="call-row-name" style={{ fontSize: 'var(--text-lg)' }}>
                      {call.customerName}
                    </span>
                    <SentimentChip sentiment={call.sentiment} />
                    <span className="chip chip-ghost">{call.archetype}</span>
                  </div>
                  <div className="call-row-sub">
                    <span>{call.id}</span>
                    <span>·</span>
                    <User size={10} strokeWidth={2} />
                    <span>{call.agent}</span>
                    <span>·</span>
                    <Clock size={10} strokeWidth={2} />
                    <span>{call.duration}</span>
                    <span>·</span>
                    <span>{call.date}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginTop: 'var(--sp-3)', maxWidth: 480 }}>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ fontSize: 10, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>
                          Purchase Prob.
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
                          {call.purchaseProbability}%
                        </span>
                      </div>
                      <ProgressBar value={call.purchaseProbability} variant="auto" height={3} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ fontSize: 10, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>
                          Confidence
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
                          {call.sentimentScore}%
                        </span>
                      </div>
                      <ProgressBar
                        value={call.sentimentScore}
                        variant={call.sentiment === 'positive' ? 'positive' : call.sentiment === 'negative' ? 'negative' : 'accent'}
                        height={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight size={16} strokeWidth={1.5} style={{ color: 'var(--ink-600)', flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
