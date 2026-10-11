import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Upload folder setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

app.use(cors());
app.use(express.json());

// Diagnostic endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    hasGroqKey: Boolean(process.env.GROQ_API_KEY),
  });
});

// System prompt for sales scoring
const SCORING_PROMPT = `You are LeadSync Enterprise, a conversation intelligence and sales telemetry AI.
Analyze this sales call recording.

Return STRICT JSON (without markdown code blocks, backticks, or other text) matching this EXACT JSON schema:
{
  "customerName": "Customer Name (or inferred from call)",
  "agent": "Sales Agent Name (or inferred from call)",
  "archetype": "One of: Self-Directed Learner | Eager Buyer | Hesitant Prospect | Angry Customer | Neutral Inquiry",
  "sentiment": "positive | neutral | negative",
  "sentimentScore": 85,
  "purchaseProbability": 92,
  "purchaseJustification": "Specific 1-2 sentence evidence-grounded reason for the purchase score.",
  "transcript": [
    { "speaker": "Agent", "text": "..." },
    { "speaker": "Customer", "text": "..." }
  ],
  "keyInsights": [
    "🟢 **Insight Title**: Details on positive buying signals...",
    "🔴 **Risk Title**: Objections, competitor lock-in, or churn risk...",
    "🟡 **Barrier Title**: Pricing, timing, or compliance hesitation...",
    "🔵 **Action Title**: Recommended tactical next step for the sales rep..."
  ],
  "behavioralSummary": "A 100-140 word executive summary describing the prospect's stance, objections, psychological leverage, and deal forecast."
}

Rules:
1. Every dialogue turn must be attributed as "Agent" or "Customer".
2. purchaseProbability must accurately reflect intent (0 to 100):
   - Hostile, anger, spam complaint, or legal/police threat: 0 to 5.
   - Polite refusal, pass, or self-study: 5 to 15.
   - Neutral feature/price evaluation: 30 to 55.
   - Buying, asking for payment link, enrolled: 85 to 98.
   DO NOT default to 50 for clearly negative or positive calls.
3. sentimentScore must be an integer from 0 to 100 (confidence level of sentiment).
4. keyInsights must include 4 to 5 bullet points starting with the emoji prefixes: 🟢 (positive signal), 🔴 (critical risk), 🟡 (caution/barrier), 🔵 (action item).`;

// Deterministic sales keyword heuristic calibration
function calibratePurchaseIntent(result) {
  const transcript = Array.isArray(result.transcript) ? result.transcript : [];
  const fullText = transcript.map(t => t.text || '').join(' ').toLowerCase();

  // 1. Severe Hostility / Legal Threat / DNC / Harassment
  const severeNegativeKeywords = [
    'police', 'complaint', 'harassment', 'phone kaat', 'spam', 'dimaag kharab',
    'dimag kharab', 'peecha chhod', 'peecha kyon nahi', "don't call", 'do not call',
    'lawyer', 'sue', 'stop calling', 'remove my number', 'fraud', 'scam', 'cheat',
    'bakwaas', 'chup', 'furious', 'harass', 'threat', 'koi coding nahi',
    'phone rakh', 'disconnect', 'chautha phone', 'chaar baar'
  ];

  if (severeNegativeKeywords.some(kw => fullText.includes(kw))) {
    return {
      purchaseProbability: 0,
      sentiment: 'negative',
      sentimentScore: Math.max(Number(result.sentimentScore) || 95, 95),
      archetype: 'Angry Customer',
      purchaseJustification: 'Immediate DNC Escalation: Customer expressed extreme hostility over unsolicited spam and explicitly threatened legal or police action.',
    };
  }

  // 2. Polite Rejection / Autodidact / Passing
  const politeRejectionKeywords = [
    'have to pass', 'going to pass', 'pass karna', 'not interested', 'no thanks',
    'learn on my own', 'self study', 'free resources', 'open source', 'not for me',
    'nahi chahiye', 'nahi karni', "don't need", 'cannot afford', 'too expensive',
    'rather spend'
  ];

  if (politeRejectionKeywords.some(kw => fullText.includes(kw))) {
    const raw = Number(result.purchaseProbability);
    const prob = Number.isFinite(raw) && raw >= 0 ? Math.min(raw, 12) : 8;
    return {
      purchaseProbability: prob,
      sentiment: result.sentiment === 'positive' ? 'neutral' : (result.sentiment || 'neutral'),
      archetype: fullText.includes('open source') || fullText.includes('learn on my own')
        ? 'Self-Directed Learner'
        : 'Hesitant Prospect',
    };
  }

  // 3. Explicit Buying / Payment Done
  const highIntentKeywords = [
    'payment is successful', 'payment done', 'payment successful', 'link bhejo',
    'send payment link', 'entering details', 'registered', 'sign me up', "i'm in",
    "im in", "let's do it", 'lets do it', 'enrolled', 'paid', 'no-cost emi',
    'welcome to the academy'
  ];

  if (highIntentKeywords.some(kw => fullText.includes(kw))) {
    const raw = Number(result.purchaseProbability);
    const prob = Number.isFinite(raw) && raw > 70 ? Math.max(raw, 92) : 95;
    return {
      purchaseProbability: prob,
      sentiment: 'positive',
      archetype: 'Eager Buyer',
    };
  }

  // 4. Sentiment-based bounding
  const rawProb = Number(result.purchaseProbability);
  let probability = Number.isFinite(rawProb) ? rawProb : 50;

  const sentiment = (result.sentiment || 'neutral').toLowerCase();
  if (sentiment === 'negative') {
    probability = Math.min(probability, 10);
  } else if (sentiment === 'positive') {
    probability = Math.max(probability, 70);
  }

  return {
    purchaseProbability: probability,
    sentiment,
    archetype: result.archetype || 'Neutral Inquiry',
  };
}

// Process with Google Gemini (Audio Multimodal with lowest token requirement)
async function analyzeWithGemini(filePath, mimeType, apiKey, custNameHint, agentHint) {
  const ai = new GoogleGenAI({ apiKey });
  const audioBuffer = fs.readFileSync(filePath);
  const base64Audio = audioBuffer.toString('base64');

  const userContext = `Customer Name: ${custNameHint || 'Unknown'} | Agent Name: ${agentHint || 'Unknown'}`;

  // Use gemini-3.5-flash-lite (Google's latest lowest-token free tier model)
  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.8-flash'];
  let lastErr = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini] Attempting analysis using low-token model: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${SCORING_PROMPT}\n\nContext: ${userContext}\n\nTranscribe and analyze:` },
              {
                inlineData: {
                  data: base64Audio,
                  mimeType: mimeType || 'audio/mp3',
                },
              },
            ],
          },
        ],
        config: {
          maxOutputTokens: 1500,
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn(`[Gemini] Model ${model} failed, trying next fallback:`, err.message);
      lastErr = err;
    }
  }

  throw lastErr;
}

// Process with OpenAI (Whisper + gpt-4o-mini: lowest token cost OpenAI stack)
async function analyzeWithOpenAI(filePath, apiKey, custNameHint, agentHint) {
  const openai = new OpenAI({ apiKey });

  // 1. Transcribe with Whisper
  console.log('[OpenAI] Transcribing audio with Whisper-1...');
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1',
    response_format: 'text',
  });

  // 2. Score with gpt-4o-mini (OpenAI's lowest-cost/free credit efficient model)
  console.log('[OpenAI] Scoring transcript with gpt-4o-mini (capped at 1200 tokens)...');
  const userPrompt = `Context: Customer: ${custNameHint || 'Unknown'}, Agent: ${agentHint || 'Unknown'}
Transcript:
"${transcription}"

Return the required JSON schema analysis.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SCORING_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 1200,
  });

  const content = completion.choices[0].message.content;
  return JSON.parse(content);
}

// Main analysis route
app.post('/api/analyze-call', upload.single('audio'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const { customerName, agentName, phone, apiKey: clientApiKey } = req.body;

  const geminiKey = clientApiKey || process.env.GEMINI_API_KEY;
  const openAIKey = clientApiKey || process.env.OPENAI_API_KEY;

  try {
    let result = null;

    if (geminiKey) {
      console.log(`[API] Processing audio with Google Gemini...`);
      const mime = file.mimetype || 'audio/mp3';
      result = await analyzeWithGemini(file.path, mime, geminiKey, customerName, agentName);
    } else if (openAIKey) {
      console.log(`[API] Processing audio with OpenAI Whisper & GPT-4o-mini...`);
      result = await analyzeWithOpenAI(file.path, openAIKey, customerName, agentName);
    } else {
      return res.status(400).json({
        error: 'NO_API_KEY',
        message: 'No AI API Key found. Please add GEMINI_API_KEY or OPENAI_API_KEY in your .env file or input it in the upload modal.',
      });
    }

    const callId = `CALL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const calibrated = calibratePurchaseIntent(result);

    const finalCall = {
      id: callId,
      customerName: result.customerName || customerName || 'Valued Customer',
      archetype: calibrated.archetype || result.archetype || 'Neutral Inquiry',
      date: new Date().toISOString().split('T')[0],
      duration: '3:15', // Will be supplemented by client audio element duration
      durationSeconds: 195,
      agent: result.agent || agentName || 'Sales Representative',
      phone: phone || '+1 (555) 000-0000',
      audioFile: null, // Client handles local blob playback URL
      sentiment: calibrated.sentiment,
      sentimentScore: Number.isFinite(calibrated.sentimentScore)
        ? calibrated.sentimentScore
        : (Number.isFinite(Number(result.sentimentScore)) ? Number(result.sentimentScore) : 85),
      purchaseProbability: calibrated.purchaseProbability,
      purchaseJustification: calibrated.purchaseJustification || result.purchaseJustification || 'Evaluated from live call audio.',
      transcript: Array.isArray(result.transcript) ? result.transcript : [],
      keyInsights: Array.isArray(result.keyInsights) ? result.keyInsights : [],
      behavioralSummary: result.behavioralSummary || 'Transcript analysis complete.',
      isCustom: true,
      isRealAiAnalysis: true,
    };

    res.json({ success: true, call: finalCall });
  } catch (err) {
    console.error('[API] Analysis failed:', err);
    res.status(500).json({
      error: 'ANALYSIS_FAILED',
      message: err.message || 'Failed to analyze audio recording.',
    });
  } finally {
    // Clean up temporary audio file from disk
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (e) {
      console.warn('Failed to delete temp file:', e);
    }
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

const server = app.listen(PORT, () => {
  console.log(`[LeadSync API] Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[LeadSync API] Error: Port ${PORT} is already in use.`);
  } else {
    console.error('[LeadSync API] Server error:', err);
  }
});

