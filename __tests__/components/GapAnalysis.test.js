/**
 * Smoke tests for GapAnalysis component.
 *
 * GapAnalysis renders a ranked list of species and countries by welfare gap
 * score with charts. These tests verify the component mounts without errors
 * under typical props.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GapAnalysis from '../../components/GapAnalysis.jsx';

const mockGapsData = {
  total: 2,
  stats: {
    totalSpeciesTracked: 2,
    totalCountriesTracked: 2,
    criticalPrioritySpecies: 1,
    highPrioritySpecies: 1,
    speciesWithNoStandards: 1,
    countriesWithNoLegislation: 1,
    percentProductionUncovered: 60,
    averageGapScore: 0.65,
  },
  data: [
    {
      speciesId: 's1',
      speciesName: 'Atlantic salmon',
      taxonomicGroup: 'Fish',
      compositeScore: 0.82,
      priorityLevel: 'Critical',
      components: { productionScale: 0.8, sentienceEvidence: 0.9, standardsGap: 0.7, regulatoryGap: 0.8, interventionFeasibility: 0.75 },
      annualProduction: 2800000,
      annualIndividuals: '~440 million',
      welfareStandardsCoverage: 0.3,
      existingSchemes: ['ASC'],
      topProducers: ['Norway', 'Chile'],
    },
    {
      speciesId: 's2',
      speciesName: 'Pacific whiteleg shrimp',
      taxonomicGroup: 'Crustacean',
      compositeScore: 0.55,
      priorityLevel: 'High',
      components: { productionScale: 0.6, sentienceEvidence: 0.5, standardsGap: 0.9, regulatoryGap: 0.7, interventionFeasibility: 0.4 },
      annualProduction: 5000000,
      annualIndividuals: '~440 billion',
      welfareStandardsCoverage: 0.05,
      existingSchemes: [],
      topProducers: ['China', 'India'],
    },
  ],
};

describe('GapAnalysis component', () => {
  test('renders without crashing with valid props', () => {
    const { container } = render(<GapAnalysis gapsData={mockGapsData} />);
    expect(container.firstChild).not.toBeNull();
  });

  test('renders without crashing with null gapsData', () => {
    const { container } = render(<GapAnalysis gapsData={null} />);
    expect(container).toBeDefined();
  });

  test('renders without crashing with undefined gapsData', () => {
    const { container } = render(<GapAnalysis />);
    expect(container).toBeDefined();
  });
});
