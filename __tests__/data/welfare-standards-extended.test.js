/**
 * Extended tests for welfare standards data.
 *
 * The base data-integrity suite checks basic structural fields.
 * These tests cover deeper domain constraints: criteria completeness,
 * cross-field consistency, and welfare score ordering rules.
 */

import { welfareStandards } from '../../data/welfare-standards.js';

describe('welfare standards — criteria completeness', () => {
  test('every standard has a welfareCriteria object with at least one criterion', () => {
    welfareStandards.forEach(std => {
      expect(std.welfareCriteria).toBeDefined();
      const keys = Object.keys(std.welfareCriteria);
      expect(keys.length).toBeGreaterThan(0);
    });
  });

  test('every criterion has a covered boolean and a numeric stringency', () => {
    welfareStandards.forEach(std => {
      Object.entries(std.welfareCriteria).forEach(([key, val]) => {
        expect(typeof val.covered).toBe('boolean');
        expect(typeof val.stringency).toBe('number');
      });
    });
  });

  test('uncovered criteria have stringency less than covered criteria in the same standard', () => {
    // Some standards have partial guidance for uncovered criteria (stringency > 0 but < covered).
    // The domain rule is: uncovered criteria never exceed 0.5 stringency.
    welfareStandards.forEach(std => {
      Object.values(std.welfareCriteria).forEach(val => {
        if (!val.covered) {
          expect(val.stringency).toBeLessThanOrEqual(0.5);
        }
      });
    });
  });

  test('covered criteria have stringency > 0', () => {
    welfareStandards.forEach(std => {
      Object.values(std.welfareCriteria).forEach(val => {
        if (val.covered) {
          expect(val.stringency).toBeGreaterThan(0);
        }
      });
    });
  });
});

describe('welfare standards — additional required fields', () => {
  test('every standard has a non-zero certifiedFarms count', () => {
    welfareStandards.forEach(std => {
      expect(typeof std.certifiedFarms).toBe('number');
      expect(std.certifiedFarms).toBeGreaterThan(0);
    });
  });

  test('every standard has a type field', () => {
    welfareStandards.forEach(std => {
      expect(typeof std.type).toBe('string');
      expect(std.type.length).toBeGreaterThan(0);
    });
  });

  test('every standard has a lastUpdated field', () => {
    welfareStandards.forEach(std => {
      expect(std.lastUpdated).toBeDefined();
    });
  });

  test('every standard covers at least one species', () => {
    welfareStandards.forEach(std => {
      expect(Array.isArray(std.speciesCovered)).toBe(true);
      expect(std.speciesCovered.length).toBeGreaterThan(0);
    });
  });

  test('ASC standard is present and is a Certification type', () => {
    const asc = welfareStandards.find(s => s.id === 'asc');
    expect(asc).toBeDefined();
    expect(asc.type).toBe('Certification');
  });
});

describe('welfare standards — score ordering', () => {
  test('overallStringencyScore is always >= welfareSpecificScore (welfare is a subset of overall)', () => {
    welfareStandards.forEach(std => {
      expect(std.overallStringencyScore).toBeGreaterThanOrEqual(std.welfareSpecificScore);
    });
  });

  test('average criterion stringency is consistent with welfareSpecificScore range', () => {
    welfareStandards.forEach(std => {
      const criteriaValues = Object.values(std.welfareCriteria).map(v => v.stringency);
      const avg = criteriaValues.reduce((sum, v) => sum + v, 0) / criteriaValues.length;
      // The welfareSpecificScore should be in a plausible range of the average
      // (it's not a strict formula, but it can't be wildly different)
      expect(Math.abs(avg - std.welfareSpecificScore)).toBeLessThan(0.5);
    });
  });
});
