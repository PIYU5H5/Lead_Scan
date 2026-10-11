import { jsPDF } from 'jspdf';
import { Download, FileText, Loader } from 'lucide-react';
import { useState } from 'react';
import { SENTIMENT_CONFIG } from '../data/callData';

function generateCSV(call) {
  const rows = [
    ['Field', 'Value'],
    ['Call ID', call.id],
    ['Customer', call.customerName],
    ['Archetype', call.archetype],
    ['Date', call.date],
    ['Duration', call.duration],
    ['Agent', call.agent],
    ['Sentiment', SENTIMENT_CONFIG[call.sentiment]?.label || call.sentiment],
    ['Sentiment Score', `${call.sentimentScore}%`],
    ['Purchase Probability', `${call.purchaseProbability}%`],
    ['Purchase Justification', call.purchaseJustification],
    [],
    ['TRANSCRIPT'],
    ['Speaker', 'Text'],
    ...call.transcript.map((t) => [t.speaker, `"${t.text.replace(/"/g, '""')}"`]),
    [],
    ['KEY INSIGHTS'],
    ...call.keyInsights.map((insight, i) => [`Insight ${i + 1}`, `"${insight.replace(/"/g, '""')}"`]),
    [],
    ['BEHAVIORAL SUMMARY'],
    ['Summary', `"${call.behavioralSummary.replace(/"/g, '""')}"`],
  ];

  return rows.map((row) => row.join(',')).join('\n');
}

function generatePDF(call) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Clean normal colors for printable document
  const cDark    = [15, 23, 42];     // Deep charcoal / nearly black for main headings & values
  const cBody    = [30, 41, 59];     // High-contrast dark slate for body text & transcript
  const cMuted   = [100, 116, 139];  // Medium slate for labels, metadata keys, and dates
  const cLine    = [226, 232, 240];  // Subtle light gray hairline dividers
  const cCardBg  = [248, 250, 252];  // Off-white / light slate card background

  const checkPage = (needed = 20) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = margin + 5;
    }
  };

  const addText = (text, x, fontSize, color, style = 'normal', maxW = contentW) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont('helvetica', style);
    const lines = doc.splitTextToSize(String(text), maxW);
    const lineSpacing = fontSize * 0.42 + 1.2;
    checkPage(lines.length * lineSpacing);
    doc.text(lines, x, y);
    y += lines.length * lineSpacing + 2;
  };

  // ── Header (Clean, Corporate, Normal Colors) ──────────────────────────────
  doc.setFontSize(18);
  doc.setTextColor(...cDark);
  doc.setFont('helvetica', 'bold');
  doc.text('LeadSync — Call Analysis Report', margin, y + 4);
  y += 10;

  doc.setFontSize(8);
  doc.setTextColor(...cMuted);
  doc.setFont('helvetica', 'normal');
  doc.text('EXECUTIVE AUDIT · AI SALES INTELLIGENCE & EVALUATION', margin, y);
  y += 5;

  // Header Divider
  doc.setDrawColor(...cLine);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  // ── Meta Box (Light card with crisp dark text) ────────────────────────────
  const metaItems = [
    ['Call ID', call.id],
    ['Customer', call.customerName],
    ['Archetype', call.archetype],
    ['Date', call.date],
    ['Duration', call.duration],
    ['Agent', call.agent],
  ];

  doc.setFillColor(...cCardBg);
  doc.setDrawColor(...cLine);
  doc.setLineWidth(0.3);
  const metaBoxHeight = 32;
  doc.roundedRect(margin, y, contentW, metaBoxHeight, 2, 2, 'FD');

  const colW = contentW / 3;
  metaItems.forEach(([label, val], idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const itemX = margin + 5 + col * colW;
    const itemY = y + 7 + row * 13;

    doc.setFontSize(8);
    doc.setTextColor(...cMuted);
    doc.setFont('helvetica', 'bold');
    doc.text(label.toUpperCase(), itemX, itemY);

    doc.setFontSize(9.5);
    doc.setTextColor(...cDark);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val), itemX, itemY + 5);
  });

  y += metaBoxHeight + 8;

  // ── Section 1: AI Evaluation & Scoring ────────────────────────────────────
  checkPage(35);
  doc.setFontSize(12);
  doc.setTextColor(...cDark);
  doc.setFont('helvetica', 'bold');
  doc.text('1. AI Evaluation & Scoring', margin, y);
  y += 3;
  doc.setDrawColor(...cLine);
  doc.setLineWidth(0.2);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  const sentLabel = SENTIMENT_CONFIG[call.sentiment]?.label || 'Neutral';
  // Normal semantic colors with high contrast on white paper:
  const sentColor = call.sentiment === 'positive' 
    ? [22, 101, 52]    // Deep forest green
    : call.sentiment === 'negative'
    ? [185, 28, 28]    // Deep crimson red
    : [71, 85, 105];   // Deep slate gray

  const probColor = call.purchaseProbability >= 70
    ? [22, 101, 52]    // High intent: deep green
    : call.purchaseProbability >= 35
    ? [180, 83, 9]     // Medium intent: deep amber
    : [185, 28, 28];   // Low intent / declined: deep red

  addText(`Sentiment: ${sentLabel} (${call.sentimentScore}% model confidence)`, margin, 10, sentColor, 'bold');
  addText(`Purchase Probability: ${call.purchaseProbability}%`, margin, 10, probColor, 'bold');
  addText(`Justification: ${call.purchaseJustification}`, margin, 9.5, cBody, 'normal');
  y += 4;

  // ── Section 2: Key Insights & Signals ─────────────────────────────────────
  checkPage(40);
  doc.setFontSize(12);
  doc.setTextColor(...cDark);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Extracted Signals & Key Insights', margin, y);
  y += 3;
  doc.setDrawColor(...cLine);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  call.keyInsights.forEach((insight) => {
    const clean = insight.replace(/[🟢🟡🔴🔵*]/g, '').trim();
    addText(`•  ${clean}`, margin + 2, 9.5, cBody, 'normal', contentW - 2);
  });
  y += 4;

  // ── Section 3: Behavioral Summary ─────────────────────────────────────────
  checkPage(35);
  doc.setFontSize(12);
  doc.setTextColor(...cDark);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Behavioral Summary', margin, y);
  y += 3;
  doc.setDrawColor(...cLine);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  addText(call.behavioralSummary, margin, 9.5, cBody, 'normal');
  y += 6;

  // ── Section 4: Full Call Transcript ───────────────────────────────────────
  checkPage(40);
  doc.setFontSize(12);
  doc.setTextColor(...cDark);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Full Call Transcript', margin, y);
  y += 3;
  doc.setDrawColor(...cLine);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  call.transcript.forEach(({ speaker, text }) => {
    checkPage(18);
    const isAgent = speaker.toLowerCase() === 'agent';
    const speakerColor = isAgent ? [30, 58, 138] : [15, 23, 42]; // Navy for agent, deep slate for customer

    doc.setFontSize(8.5);
    doc.setTextColor(...speakerColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${speaker.toUpperCase()}:`, margin, y);
    y += 4.5;

    addText(text, margin + 4, 9, cBody, 'normal', contentW - 4);
    y += 1.5;
  });

  // ── Professional Footer on every page ─────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...cLine);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 12, margin + contentW, pageH - 12);

    doc.setFontSize(7.5);
    doc.setTextColor(...cMuted);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `LeadSync AI Call Analysis  |  ${call.id}  |  Generated ${new Date().toLocaleDateString()}`,
      margin,
      pageH - 8
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageW - margin,
      pageH - 8,
      { align: 'right' }
    );
  }

  return doc;
}

export default function ReportDownload({ call }) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);

  const handlePDF = async () => {
    setLoadingPdf(true);
    await new Promise((r) => setTimeout(r, 400));
    try {
      const doc = generatePDF(call);
      doc.save(`LeadSync_${call.id}_Report.pdf`);
    } catch (e) {
      console.error('PDF generation failed:', e);
    }
    setLoadingPdf(false);
  };

  const handleCSV = async () => {
    setLoadingCsv(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      const csv = generateCSV(call);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LeadSync_${call.id}_Report.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('CSV generation failed:', e);
    }
    setLoadingCsv(false);
  };

  return (
    <div className="report-download-group">
      <button
        className="btn btn-primary"
        onClick={handlePDF}
        disabled={loadingPdf}
        id={`download-pdf-${call.id}`}
        aria-label="Download PDF report"
        aria-busy={loadingPdf}
      >
        {loadingPdf ? (
          <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
        ) : (
          <Download size={15} aria-hidden="true" />
        )}
        Download PDF
      </button>
      <button
        className="btn btn-secondary"
        onClick={handleCSV}
        disabled={loadingCsv}
        id={`download-csv-${call.id}`}
        aria-label="Download CSV report"
        aria-busy={loadingCsv}
      >
        {loadingCsv ? (
          <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
        ) : (
          <FileText size={15} aria-hidden="true" />
        )}
        Export CSV
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
