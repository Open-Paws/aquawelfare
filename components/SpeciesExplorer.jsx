'use client';

import { useState, useMemo } from 'react';

export default function SpeciesExplorer({ species, onSelect, gapsData, gapMap: gapMapProp }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('gap');

  // Use pre-computed gapMap from page.js when available, otherwise build locally
  const gapMap = useMemo(() => {
    if (gapMapProp) return gapMapProp;
    const map = {};
    if (gapsData?.data) {
      gapsData.data.forEach(g => { map[g.speciesId] = g; });
    }
    return map;
  }, [gapMapProp, gapsData]);

  const filteredSpecies = useMemo(() => {
    let data = species || [];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(s => 
        s.commonName.toLowerCase().includes(q) || 
        s.scientificName.toLowerCase().includes(q) ||
        s.taxonomicGroup.toLowerCase().includes(q)
      );
    }
    
    if (sortBy === 'gap') {
      data = [...data].sort((a, b) => {
        const gA = gapMap[a.id]?.compositeScore || 0;
        const gB = gapMap[b.id]?.compositeScore || 0;
        return gB - gA;
      });
    } else if (sortBy === 'production') {
      data = [...data].sort((a, b) => b.annualProductionTonnes - a.annualProductionTonnes);
    } else if (sortBy === 'sentience') {
      data = [...data].sort((a, b) => b.sentienceScore - a.sentienceScore);
    } else if (sortBy === 'name') {
      data = [...data].sort((a, b) => a.commonName.localeCompare(b.commonName));
    }
    
    return data;
  }, [species, search, sortBy, gapMap]);

  const getPriorityBadge = (speciesId) => {
    const gap = gapMap[speciesId];
    if (!gap) return null;
    const cls = gap.priorityLevel.toLowerCase();
    return <span className={`badge ${cls}`}>{gap.priorityLevel} ({gap.compositeScore})</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search species by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="filter-select"
          style={{ flex: 1, minWidth: 220, backgroundImage: 'none', paddingRight: 14 }}
        />
        <select
          className="filter-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="gap">Sort by Gap Score</option>
          <option value="production">Sort by Production</option>
          <option value="sentience">Sort by Sentience</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        Showing {filteredSpecies.length} species
      </div>

      <div className="species-grid stagger-animation">
        {filteredSpecies.map(s => (
          <div key={s.id} className="species-card" onClick={() => onSelect(s)}>
            <div className="species-card-header">
              <div className="species-emoji">{s.image}</div>
              <div>
                <h4>{s.commonName}</h4>
                <div className="scientific">{s.scientificName}</div>
                <div style={{ marginTop: 4 }}>
                  {getPriorityBadge(s.id)}
                </div>
              </div>
            </div>

            <div className="species-card-stats">
              <div className="species-stat">
                <strong>{(s.annualProductionTonnes / 1000000).toFixed(1)}M t</strong>
                Annual Production
              </div>
              <div className="species-stat">
                <strong>{s.annualIndividuals}</strong>
                Individuals/Year
              </div>
              <div className="species-stat">
                <strong style={{ color: s.sentienceScore >= 0.7 ? 'var(--accent-orange)' : s.sentienceScore >= 0.4 ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>
                  {(s.sentienceScore * 100).toFixed(0)}%
                </strong>
                Sentience Score
              </div>
              <div className="species-stat">
                <strong style={{ color: s.welfareStandardsCoverage < 0.2 ? 'var(--accent-red)' : s.welfareStandardsCoverage < 0.5 ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>
                  {(s.welfareStandardsCoverage * 100).toFixed(0)}%
                </strong>
                Welfare Coverage
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Welfare Coverage</span>
                <span>{(s.welfareStandardsCoverage * 100).toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${s.welfareStandardsCoverage * 100}%`,
                    background: s.welfareStandardsCoverage < 0.2 ? 'var(--accent-red)' : s.welfareStandardsCoverage < 0.5 ? 'var(--accent-yellow)' : 'var(--accent-green)'
                  }}
                />
              </div>
            </div>

            <div className="species-card-concerns">
              {s.keyWelfareConcerns?.slice(0, 3).map((concern, i) => (
                <span key={i} className="concern-tag">{concern}</span>
              ))}
              {s.keyWelfareConcerns?.length > 3 && (
                <span className="concern-tag" style={{ background: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                  +{s.keyWelfareConcerns.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSpecies.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No species found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
