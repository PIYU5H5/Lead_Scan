import { Link } from 'react-router-dom';
import { SENTIMENT_CONFIG } from '../data/callData';
import { useCalls } from '../context/CallsContext';
import { TrendingUp, TrendingDown, Target, BarChart3, ArrowRight } from 'lucide-react';
import { StatTile, ProgressBar, RadialProgress, SentimentChip } from '../components/UIComponents';

function InlineBar({ value, variant }) {
  return (
    <div style={{ flex: 1, minWidth: 60 }}>
      <ProgressBar value={value} variant={variant} height={3} />
    </div>
  );
}

export default function Analytics() {
  const { calls } = useCalls();

  const total = calls.length;
  const avgProb = total ? Math.round(calls.reduce((s, c) => s + c.purchaseProbability, 0) / total) : 0;
  const avgConf = total ? Math.round(calls.reduce((s, c) => s + c.sentimentScore, 0) / total) : 0;

  const sentDist = Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => {
    const matching = calls.filter(c => c.sentiment === key);
    return {
      key, cfg,
      count: matching.length,
      avgProb: matching.length
        ? Math.round(matching.reduce((s, c) => s + c.purchaseProbability, 0) / matching.length)
        : 0,
    };
  });

  return (
    <div className="page-content anim-up">

      {/* Header */}
      <header style={{ marginBottom: 'var(--sp-7)' }}>
        <p className="page-eyebrow">Data Intelligence</p>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <h1 className="page-title">Performance & Pipeline Analytics</h1>
            <div className="page-meta">
              <span className="page-meta-item mono">{total} recordings evaluated</span>
              <span style={{ color: 'var(--border-2)' }}>·</span>
              <span className="page-meta-item">Cohort: Q3 Ingested Dataset</span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Ribbon */}
      <div className="grid-4 mb-6">
        <StatTile
          label="Avg. Purchase Prob."
          value={`${avgProb}%`}
          sub="Model aggregate"
          delay={1}
          accent={Target}
        />
        <StatTile
          label="Avg. Sentiment Conf."
          value={`${avgConf}%`}
          sub="Zero-shot certainty"
          delay={2}
          accent={BarChart3}
        />
        <StatTile
          label="High-Intent Accounts"
          value={CALLS.filter(c => c.purchaseProbability >= 70).length}
          sub="≥70% probability"
          subType="positive"
          delay={3}
          accent={TrendingUp}
        />
        <StatTile
          label="Churn Risk Accounts"
          value={CALLS.filter(c => c.sentiment === 'negative').length}
          sub="Negative sentiment"
          subType="negative"
          delay={4}
          accent={TrendingDown}
        />
      </div>

      {/* Charts Deck */}
      <div className="grid-2 mb-6">

        {/* Purchase Prob. by call */}
        <div className="card">
          <div className="card-header">
            <span className="section-heading" style={{ fontSize: 'var(--text-sm)' }}>Purchase Probability Ranking</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>Sorted descending</span>
          </div>
          <div className="card-body flex flex-col gap-3">
            {[...CALLS]
              .sort((a, b) => b.purchaseProbability - a.purchaseProbability)
              .map(call => {
                const variant = call.purchaseProbability >= 70 ? 'positive' : call.purchaseProbability >= 40 ? 'warning' : 'negative';
                return (
                  <div key={call.id} className="flex items-center gap-3">
                    <Link
                      to={`/calls/${call.id}`}
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--ink-200)',
                        width: 90,
                        flexShrink: 0,
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {call.customerName.split(' ')[0]}
                    </Link>
                    <div style={{ flex: 1 }}>
                      <ProgressBar value={call.purchaseProbability} variant={variant} height={4} />
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-400)', width: 38, textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>
                      {call.purchaseProbability}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="card">
          <div className="card-header">
            <span className="section-heading" style={{ fontSize: 'var(--text-sm)' }}>Sentiment Distribution</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>Relative split</span>
          </div>
          <div className="card-body">
            <div className="flex justify-around mb-5">
              {sentDist.map(({ key, cfg, count }) => {
                const color = key === 'positive'
                  ? 'var(--status-positive)'
                  : key === 'negative'
                    ? 'var(--status-negative)'
                    : 'var(--status-neutral)';
                return (
                  <RadialProgress
                    key={key}
                    value={Math.round((count / total) * 100)}
                    size={72}
                    stroke={6}
                    color={color}
                    sub={cfg.label.slice(0, 4)}
                  />
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              {sentDist.map(({ key, cfg, count, avgProb: ap }) => {
                const color = key === 'positive'
                  ? 'var(--status-positive)'
                  : key === 'negative'
                    ? 'var(--status-negative)'
                    : 'var(--status-neutral)';
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3"
                    style={{
                      padding: '8px var(--sp-3)',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border-1)',
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--ink-200)', fontWeight: 500 }}>
                      {cfg.label}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                      {count} call{count !== 1 ? 's' : ''}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-400)', width: 56, textAlign: 'right' }}>
                      avg {ap}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <span className="section-heading" style={{ fontSize: 'var(--text-sm)' }}>Account Comparison Matrix</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-500)' }}>
            {total} records
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 680 }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Archetype</th>
                <th>Sentiment</th>
                <th>Confidence</th>
                <th>Purchase Prob.</th>
                <th>Duration</th>
                <th>Agent</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {calls.map(call => {
                const probVariant = call.purchaseProbability >= 70 ? 'positive' : call.purchaseProbability >= 40 ? 'warning' : 'negative';
                const sentVariant = call.sentiment === 'positive' ? 'positive' : call.sentiment === 'negative' ? 'negative' : 'accent';
                return (
                  <tr key={call.id}>
                    <td>
                      <Link
                        to={`/calls/${call.id}`}
                        style={{ fontWeight: 600, color: 'var(--ink-100)', textDecoration: 'none' }}
                      >
                        {call.customerName}
                      </Link>
                    </td>
                    <td>
                      <span className="chip chip-ghost" style={{ fontSize: 10 }}>{call.archetype}</span>
                    </td>
                    <td><SentimentChip sentiment={call.sentiment} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <InlineBar value={call.sentimentScore} variant={sentVariant} />
                        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-400)', flexShrink: 0 }}>
                          {call.sentimentScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <InlineBar value={call.purchaseProbability} variant={probVariant} />
                        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-400)', flexShrink: 0, fontWeight: 600 }}>
                          {call.purchaseProbability}%
                        </span>
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: 11 }}>{call.duration}</td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-300)' }}>{call.agent}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/calls/${call.id}`} className="btn btn-ghost btn-sm">
                        View <ArrowRight size={11} strokeWidth={2} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
