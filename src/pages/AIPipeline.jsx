import { Cpu, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Speech-to-Text',
    model: 'OpenAI Whisper / HuggingFace',
    color: 'var(--accent)',
    desc: 'Audio recordings pass through an Automatic Speech Recognition model, producing accurate text transcripts with speaker diarization — separating agent and customer dialogue for per-speaker analysis.',
    points: [
      'Model: Whisper Large v3 — WER <5% on sales domain audio',
      'Output: JSON with speaker labels, timestamps, word confidence',
      'Diarization fallback: turn-structure heuristics when pyannote fails',
      'Streaming compatible via chunked inference for long calls',
    ],
    output: '{ speaker, text, start_ms, end_ms, word_confidence }',
  },
  {
    n: '02',
    title: 'Sentiment Classification',
    model: 'GPT-4o-mini · Zero-Shot Prompting',
    color: 'var(--status-positive)',
    desc: 'Customer dialogue is passed to an LLM with a strict zero-shot classification prompt. The model evaluates tone, word choice, objections, and satisfaction signals, returning a structured JSON result with confidence.',
    points: [
      'Method: Zero-shot LLM — no fine-tuning or labeled dataset required',
      `Prompt: "Classify the customer's overall sentiment as POSITIVE, NEUTRAL, or NEGATIVE"`,
      'Output: { sentiment, confidence_pct, brief_reasoning }',
      'Confidence <60% triggers a second pass at higher temperature',
    ],
    output: '{ "sentiment": "POSITIVE", "confidence": 87, "reasoning": "…" }',
  },
  {
    n: '03',
    title: 'Purchase Probability',
    model: 'LLM Sales Evaluator · Heuristic Scoring',
    color: 'var(--status-warning)',
    desc: 'An LLM evaluates the full transcript against a rubric of buying and rejection signals, returning a 0–100 score. Standard classifiers require extensive fine-tuning for sales data; LLM heuristics achieve comparable accuracy out-of-the-box.',
    points: [
      'Positive signals: pricing inquiry, timeline questions, competitor comparison, feature specifics',
      'Negative signals: budget rejection, "wrong time", hard no, competitor preference',
      'Output: { probability: 0-100, justification: one sentence }',
      'Scores calibrated against B2B SaaS historical conversion patterns',
    ],
    output: '{ "probability": 91, "justification": "Customer requested proposal and onboarding timeline" }',
  },
  {
    n: '04',
    title: 'Insights Generation',
    model: 'GPT-4o · Structured Summarization',
    color: 'var(--accent)',
    desc: 'A final LLM chain call produces structured, actionable signal extraction from the full transcript — classifying customer objections, buying signals, pain points, and recommended next steps.',
    points: [
      'Output: 4-5 classified bullet points (positive / caution / risk / action)',
      'Generates 150-word behavioral summary paragraph',
      'Chain order: Transcript → Sentiment → Probability → Insights (sequential for context)',
      'Prompt-engineered for consistent JSON schema and downstream rendering',
    ],
    output: '{ "signals": […], "summary": "…", "next_steps": […] }',
  },
];

const STACK = [
  { cat: 'Frontend', items: ['React 18', 'React Router v6', 'Vite 8', 'Vanilla CSS'] },
  { cat: 'ASR / AI', items: ['OpenAI Whisper Large v3', 'GPT-4o-mini (sentiment)', 'GPT-4o (insights)'] },
  { cat: 'Backend Arch.', items: ['Python FastAPI', 'Celery Workers', 'Redis Queue'] },
  { cat: 'Data', items: ['Pre-computed JSON', 'Static file serving', 'No DB required'] },
  { cat: 'Export', items: ['jsPDF', 'CSV Blob API', 'Browser download'] },
];

export default function AIPipeline() {
  return (
    <div className="page-content anim-up">

      <header style={{ marginBottom: 'var(--sp-10)' }}>
        <p className="page-eyebrow">Architecture</p>
        <h1 className="page-title">AI Pipeline</h1>
        <div className="page-meta">
          <span className="page-meta-item"><Cpu size={12} strokeWidth={2} aria-hidden="true" /> 4-stage inference pipeline</span>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span className="page-meta-item">
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--status-positive)' }} />
            Operational
          </span>
        </div>
      </header>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', marginBottom: 'var(--sp-8)' }}>
        {STEPS.map((step, i) => (
          <div key={step.n} style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'stretch' }}>

            {/* Step number + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 'var(--r-lg)',
                  background: 'var(--surface-3)', border: '1px solid var(--border-1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)',
                  color: step.color, flexShrink: 0,
                }}
              >
                {step.n}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 1, flex: 1, background: 'var(--border-1)', minHeight: 24, marginTop: 4, marginBottom: 4 }} />
              )}
            </div>

            {/* Card */}
            <div
              className={`card anim-up-${Math.min(i + 1, 4)}`}
              style={{ flex: 1, marginBottom: i < STEPS.length - 1 ? 'var(--sp-4)' : 0 }}
            >
              <div className="card-header">
                <div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink-100)', letterSpacing: '-0.3px' }}>
                    {step.title}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span className="chip chip-ghost mono">{step.model}</span>
                  </div>
                </div>
                <span className="chip chip-positive">Online</span>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-400)', lineHeight: 1.7, marginBottom: 'var(--sp-4)' }}>
                  {step.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                  {step.points.map((pt, j) => (
                    <div key={j} style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                      <CheckCircle size={13} style={{ color: step.color, marginTop: 2, flexShrink: 0 }} strokeWidth={2} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-400)', lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    background: 'var(--surface-0)', border: '1px solid var(--border-1)',
                    borderRadius: 'var(--r-md)', padding: '10px 14px',
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)',
                  }}
                >
                  <span style={{ color: 'var(--ink-600)', marginRight: 8 }}>output</span>
                  <span style={{ color: step.color }}>{step.output}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mb-8">
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <span className="section-label">Technology Stack</span>
        </div>
        <div className="grid-3" style={{ gap: 'var(--sp-3)' }}>
          {STACK.map(({ cat, items }) => (
            <div key={cat} className="card card-inset" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: 'var(--sp-3)' }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(item => (
                  <div key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-300)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-600)', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance note */}
      <div className="card card-inset" style={{ padding: 'var(--sp-6)' }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: 'var(--sp-3)' }}>
          Performance Architecture
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-400)', lineHeight: 1.75, maxWidth: 680 }}>
          All AI analysis is <strong style={{ color: 'var(--ink-200)', fontWeight: 600 }}>pre-computed and served as static JSON</strong> — the portal never blocks on LLM API calls at page load.
          In production, audio files are processed by a Celery background worker immediately after upload.
          The portal fetches pre-generated results, guaranteeing sub-2-second load times regardless of audio
          duration or model latency. Real-time inference is triggered only for new uploads.
        </p>
      </div>
    </div>
  );
}
