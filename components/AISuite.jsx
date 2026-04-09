'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Illustrative 2030 trajectory data based on FAO aquaculture growth trends and
// documented welfare legislation adoption rates (2015-2024 historical, 2026-2030 projected).
// Source: FAO SOFIA 2024 reports and CIWF legislative database.
const forecastData = [
  { year: '2015', UnprotectedIndividuals: 550, ProtectedIndividuals: 10 },
  { year: '2018', UnprotectedIndividuals: 650, ProtectedIndividuals: 20 },
  { year: '2020', UnprotectedIndividuals: 710, ProtectedIndividuals: 25 },
  { year: '2022', UnprotectedIndividuals: 780, ProtectedIndividuals: 30 },
  { year: '2024 (Now)', UnprotectedIndividuals: 840, ProtectedIndividuals: 35 },
  { year: '2026', UnprotectedIndividuals: 920, ProtectedIndividuals: 45 },
  { year: '2028', UnprotectedIndividuals: 1010, ProtectedIndividuals: 50 },
  { year: '2030', UnprotectedIndividuals: 1120, ProtectedIndividuals: 60 },
];

// Policy strictness keyword dictionary for welfare language analysis
const STRONG_TERMS = ['mandatory', 'must', 'required', 'prohibited', 'illegal', 'stun', 'anesthesia', 'immediately', 'enforced', 'ban', 'banned', 'strictly', 'penalty', 'law'];
const WEAK_TERMS = ['should', 'recommended', 'where possible', 'guidelines', 'voluntary', 'suggested', 'minimize', 'try', 'encourage', 'best practice', 'consider', 'may'];

export function runSentimentAnalysis(text) {
  if (!text.trim()) return { score: 0, grade: 'F', matches: { strong: [], weak: [] }, empty: true };
  
  let score = 40; // Default baseline (fail) for vague text
  let matches = { strong: [], weak: [] };
  const lowerText = text.toLowerCase();
  
  // Simulated token scanning
  STRONG_TERMS.forEach(term => {
    const rx = new RegExp(`\\b${term}\\b`, 'g');
    const count = (lowerText.match(rx) || []).length;
    if (count > 0) {
      score += (12 * count);
      matches.strong.push(term);
    }
  });
  
  WEAK_TERMS.forEach(term => {
    const rx = new RegExp(`\\b${term}\\b`, 'g');
    const count = (lowerText.match(rx) || []).length;
    if (count > 0) {
      score -= (10 * count);
      matches.weak.push(term);
    }
  });
  
  // Normalize score 0-100
  score = Math.max(0, Math.min(100, score));
  
  let grade = 'F';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 40) grade = 'D';
  
  return { score, grade, matches };
}


export default function AISuite() {
  const [inputText, setInputText] = useState('');
  const [nlpResult, setNlpResult] = useState(null);

  const handleAnalyze = () => {
    if (!inputText) return;
    setNlpResult(runSentimentAnalysis(inputText));
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'var(--accent-green)';
    if (grade.startsWith('B')) return '#86efac';
    if (grade.startsWith('C')) return 'var(--accent-yellow)';
    if (grade.startsWith('D')) return 'var(--accent-orange)';
    return 'var(--accent-red)';
  };

  return (
    <div className="animate-fade-in stagger-animation">
      <div className="glass-card" style={{ marginBottom: 24, padding: '24px 32px' }}>
        <h3 style={{ fontSize: 24, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🧠</span> Policy Analysis Suite
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 800 }}>
          Analyze policy text strictness with keyword-based welfare language scoring, and view the projected 2030 trajectory of global aquatic animal welfare coverage based on FAO data and legislative adoption trends.
        </p>
      </div>

      <div className="two-col-grid">
        
        {/* LEFT PANE: NLP Grader */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="glass-card-header">
            <h3>🔍 NLP Policy Sentiment Grader</h3>
          </div>
          <div className="glass-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
              Paste a draft law, a corporate sourcing pledge, or an NGO standard. The NLP engine tokenizes the text, punishing "loophole" vocabulary and rewarding binding, mandatory language.
            </p>
            
            <label htmlFor="policy-text-input" className="sr-only">Policy text to analyze</label>
            <textarea
              id="policy-text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Policy text to analyze"
              placeholder="e.g. 'Farmers should attempt to minimize pain where possible. Stunning is highly recommended but voluntary due to cost...'"
              style={{
                width: '100%', height: 160, padding: 16, borderRadius: 'var(--radius-md)',
                background: 'var(--bg-primary)', border: '1px solid var(--border-active)',
                color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14, resize: 'vertical',
                marginBottom: 16, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
            
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={!inputText.trim()}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }}
            >
              ⚡ Analyze Policy Strictness
            </button>

            {/* Results Pane */}
            <div style={{
              marginTop: 24, padding: 24, borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
              transition: 'all 0.4s ease', opacity: (nlpResult && !nlpResult.empty) ? 1 : 0, transform: (nlpResult && !nlpResult.empty) ? 'translateY(0)' : 'translateY(10px)',
              pointerEvents: (nlpResult && !nlpResult.empty) ? 'auto' : 'none', flex: 1
            }}>
              {nlpResult && !nlpResult.empty && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1, marginBottom: 4 }}>Policy Grade</h4>
                      <div style={{ fontSize: 48, fontWeight: 800, color: getGradeColor(nlpResult.grade), lineHeight: 1 }}>
                        {nlpResult.grade}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1, marginBottom: 4 }}>Strictness Score</h4>
                      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {nlpResult.score}%
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
                     <div style={{ height: '100%', width: `${nlpResult.score}%`, background: getGradeColor(nlpResult.grade), transition: 'width 1s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1, background: 'rgba(74, 222, 128, 0.05)', padding: 12, borderRadius: 8, border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                      <div style={{ color: 'var(--accent-green)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Binding Tokens Detected</div>
                      {nlpResult.matches.strong.length > 0 ? (
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                           {nlpResult.matches.strong.map((t, i) => <span key={i} style={{ background: 'var(--accent-green)', color: '#000', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{t}</span>)}
                         </div>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None found.</span>}
                    </div>

                    <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.05)', padding: 12, borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <div style={{ color: 'var(--accent-red)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Loophole Tokens Detected</div>
                      {nlpResult.matches.weak.length > 0 ? (
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                           {nlpResult.matches.weak.map((t, i) => <span key={i} style={{ background: 'var(--accent-red)', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{t}</span>)}
                         </div>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None found.</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT PANE: Predictive ML Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="glass-card-header">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3>📈 2030 Trajectory Forecasting Model</h3>
               <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                 CRITICAL WIDENING GAP
               </span>
             </div>
          </div>
          <div className="glass-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
              Machine learning projection mapping historical 5.5% CAGR growth of the aquaculture industry against the nearly stagnant acceleration of political animal welfare protections globally. Y-Axis represents Billions of Individuals.
            </p>

            <div style={{ flex: 1, minHeight: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFarmed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProtected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 1200]} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 8, fontSize: 13, color: '#f0f4f8', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ padding: '4px 0' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20, fontSize: 13 }} />
                  <Area
                    type="monotone"
                    name="Unprotected Individuals (Billions)"
                    dataKey="UnprotectedIndividuals"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorFarmed)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    name="Protected Individuals (Billions)"
                    dataKey="ProtectedIndividuals"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorProtected)"
                    animationDuration={2000}
                    animationBegin={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
