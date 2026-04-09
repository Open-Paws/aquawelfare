/**
 * Tests for welfare gaps API filtering logic.
 *
 * Mirrors the filtering in app/api/welfare-gaps/route.js. Tests verify that
 * type switching between 'species' and 'countries', region filtering,
 * taxonomicGroup filtering, and priority filtering all work correctly.
 */

import {
  calculateAllGapScores,
  calculateCountryGapScores,
  getGapSummaryStats,
} from '../../lib/gap-scoring.js';

// --- Replicate filtering from app/api/welfare-gaps/route.js ---

function filterWelfareGaps({ type, taxonomicGroup, region, priority } = {}) {
  const resolvedType = type || 'species';
  let data;

  if (resolvedType === 'countries') {
    data = calculateCountryGapScores();
    if (region && region !== 'All') {
      data = data.filter(d => d.region === region);
    }
  } else {
    data = calculateAllGapScores();
    if (taxonomicGroup && taxonomicGroup !== 'All') {
      data = data.filter(d => d.taxonomicGroup === taxonomicGroup);
    }
  }

  if (priority && priority !== 'All') {
    data = data.filter(d => d.priorityLevel === priority);
  }

  return { total: data.length, stats: getGapSummaryStats(), data };
}

describe('welfare gaps API — type switching', () => {
  test('default type is species and returns species gap scores', () => {
    const result = filterWelfareGaps({});
    const allSpeciesScores = calculateAllGapScores();
    expect(result.total).toBe(allSpeciesScores.length);
  });

  test('type=countries returns country gap scores', () => {
    const result = filterWelfareGaps({ type: 'countries' });
    const allCountryScores = calculateCountryGapScores();
    expect(result.total).toBe(allCountryScores.length);
  });

  test('species type returns speciesId fields, not countryId fields', () => {
    const result = filterWelfareGaps({ type: 'species' });
    result.data.forEach(d => {
      expect(d).toHaveProperty('speciesId');
    });
  });

  test('countries type returns countryId fields', () => {
    const result = filterWelfareGaps({ type: 'countries' });
    result.data.forEach(d => {
      expect(d).toHaveProperty('countryId');
    });
  });

  test('stats object is present for both types', () => {
    const speciesResult = filterWelfareGaps({ type: 'species' });
    const countryResult = filterWelfareGaps({ type: 'countries' });
    expect(speciesResult.stats).toBeDefined();
    expect(countryResult.stats).toBeDefined();
  });
});

describe('welfare gaps API — taxonomicGroup filter (species type)', () => {
  test('Fish filter returns only Fish species gaps', () => {
    const result = filterWelfareGaps({ type: 'species', taxonomicGroup: 'Fish' });
    result.data.forEach(d => expect(d.taxonomicGroup).toBe('Fish'));
  });

  test('Crustacean filter returns at least one result', () => {
    const result = filterWelfareGaps({ type: 'species', taxonomicGroup: 'Crustacean' });
    expect(result.data.length).toBeGreaterThan(0);
  });

  test('All group returns all species gaps', () => {
    const all = filterWelfareGaps({ type: 'species', taxonomicGroup: 'All' });
    const unfiltered = filterWelfareGaps({ type: 'species' });
    expect(all.total).toBe(unfiltered.total);
  });

  test('taxonomicGroup filter has no effect on countries type', () => {
    const withFilter = filterWelfareGaps({ type: 'countries', taxonomicGroup: 'Fish' });
    const withoutFilter = filterWelfareGaps({ type: 'countries' });
    expect(withFilter.total).toBe(withoutFilter.total);
  });
});

describe('welfare gaps API — region filter (countries type)', () => {
  test('East Asia region filter returns only East Asia countries', () => {
    const result = filterWelfareGaps({ type: 'countries', region: 'East Asia' });
    result.data.forEach(d => expect(d.region).toBe('East Asia'));
  });

  test('All region returns all country gaps', () => {
    const all = filterWelfareGaps({ type: 'countries', region: 'All' });
    const unfiltered = filterWelfareGaps({ type: 'countries' });
    expect(all.total).toBe(unfiltered.total);
  });

  test('region filter has no effect on species type', () => {
    const withRegion = filterWelfareGaps({ type: 'species', region: 'East Asia' });
    const withoutRegion = filterWelfareGaps({ type: 'species' });
    expect(withRegion.total).toBe(withoutRegion.total);
  });
});

describe('welfare gaps API — priority filter', () => {
  test('priority filter applies to species type', () => {
    ['Critical', 'High', 'Medium', 'Low'].forEach(level => {
      const result = filterWelfareGaps({ type: 'species', priority: level });
      result.data.forEach(d => expect(d.priorityLevel).toBe(level));
    });
  });

  test('priority filter applies to countries type', () => {
    ['Critical', 'High', 'Medium', 'Low'].forEach(level => {
      const result = filterWelfareGaps({ type: 'countries', priority: level });
      result.data.forEach(d => expect(d.priorityLevel).toBe(level));
    });
  });

  test('All priority returns same count as no priority filter', () => {
    const allPriority = filterWelfareGaps({ type: 'species', priority: 'All' });
    const noPriority = filterWelfareGaps({ type: 'species' });
    expect(allPriority.total).toBe(noPriority.total);
  });
});

describe('welfare gaps API — combined filters', () => {
  test('Fish + Critical priority returns only Fish species with Critical priority', () => {
    const result = filterWelfareGaps({
      type: 'species',
      taxonomicGroup: 'Fish',
      priority: 'Critical',
    });
    result.data.forEach(d => {
      expect(d.taxonomicGroup).toBe('Fish');
      expect(d.priorityLevel).toBe('Critical');
    });
  });

  test('East Asia + Critical priority returns only Critical East Asia countries', () => {
    const result = filterWelfareGaps({
      type: 'countries',
      region: 'East Asia',
      priority: 'Critical',
    });
    result.data.forEach(d => {
      expect(d.region).toBe('East Asia');
      expect(d.priorityLevel).toBe('Critical');
    });
  });
});
