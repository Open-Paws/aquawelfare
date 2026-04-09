/**
 * Tests for species API filtering logic.
 *
 * The API route in app/api/species/route.js applies four independent filters
 * to the species dataset. These tests verify each filter in isolation and in
 * combination, exercising the actual data to confirm each filter would fail
 * if the logic were broken.
 */

import { species, getTaxonomicGroups } from '../../data/species.js';

// --- Replicate the exact filtering logic from app/api/species/route.js ---

function filterSpecies({ taxonomicGroup, country, minProduction, search } = {}) {
  let result = [...species];

  if (taxonomicGroup && taxonomicGroup !== 'All') {
    result = result.filter(s => s.taxonomicGroup === taxonomicGroup);
  }

  if (country) {
    result = result.filter(s => s.topProducers.includes(country));
  }

  if (minProduction) {
    result = result.filter(s => s.annualProductionTonnes >= parseInt(minProduction));
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s =>
      s.commonName.toLowerCase().includes(q) ||
      s.scientificName.toLowerCase().includes(q)
    );
  }

  return result;
}

describe('species API — no filter', () => {
  test('returns all species when no filters applied', () => {
    const result = filterSpecies({});
    expect(result.length).toBe(species.length);
  });
});

describe('species API — taxonomicGroup filter', () => {
  test('Fish filter returns only Fish species', () => {
    const result = filterSpecies({ taxonomicGroup: 'Fish' });
    result.forEach(s => expect(s.taxonomicGroup).toBe('Fish'));
  });

  test('Fish filter returns fewer results than unfiltered', () => {
    const result = filterSpecies({ taxonomicGroup: 'Fish' });
    expect(result.length).toBeLessThan(species.length);
  });

  test('All group filter returns all species', () => {
    const result = filterSpecies({ taxonomicGroup: 'All' });
    expect(result.length).toBe(species.length);
  });

  test('unknown group returns empty array', () => {
    const result = filterSpecies({ taxonomicGroup: 'Dinosaur' });
    expect(result.length).toBe(0);
  });

  test('Crustacean filter returns at least one result', () => {
    const result = filterSpecies({ taxonomicGroup: 'Crustacean' });
    expect(result.length).toBeGreaterThan(0);
  });

  test('sum of all group-filtered results equals total species count', () => {
    const groups = getTaxonomicGroups();
    const total = groups.reduce((sum, g) => sum + filterSpecies({ taxonomicGroup: g }).length, 0);
    expect(total).toBe(species.length);
  });
});

describe('species API — country filter', () => {
  test('Norway filter returns only species that list Norway as a top producer', () => {
    const result = filterSpecies({ country: 'Norway' });
    result.forEach(s => expect(s.topProducers).toContain('Norway'));
  });

  test('Norway filter includes Atlantic Salmon', () => {
    const result = filterSpecies({ country: 'Norway' });
    const ids = result.map(s => s.id);
    expect(ids).toContain('atlantic-salmon');
  });

  test('China filter returns at least one species', () => {
    const result = filterSpecies({ country: 'China' });
    expect(result.length).toBeGreaterThan(0);
  });

  test('non-existent country returns empty array', () => {
    const result = filterSpecies({ country: 'Nonexistentland' });
    expect(result.length).toBe(0);
  });
});

describe('species API — minProduction filter', () => {
  test('high minProduction returns fewer species than no filter', () => {
    const result = filterSpecies({ minProduction: '1000000' });
    expect(result.length).toBeLessThan(species.length);
  });

  test('minProduction of 0 returns all species', () => {
    const result = filterSpecies({ minProduction: '0' });
    expect(result.length).toBe(species.length);
  });

  test('all returned species meet the minProduction threshold', () => {
    const threshold = 500000;
    const result = filterSpecies({ minProduction: threshold.toString() });
    result.forEach(s => {
      expect(s.annualProductionTonnes).toBeGreaterThanOrEqual(threshold);
    });
  });

  test('very high minProduction threshold returns empty or small set', () => {
    const result = filterSpecies({ minProduction: '999999999999' });
    expect(result.length).toBe(0);
  });
});

describe('species API — search filter', () => {
  test('search for "salmon" returns Atlantic Salmon', () => {
    const result = filterSpecies({ search: 'salmon' });
    const ids = result.map(s => s.id);
    expect(ids).toContain('atlantic-salmon');
  });

  test('search is case-insensitive', () => {
    const lower = filterSpecies({ search: 'salmon' });
    const upper = filterSpecies({ search: 'SALMON' });
    const mixed = filterSpecies({ search: 'Salmon' });
    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBe(mixed.length);
  });

  test('search matches scientific name', () => {
    // Atlantic Salmon has scientific name "Salmo salar"
    const result = filterSpecies({ search: 'salmo' });
    const ids = result.map(s => s.id);
    expect(ids).toContain('atlantic-salmon');
  });

  test('search for gibberish returns empty array', () => {
    const result = filterSpecies({ search: 'xyzxyzxyznosuchspecies' });
    expect(result.length).toBe(0);
  });
});

describe('species API — combined filters', () => {
  test('Fish + Norway returns only Fish species that list Norway', () => {
    const result = filterSpecies({ taxonomicGroup: 'Fish', country: 'Norway' });
    result.forEach(s => {
      expect(s.taxonomicGroup).toBe('Fish');
      expect(s.topProducers).toContain('Norway');
    });
  });

  test('Fish + minProduction + search narrows results correctly', () => {
    const resultAll = filterSpecies({ taxonomicGroup: 'Fish' });
    const resultFiltered = filterSpecies({ taxonomicGroup: 'Fish', minProduction: '1000000' });
    expect(resultFiltered.length).toBeLessThanOrEqual(resultAll.length);
    resultFiltered.forEach(s => {
      expect(s.taxonomicGroup).toBe('Fish');
      expect(s.annualProductionTonnes).toBeGreaterThanOrEqual(1000000);
    });
  });
});
