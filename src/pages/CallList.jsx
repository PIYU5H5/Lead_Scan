import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Clock, User, Calendar, Search, UploadCloud, Sparkles } from 'lucide-react';
import { useCalls } from '../context/CallsContext';
import { SentimentChip, ProgressBar } from '../components/UIComponents';

const FILTERS = ['All', 'Positive', 'Neutral', 'Negative'];

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

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export default function CallList() {
  const { calls, openUploadModal } = useCalls();
  const [filter, setFilter] = useState('All');
  const [query, setQuery]   = useState('');

  const visible = calls.filter(c => {
    const fMatch = filter === 'All' || c.sentiment === filter.toLowerCase();
    const q = query.toLowerCase();
    const qMatch = !q || c.customerName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.archetype.toLowerCase().includes(q);
    return fMatch && qMatch;
  });

  return (
    <div className="page-content anim-up">

      {/* Header */}
      <header style={{ marginBottom: 'var(--sp-6)' }}>
        <p className="page-eyebrow">Audio Archive</p>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <h1 className="page-title">Customer Recordings Library</h1>
            <div className="page-meta">
              <span className="page-meta-item">
                <Phone size={12} strokeWidth={2} aria-hidden="true" />
                {calls.length} recordings ingested · {visible.length} displayed
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={openUploadModal}
            id="call-list-btn-upload"
          >
            <UploadCloud size={14} strokeWidth={2} />
            Ingest Recording
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-5" style={{ flexWrap: 'wrap' }}>
        <div className="search-wrap" style={{ maxWidth: 300, flex: '1 1 200px' }}>
          <Search size={13} className="search-icon" aria-hidden="true" />
          <input
            className="search-input"
            type="search"
            placeholder="Search by customer, ID, or archetype…"
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
        <div className="empty-state card">
          <div className="empty-icon">
            <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className="empty-title">No recordings match search</div>
          <div className="empty-desc">Check your query spelling or reset the filter tabs.</div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setQuery(''); setFilter('All'); }}
            style={{ marginTop: 'var(--sp-3)' }}
          >
            Clear Filters
          </button>
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
                  style={{ background: av.bg, color: av.color, borderColor: av.border }}
                  aria-hidden="true"
                >
                  {initials(call.customerName)}
                </div>

                {/* Info Deck */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                    <span className="call-row-name">
                      {call.customerName}
                    </span>
                    <SentimentChip sentiment={call.sentiment} />
                    <span className="chip chip-ghost" style={{ fontSize: 10, padding: '1px 6px' }}>
                      {call.archetype}
                    </span>
                    {call.isCustom && (
                      <span className="chip chip-positive" style={{ fontSize: 9, padding: '1px 6px', gap: 3 }}>
                        <Sparkles size={9} /> Ingested
                      </span>
                    )}
                  </div>

                  <div className="call-row-sub">
                    <span>{call.id}</span>
                    <span>·</span>
                    <User size={11} strokeWidth={2} aria-hidden="true" />
                    <span>Agent: {call.agent}</span>
                    <span>·</span>
                    <Calendar size={11} strokeWidth={2} aria-hidden="true" />
                    <span>{call.date}</span>
                  </div>

                  <div className="call-row-meters">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span style={{ fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-mono)' }}>
                          Purchase Intent
                        </span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-300)', fontWeight: 600 }}>
                          {call.purchaseProbability}%
                        </span>
                      </div>
                      <ProgressBar value={call.purchaseProbability} variant="auto" height={3} />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span style={{ fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-mono)' }}>
                          AI Confidence
                        </span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-300)', fontWeight: 600 }}>
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

                {/* Right Meta Column */}
                <div className="call-row-meta">
                  <span className="call-row-time">{call.duration}</span>
                  <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>Inspect</span>
                    <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
