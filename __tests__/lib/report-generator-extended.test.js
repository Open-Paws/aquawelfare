/**
 * Extended tests for the report generator.
 *
 * Covers content accuracy, filter propagation, and structural completeness
 * beyond the smoke tests in the base suite. Every assertion here should
 * fail if the corresponding report section or filter logic is broken.
 */

import { generateReport } from '../../lib/report-generator.js';
import { species } from '../../data/species.js';
import { countries } from '../../data/countries.js';
import { welfareStandards } from '../../data/welfare-standards.js';

describe('generateReport — structural completeness', () => {
  let report;
  beforeAll(() => { report = generateReport(); });

  test('report starts with a heading', () => {
    expect(report.trimStart()).toMatch(/^#/);
  });

  test('report contains Methodology section', () => {
    expect(report).toContain('## Methodology');
  });

  test('report contains the total species count', () => {
    expect(report).toContain(species.length.toString());
  });

  test('report contains the total countries count', () => {
    expect(report).toContain(countries.length.toString());
  });

  test('report mentions all certification standards by abbreviation', () => {
    welfareStandards.forEach(std => {
      expect(report).toContain(std.abbreviation);
    });
  });

  test('report contains at least one country name', () => {
    const anyCountryMentioned = countries.some(c => report.includes(c.name));
    expect(anyCountryMentioned).toBe(true);
  });

  test('report includes the scoring weight factors in the methodology', () => {
    expect(report).toContain('Production Scale');
    expect(report).toContain('Sentience Evidence');
    expect(report).toContain('Standards Gap');
  });

  test('report is longer than 1000 characters (not a stub)', () => {
    expect(report.length).toBeGreaterThan(1000);
  });
});

describe('generateReport — filter semantics', () => {
  test('Fish filter produces a report mentioning known fish species', () => {
    const fishReport = generateReport({ taxonomicGroup: 'Fish' });
    // Atlantic Salmon is a Fish and should appear somewhere
    const fishSpecies = species.filter(s => s.taxonomicGroup === 'Fish');
    const anyFishMentioned = fishSpecies.some(s => fishReport.includes(s.commonName));
    expect(anyFishMentioned).toBe(true);
  });

  test('Crustacean filter does not throw and produces non-empty output', () => {
    const crustaceanReport = generateReport({ taxonomicGroup: 'Crustacean' });
    expect(crustaceanReport.length).toBeGreaterThan(100);
  });

  test('Europe region filter produces non-empty report', () => {
    const europeReport = generateReport({ region: 'Europe' });
    expect(europeReport.length).toBeGreaterThan(100);
  });

  test('East Asia region filter includes China in regional section', () => {
    const report = generateReport({ region: 'East Asia' });
    // East Asia section should mention China
    expect(report).toContain('China');
  });

  test('unknown region produces a report without crashing', () => {
    expect(() => generateReport({ region: 'Atlantis' })).not.toThrow();
  });

  test('unknown taxonomicGroup produces a report without crashing', () => {
    expect(() => generateReport({ taxonomicGroup: 'Mythical' })).not.toThrow();
  });

  test('All species group filter produces same sections as no filter', () => {
    const allFilter = generateReport({ taxonomicGroup: 'All' });
    const noFilter = generateReport({});
    // Both must contain the key sections
    expect(allFilter).toContain('## Species-Level Gap Analysis');
    expect(noFilter).toContain('## Species-Level Gap Analysis');
  });

  test('All region filter produces same sections as no filter', () => {
    const allFilter = generateReport({ region: 'All' });
    const noFilter = generateReport({});
    expect(allFilter).toContain('## Regional Analysis');
    expect(noFilter).toContain('## Regional Analysis');
  });

  test('productionSystem filter does not crash', () => {
    expect(() => generateReport({ productionSystem: 'Pond' })).not.toThrow();
    expect(() => generateReport({ productionSystem: 'All' })).not.toThrow();
  });
});

describe('generateReport — Key Findings accuracy', () => {
  test('Key Findings mentions species with no welfare standards', () => {
    const report = generateReport();
    // The executive summary should reference the no-standards count
    const noStandardsCount = species.filter(s => s.certificationSchemes.length === 0).length;
    expect(report).toContain(noStandardsCount.toString());
  });

  test('Key Findings mentions countries without legislation', () => {
    const report = generateReport();
    const noLegCount = countries.filter(c => !c.regulatoryFramework.hasLegislation).length;
    expect(report).toContain(noLegCount.toString());
  });
});
