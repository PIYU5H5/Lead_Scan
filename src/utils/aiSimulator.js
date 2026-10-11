// ============================================================================
// LeadSync — In-Browser AI Engine & Inference Simulator
// Provides realistic ASR diarization, sentiment classification,
// purchase probability scoring, and behavioral summary synthesis.
// ============================================================================

export const PRESET_SCENARIOS = {
  'eager-buyer': {
    name: 'Eager Enterprise Buyer (High Intent)',
    archetype: 'Eager Buyer',
    sentiment: 'positive',
    sentimentScore: 92,
    purchaseProbability: 95,
    purchaseJustification: 'Customer requested enterprise pilot proposal, asked about procurement approval timelines, and validated budget allocation for current quarter.',
    transcript: [
      { speaker: 'Agent', text: 'Good afternoon, this is Alex from LeadSync Enterprise. Am I speaking with Priya?' },
      { speaker: 'Customer', text: 'Hi Alex! Yes, thanks for getting back to me so quickly. We tested the sandbox yesterday.' },
      { speaker: 'Agent', text: 'Wonderful! How did the automated call diarization and telemetry look with your test dataset?' },
      { speaker: 'Customer', text: 'Honestly, the team was very impressed. The accuracy on noisy sales audio was noticeably better than our existing tool, and the purchase intent scoring matches what our VPs look for.' },
      { speaker: 'Agent', text: 'That is great validation. Are you looking to roll this out across your full outbound SDR team?' },
      { speaker: 'Customer', text: 'Yes, we have 45 reps. Can you send over the master service agreement and pilot pricing tier? Our procurement cycle closes next week and I want this locked in.' },
      { speaker: 'Agent', text: 'Absolutely, Priya. I will have the enterprise quote and security documentation in your inbox within 30 minutes.' },
      { speaker: 'Customer', text: 'Perfect. Looking forward to getting this onboarded.' },
    ],
    keyInsights: [
      '🟢 **Procurement Intent Expressed**: Customer explicitly asked for Master Service Agreement and pilot proposal with immediate sign-off intent.',
      '🟢 **Benchmark Validation**: LeadSync telemetry and noise resilience outperformed competitor tool in sandbox evaluation.',
      '🔵 **Expansion Target**: 45 outbound SDR seats ready for onboarding upon commercial sign-off.',
      '🟡 **Urgency Parameter**: Current procurement cycle window closes within 7 days; requires immediate contract turnaround.',
      '🔵 **Actionable Follow-up**: Deliver SOC2 security documentation and volume tier pricing within 30 minutes.',
    ],
    behavioralSummary: 'Priya demonstrated immediate commercial intent following a successful pilot evaluation. Her team validated accuracy over incumbent solutions and requested urgent procurement paperwork for 45 seats before end of month. High-priority lead with a 95% conversion probability.',
  },

  'hesitant-prospect': {
    name: 'Hesitant Prospect (Feature & Compliance Inquiry)',
    archetype: 'Hesitant Prospect',
    sentiment: 'neutral',
    sentimentScore: 58,
    purchaseProbability: 46,
    purchaseJustification: 'Customer is interested in telemetry capability but blocked on strict HIPAA/SOC2 compliance approval and custom on-premise deployment requirements.',
    transcript: [
      { speaker: 'Agent', text: 'Hello David, thank you for requesting a product overview of LeadSync.' },
      { speaker: 'Customer', text: 'Hi there. We are reviewing conversation intelligence platforms, but we operate in healthcare so data sovereignty is critical.' },
      { speaker: 'Agent', text: 'Understood. We offer enterprise data encryption at rest and in transit, with dedicated VPC hosting.' },
      { speaker: 'Customer', text: 'Do you have BAA agreements available and automated PII redaction on recorded audio streams before inference?' },
      { speaker: 'Agent', text: 'We do support PII masking on transcripts, though on-premise private VPC deployments require our tier-2 enterprise plan.' },
      { speaker: 'Customer', text: 'Okay. I like the dashboard layout and sentiment tracking, but I cannot make any commitment until our compliance committee inspects your audit report.' },
      { speaker: 'Agent', text: 'Understood David. Let me share our security whitepaper and schedule a call with our compliance solutions architect.' },
      { speaker: 'Customer', text: 'That works. Send those over and let us reconvene in two weeks.' },
    ],
    keyInsights: [
      '🟡 **Compliance Gatekeeper**: Deal progression is contingent on HIPAA Business Associate Agreement (BAA) and PII redaction sign-off.',
      '🟡 **Deployment Constraints**: Customer mandates private VPC deployment over shared multi-tenant SaaS.',
      '🟢 **UI & Telemetry Validation**: Prospect commended dashboard analytics, radial probability charts, and usability.',
      '🔵 **Next Step Strategy**: Loop in LeadSync security architecture specialist for formal compliance review.',
    ],
    behavioralSummary: 'David is an analytically grounded technical evaluator interested in platform capabilities, but strictly constrained by healthcare compliance standards. The deal is viable (46% probability) but will require security team intervention and extended procurement review.',
  },

  'price-objection': {
    name: 'Price Sensitive / Budget Objection',
    archetype: 'Hesitant Prospect',
    sentiment: 'neutral',
    sentimentScore: 50,
    purchaseProbability: 25,
    purchaseJustification: 'Customer acknowledged product utility but reported a 40% budget shortfall compared to standard enterprise licensing fees.',
    transcript: [
      { speaker: 'Agent', text: 'Hi Marcus, checking in regarding the team subscription quote we sent over.' },
      { speaker: 'Customer', text: 'Hi. Look, the team likes the platform, but the per-seat pricing came in significantly higher than what our executive team budgeted.' },
      { speaker: 'Agent', text: 'We appreciate the feedback Marcus. Keep in mind that includes unlimited transcription, automated pipeline scoring, and executive PDF reporting.' },
      { speaker: 'Customer', text: 'I understand the feature set, but we are a Series A startup. Paying enterprise rates right now is difficult. Are there tiered starter packages?' },
      { speaker: 'Agent', text: 'We can structure a tiered ramp or offer an annual upfront discount of 20%.' },
      { speaker: 'Customer', text: 'Let me run that by our CFO. If we cannot reach our target price point, we might have to build a basic internal script for now.' },
    ],
    keyInsights: [
      '🔴 **Budget Mismatch**: Current pricing tier exceeds prospect startup budget by ~40%.',
      '🟡 **Build vs Buy Risk**: Prospect considering basic internal script as an interim alternative.',
      '🟢 **Value Appreciation**: Prospect confirmed team satisfaction with transcription accuracy and executive reporting.',
      '🔵 **Commercial Action**: Present staged ramp discount model or quarterly milestone billing.',
    ],
    behavioralSummary: 'Marcus confirmed strong technical interest from his team, but faces rigid budgetary constraints typical of early-stage startups. Conversion hinges entirely on commercial flexibility; conversion probability stands at 25%.',
  },

  'angry-customer': {
    name: 'Frustrated Customer / High Churn Risk',
    archetype: 'Angry Customer',
    sentiment: 'negative',
    sentimentScore: 94,
    purchaseProbability: 5,
    purchaseJustification: 'Customer reported persistent integration downtime with their CRM webhook and requested an immediate manager escalation.',
    transcript: [
      { speaker: 'Agent', text: 'Thank you for calling LeadSync Support, my name is Carlos. How can I help?' },
      { speaker: 'Customer', text: 'Carlos, this is ridiculous. Our HubSpot sync broke for the third time this week and our reps lost all their call scores!' },
      { speaker: 'Agent', text: 'I am so sorry to hear that. Let me look up your workspace telemetry right away.' },
      { speaker: 'Customer', text: 'I have had three tickets open with no resolution. We pay thousands of dollars for this system and it is impacting our sales pipeline.' },
      { speaker: 'Agent', text: 'I understand completely why you are frustrated. I am personally escalating this to our engineering lead right now to restore the webhook.' },
      { speaker: 'Customer', text: 'If this is not permanently resolved today, I am cancelling our contract and requesting a full refund.' },
    ],
    keyInsights: [
      '🔴 **Severe Churn Risk**: Customer threatened contract cancellation and formal refund demand.',
      '🔴 **Webhook Integration Failure**: Repetitive CRM sync interruption caused sales data visibility loss.',
      '🟡 **Escalation Protocol**: Immediate handoff to engineering leadership and account executive required.',
      '🔵 **Immediate Retention Step**: Issue service credit and establish direct Slack bridge with engineering.',
    ],
    behavioralSummary: 'Critical escalation. Customer experienced multiple integration failures disrupting core sales operations, resulting in extreme frustration and immediate churn risk. Requires same-day executive outreach and engineering resolution.',
  },
};

// Helper to determine duration of an Audio File or Blob in seconds
export async function getAudioDuration(file) {
  if (!file) return 180;
  return new Promise((resolve) => {
    try {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      const url = URL.createObjectURL(file);
      audio.src = url;

      const cleanup = () => {
        URL.revokeObjectURL(url);
      };

      audio.onloadedmetadata = () => {
        const d = Math.round(audio.duration);
        cleanup();
        resolve(d > 0 && !isNaN(d) ? d : 165);
      };

      audio.onerror = () => {
        cleanup();
        resolve(150); // Fallback realistic duration
      };

      // Timeout safety
      setTimeout(() => {
        cleanup();
        resolve(160);
      }, 3000);
    } catch {
      resolve(160);
    }
  });
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Generate realistic synthetic transcript if user enters custom prompt/text
export function parseCustomTranscript(text) {
  if (!text || !text.trim()) return null;
  const lines = text.trim().split('\n').filter(l => l.trim().length > 0);
  const turns = [];

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < 30) {
      const speakerRaw = line.slice(0, colonIdx).trim();
      const content = line.slice(colonIdx + 1).trim();
      const isAgent = /agent|rep|sales|lead|techup/i.test(speakerRaw);
      turns.push({
        speaker: isAgent ? 'Agent' : 'Customer',
        text: content,
      });
    } else {
      // Alternate speaker if no prefix
      const last = turns[turns.length - 1];
      const speaker = last && last.speaker === 'Agent' ? 'Customer' : 'Agent';
      turns.push({ speaker, text: line.trim() });
    }
  }

  return turns.length > 0 ? turns : null;
}

// Full simulated pipeline runner with real staged delays
export async function runIngestionPipeline({
  customerName,
  agentName,
  phone,
  scenarioKey,
  customTranscriptText,
  audioFile,
  onProgress,
}) {
  const stages = [
    { pct: 15, label: 'Stage 01: Audio Ingestion & Format Normalization', detail: 'Decoding PCM audio waveform and calculating SNR...' },
    { pct: 45, label: 'Stage 02: Whisper Large v3 ASR & Diarization', detail: 'Aligning acoustic frames & detecting speaker turn boundaries...' },
    { pct: 75, label: 'Stage 03: Zero-Shot Sentiment & Intent Scoring', detail: 'Evaluating customer objections, buying signals & deal likelihood...' },
    { pct: 95, label: 'Stage 04: Structured Insights & Executive Summary', detail: 'Generating executive action items and sales recommendations...' },
    { pct: 100, label: 'Pipeline Complete', detail: 'Call ingested and intelligence synchronized.' },
  ];

  // Stage 1
  onProgress?.(stages[0]);
  const durationSec = await getAudioDuration(audioFile);
  await new Promise(r => setTimeout(r, 600));

  // Stage 2
  onProgress?.(stages[1]);
  await new Promise(r => setTimeout(r, 700));

  // Determine scenario / transcript base
  const preset = PRESET_SCENARIOS[scenarioKey] || PRESET_SCENARIOS['eager-buyer'];
  const userTurns = parseCustomTranscript(customTranscriptText);

  let finalTranscript = userTurns || preset.transcript.map(t => {
    // Replace names dynamically
    return {
      speaker: t.speaker,
      text: t.text
        .replace(/\bPriya\b/g, customerName)
        .replace(/\bDavid\b/g, customerName)
        .replace(/\bMarcus\b/g, customerName)
        .replace(/\bAlex\b/g, agentName)
        .replace(/\bCarlos\b/g, agentName),
    };
  });

  // Stage 3
  onProgress?.(stages[2]);
  await new Promise(r => setTimeout(r, 800));

  // Stage 4
  onProgress?.(stages[3]);
  await new Promise(r => setTimeout(r, 600));

  const callId = `CALL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  const callRecord = {
    id: callId,
    customerName: customerName || 'Enterprise Lead',
    archetype: preset.archetype,
    date: dateStr,
    duration: formatDuration(durationSec),
    durationSeconds: durationSec,
    agent: agentName || 'Sales Representative',
    phone: phone || '+1 (555) 234-5678',
    audioFile: null, // Will be attached as object URL
    sentiment: preset.sentiment,
    sentimentScore: preset.sentimentScore,
    purchaseProbability: preset.purchaseProbability,
    purchaseJustification: preset.purchaseJustification,
    transcript: finalTranscript,
    keyInsights: preset.keyInsights,
    behavioralSummary: preset.behavioralSummary.replace(/Priya|David|Marcus/g, customerName || 'The customer'),
    isCustom: true,
  };

  onProgress?.(stages[4]);
  await new Promise(r => setTimeout(r, 300));

  return callRecord;
}
