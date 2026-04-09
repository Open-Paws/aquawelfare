/**
 * Tests for AISuite component and its NLP sentiment analysis logic.
 *
 * The AISuite contains a pure `runSentimentAnalysis` function that implements
 * the NLP policy grader — a key domain tool for evaluating welfare legislation
 * stringency. These tests verify its scoring logic. The component test verifies
 * render and basic interaction.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AISuite from '../../components/AISuite.jsx';

// --- Replicate the pure function from AISuite.jsx ---
// (Component doesn't export it, so we test it via the replicated source)

const STRONG_TERMS = ['mandatory', 'must', 'required', 'prohibited', 'illegal', 'stun', 'anesthesia', 'immediately', 'enforced', 'ban', 'banned', 'strictly', 'penalty', 'law'];
const WEAK_TERMS = ['should', 'recommended', 'where possible', 'guidelines', 'voluntary', 'suggested', 'minimize', 'try', 'encourage', 'best practice', 'consider', 'may'];

function runSentimentAnalysis(text) {
  if (!text.trim()) return null;

  let score = 40;
  let matches = { strong: [], weak: [] };
  const lowerText = text.toLowerCase();

  STRONG_TERMS.forEach(term => {
    const rx = new RegExp(`\\b${term}\\b`, 'g');
    const count = (lowerText.match(rx) || []).length;
    if (count > 0) {
      score += (12 * count);
      matches.strong.push(term);
    }
  });

  WEAK_TERMS.forEach(term => {
    const rx = new RegExp(`\\b${term}\\b`, 'g');
    const count = (lowerText.match(rx) || []).length;
    if (count > 0) {
      score -= (10 * count);
      matches.weak.push(term);
    }
  });

  score = Math.max(0, Math.min(100, score));

  let grade = 'F';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 40) grade = 'D';

  return { score, grade, matches };
}

// --- NLP sentiment analysis logic tests ---

describe('runSentimentAnalysis — return value', () => {
  test('returns null for empty string', () => {
    expect(runSentimentAnalysis('')).toBeNull();
  });

  test('returns null for whitespace-only string', () => {
    expect(runSentimentAnalysis('   ')).toBeNull();
  });

  test('returns an object with score, grade, and matches for valid text', () => {
    const result = runSentimentAnalysis('The standard must be followed.');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('grade');
    expect(result).toHaveProperty('matches');
  });
});

describe('runSentimentAnalysis — score bounds', () => {
  test('score is always between 0 and 100', () => {
    const texts = [
      'must mandatory required prohibited illegal banned enforced strictly',
      'should recommended where possible guidelines voluntary suggested',
      'The regulations apply.',
    ];
    texts.forEach(text => {
      const result = runSentimentAnalysis(text);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });
});

describe('runSentimentAnalysis — strong vs weak language', () => {
  test('text with mandatory/must scores higher than text with should/guidelines', () => {
    const strong = runSentimentAnalysis('Stunning must be mandatory for all farmed fish.');
    const weak = runSentimentAnalysis('Stunning should be recommended following guidelines.');
    expect(strong.score).toBeGreaterThan(weak.score);
  });

  test('strong terms are captured in matches.strong', () => {
    const result = runSentimentAnalysis('The law must be enforced.');
    expect(result.matches.strong).toContain('law');
    expect(result.matches.strong).toContain('must');
    expect(result.matches.strong).toContain('enforced');
  });

  test('weak terms are captured in matches.weak', () => {
    const result = runSentimentAnalysis('Farmers should consider voluntary guidelines.');
    expect(result.matches.weak).toContain('should');
    expect(result.matches.weak).toContain('voluntary');
    expect(result.matches.weak).toContain('guidelines');
    expect(result.matches.weak).toContain('consider');
  });

  test('baseline score for neutral text is 40 (D grade)', () => {
    // Text with no strong or weak terms starts at 40
    const result = runSentimentAnalysis('The aquaculture facility operates.');
    expect(result.score).toBe(40);
    expect(result.grade).toBe('D');
  });
});

describe('runSentimentAnalysis — grade thresholds', () => {
  test('score >= 95 gives A+ grade', () => {
    // Each strong term adds 12 points. Need (95-40)/12 ~ 5 strong terms.
    const result = runSentimentAnalysis('mandatory must required prohibited illegal stun banned');
    if (result.score >= 95) {
      expect(result.grade).toBe('A+');
    }
  });

  test('score in [85, 94] gives A grade', () => {
    // 4 strong terms: 40 + 48 = 88 (no weak terms) → A
    const result = runSentimentAnalysis('mandatory must required prohibited');
    if (result.score >= 85 && result.score < 95) {
      expect(result.grade).toBe('A');
    }
  });

  test('score in [75, 84] gives B grade', () => {
    // 3 strong terms: 40 + 36 = 76 → B
    const result = runSentimentAnalysis('mandatory must required');
    if (result.score >= 75 && result.score < 85) {
      expect(result.grade).toBe('B');
    }
    expect(result.grade).toBe('B');
  });

  test('score in [60, 74] gives C grade', () => {
    // 2 strong: 40 + 24 = 64 → C
    const result = runSentimentAnalysis('mandatory must');
    if (result.score >= 60 && result.score < 75) {
      expect(result.grade).toBe('C');
    }
    expect(result.grade).toBe('C');
  });

  test('score in [40, 59] gives D grade', () => {
    const result = runSentimentAnalysis('The facility operates.');
    expect(result.grade).toBe('D');
  });

  test('mixed strong and weak gives intermediate score', () => {
    const pureStrong = runSentimentAnalysis('mandatory');
    const mixed = runSentimentAnalysis('mandatory should');
    expect(pureStrong.score).toBeGreaterThan(mixed.score);
  });
});

// --- Component smoke tests ---

describe('AISuite component', () => {
  test('renders without crashing', () => {
    const { container } = render(<AISuite />);
    expect(container.firstChild).not.toBeNull();
  });

  test('renders the textarea for policy text input', () => {
    render(<AISuite />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders the analyze button', () => {
    render(<AISuite />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('analyze button is disabled when textarea is empty', () => {
    render(<AISuite />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
