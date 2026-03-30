'use client';

import { useMemo } from 'react';

export default function SpeciesDetail({ species: s, gapsData, onClose }) {
  if (!s) return null;

  const gapInfo = useMemo(() => {
    if (!gapsData?.data) return null;
    return gapsData.data.find(g => g.speciesId === s.id);
  }, [gapsData, s]);

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <div className="detail-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="species-emoji" style={{ fontSize: 40, width: 60, height: 60 }}>{s.image}</div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{s.commonName}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>{s.scientificName}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {s.taxonomicGroup}
                </span>
                {gapInfo && (
                  <span className={`badge ${gapInfo.priorityLevel.toLowerCase()}`}>
                    {gapInfo.priorityLevel} Priority — Score: {gapInfo.compositeScore}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="detail-panel-close" onClick={onClose}>✕</button>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'var(--bg-glass)', padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{(s.annualProductionTonnes / 1000000).toFixed(1)}M</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tonnes/Year</div>
          </div>
          <div style={{ background: 'var(--bg-glass)', padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.sentienceScore >= 0.7 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
              {(s.sentienceScore * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sentience Score</div>
          </div>
          <div style={{ background: 'var(--bg-glass)', padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.welfareStandardsCoverage < 0.2 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {(s.welfareStandardsCoverage * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Welfare Coverage</div>
          </div>
        </div>

        {/* Gap Score Components */}
        {gapInfo && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>📊 Gap Score Components</h3>
            {[
              { label: 'Production Scale', value: gapInfo.components.productionScale, color: '#38bdf8' },
              { label: 'Sentience Evidence', value: gapInfo.components.sentienceEvidence, color: '#f472b6' },
              { label: 'Standards Gap', value: gapInfo.components.standardsGap, color: '#ef4444' },
              { label: 'Regulatory Gap', value: gapInfo.components.regulatoryGap, color: '#fbbf24' },
              { label: 'Intervention Feasibility', value: gapInfo.components.interventionFeasibility, color: '#4ade80' },
            ].map(comp => (
              <div key={comp.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{comp.label}</span>
                  <span style={{ fontWeight: 600 }}>{comp.value}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${comp.value * 100}%`, background: comp.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sentience Evidence */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>🧠 Sentience Evidence</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.sentienceEvidence}</p>
        </div>

        {/* Key Welfare Concerns */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>⚠️ Key Welfare Concerns</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {s.keyWelfareConcerns?.map((concern, i) => (
              <span key={i} className="concern-tag">{concern}</span>
            ))}
          </div>
        </div>

        {/* Production Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>🌏 Top Producers</h3>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'var(--text-secondary)' }}>
              {s.topProducers?.map((p, i) => (
                <li key={i} style={{ padding: '3px 0' }}>
                  {i + 1}. {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>🏭 Production Systems</h3>
            <ul style={{ listStyle: 'none', fontSize: 13, color: 'var(--text-secondary)' }}>
              {s.productionSystems?.map((p, i) => (
                <li key={i} style={{ padding: '3px 0' }}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certification Schemes */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>✅ Certification Schemes</h3>
          {s.certificationSchemes?.length > 0 ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {s.certificationSchemes.map((scheme, i) => (
                <span key={i} style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: 'rgba(74, 222, 128, 0.1)', color: 'var(--accent-green)',
                  border: '1px solid rgba(74, 222, 128, 0.3)'
                }}>
                  {scheme}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--accent-red)' }}>❌ No certification schemes exist for this species</p>
          )}
        </div>

        {/* Research Citations */}
        {s.researchCitations?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>📚 Key Research</h3>
            <ul style={{ listStyle: 'none', fontSize: 12, color: 'var(--text-muted)' }}>
              {s.researchCitations.map((cite, i) => (
                <li key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--border-glass)' }}>{cite}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Data Source */}
        <div style={{ padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            📅 Data Year: {s.dataYear} | 📊 Source: {s.dataSource} | 🔢 Individuals/Year: {s.annualIndividuals}
          </p>
        </div>
      </div>
    </div>
  );
}
