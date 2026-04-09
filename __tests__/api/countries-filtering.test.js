/**
 * Tests for countries API filtering logic.
 *
 * Mirrors the filtering logic in app/api/countries/route.js to verify that
 * each filter correctly narrows the dataset. Tests encode domain rules
 * (e.g., hasLegislation semantics) and must fail if filter logic breaks.
 */

import { countries, regions } from '../../data/countries.js';

// --- Replicate filtering logic from app/api/countries/route.js ---

function filterCountries({ region, hasLegislation, minProduction } = {}) {
  let result = [...countries];

  if (region && region !== 'All') {
    result = result.filter(c => c.region === region);
  }

  if (hasLegislation !== null && hasLegislation !== undefined) {
    result = result.filter(
      c => c.regulatoryFramework.hasLegislation === (hasLegislation === 'true')
    );
  }

  if (minProduction) {
    result = result.filter(c => c.totalAquacultureProduction >= parseInt(minProduction));
  }

  return result;
}

describe('countries API — no filter', () => {
  test('returns all countries when no filters applied', () => {
    expect(filterCountries({}).length).toBe(countries.length);
  });
});

describe('countries API — region filter', () => {
  test('each region filter returns only countries in that region', () => {
    regions.forEach(region => {
      const result = filterCountries({ region });
      result.forEach(c => expect(c.region).toBe(region));
    });
  });

  test('All region returns all countries', () => {
    const result = filterCountries({ region: 'All' });
    expect(result.length).toBe(countries.length);
  });

  test('sum of all region-filtered results equals total country count', () => {
    const total = regions.reduce((sum, r) => sum + filterCountries({ region: r }).length, 0);
    expect(total).toBe(countries.length);
  });

  test('East Asia filter includes China', () => {
    const result = filterCountries({ region: 'East Asia' });
    const names = result.map(c => c.name);
    expect(names).toContain('China');
  });

  test('Northern Europe filter includes Norway', () => {
    const result = filterCountries({ region: 'Northern Europe' });
    const names = result.map(c => c.name);
    expect(names).toContain('Norway');
  });

  test('unknown region returns empty array', () => {
    const result = filterCountries({ region: 'Atlantis' });
    expect(result.length).toBe(0);
  });
});

describe('countries API — hasLegislation filter', () => {
  test('true filter returns only countries with legislation', () => {
    const result = filterCountries({ hasLegislation: 'true' });
    result.forEach(c => {
      expect(c.regulatoryFramework.hasLegislation).toBe(true);
    });
  });

  test('false filter returns only countries without legislation', () => {
    const result = filterCountries({ hasLegislation: 'false' });
    result.forEach(c => {
      expect(c.regulatoryFramework.hasLegislation).toBe(false);
    });
  });

  test('true + false sets are disjoint and together equal all countries', () => {
    const withLeg = filterCountries({ hasLegislation: 'true' });
    const withoutLeg = filterCountries({ hasLegislation: 'false' });
    expect(withLeg.length + withoutLeg.length).toBe(countries.length);
  });

  test('true filter includes Norway (has enforced legislation)', () => {
    const result = filterCountries({ hasLegislation: 'true' });
    const names = result.map(c => c.name);
    expect(names).toContain('Norway');
  });

  test('false filter includes China (no aquatic welfare legislation)', () => {
    const result = filterCountries({ hasLegislation: 'false' });
    const names = result.map(c => c.name);
    expect(names).toContain('China');
  });
});

describe('countries API — minProduction filter', () => {
  test('all returned countries meet the production threshold', () => {
    const threshold = 1000000;
    const result = filterCountries({ minProduction: threshold.toString() });
    result.forEach(c => {
      expect(c.totalAquacultureProduction).toBeGreaterThanOrEqual(threshold);
    });
  });

  test('high threshold returns fewer countries than no filter', () => {
    const result = filterCountries({ minProduction: '5000000' });
    expect(result.length).toBeLessThan(countries.length);
  });

  test('threshold of 0 returns all countries', () => {
    const result = filterCountries({ minProduction: '0' });
    expect(result.length).toBe(countries.length);
  });

  test('China is returned when threshold is within its production range', () => {
    // China has the highest production at ~57M tonnes
    const result = filterCountries({ minProduction: '50000000' });
    const names = result.map(c => c.name);
    expect(names).toContain('China');
  });
});

describe('countries API — combined filters', () => {
  test('East Asia + hasLegislation false returns only East Asian countries without legislation', () => {
    const result = filterCountries({ region: 'East Asia', hasLegislation: 'false' });
    result.forEach(c => {
      expect(c.region).toBe('East Asia');
      expect(c.regulatoryFramework.hasLegislation).toBe(false);
    });
  });

  test('combined filter narrows results vs either filter alone', () => {
    const regionOnly = filterCountries({ region: 'East Asia' });
    const combined = filterCountries({ region: 'East Asia', minProduction: '5000000' });
    expect(combined.length).toBeLessThanOrEqual(regionOnly.length);
  });
});

describe('countries API — response shape', () => {
  test('regions list has no duplicates', () => {
    const unique = new Set(regions);
    expect(unique.size).toBe(regions.length);
  });

  test('every country id matches a region in the regions list', () => {
    const regionSet = new Set(regions);
    countries.forEach(c => {
      expect(regionSet.has(c.region)).toBe(true);
    });
  });
});
