'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ReportPanel({ filters }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Error generating report:', err);
    }
    setLoading(false);
  };

  const downloadMarkdown = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquatic-welfare-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!report) return;
    
    // Dynamically import to avoid Next.js SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('pdf-report-content');
    
    const opt = {
      margin:       [15, 15, 15, 15],
      filename:     `aquatic-welfare-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="section-grid">
      <div className="glass-card">
        <div className="glass-card-header">
          <h3>📋 AI-Powered Report Generator</h3>
        </div>
        <div className="glass-card-body">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>
            Generate a comprehensive welfare gap analysis report based on current filters. 
            The AI engine analyzes all species, countries, and certification data to produce 
            actionable intervention recommendations.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <div style={{ background: 'var(--bg-glass)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Species Group:</span>{' '}
              <strong>{filters.taxonomicGroup}</strong>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Region:</span>{' '}
              <strong>{filters.region}</strong>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>System:</span>{' '}
              <strong>{filters.productionSystem}</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button 
          className="btn btn-primary" 
          onClick={generateReport} 
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2, marginRight: 0 }} />
              Generating Report...
            </>
          ) : (
            <>🤖 Generate AI Report</>
          )}
        </button>

        {report && (
          <>
            <button className="btn btn-secondary" onClick={downloadPDF} style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', borderColor: 'var(--border-active)' }}>
              📄 Download PDF
            </button>
            <button className="btn btn-secondary" onClick={downloadMarkdown}>
              📥 Download (.md)
            </button>
          </>
        )}
      </div>

      {report && (
        <>
          <div className="report-container animate-slide-up">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
          
          <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px' }}>
            <div id="pdf-report-content" className="pdf-container">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
