import { useEffect, useState } from 'react';

/* ---- Sentiment chip ---- */
export function SentimentChip({ sentiment, size = 'sm' }) {
  const map = {
    positive: { label: 'Positive', cls: 'chip chip-positive' },
    neutral:  { label: 'Neutral',  cls: 'chip chip-neutral'  },
    negative: { label: 'Negative', cls: 'chip chip-negative' },
  };
  const { label, cls } = map[sentiment] || map.neutral;
  return (
    <span className={cls} style={size === 'lg' ? { fontSize: 13, padding: '4px 12px' } : {}}>
      {label}
    </span>
  );
}

/* ---- Linear progress bar ---- */
export function ProgressBar({ value, variant = 'accent', height = 3 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80);
    return () => clearTimeout(t);
  }, [value]);

  const fillClass = {
    accent:   'progress-fill fill-accent',
    positive: 'progress-fill fill-positive',
    warning:  'progress-fill fill-warning',
    negative: 'progress-fill fill-negative',
    auto: value >= 70
      ? 'progress-fill fill-positive'
      : value >= 40
        ? 'progress-fill fill-warning'
        : 'progress-fill fill-negative',
  }[variant] || 'progress-fill fill-accent';

  return (
    <div
      className="progress-track"
      style={{ height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress percentage"
    >
      <div className={fillClass} style={{ width: `${width}%` }} />
      <div className="timeline-thumb" style={{ left: `${width}%` }} />
    </div>
  );
}

/* ---- Radial / circular progress ---- */
export function RadialProgress({ value, size = 112, stroke = 8, color = 'var(--accent)', sub = '' }) {
  const [animated, setAnimated] = useState(0);
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div
      className="radial-wrap"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${sub || 'Progress'} ${value}%`}
    >
      <svg className="radial-svg" width={size} height={size} aria-hidden="true">
        <circle
          className="radial-track-ring"
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke}
        />
        <circle
          className="radial-fill-ring"
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="radial-label">
        <span className="radial-pct" style={{ color }}>{value}%</span>
        {sub && <span className="radial-sub">{sub}</span>}
      </div>
    </div>
  );
}

/* ---- Premium Studio Waveform visualizer ---- */
export function Waveform({ playing = false }) {
  // 16 visualizer bars with harmonic natural heights
  const bars = [10, 16, 24, 14, 28, 20, 32, 22, 16, 28, 14, 24, 18, 26, 14, 8];
  return (
    <div className={`waveform${playing ? ' playing' : ''}`} aria-hidden="true">
      {bars.map((h, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: playing ? h : 3,
            animationDelay: `${(i * 0.08).toFixed(2)}s`,
            animationPlayState: playing ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}

/* ---- Stat tile ---- */
export function StatTile({ label, value, sub, subType = 'neutral', accent: AccentIcon, delay = 0 }) {
  return (
    <div className={`stat-tile anim-up-${delay}`}>
      <div className="stat-tile-top">
        <span className="stat-tile-label">{label}</span>
        {AccentIcon && (
          <div className="stat-tile-icon-badge" aria-hidden="true">
            <AccentIcon size={15} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="stat-tile-value">{value}</div>
      {sub && (
        <div className={`stat-tile-sub ${subType}`}>
          <span className="stat-tile-sub-pill">{sub}</span>
        </div>
      )}
      {AccentIcon && (
        <div className="stat-tile-accent" aria-hidden="true">
          <AccentIcon size={64} strokeWidth={1} />
        </div>
      )}
    </div>
  );
}
