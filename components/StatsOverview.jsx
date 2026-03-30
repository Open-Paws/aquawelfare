'use client';

export default function StatsOverview({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: 'Species Tracked', value: stats.totalSpeciesTracked, icon: '🐟', color: 'blue' },
    { label: 'Countries Analyzed', value: stats.totalCountriesTracked, icon: '🌍', color: 'cyan' },
    { label: 'No Welfare Standards', value: stats.speciesWithNoStandards, icon: '🚫', color: 'red' },
    { label: 'No Legislation', value: `${stats.countriesWithNoLegislation} countries`, icon: '⚖️', color: 'yellow' },
    { label: 'Production Uncovered', value: `${stats.percentProductionUncovered}%`, icon: '📉', color: 'purple' },
    { label: 'Critical Priority', value: stats.criticalPrioritySpecies, icon: '🔴', color: 'red' },
  ];

  return (
    <div className="stats-grid stagger-animation">
      {cards.map((card, i) => (
        <div key={i} className="stat-card">
          <div className={`stat-card-icon ${card.color}`}>
            {card.icon}
          </div>
          <h3>{card.value}</h3>
          <p>{card.label}</p>
        </div>
      ))}
    </div>
  );
}
