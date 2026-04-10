/**
 * Tests for the welfare gap scoring algorithm.
 *
 * These tests cover the core domain logic: calculating welfare gap scores,
 * ranking intervention priorities, and summarising the global coverage picture.
 * Each test must fail if the behaviour it covers changes — this is the
 * primary quality gate for the gap-scoring module.
 */

import {
  calculateGapScore,
  calculateAllGapScores,
  calculateCountryGapScores,
  getGapSummaryStats,
  getTopInterventionTargets,
  getGapsByPriority,
} from '../lib/gap-scoring.js';

import { species } from '../data/species.js';
import { countries } from '../data/countries.js';

// --- calculateGapScore ---

describe('calculateGapScore', () => {
  const atlanticSalmon = species.find(s => s.id === 'atlantic-salmon');

  test('returns all expected fields', () => {
    const result = calculateGapScore(atlanticSalmon);
    expect(result).toHaveProperty('speciesId', 'atlantic-salmon');
    expect(result).toHaveProperty('speciesName', 'Atlantic Salmon');
    expect(result).toHaveProperty('compositeScore');
    expect(result).toHaveProperty('components');
    expect(result).toHaveProperty('priorityLevel');
    expect(result).toHaveProperty('annualProduction');
    expect(result).toHaveProperty('existingSchemes');
    expect(result).toHaveProperty('topProducers');
  });

  test('compositeScore is between 0 and 1', () => {
    species.forEach(s => {
      const result = calculateGapScore(s);
      expect(result.compositeScore).toBeGreaterThanOrEqual(0);
      expect(result.compositeScore).toBeLessThanOrEqual(1);
    });
  });

  test('all component scores are between 0 and 1', () => {
    species.forEach(s => {
      const { components } = calculateGapScore(s);
      Object.values(components).forEach(v => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
    });
  });

  test('priorityLevel is one of the defined categories', () => {
    const validLevels = new Set(['Critical', 'High', 'Medium', 'Low']);
    species.forEach(s => {
      const { priorityLevel } = calculateGapScore(s);
      expect(validLevels).toContain(priorityLevel);
    });
  });

  test('species with higher sentience score tends toward higher compositeScore when other factors equal', () => {
    // Construct two minimal species objects differing only in sentienceScore
    const base = {
      id: 'test-low',
      commonName: 'Test Low',
      taxonomicGroup: 'Fish',
      annualProductionTonnes: 100000,
      sentienceScore: 0.2,
      welfareStandardsCoverage: 0.5,
      topProducers: [],
      certificationSchemes: [],
      researchCitations: [],
    };
    const highSentience = { ...base, id: 'test-high', sentienceScore: 0.9 };

    const lowResult = calculateGapScore(base);
    const highResult = calculateGapScore(highSentience);
    expect(highResult.compositeScore).toBeGreaterThan(lowResult.compositeScore);
  });

  test('species with zero welfare coverage gets a higher standardsGap than one with full coverage', () => {
    const baseFish = species.find(s => s.taxonomicGroup === 'Fish');
    const zeroCoverage = { ...baseFish, welfareStandardsCoverage: 0 };
    const fullCoverage = { ...baseFish, welfareStandardsCoverage: 1 };

    const zeroResult = calculateGapScore(zeroCoverage);
    const fullResult = calculateGapScore(fullCoverage);
    expect(zeroResult.components.standardsGap).toBeGreaterThan(fullResult.components.standardsGap);
  });
});

// --- calculateAllGapScores ---

describe('calculateAllGapScores', () => {
  test('returns a score for every tracked species', () => {
    const scores = calculateAllGapScores();
    expect(scores).toHaveLength(species.length);
  });

  test('results are sorted by compositeScore descending', () => {
    const scores = calculateAllGapScores();
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1].compositeScore).toBeGreaterThanOrEqual(scores[i].compositeScore);
    }
  });
});

// --- calculateCountryGapScores ---

describe('calculateCountryGapScores', () => {
  test('returns a score for every tracked country', () => {
    const scores = calculateCountryGapScores();
    expect(scores).toHaveLength(countries.length);
  });

  test('all country gap scores are between 0 and 1', () => {
    const scores = calculateCountryGapScores();
    scores.forEach(({ gapScore }) => {
      expect(gapScore).toBeGreaterThanOrEqual(0);
      expect(gapScore).toBeLessThanOrEqual(1);
    });
  });

  test('countries without legislation have higher gapScore than those with enforced legislation, all else equal', () => {
    const scores = calculateCountryGapScores();
    const noLeg = scores.filter(s => !s.hasLegislation);
    const enforcedLeg = scores.filter(s => s.hasLegislation && s.enforced);

    if (noLeg.length > 0 && enforcedLeg.length > 0) {
      const avgNoLeg = noLeg.reduce((sum, s) => sum + s.gapScore, 0) / noLeg.length;
      const avgEnforced = enforcedLeg.reduce((sum, s) => sum + s.gapScore, 0) / enforcedLeg.length;
      expect(avgNoLeg).toBeGreaterThan(avgEnforced);
    }
  });
});

// --- getGapSummaryStats ---

describe('getGapSummaryStats', () => {
  let stats;
  beforeAll(() => { stats = getGapSummaryStats(); });

  test('tracks the correct number of species', () => {
    expect(stats.totalSpeciesTracked).toBe(species.length);
  });

  test('tracks the correct number of countries', () => {
    expect(stats.totalCountriesTracked).toBe(countries.length);
  });

  test('averageGapScore is within the valid range', () => {
    expect(stats.averageGapScore).toBeGreaterThan(0);
    expect(stats.averageGapScore).toBeLessThanOrEqual(1);
  });

  test('percentProductionUncovered is a valid percentage', () => {
    expect(stats.percentProductionUncovered).toBeGreaterThanOrEqual(0);
    expect(stats.percentProductionUncovered).toBeLessThanOrEqual(100);
  });

  test('countriesWithNoLegislation does not exceed total countries', () => {
    expect(stats.countriesWithNoLegislation).toBeLessThanOrEqual(stats.totalCountriesTracked);
  });

  test('criticalPrioritySpecies does not exceed total species', () => {
    expect(stats.criticalPrioritySpecies).toBeLessThanOrEqual(stats.totalSpeciesTracked);
  });
});

// --- getTopInterventionTargets ---

describe('getTopInterventionTargets', () => {
  test('returns exactly n targets when n is provided', () => {
    const targets = getTopInterventionTargets(5);
    expect(targets).toHaveLength(5);
  });

  test('defaults to 10 targets', () => {
    const targets = getTopInterventionTargets();
    expect(targets).toHaveLength(10);
  });

  test('targets are ranked highest-priority first', () => {
    const targets = getTopInterventionTargets(10);
    for (let i = 1; i < targets.length; i++) {
      expect(targets[i - 1].compositeScore).toBeGreaterThanOrEqual(targets[i].compositeScore);
    }
  });
});

// --- getGapsByPriority ---

describe('getGapsByPriority', () => {
  test('all returned gaps match the requested priority level', () => {
    ['Critical', 'High', 'Medium', 'Low'].forEach(level => {
      const gaps = getGapsByPriority(level);
      gaps.forEach(g => {
        expect(g.priorityLevel).toBe(level);
      });
    });
  });
});

// --- interventionFeasibility branch coverage ---

describe('calculateGapScore feasibility branches', () => {
  const baseSpecies = {
    id: 'test-base',
    commonName: 'Test Species',
    taxonomicGroup: 'Mollusc',
    annualProductionTonnes: 50000,
    sentienceScore: 0.5,
    welfareStandardsCoverage: 0.5,
    topProducers: [],
    certificationSchemes: [],
    researchCitations: [],
  };

  test('FEASIBILITY_CERT_BONUS: species with certificationSchemes has higher feasibility than one without', () => {
    const withCert = { ...baseSpecies, certificationSchemes: ['ASC'] };
    const withoutCert = { ...baseSpecies, certificationSchemes: [] };

    const withResult = calculateGapScore(withCert);
    const withoutResult = calculateGapScore(withoutCert);

    expect(withResult.components.interventionFeasibility).toBeGreaterThan(
      withoutResult.components.interventionFeasibility
    );
  });

  test('FEASIBILITY_CRUSTACEAN_BONUS: Crustacean has higher feasibility than Mollusc (same base)', () => {
    const crustacean = { ...baseSpecies, taxonomicGroup: 'Crustacean' };
    const mollusc = { ...baseSpecies, taxonomicGroup: 'Mollusc' };

    const crustaceanResult = calculateGapScore(crustacean);
    const molluscResult = calculateGapScore(mollusc);

    expect(crustaceanResult.components.interventionFeasibility).toBeGreaterThan(
      molluscResult.components.interventionFeasibility
    );
  });

  test('FEASIBILITY_SCALE_BONUS: species above scale threshold has higher feasibility than one below', () => {
    const aboveThreshold = { ...baseSpecies, annualProductionTonnes: 100001 };
    const belowThreshold = { ...baseSpecies, annualProductionTonnes: 100000 };

    const aboveResult = calculateGapScore(aboveThreshold);
    const belowResult = calculateGapScore(belowThreshold);

    expect(aboveResult.components.interventionFeasibility).toBeGreaterThan(
      belowResult.components.interventionFeasibility
    );
  });
});
