/**
 * Tests for StatsOverview component.
 *
 * Verifies that the component renders correctly with valid stats data and
 * handles missing data gracefully. Tests are smoke tests plus data binding
 * assertions that fail if the component stops rendering key values.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsOverview from '../../components/StatsOverview.jsx';

const sampleStats = {
  totalSpeciesTracked: 25,
  totalCountriesTracked: 40,
  speciesWithNoStandards: 15,
  countriesWithNoLegislation: 30,
  percentProductionUncovered: 72,
  criticalPrioritySpecies: 8,
};

describe('StatsOverview', () => {
  test('renders without crashing with valid stats', () => {
    const { container } = render(<StatsOverview stats={sampleStats} />);
    expect(container.firstChild).not.toBeNull();
  });

  test('renders null when stats prop is absent', () => {
    const { container } = render(<StatsOverview />);
    expect(container.firstChild).toBeNull();
  });

  test('renders null when stats prop is null', () => {
    const { container } = render(<StatsOverview stats={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('displays the total species count', () => {
    render(<StatsOverview stats={sampleStats} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  test('displays the total countries count', () => {
    render(<StatsOverview stats={sampleStats} />);
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  test('displays species with no standards count', () => {
    render(<StatsOverview stats={sampleStats} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('displays critical priority species count', () => {
    render(<StatsOverview stats={sampleStats} />);
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  test('displays the production uncovered percentage', () => {
    render(<StatsOverview stats={sampleStats} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  test('renders a stat card for each metric', () => {
    const { container } = render(<StatsOverview stats={sampleStats} />);
    const cards = container.querySelectorAll('.stat-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
