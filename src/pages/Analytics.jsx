import { CALLS, SENTIMENT_CONFIG } from '../data/callData';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { StatTile, ProgressBar, RadialProgress, SentimentChip } from '../components/UIComponents';

const total = CALLS.length;
const avgProb = total ? Math.round(CALLS.reduce((s, c) => s + c.purchaseProbability, 0) / total) : 0;
const avgConf = total ? Math.round(CALLS.reduce((s, c) => s + c.sentimentScore, 0) / total) : 0;

function InlineBar({ value, variant }) {
  return (
    <div style={{ flex: 1 }}>
      <ProgressBar value={value} variant={variant} height={3} />
    </div>
  );
}

export default function Analytics() {
  const sentDist = Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => {
    const matching = CALLS.filter(c => c.sentiment === key);
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
      <header style={{ marginBottom: 'var(--sp-10)' }}>
        <p className="page-eyebrow">Analytics</p>
        <h1 className="page-title">Performance Overview</h1>
        <div className="page-meta">
          <span className="page-meta-item mono">{total} recordings · Full dataset</span>
        </div>
      </header>

      {/* KPI */}
      <div className="grid-4 mb-8">
        <StatTile label="Avg. Purchase Prob." value={`${avgProb}%`} sub="Across all calls" delay={1} accent={Target} />
        <StatTile label="Avg. Sentiment Conf." value={`${avgConf}%`} sub="Model confidence" delay={2} accent={BarChart3} />
        <StatTile
          label="High-Intent Leads"
          value={CALLS.filter(c => c.purchaseProbability >= 70).length}
          sub="≥70% probability"
          subType="positive"
          delay={3}
          accent={TrendingUp}
        />
        <StatTile
          label="Churn Risks"
          value={CALLS.filter(c => c.sentiment === 'negative').length}
          sub="Negative sentiment"
          subType="negative"
          delay={4}
          accent={TrendingDown}
        />
      </div>

      {/* Charts */}
      <div className="grid-2 mb-8">

        {/* Purchase Prob. by call */}
        <div className="card">
          <div className="card-header">
            <span className="section-label">Purchase Probability</span>
          </div>
          <div className="card-body flex flex-col gap-4">
            {[...CALLS]
              .sort((a, b) => b.purchaseProbability - a.purchaseProbability)
              .map(call => {
                const variant = call.purchaseProbability >= 70 ? 'positive' : call.purchaseProbability >= 40 ? 'warning' : 'negative';
                return (
                  <div key={call.id} className="flex items-center gap-3">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', width: 80, flexShrink: 0, fontWeight: 500 }}>
                      {call.customerName.split(' ')[0]}
                    </span>
                    <div style={{ flex: 1 }}>
                      <ProgressBar value={call.purchaseProbability} variant={variant} height={4} />
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', width: 32, textAlign: 'right', flexShrink: 0 }}>
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
            <span className="section-label">Sentiment Distribution</span>
          </div>
          <div className="card-body">
            <div className="flex justify-around mb-6">
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
                    size={82}
                    stroke={7}
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
                    style={{ padding: '10px var(--sp-4)', borderRadius: 'var(--r-lg)', background: 'var(--border-0)', border: '1px solid var(--border-1)' }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--ink-300)', fontWeight: 500 }}>{cfg.label}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{count} calls</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', width: 52, textAlign: 'right' }}>
                      avg {ap}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <span className="section-label">Comparison Matrix</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', fontFamily: 'var(--font-mono)' }}>
            {total} records
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Archetype</th>
                <th>Sentiment</th>
                <th>Confidence</th>
                <th>Purchase Prob.</th>
                <th>Duration</th>
                <th>Agent</th>
              </tr>
            </thead>
            <tbody>
              {CALLS.map(call => {
                const probVariant = call.purchaseProbability >= 70 ? 'positive' : call.purchaseProbability >= 40 ? 'warning' : 'negative';
                const sentVariant = call.sentiment === 'positive' ? 'positive' : call.sentiment === 'negative' ? 'negative' : 'accent';
                return (
                  <tr key={call.id}>
                    <td style={{ fontWeight: 600, color: 'var(--ink-100)' }}>{call.customerName}</td>
                    <td>
                      <span className="chip chip-ghost">{call.archetype}</span>
                    </td>
                    <td><SentimentChip sentiment={call.sentiment} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <InlineBar value={call.sentimentScore} variant={sentVariant} />
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-400)', flexShrink: 0 }}>
                          {call.sentimentScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <InlineBar value={call.purchaseProbability} variant={probVariant} />
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-400)', flexShrink: 0 }}>
                          {call.purchaseProbability}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{call.duration}</td>
                    <td>{call.agent}</td>
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
