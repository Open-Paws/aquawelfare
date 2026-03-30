'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap, Legend } from 'recharts';

const CHART_COLORS = ['#38bdf8', '#22d3ee', '#2dd4bf', '#4ade80', '#a78bfa', '#f472b6', '#fbbf24', '#fb923c', '#f87171'];

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
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label || payload[0]?.name}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill || '#94a3b8', fontSize: 12 }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WelfareCharts({ speciesData, gapsData, countriesData }) {
  const productionByGroup = useMemo(() => {
    const groups = {};
    (speciesData || []).forEach(s => {
      groups[s.taxonomicGroup] = (groups[s.taxonomicGroup] || 0) + s.annualProductionTonnes;
    });
    return Object.entries(groups).map(([name, value]) => ({
      name,
      value: Math.round(value / 1000000),
    })).sort((a, b) => b.value - a.value);
  }, [speciesData]);

  const topProducers = useMemo(() => {
    return (countriesData || [])
      .sort((a, b) => b.totalAquacultureProduction - a.totalAquacultureProduction)
      .slice(0, 10)
      .map(c => ({
        name: c.name.length > 12 ? c.name.substring(0, 10) + '…' : c.name,
        fullName: c.name,
        production: Math.round(c.totalAquacultureProduction / 1000000),
        welfareScore: Math.round(c.welfareScore * 100),
      }));
  }, [countriesData]);

  const coverageBreakdown = useMemo(() => {
    const total = (speciesData || []).length;
    const withStandards = (speciesData || []).filter(s => s.certificationSchemes?.length > 0).length;
    const withoutStandards = total - withStandards;
    return [
      { name: 'Has Standards', value: withStandards },
      { name: 'No Standards', value: withoutStandards },
    ];
  }, [speciesData]);

  const legislationData = useMemo(() => {
    const total = (countriesData || []).length;
    const enforced = (countriesData || []).filter(c => c.regulatoryFramework?.hasLegislation && c.regulatoryFramework?.enforced).length;
    const notEnforced = (countriesData || []).filter(c => c.regulatoryFramework?.hasLegislation && !c.regulatoryFramework?.enforced).length;
    const none = total - enforced - notEnforced;
    return [
      { name: 'Enforced', value: enforced },
      { name: 'Not Enforced', value: notEnforced },
      { name: 'No Legislation', value: none },
    ];
  }, [countriesData]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.08) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="charts-grid">
      {/* Production by Group */}
      <div className="glass-card">
        <div className="glass-card-header">
          <h3>🥧 Production by Taxonomic Group</h3>
        </div>
        <div className="glass-card-body">
          <div className="chart-container" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productionByGroup} cx="50%" cy="50%" outerRadius={100} innerRadius={50}
                  dataKey="value" nameKey="name" label={renderCustomLabel} labelLine={false}>
                  {productionByGroup.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} formatter={(value) => <span style={{ color: '#94a3b8' }}>{value} (M tonnes)</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Welfare Standards Coverage */}
      <div className="glass-card">
        <div className="glass-card-header">
          <h3>📊 Welfare Standards Coverage</h3>
        </div>
        <div className="glass-card-body">
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>Species Coverage</p>
              <div className="chart-container" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={coverageBreakdown} cx="50%" cy="50%" outerRadius={70} innerRadius={40}
                      dataKey="value" label={renderCustomLabel} labelLine={false}>
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>Legislation Status</p>
              <div className="chart-container" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={legislationData} cx="50%" cy="50%" outerRadius={70} innerRadius={40}
                      dataKey="value" label={renderCustomLabel} labelLine={false}>
                      <Cell fill="#22c55e" />
                      <Cell fill="#eab308" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Producers */}
      <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
        <div className="glass-card-header">
          <h3>🏭 Top 10 Producing Countries — Production vs Welfare Score</h3>
        </div>
        <div className="glass-card-body">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducers} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Production (M tonnes)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Welfare Score %', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Bar yAxisId="left" dataKey="production" name="Production (M tonnes)" fill="#38bdf8" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
                <Bar yAxisId="right" dataKey="welfareScore" name="Welfare Score %" fill="#4ade80" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
