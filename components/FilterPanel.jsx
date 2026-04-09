'use client';

import { regions as defaultRegions } from '../data/countries';
import { productionSystems as defaultProductionSystems } from '../data/production-systems';

export default function FilterPanel({ filters, onFilterChange, regions: regionsProp, productionSystems: productionSystemsProp }) {
  const taxonomicGroups = ['All', 'Fish', 'Crustacean', 'Cephalopod', 'Mollusk', 'Other'];
  const allRegions = ['All', ...(regionsProp || defaultRegions)];
  const allSystems = ['All', ...(productionSystemsProp || defaultProductionSystems).map(s => s.name)];

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Species Group</label>
        <select
          className="filter-select"
          value={filters.taxonomicGroup}
          onChange={e => onFilterChange('taxonomicGroup', e.target.value)}
        >
          {taxonomicGroups.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Region</label>
        <select
          className="filter-select"
          value={filters.region}
          onChange={e => onFilterChange('region', e.target.value)}
        >
          {allRegions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Production System</label>
        <select
          className="filter-select"
          value={filters.productionSystem}
          onChange={e => onFilterChange('productionSystem', e.target.value)}
        >
          {allSystems.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Priority Level</label>
        <select
          className="filter-select"
          value={filters.priority}
          onChange={e => onFilterChange('priority', e.target.value)}
        >
          <option value="All">All</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
}
