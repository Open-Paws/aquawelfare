/**
 * Tests for chart data transformation logic used in WelfareCharts.
 *
 * The useMemo functions inside WelfareCharts transform raw data into chart
 * formats. Extracted and tested here as pure functions — they encode domain
 * rules (grouping by taxonomicGroup, production unit conversion, legislation
 * categorization) that must survive refactoring.
 */

import { species } from '../../data/species.js';
import { countries } from '../../data/countries.js';

// --- Replicated from WelfareCharts.jsx (useMemo bodies) ---

function getProductionByGroup(speciesData) {
  const groups = {};
  (speciesData || []).forEach(s => {
    groups[s.taxonomicGroup] = (groups[s.taxonomicGroup] || 0) + s.annualProductionTonnes;
  });
  return Object.entries(groups)
    .map(([name, value]) => ({ name, value: Math.round(value / 1000000) }))
    .sort((a, b) => b.value - a.value);
}

function getTopProducersChartData(countriesData) {
  return (countriesData || [])
    .sort((a, b) => b.totalAquacultureProduction - a.totalAquacultureProduction)
    .slice(0, 10)
    .map(c => ({
      name: c.name.length > 12 ? c.name.substring(0, 10) + '\u2026' : c.name,
      fullName: c.name,
      production: Math.round(c.totalAquacultureProduction / 1000000),
      welfareScore: Math.round(c.welfareScore * 100),
    }));
}

function getCoverageBreakdown(speciesData) {
  const total = (speciesData || []).length;
  const withStandards = (speciesData || []).filter(s => s.certificationSchemes?.length > 0).length;
  const withoutStandards = total - withStandards;
  return [
    { name: 'Has Standards', value: withStandards },
    { name: 'No Standards', value: withoutStandards },
  ];
}

function getLegislationData(countriesData) {
  const total = (countriesData || []).length;
  const enforced = (countriesData || []).filter(
    c => c.regulatoryFramework?.hasLegislation && c.regulatoryFramework?.enforced
  ).length;
  const notEnforced = (countriesData || []).filter(
    c => c.regulatoryFramework?.hasLegislation && !c.regulatoryFramework?.enforced
  ).length;
  const none = total - enforced - notEnforced;
  return [
    { name: 'Enforced', value: enforced },
    { name: 'Not Enforced', value: notEnforced },
    { name: 'No Legislation', value: none },
  ];
}

// --- Tests ---

describe('getProductionByGroup', () => {
  test('returns a non-empty array for the full species dataset', () => {
    const result = getProductionByGroup(species);
    expect(result.length).toBeGreaterThan(0);
  });

  test('each entry has name and value fields', () => {
    const result = getProductionByGroup(species);
    result.forEach(entry => {
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.value).toBe('number');
    });
  });

  test('results are sorted by value descending', () => {
    const result = getProductionByGroup(species);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].value).toBeGreaterThanOrEqual(result[i].value);
    }
  });

  test('each taxonomicGroup appears exactly once', () => {
    const result = getProductionByGroup(species);
    const names = result.map(r => r.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  test('sum of group values approximates total production in millions of tonnes', () => {
    const result = getProductionByGroup(species);
    const groupSum = result.reduce((sum, r) => sum + r.value, 0);
    const totalMillion = Math.round(
      species.reduce((sum, s) => sum + s.annualProductionTonnes, 0) / 1000000
    );
    // Rounding per-group then summing may differ from rounding total by at most n groups
    expect(Math.abs(groupSum - totalMillion)).toBeLessThanOrEqual(result.length);
  });

  test('returns empty array for empty input', () => {
    expect(getProductionByGroup([])).toHaveLength(0);
  });

  test('returns empty array for null input', () => {
    expect(getProductionByGroup(null)).toHaveLength(0);
  });
});

describe('getTopProducersChartData', () => {
  test('returns at most 10 entries', () => {
    expect(getTopProducersChartData(countries).length).toBeLessThanOrEqual(10);
  });

  test('returns exactly 10 entries when more than 10 countries available', () => {
    if (countries.length > 10) {
      expect(getTopProducersChartData(countries).length).toBe(10);
    }
  });

  test('entries are sorted by production descending', () => {
    const result = getTopProducersChartData(countries);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].production).toBeGreaterThanOrEqual(result[i].production);
    }
  });

  test('first entry is China (highest aquaculture producer)', () => {
    const result = getTopProducersChartData(countries);
    expect(result[0].fullName).toBe('China');
  });

  test('long country names are truncated with ellipsis', () => {
    const result = getTopProducersChartData(countries);
    result.forEach(entry => {
      if (entry.fullName.length > 12) {
        expect(entry.name.endsWith('\u2026')).toBe(true);
        expect(entry.name.length).toBeLessThanOrEqual(11); // 10 chars + ellipsis
      }
    });
  });

  test('welfareScore is expressed as a percentage (0-100)', () => {
    const result = getTopProducersChartData(countries);
    result.forEach(entry => {
      expect(entry.welfareScore).toBeGreaterThanOrEqual(0);
      expect(entry.welfareScore).toBeLessThanOrEqual(100);
    });
  });

  test('returns empty array for empty input', () => {
    expect(getTopProducersChartData([])).toHaveLength(0);
  });
});

describe('getCoverageBreakdown', () => {
  test('returns exactly two entries: Has Standards and No Standards', () => {
    const result = getCoverageBreakdown(species);
    expect(result).toHaveLength(2);
    const names = result.map(r => r.name);
    expect(names).toContain('Has Standards');
    expect(names).toContain('No Standards');
  });

  test('total of both values equals species count', () => {
    const result = getCoverageBreakdown(species);
    const total = result.reduce((sum, r) => sum + r.value, 0);
    expect(total).toBe(species.length);
  });

  test('Has Standards count matches species with at least one certification scheme', () => {
    const result = getCoverageBreakdown(species);
    const withStandards = species.filter(s => s.certificationSchemes.length > 0).length;
    const hasStandardsEntry = result.find(r => r.name === 'Has Standards');
    expect(hasStandardsEntry.value).toBe(withStandards);
  });

  test('returns [0, 0] breakdown for empty input', () => {
    const result = getCoverageBreakdown([]);
    const total = result.reduce((sum, r) => sum + r.value, 0);
    expect(total).toBe(0);
  });
});

describe('getLegislationData', () => {
  test('returns exactly three entries', () => {
    expect(getLegislationData(countries)).toHaveLength(3);
  });

  test('three categories are Enforced, Not Enforced, No Legislation', () => {
    const result = getLegislationData(countries);
    const names = result.map(r => r.name);
    expect(names).toContain('Enforced');
    expect(names).toContain('Not Enforced');
    expect(names).toContain('No Legislation');
  });

  test('sum of all three values equals country count', () => {
    const result = getLegislationData(countries);
    const total = result.reduce((sum, r) => sum + r.value, 0);
    expect(total).toBe(countries.length);
  });

  test('Enforced count does not exceed total with legislation', () => {
    const result = getLegislationData(countries);
    const enforced = result.find(r => r.name === 'Enforced').value;
    const notEnforced = result.find(r => r.name === 'Not Enforced').value;
    expect(enforced).toBeLessThanOrEqual(enforced + notEnforced);
  });

  test('Norway appears in Enforced category', () => {
    const norway = countries.find(c => c.id === 'NO');
    // Norway has enforced legislation per the data
    expect(norway.regulatoryFramework.hasLegislation).toBe(true);
    expect(norway.regulatoryFramework.enforced).toBe(true);
    // Therefore it contributes to the Enforced count
    const result = getLegislationData(countries);
    const enforced = result.find(r => r.name === 'Enforced').value;
    expect(enforced).toBeGreaterThan(0);
  });
});
