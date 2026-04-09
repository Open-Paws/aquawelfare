/**
 * Tests for the production systems data file.
 *
 * Verifies structural integrity and domain rules for aquaculture production
 * system data. Every assertion encodes a domain constraint — tests must fail
 * the moment the data diverges from the schema.
 */

import { productionSystems } from '../../data/production-systems.js';

describe('production systems data', () => {
  test('productionSystems array is non-empty', () => {
    expect(productionSystems.length).toBeGreaterThan(0);
  });

  test('every system has a unique id', () => {
    const ids = productionSystems.map(s => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every system has required string fields', () => {
    productionSystems.forEach(sys => {
      expect(typeof sys.id).toBe('string');
      expect(sys.id.length).toBeGreaterThan(0);
      expect(typeof sys.name).toBe('string');
      expect(sys.name.length).toBeGreaterThan(0);
      expect(typeof sys.description).toBe('string');
    });
  });

  test('every system has a numeric globalSharePercent in [0, 100]', () => {
    productionSystems.forEach(sys => {
      expect(typeof sys.globalSharePercent).toBe('number');
      expect(sys.globalSharePercent).toBeGreaterThanOrEqual(0);
      expect(sys.globalSharePercent).toBeLessThanOrEqual(100);
    });
  });

  test('every system has speciesCompatible as a non-empty array', () => {
    productionSystems.forEach(sys => {
      expect(Array.isArray(sys.speciesCompatible)).toBe(true);
      expect(sys.speciesCompatible.length).toBeGreaterThan(0);
    });
  });

  test('every system has a welfareImplications object with positives and negatives arrays', () => {
    productionSystems.forEach(sys => {
      expect(sys.welfareImplications).toBeDefined();
      expect(Array.isArray(sys.welfareImplications.positives)).toBe(true);
      expect(Array.isArray(sys.welfareImplications.negatives)).toBe(true);
    });
  });

  test('overallWelfareScore is in the valid range [0, 1]', () => {
    productionSystems.forEach(sys => {
      expect(sys.welfareImplications.overallWelfareScore).toBeGreaterThanOrEqual(0);
      expect(sys.welfareImplications.overallWelfareScore).toBeLessThanOrEqual(1);
    });
  });

  test('every system has a prevalentRegions array with at least one entry', () => {
    productionSystems.forEach(sys => {
      expect(Array.isArray(sys.prevalentRegions)).toBe(true);
      expect(sys.prevalentRegions.length).toBeGreaterThan(0);
    });
  });

  test('Pond system is present and accounts for the largest global share', () => {
    const pond = productionSystems.find(s => s.id === 'pond');
    expect(pond).toBeDefined();
    const maxShare = Math.max(...productionSystems.map(s => s.globalSharePercent));
    expect(pond.globalSharePercent).toBe(maxShare);
  });

  test('names are unique across systems', () => {
    const names = productionSystems.map(s => s.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});
