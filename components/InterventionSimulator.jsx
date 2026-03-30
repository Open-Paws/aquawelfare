'use client';

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Parses strings like "~440 billion" into numbers
function parseIndividuals(text) {
  if (!text) return 0;
  let numStr = text.replace(/[^0-9.]/g, '');
  let multiplier = 1;
  if (text.toLowerCase().includes('billion')) multiplier = 1000000000;
  if (text.toLowerCase().includes('million')) multiplier = 1000000;
  return parseFloat(numStr) * multiplier;
}

function formatLargeNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + ' Billion';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + ' Million';
  return num.toLocaleString();
}

export default function InterventionSimulator({ speciesData, gapsData }) {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('');
  
  // Toggles for hypothetical interventions
  const [toggles, setToggles] = useState({
    corporatePledge: false, // E.g., Major buyers mandate standard coverage
    legalSentience: false,  // E.g., UK Sentience Act recognition
    humaneSlaughter: false, // E.g., Mandatory electrical stunning
  });

  // Set default selection when data loads
  useEffect(() => {
    if (speciesData?.length > 0 && !selectedSpeciesId) {
      // Default to Whiteleg Shrimp (highest pop) or highest gap score
      const defaultSpecies = speciesData.find(s => s.id === 'whiteleg-shrimp') || speciesData[0];
      setSelectedSpeciesId(defaultSpecies.id);
    }
  }, [speciesData, selectedSpeciesId]);

  const baselineMap = useMemo(() => {
    const map = {};
    if (gapsData?.data) {
      gapsData.data.forEach(g => { map[g.speciesId] = g; });
    }
    return map;
  }, [gapsData]);

  const targetSpecies = useMemo(() => {
    return speciesData?.find(s => s.id === selectedSpeciesId);
  }, [speciesData, selectedSpeciesId]);

  // Model calculation engine
  const calculation = useMemo(() => {
    if (!targetSpecies || !baselineMap[targetSpecies.id]) return null;
    
    const baseline = baselineMap[targetSpecies.id];
    const totalPopulation = parseIndividuals(targetSpecies.annualIndividuals);
    
    // Original values
    let currentCoverage = targetSpecies.welfareStandardsCoverage;
    let currentRegulatoryGap = baseline.components.regulatoryGap;
    let currentSentienceScore = targetSpecies.sentienceScore;
    let currentSlaughterGap = 1.0; // Assume 100% bad by default if not stunned
    
    // Projected values based on interventions
    let projectedCoverage = currentCoverage;
    let projectedRegulatoryGap = currentRegulatoryGap;
    let projectedSlaughterGap = currentSlaughterGap;

    if (toggles.corporatePledge) {
      // Corporate pledge guarantees at least 80% market shift to certified
      projectedCoverage = Math.max(currentCoverage, 0.8);
    }
    if (toggles.legalSentience) {
      // Sentience recognition cuts the regulatory gap in half legally
      projectedRegulatoryGap = currentRegulatoryGap * 0.5;
    }
    if (toggles.humaneSlaughter) {
      // Eliminates the slaughtering trauma penalty heavily weighting the gap
      projectedSlaughterGap = 0.2; // Minor residual handling stress
    }

    // Mathematical Gap Weighting (Simplified linear model for simulation)
    const baseGapScore = baseline.compositeScore;
    
    // We compute a synthetic "Reduction Multiplier" based on levers
    let reduction = 0;
    if (toggles.corporatePledge) reduction += (projectedCoverage - currentCoverage) * 0.4;
    if (toggles.legalSentience) reduction += (currentRegulatoryGap - projectedRegulatoryGap) * 0.3;
    if (toggles.humaneSlaughter) reduction += (currentSlaughterGap - projectedSlaughterGap) * 0.3;
    
    // Cannot reduce beyond 90% in theory
    const projectedGapScore = Math.max(0.1, baseGapScore * (1 - reduction));
    
    // Impact calculation: how many individuals transition from 'unprotected' to 'shielded'
    const gapReductionPercent = (baseGapScore - projectedGapScore) / baseGapScore;
    const individualsShielded = totalPopulation * gapReductionPercent;

    return {
      totalPopulation,
      baseGapScore: parseFloat(baseGapScore.toFixed(3)),
      projectedGapScore: parseFloat(projectedGapScore.toFixed(3)),
      gapReductionPercent: (gapReductionPercent * 100).toFixed(1),
      individualsShielded,
    };
  }, [targetSpecies, baselineMap, toggles]);

  if (!targetSpecies || !calculation) return <div className="loading">Loading simulator data...</div>;

  const chartData = [
    {
      name: 'Welfare Gap Score',
      Baseline: calculation.baseGapScore,
      Projected: calculation.projectedGapScore,
    }
  ];

  return (
    <div className="animate-fade-in stagger-animation">
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div className="glass-card-header">
          <h3>🚀 Strategic Intervention Simulator</h3>
        </div>
        <div className="glass-card-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Select a target species and toggle hypothetical policy/corporate interventions to mathematically project the impact on global welfare gaps and calculate the absolute number of individual animals shielded from extreme suffering.
          </p>
        </div>
      </div>

      <div className="two-col-grid">
        {/* Left Column - Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-card">
            <div className="glass-card-body">
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
                Target Species
              </label>
              <select 
                className="filter-select" 
                style={{ width: '100%', marginBottom: 20 }}
                value={selectedSpeciesId}
                onChange={e => setSelectedSpeciesId(e.target.value)}
              >
                {(speciesData || []).map(s => (
                  <option key={s.id} value={s.id}>{s.image} {s.commonName} ({formatLargeNumber(parseIndividuals(s.annualIndividuals))} / yr)</option>
                ))}
              </select>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Intervention Scenarios
                </label>

                {/* Toggle 1 */}
                <div 
                  style={{ 
                    padding: 16, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s',
                    background: toggles.corporatePledge ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-glass)',
                    border: `1px solid ${toggles.corporatePledge ? 'var(--border-active)' : 'var(--border-glass)'}`
                  }}
                  onClick={() => setToggles(p => ({ ...p, corporatePledge: !p.corporatePledge }))}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, color: toggles.corporatePledge ? 'var(--accent-blue)' : 'var(--text-primary)' }}>100% ASC Corporate Pledge</div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: toggles.corporatePledge ? 'var(--accent-blue)' : 'var(--bg-secondary)', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: toggles.corporatePledge ? 22 : 2, transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Major grocery buyers mandate certification, pushing standards coverage to a minimum baseline of 80%.</div>
                </div>

                {/* Toggle 2 */}
                <div 
                  style={{ 
                    padding: 16, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s',
                    background: toggles.legalSentience ? 'rgba(167, 139, 250, 0.1)' : 'var(--bg-glass)',
                    border: `1px solid ${toggles.legalSentience ? 'rgba(167, 139, 250, 0.4)' : 'var(--border-glass)'}`
                  }}
                  onClick={() => setToggles(p => ({ ...p, legalSentience: !p.legalSentience }))}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, color: toggles.legalSentience ? 'var(--accent-purple)' : 'var(--text-primary)' }}>Legal Sentience Recognition</div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: toggles.legalSentience ? 'var(--accent-purple)' : 'var(--bg-secondary)', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: toggles.legalSentience ? 22 : 2, transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Top 5 producing countries legally recognize the species as sentient, cutting the regulatory gap.</div>
                </div>

                {/* Toggle 3 */}
                <div 
                  style={{ 
                    padding: 16, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s',
                    background: toggles.humaneSlaughter ? 'rgba(74, 222, 128, 0.1)' : 'var(--bg-glass)',
                    border: `1px solid ${toggles.humaneSlaughter ? 'rgba(74, 222, 128, 0.4)' : 'var(--border-glass)'}`
                  }}
                  onClick={() => setToggles(p => ({ ...p, humaneSlaughter: !p.humaneSlaughter }))}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, color: toggles.humaneSlaughter ? 'var(--accent-green)' : 'var(--text-primary)' }}>Humane Slaughter Mandate</div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: toggles.humaneSlaughter ? 'var(--accent-green)' : 'var(--bg-secondary)', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: toggles.humaneSlaughter ? 22 : 2, transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Abolish asphyxiation, ice slurry, or live-boiling. Mandate electrical or percussive stunning dynamically lowering cruelty metrics.</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Results Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Main Metric Card */}
          <div className="stat-card" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-active)', boxShadow: 'var(--shadow-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div className="stat-card-icon green" style={{ margin: 0 }}>🛡️</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Calculated Individual Impact</p>
            </div>
            
            <h3 style={{ fontSize: 42, color: calculation.individualsShielded > 0 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
              {formatLargeNumber(Math.floor(calculation.individualsShielded))}
            </h3>
            <p style={{ fontSize: 15, marginTop: 4 }}>
              Animals Shielded / Year
            </p>

            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Protection Coverage Matrix</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>{calculation.gapReductionPercent}% Improved</span>
              </div>
              <div style={{ width: '100%', height: 12, background: 'rgba(239, 68, 68, 0.2)', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
                <div style={{ height: '100%', width: `${calculation.gapReductionPercent}%`, background: 'var(--accent-green)', transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
                <div style={{ height: '100%', flex: 1, background: 'var(--accent-red)', opacity: 0.8, transition: 'flex 0.8s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 6, color: 'var(--text-muted)' }}>
                <span>Shielded Baseline ({formatLargeNumber(calculation.totalPopulation * (1 - calculation.baseGapScore))})</span>
                <span>Unprotected Exposed ({formatLargeNumber(calculation.totalPopulation - calculation.individualsShielded - (calculation.totalPopulation * (1 - calculation.baseGapScore)))})</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Comparsion */}
          <div className="glass-card flex-1">
            <div className="glass-card-header">
              <h3 style={{ fontSize: 15 }}>📊 Gap Score Status Comparison</h3>
            </div>
            <div className="glass-card-body">
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[0, 1]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }}
                      contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 8, fontSize: 13, color: '#f0f4f8' }} 
                    />
                    <Legend wrapperStyle={{ paddingTop: 20, fontSize: 12 }} />
                    <Bar dataKey="Baseline" fill="#f87171" radius={[4, 4, 0, 0]} barSize={80} animationDuration={1000} />
                    <Bar dataKey="Projected" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={80} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
