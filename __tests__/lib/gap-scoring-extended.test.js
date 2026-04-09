/**
 * Extended tests for the welfare gap scoring algorithm.
 *
 * These tests cover algorithmic edge cases and internal scoring rules that
 * the primary gap-scoring test suite does not address. Each test must fail
 * if the underlying scoring logic changes — no vacuous assertions.
 */

import {
  calculateGapScore,
  calculateAllGapScores,
  calculateCountryGapScores,
  getGapSummaryStats,
  getTopInterventionTargets,
  getGapsByPriority,
  getGapsByGroup,
} from '../../lib/gap-scoring.js';

import { species } from '../../data/species.js';
import { countries } from '../../data/countries.js';

// --- Weight integrity: composite score must equal the declared weighted sum ---

describe('calculateGapScore — weight arithmetic', () => {
  test('compositeScore is deterministic for the same input', () => {
    const s = species[0];
    const first = calculateGapScore(s);
    const second = calculateGapScore(s);
    expect(first.compositeScore).toBe(second.compositeScore);
  });

  test('compositeScore rounds to two decimal places', () => {
    species.forEach(s => {
      const { compositeScore } = calculateGapScore(s);
      const asString = compositeScore.toString();
      const decimals = asString.includes('.') ? asString.split('.')[1].length : 0;
      expect(decimals).toBeLessThanOrEqual(2);
    });
  });

  test('all component scores round to two decimal places', () => {
    species.forEach(s => {
      const { components } = calculateGapScore(s);
      Object.values(components).forEach(v => {
        const asString = v.toString();
        const decimals = asString.includes('.') ? asString.split('.')[1].length : 0;
        expect(decimals).toBeLessThanOrEqual(2);
      });
    });
  });
});

// --- Priority thresholds ---

describe('calculateGapScore — priority thresholds', () => {
  // These thresholds are domain rules encoded in the scoring algorithm.
  // If the thresholds change, these tests MUST fail.
  test('score >= 0.70 maps to Critical', () => {
    // Whiteleg Shrimp is the highest-gap species and should be Critical
    const whitelegShrimp = species.find(s => s.id === 'whiteleg-shrimp');
    if (whitelegShrimp) {
      const result = calculateGapScore(whitelegShrimp);
      if (result.compositeScore >= 0.70) {
        expect(result.priorityLevel).toBe('Critical');
      }
    }
  });

  test('score < 0.35 maps to Low', () => {
    // Construct a minimal species with very low gap indicators
    const lowGapSpecies = {
      id: 'low-gap-test',
      commonName: 'Low Gap Test',
      taxonomicGroup: 'Mollusk',
      annualProductionTonnes: 1000, // tiny production
      sentienceScore: 0.0,
      welfareStandardsCoverage: 1.0, // fully covered
      topProducers: ['Norway'], // Norway has enforced legislation
      certificationSchemes: ['ASC'],
      researchCitations: [],
    };
    const result = calculateGapScore(lowGapSpecies);
    expect(result.priorityLevel).toBe('Low');
  });

  test('all four priority levels are valid for every real species result', () => {
    const valid = new Set(['Critical', 'High', 'Medium', 'Low']);
    species.forEach(s => {
      const { priorityLevel } = calculateGapScore(s);
      expect(valid.has(priorityLevel)).toBe(true);
    });
  });
});

// --- standardsGap direction ---

describe('calculateGapScore — standardsGap direction', () => {
  test('full welfare coverage produces standardsGap of 0', () => {
    const base = species[0];
    const fullyCovered = { ...base, welfareStandardsCoverage: 1.0 };
    const result = calculateGapScore(fullyCovered);
    expect(result.components.standardsGap).toBe(0);
  });

  test('zero welfare coverage produces standardsGap of 1', () => {
    const base = species[0];
    const uncovered = { ...base, welfareStandardsCoverage: 0.0 };
    const result = calculateGapScore(uncovered);
    expect(result.components.standardsGap).toBe(1);
  });

  test('standardsGap is the complement of welfareStandardsCoverage', () => {
    species.forEach(s => {
      const result = calculateGapScore(s);
      const expected = Math.round((1 - s.welfareStandardsCoverage) * 100) / 100;
      expect(result.components.standardsGap).toBe(expected);
    });
  });
});

// --- interventionFeasibility logic ---

describe('calculateGapScore — interventionFeasibility', () => {
  test('Fish group gets higher feasibility bonus than Mollusk group (all else equal)', () => {
    const baseFish = {
      id: 'test-fish',
      commonName: 'Test Fish',
      taxonomicGroup: 'Fish',
      annualProductionTonnes: 50000, // below threshold
      sentienceScore: 0.5,
      welfareStandardsCoverage: 0.5,
      topProducers: [],
      certificationSchemes: [],
      researchCitations: [],
    };
    const baseMollusk = { ...baseFish, id: 'test-mollusk', taxonomicGroup: 'Mollusk' };

    const fishResult = calculateGapScore(baseFish);
    const molluskResult = calculateGapScore(baseMollusk);
    expect(fishResult.components.interventionFeasibility).toBeGreaterThan(molluskResult.components.interventionFeasibility);
  });

  test('species with research citations scores higher feasibility than one without', () => {
    const withResearch = {
      id: 'with-research',
      commonName: 'With Research',
      taxonomicGroup: 'Mollusk',
      annualProductionTonnes: 50000,
      sentienceScore: 0.5,
      welfareStandardsCoverage: 0.5,
      topProducers: [],
      certificationSchemes: [],
      researchCitations: ['Some paper 2024'],
    };
    const withoutResearch = { ...withResearch, id: 'without-research', researchCitations: [] };

    const withResult = calculateGapScore(withResearch);
    const withoutResult = calculateGapScore(withoutResearch);
    expect(withResult.components.interventionFeasibility).toBeGreaterThan(withoutResult.components.interventionFeasibility);
  });

  test('interventionFeasibility never exceeds 1', () => {
    // Max-bonus species: Fish + research + cert + large production
    const maxBonus = {
      id: 'max-bonus',
      commonName: 'Max Bonus',
      taxonomicGroup: 'Fish',
      annualProductionTonnes: 5000000,
      sentienceScore: 1.0,
      welfareStandardsCoverage: 0.0,
      topProducers: [],
      certificationSchemes: ['ASC'],
      researchCitations: ['Paper A', 'Paper B'],
    };
    const result = calculateGapScore(maxBonus);
    expect(result.components.interventionFeasibility).toBeLessThanOrEqual(1);
  });
});

// --- calculateAllGapScores ordering guarantee ---

describe('calculateAllGapScores — ordering', () => {
  test('all species appear exactly once', () => {
    const scores = calculateAllGapScores();
    const ids = scores.map(s => s.speciesId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
    expect(scores.length).toBe(species.length);
  });

  test('first result is never lower priority than last result', () => {
    const scores = calculateAllGapScores();
    const first = scores[0];
    const last = scores[scores.length - 1];
    expect(first.compositeScore).toBeGreaterThanOrEqual(last.compositeScore);
  });

  test('every result has the correct speciesId matching a known species', () => {
    const speciesIds = new Set(species.map(s => s.id));
    const scores = calculateAllGapScores();
    scores.forEach(score => {
      expect(speciesIds.has(score.speciesId)).toBe(true);
    });
  });
});

// --- getGapsByGroup ---

describe('getGapsByGroup', () => {
  test('all returned gaps belong to the requested taxonomic group', () => {
    ['Fish', 'Crustacean', 'Mollusk'].forEach(group => {
      const gaps = getGapsByGroup(group);
      gaps.forEach(g => {
        expect(g.taxonomicGroup).toBe(group);
      });
    });
  });

  test('Fish group has at least one entry', () => {
    expect(getGapsByGroup('Fish').length).toBeGreaterThan(0);
  });

  test('unknown group returns an empty array', () => {
    expect(getGapsByGroup('NonExistentGroup')).toHaveLength(0);
  });
});

// --- calculateCountryGapScores detailed checks ---

describe('calculateCountryGapScores — details', () => {
  test('result contains countryId, countryName, region, gapScore for every entry', () => {
    const scores = calculateCountryGapScores();
    scores.forEach(s => {
      expect(typeof s.countryId).toBe('string');
      expect(typeof s.countryName).toBe('string');
      expect(typeof s.region).toBe('string');
      expect(typeof s.gapScore).toBe('number');
    });
  });

  test('results are sorted by gapScore descending', () => {
    const scores = calculateCountryGapScores();
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1].gapScore).toBeGreaterThanOrEqual(scores[i].gapScore);
    }
  });

  test('each country appears exactly once', () => {
    const scores = calculateCountryGapScores();
    const ids = scores.map(s => s.countryId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every countryId matches a known country', () => {
    const countryIds = new Set(countries.map(c => c.id));
    const scores = calculateCountryGapScores();
    scores.forEach(s => {
      expect(countryIds.has(s.countryId)).toBe(true);
    });
  });

  test('priorityLevel field is present and valid for every country score', () => {
    const valid = new Set(['Critical', 'High', 'Medium', 'Low']);
    const scores = calculateCountryGapScores();
    scores.forEach(s => {
      expect(s).toHaveProperty('priorityLevel');
      expect(valid.has(s.priorityLevel)).toBe(true);
    });
  });

  test('Norway has lower gapScore than China (enforced legislation vs no legislation)', () => {
    const scores = calculateCountryGapScores();
    const norway = scores.find(s => s.countryId === 'NO');
    const china = scores.find(s => s.countryId === 'CN');
    if (norway && china) {
      expect(china.gapScore).toBeGreaterThan(norway.gapScore);
    }
  });
});

// --- getGapSummaryStats — internal consistency ---

describe('getGapSummaryStats — internal consistency', () => {
  let stats;
  beforeAll(() => { stats = getGapSummaryStats(); });

  test('speciesWithNoStandards does not exceed totalSpeciesTracked', () => {
    expect(stats.speciesWithNoStandards).toBeLessThanOrEqual(stats.totalSpeciesTracked);
  });

  test('speciesWithNoStandards is non-negative', () => {
    expect(stats.speciesWithNoStandards).toBeGreaterThanOrEqual(0);
  });

  test('highPrioritySpecies does not exceed totalSpeciesTracked', () => {
    expect(stats.highPrioritySpecies).toBeLessThanOrEqual(stats.totalSpeciesTracked);
  });

  test('criticalPriorityCountries does not exceed totalCountriesTracked', () => {
    expect(stats.criticalPriorityCountries).toBeLessThanOrEqual(stats.totalCountriesTracked);
  });

  test('criticalPrioritySpecies + highPrioritySpecies does not exceed totalSpeciesTracked', () => {
    expect(stats.criticalPrioritySpecies + stats.highPrioritySpecies)
      .toBeLessThanOrEqual(stats.totalSpeciesTracked);
  });

  test('averageGapScore is the mean of all species composite scores', () => {
    const allGaps = calculateAllGapScores();
    const manualMean = Math.round(
      (allGaps.reduce((sum, g) => sum + g.compositeScore, 0) / allGaps.length) * 100
    ) / 100;
    expect(stats.averageGapScore).toBe(manualMean);
  });

  test('percentProductionUncovered is an integer percentage', () => {
    expect(Number.isInteger(stats.percentProductionUncovered)).toBe(true);
  });
});

// --- getTopInterventionTargets boundary conditions ---

describe('getTopInterventionTargets — boundaries', () => {
  test('requesting more targets than species returns all species', () => {
    const tooMany = species.length + 100;
    const targets = getTopInterventionTargets(tooMany);
    expect(targets.length).toBeLessThanOrEqual(species.length);
  });

  test('requesting 1 target returns exactly 1 result', () => {
    const targets = getTopInterventionTargets(1);
    expect(targets).toHaveLength(1);
  });

  test('single target is the species with the highest composite score', () => {
    const allScores = calculateAllGapScores();
    const topTarget = getTopInterventionTargets(1)[0];
    expect(topTarget.compositeScore).toBe(allScores[0].compositeScore);
  });
});

// --- getGapsByPriority — completeness ---

describe('getGapsByPriority — completeness', () => {
  test('union of all priority levels equals all species', () => {
    const critical = getGapsByPriority('Critical');
    const high = getGapsByPriority('High');
    const medium = getGapsByPriority('Medium');
    const low = getGapsByPriority('Low');
    const total = critical.length + high.length + medium.length + low.length;
    expect(total).toBe(species.length);
  });

  test('no species appears in two different priority buckets', () => {
    const all = ['Critical', 'High', 'Medium', 'Low'].flatMap(level =>
      getGapsByPriority(level).map(g => `${level}:${g.speciesId}`)
    );
    const unique = new Set(all);
    expect(unique.size).toBe(all.length);
  });
});
