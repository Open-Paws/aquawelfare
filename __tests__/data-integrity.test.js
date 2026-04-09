/**
 * Data integrity tests — verify that the static data files satisfy the
 * structural contracts that the rest of the application relies on.
 *
 * These tests encode domain rules: every species must have a sentience score,
 * every country must have a welfare score, all IDs must be unique, etc.
 * A test here should fail the moment the data diverges from the schema.
 */

import { species, getTaxonomicGroups, getTotalProduction } from '../data/species.js';
import { countries, regions } from '../data/countries.js';
import { welfareStandards } from '../data/welfare-standards.js';

// --- Species data ---

describe('species data', () => {
  test('species array is non-empty', () => {
    expect(species.length).toBeGreaterThan(0);
  });

  test('every species has a unique id', () => {
    const ids = species.map(s => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every species has required fields', () => {
    species.forEach(s => {
      expect(typeof s.id).toBe('string');
      expect(typeof s.commonName).toBe('string');
      expect(typeof s.scientificName).toBe('string');
      expect(typeof s.taxonomicGroup).toBe('string');
      expect(typeof s.annualProductionTonnes).toBe('number');
    });
  });

  test('sentience scores are in the valid range [0, 1]', () => {
    species.forEach(s => {
      expect(s.sentienceScore).toBeGreaterThanOrEqual(0);
      expect(s.sentienceScore).toBeLessThanOrEqual(1);
    });
  });

  test('welfare standards coverage is in the valid range [0, 1]', () => {
    species.forEach(s => {
      expect(s.welfareStandardsCoverage).toBeGreaterThanOrEqual(0);
      expect(s.welfareStandardsCoverage).toBeLessThanOrEqual(1);
    });
  });

  test('annual production is a positive number', () => {
    species.forEach(s => {
      expect(s.annualProductionTonnes).toBeGreaterThan(0);
    });
  });

  test('every species names at least one top producer', () => {
    species.forEach(s => {
      expect(Array.isArray(s.topProducers)).toBe(true);
      expect(s.topProducers.length).toBeGreaterThan(0);
    });
  });

  test('getTaxonomicGroups returns known groups without duplicates', () => {
    const groups = getTaxonomicGroups();
    const unique = new Set(groups);
    expect(unique.size).toBe(groups.length);
    expect(groups.length).toBeGreaterThan(0);
  });

  test('getTotalProduction equals the sum of all species production', () => {
    const expected = species.reduce((sum, s) => sum + s.annualProductionTonnes, 0);
    expect(getTotalProduction()).toBe(expected);
  });
});

// --- Countries data ---

describe('countries data', () => {
  test('countries array is non-empty', () => {
    expect(countries.length).toBeGreaterThan(0);
  });

  test('every country has a unique id', () => {
    const ids = countries.map(c => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every country has required fields', () => {
    countries.forEach(c => {
      expect(typeof c.id).toBe('string');
      expect(typeof c.name).toBe('string');
      expect(typeof c.region).toBe('string');
      expect(typeof c.totalAquacultureProduction).toBe('number');
      expect(c).toHaveProperty('regulatoryFramework');
      expect(typeof c.regulatoryFramework.hasLegislation).toBe('boolean');
      expect(typeof c.regulatoryFramework.enforced).toBe('boolean');
    });
  });

  test('welfareScore is in the valid range [0, 1]', () => {
    countries.forEach(c => {
      expect(c.welfareScore).toBeGreaterThanOrEqual(0);
      expect(c.welfareScore).toBeLessThanOrEqual(1);
    });
  });

  test('certifiedProductionPercent is in the valid range [0, 100]', () => {
    countries.forEach(c => {
      expect(c.certifiedProductionPercent).toBeGreaterThanOrEqual(0);
      expect(c.certifiedProductionPercent).toBeLessThanOrEqual(100);
    });
  });

  test('enforced legislation implies legislation exists', () => {
    countries.forEach(c => {
      if (c.regulatoryFramework.enforced) {
        expect(c.regulatoryFramework.hasLegislation).toBe(true);
      }
    });
  });

  test('regions list is non-empty and contains no duplicates', () => {
    const unique = new Set(regions);
    expect(unique.size).toBe(regions.length);
    expect(regions.length).toBeGreaterThan(0);
  });

  test('every country region is in the regions list', () => {
    const regionSet = new Set(regions);
    countries.forEach(c => {
      expect(regionSet).toContain(c.region);
    });
  });
});

// --- Welfare standards data ---

describe('welfare standards data', () => {
  test('welfareStandards array is non-empty', () => {
    expect(welfareStandards.length).toBeGreaterThan(0);
  });

  test('every standard has a unique id', () => {
    const ids = welfareStandards.map(s => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every standard has required fields', () => {
    welfareStandards.forEach(s => {
      expect(typeof s.id).toBe('string');
      expect(typeof s.name).toBe('string');
      expect(typeof s.abbreviation).toBe('string');
      expect(Array.isArray(s.speciesCovered)).toBe(true);
    });
  });

  test('overallStringencyScore is in the valid range [0, 1]', () => {
    welfareStandards.forEach(s => {
      expect(s.overallStringencyScore).toBeGreaterThanOrEqual(0);
      expect(s.overallStringencyScore).toBeLessThanOrEqual(1);
    });
  });

  test('welfareSpecificScore is in the valid range [0, 1]', () => {
    welfareStandards.forEach(s => {
      expect(s.welfareSpecificScore).toBeGreaterThanOrEqual(0);
      expect(s.welfareSpecificScore).toBeLessThanOrEqual(1);
    });
  });

  test('all welfare criteria stringency values are in range [0, 1]', () => {
    welfareStandards.forEach(std => {
      Object.values(std.welfareCriteria).forEach(criterion => {
        expect(criterion.stringency).toBeGreaterThanOrEqual(0);
        expect(criterion.stringency).toBeLessThanOrEqual(1);
      });
    });
  });
});
