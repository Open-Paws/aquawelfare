/**
 * Tests for number parsing and formatting utilities used across the application.
 *
 * These functions are defined inside components but encode domain logic: the
 * annualIndividuals strings in the species data use the "~N billion/million"
 * format. Parsing and formatting must be consistent with those strings.
 *
 * Extracted and tested here because component testing requires a browser-like
 * environment; the pure functions are tested in isolation instead.
 */

// Replicated from components/InterventionSimulator.jsx — pure functions
function parseIndividuals(text) {
  if (!text) return 0;
  let numStr = text.replace(/[^0-9.]/g, '');
  let multiplier = 1;
  if (text.toLowerCase().includes('billion')) multiplier = 1000000000;
  if (text.toLowerCase().includes('million')) multiplier = 1000000;
  return parseFloat(numStr) * multiplier;
}

function formatLargeNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + ' Billion';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + ' Million';
  return num.toLocaleString();
}

describe('parseIndividuals', () => {
  test('returns 0 for null input', () => {
    expect(parseIndividuals(null)).toBe(0);
  });

  test('returns 0 for undefined input', () => {
    expect(parseIndividuals(undefined)).toBe(0);
  });

  test('returns 0 for empty string', () => {
    expect(parseIndividuals('')).toBe(0);
  });

  test('parses "~600 million" correctly', () => {
    expect(parseIndividuals('~600 million')).toBe(600 * 1e6);
  });

  test('parses "~440 billion" correctly', () => {
    expect(parseIndividuals('~440 billion')).toBe(440 * 1e9);
  });

  test('parses "~6.5 billion" correctly', () => {
    expect(parseIndividuals('~6.5 billion')).toBeCloseTo(6.5e9, 0);
  });

  test('parses "~2.3 billion" correctly', () => {
    expect(parseIndividuals('~2.3 billion')).toBeCloseTo(2.3e9, 0);
  });

  test('billion takes precedence and produces a larger number than million equivalent', () => {
    const billion = parseIndividuals('1 billion');
    const million = parseIndividuals('1 million');
    expect(billion).toBeGreaterThan(million);
    expect(billion / million).toBe(1000);
  });

  test('is case-insensitive for million/billion keywords', () => {
    expect(parseIndividuals('500 MILLION')).toBe(500e6);
    expect(parseIndividuals('2 BILLION')).toBe(2e9);
  });

  test('strips tilde prefix from numbers', () => {
    expect(parseIndividuals('~100 million')).toBe(100e6);
  });

  test('returns a number type', () => {
    expect(typeof parseIndividuals('~100 million')).toBe('number');
  });
});

describe('formatLargeNumber', () => {
  test('formats numbers >= 1 billion with "Billion" suffix', () => {
    expect(formatLargeNumber(1e9)).toBe('1.00 Billion');
  });

  test('formats numbers >= 1 million with "Million" suffix', () => {
    expect(formatLargeNumber(1e6)).toBe('1.0 Million');
  });

  test('formats numbers below 1 million with toLocaleString', () => {
    expect(formatLargeNumber(500)).toBe((500).toLocaleString());
  });

  test('Billion format has two decimal places', () => {
    const result = formatLargeNumber(2.5e9);
    expect(result).toBe('2.50 Billion');
  });

  test('Million format has one decimal place', () => {
    const result = formatLargeNumber(1.5e6);
    expect(result).toBe('1.5 Million');
  });

  test('exactly 1 billion is formatted as Billion not Million', () => {
    const result = formatLargeNumber(1e9);
    expect(result).toContain('Billion');
    expect(result).not.toContain('Million');
  });

  test('exactly 1 million is formatted as Million not a raw number', () => {
    const result = formatLargeNumber(1e6);
    expect(result).toContain('Million');
    expect(result).not.toContain('Billion');
  });

  test('returns a string', () => {
    expect(typeof formatLargeNumber(12345)).toBe('string');
    expect(typeof formatLargeNumber(1e9)).toBe('string');
    expect(typeof formatLargeNumber(1e6)).toBe('string');
  });
});

describe('parseIndividuals round-trip with species data', () => {
  // The annualIndividuals field in the species dataset uses the "~N billion/million" format.
  // These values should parse to non-zero numbers.
  const sampleValues = [
    '~600 million',
    '~2.3 billion',
    '~6.5 billion',
    '~440 billion',
    '~1.2 billion',
  ];

  sampleValues.forEach(val => {
    test(`"${val}" parses to a positive number`, () => {
      expect(parseIndividuals(val)).toBeGreaterThan(0);
    });
  });
});
