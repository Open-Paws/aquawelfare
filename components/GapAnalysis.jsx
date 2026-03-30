'use client';

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
        color: '#f0f4f8',
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || '#94a3b8', fontSize: 12 }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function GapAnalysis({ gapsData, speciesData, countriesData, filters }) {
  const [view, setView] = useState('species');
  
  const speciesGaps = useMemo(() => {
    if (!gapsData?.data) return [];
    let data = gapsData.data;
    if (filters?.priority && filters.priority !== 'All') {
      data = data.filter(d => d.priorityLevel === filters.priority);
    }
    return data;
  }, [gapsData, filters]);

  const chartData = useMemo(() => {
    return speciesGaps.slice(0, 15).map(g => ({
      name: g.speciesName.length > 18 ? g.speciesName.substring(0, 16) + '…' : g.speciesName,
      fullName: g.speciesName,
      score: g.compositeScore,
      production: g.components.productionScale,
      sentience: g.components.sentienceEvidence,
      standardsGap: g.components.standardsGap,
      regulatoryGap: g.components.regulatoryGap,
      feasibility: g.components.interventionFeasibility,
      priority: g.priorityLevel,
    }));
  }, [speciesGaps]);

  const radarData = useMemo(() => {
    if (speciesGaps.length === 0) return [];
    const top3 = speciesGaps.slice(0, 3);
    return [
      { factor: 'Production Scale', ...Object.fromEntries(top3.map(g => [g.speciesName, g.components.productionScale])) },
      { factor: 'Sentience', ...Object.fromEntries(top3.map(g => [g.speciesName, g.components.sentienceEvidence])) },
      { factor: 'Standards Gap', ...Object.fromEntries(top3.map(g => [g.speciesName, g.components.standardsGap])) },
      { factor: 'Regulatory Gap', ...Object.fromEntries(top3.map(g => [g.speciesName, g.components.regulatoryGap])) },
      { factor: 'Feasibility', ...Object.fromEntries(top3.map(g => [g.speciesName, g.components.interventionFeasibility])) },
    ];
  }, [speciesGaps]);

  const priorityCounts = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    speciesGaps.forEach(g => { counts[g.priorityLevel]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [speciesGaps]);

  const radarColors = ['#38bdf8', '#f472b6', '#4ade80'];

  return (
    <div className="section-grid">
      {/* Priority Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {priorityCounts.map(pc => (
          <div key={pc.name} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[pc.name] }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{pc.name}</span>
            </div>
            <h3 style={{ color: COLORS[pc.name] }}>{pc.value}</h3>
            <p>species</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="glass-card">
          <div className="glass-card-header">
            <h3>📊 Gap Scores — Top 15 Species</h3>
          </div>
          <div className="glass-card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis type="number" domain={[0, 1]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={130} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Gap Score" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[entry.priority]} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <h3>🎯 Factor Comparison — Top 3 Priority Species</h3>
          </div>
          <div className="glass-card-body">
            <div className="chart-container">
              {speciesGaps.length >= 1 && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(148,163,184,0.15)" />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 10 }} />
                    {speciesGaps.slice(0, 3).map((g, i) => (
                      <Radar key={g.speciesName} name={g.speciesName} dataKey={g.speciesName}
                        stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={0.15} strokeWidth={2} />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gap Table */}
      <div className="glass-card">
        <div className="glass-card-header">
          <h3>📋 Detailed Gap Analysis Ranking</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{speciesGaps.length} species</span>
        </div>
        <div className="glass-card-body" style={{ overflowX: 'auto' }}>
          <table className="gap-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Species</th>
                <th>Group</th>
                <th>Gap Score</th>
                <th>Priority</th>
                <th>Production</th>
                <th>Sentience</th>
                <th>Standards Gap</th>
                <th>Coverage</th>
                <th>Schemes</th>
              </tr>
            </thead>
            <tbody>
              {speciesGaps.map((gap, i) => (
                <tr key={gap.speciesId}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{gap.speciesName}</div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{gap.taxonomicGroup}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ 
                          width: `${gap.compositeScore * 100}%`,
                          background: COLORS[gap.priorityLevel]
                        }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{gap.compositeScore}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${gap.priorityLevel.toLowerCase()}`}>{gap.priorityLevel}</span></td>
                  <td>{(gap.annualProduction / 1000000).toFixed(1)}M t</td>
                  <td>{gap.components.sentienceEvidence}</td>
                  <td>{gap.components.standardsGap}</td>
                  <td>{Math.round(gap.welfareStandardsCoverage * 100)}%</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {gap.existingSchemes.length > 0 ? gap.existingSchemes.join(', ') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
