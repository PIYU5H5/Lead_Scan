import { Cpu, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Speech-to-Text & Diarization',
    model: 'OpenAI Whisper Large v3',
    color: 'var(--accent)',
    desc: 'Audio recordings pass through an Automatic Speech Recognition model producing high-fidelity text transcripts with speaker diarization — separating agent and customer turns for per-speaker acoustic analysis.',
    points: [
      'Model: Whisper Large v3 — WER <5% on sales and enterprise audio domain',
      'Output: JSON stream with speaker labels, start/end timestamps, and word confidence',
      'Diarization heuristic fallback: turn-structure heuristics when pyannote is offline',
      'Streaming compatible via chunked inference for extended calls',
    ],
    output: '{ speaker, text, start_ms, end_ms, word_confidence }',
  },
  {
    n: '02',
    title: 'Sentiment Classification',
    model: 'GPT-4o-mini · Zero-Shot Prompting',
    color: 'var(--status-positive)',
    desc: 'Customer dialogue turns are fed to an LLM with a strict zero-shot classification rubric. The model analyzes vocal tone, vocabulary, objections, and buying signals, returning confidence-calibrated structured JSON.',
    points: [
      'Method: Zero-shot LLM — no fine-tuning or proprietary labeled dataset required',
      'Prompt: "Classify customer sentiment as POSITIVE, NEUTRAL, or NEGATIVE with confidence"',
      'Output: { sentiment, confidence_pct, reasoning }',
      'Confidence <60% automatically triggers a second validation pass',
    ],
    output: '{ "sentiment": "POSITIVE", "confidence": 87, "reasoning": "…" }',
  },
  {
    n: '03',
    title: 'Purchase Probability Scoring',
    model: 'LLM Sales Evaluator · Heuristic Engine',
    color: 'var(--status-warning)',
    desc: 'An LLM evaluates the entire transcript against a quantitative matrix of buying and rejection signals, returning a 0–100 purchase likelihood score calibrated against B2B historical deal cycles.',
    points: [
      'Positive indicators: pricing inquiries, contract timelines, competitor contrast, feature specifics',
      'Negative indicators: hard budget veto, "wrong timing", competitor locked-in, DNC threats',
      'Output: { probability: 0-100, justification: string }',
      'Calibrated against B2B enterprise SaaS sales conversion benchmarks',
    ],
    output: '{ "probability": 98, "justification": "Customer requested pricing & contract start date" }',
  },
  {
    n: '04',
    title: 'Executive Insights & Behavioral Summary',
    model: 'GPT-4o · Structured Summarization',
    color: 'var(--accent)',
    desc: 'A final sequential chain call extracts structured action signals from the conversation — classifying customer objections, buying signals, pain points, and recommended next steps for sales reps.',
    points: [
      'Output: 4-5 categorized signal bullet points (positive, caution, risk, action)',
      'Generates 120-word executive behavioral summary paragraph',
      'Chain dependency: Transcript → Sentiment → Probability → Insights (sequential context)',
      'Deterministic JSON schema ensuring predictable dashboard rendering',
    ],
    output: '{ "signals": […], "summary": "…", "next_steps": […] }',
  },
];

const STACK = [
  { cat: 'Frontend', items: ['React 18', 'React Router v6', 'Vite 8', 'Vanilla CSS Design DNA'] },
  { cat: 'ASR / AI Engine', items: ['OpenAI Whisper Large v3', 'GPT-4o-mini (sentiment)', 'GPT-4o (insights)'] },
  { cat: 'Backend Telemetry', items: ['Python FastAPI', 'Celery Workers', 'Redis Queue'] },
  { cat: 'Data Architecture', items: ['Pre-computed JSON', 'Static Asset Serving', 'Sub-20ms Load Latency'] },
  { cat: 'Executive Export', items: ['jsPDF 2.5 + AutoTable', 'CSV Blob API', 'Printable PDF Styles'] },
];

export default function AIPipeline() {
  return (
    <div className="page-content anim-up">

      <header style={{ marginBottom: 'var(--sp-7)' }}>
        <p className="page-eyebrow">Inference Architecture</p>
        <h1 className="page-title">AI Pipeline & Telemetry</h1>
        <div className="page-meta">
          <span className="page-meta-item">
            <Cpu size={12} strokeWidth={2} aria-hidden="true" />
            4-stage sequential inference chain
          </span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span className="page-meta-item">
            <span className="status-pip" style={{ marginRight: 4 }} aria-hidden="true" />
            All stages operational
          </span>
        </div>
      </header>

      {/* Sequential Inference Stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', marginBottom: 'var(--sp-6)' }}>
        {STEPS.map((step, i) => (
          <div key={step.n} style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'stretch' }}>

            {/* Step indicator node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 'var(--r-md)',
                  background: 'var(--surface-2)', border: '1px solid var(--border-1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11,
                  color: step.color, flexShrink: 0,
                }}
              >
                {step.n}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 1, flex: 1, background: 'var(--border-1)', minHeight: 20, margin: '4px 0' }} />
              )}
            </div>

            {/* Stage card */}
            <div
              className={`card anim-up-${Math.min(i + 1, 4)}`}
              style={{ flex: 1, marginBottom: i < STEPS.length - 1 ? 'var(--sp-4)' : 0 }}
            >
              <div className="card-header">
                <div>
                  <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink-100)', letterSpacing: '-0.2px' }}>
                    {step.title}
                  </h2>
                  <div style={{ marginTop: 2 }}>
                    <span className="chip chip-ghost mono" style={{ fontSize: 10 }}>{step.model}</span>
                  </div>
                </div>
                <span className="chip chip-positive" style={{ fontSize: 10 }}>Operational</span>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-300)', lineHeight: 1.6, marginBottom: 'var(--sp-3)' }}>
                  {step.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', marginBottom: 'var(--sp-3)' }}>
                  {step.points.map((pt, j) => (
                    <div key={j} style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-start' }}>
                      <CheckCircle size={12} style={{ color: step.color, marginTop: 3, flexShrink: 0 }} strokeWidth={2} aria-hidden="true" />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-400)', lineHeight: 1.45 }}>{pt}</span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    background: 'var(--surface-0)', border: '1px solid var(--border-1)',
                    borderRadius: 'var(--r-sm)', padding: '6px 12px',
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)',
                  }}
                >
                  <span style={{ color: 'var(--ink-500)', marginRight: 8 }}>SCHEMA:</span>
                  <span style={{ color: step.color }}>{step.output}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technology Stack Grid */}
      <div className="mb-6">
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <span className="section-label">Technology Infrastructure</span>
        </div>
        <div className="grid-3" style={{ gap: 'var(--sp-3)' }}>
          {STACK.map(({ cat, items }) => (
            <div key={cat} className="card card-inset" style={{ padding: 'var(--sp-4)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)', marginBottom: 'var(--sp-2)' }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map(item => (
                  <div key={item} style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-300)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-500)', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Performance Note */}
      <div className="card" style={{ padding: 'var(--sp-5)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)', marginBottom: 'var(--sp-2)' }}>
          Latency & Scalability Architecture
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-300)', lineHeight: 1.6, margin: 0 }}>
          All conversation intelligence telemetry is <strong>pre-computed and stored as immutable JSON artifacts</strong>. The client portal never halts on external LLM inference at page mount. In production, newly uploaded audio recordings are processed asynchronously by background workers, ensuring instantaneous sub-50ms dashboard page loads across global deployments.
        </p>
      </div>
    </div>
  );
}
