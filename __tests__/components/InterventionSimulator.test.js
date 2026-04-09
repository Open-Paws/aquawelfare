/**
 * Smoke tests for InterventionSimulator component.
 *
 * The simulator lets users toggle hypothetical welfare interventions and see
 * the projected impact on individuals affected. These tests verify it mounts
 * correctly with typical and edge-case prop values.
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import InterventionSimulator from '../../components/InterventionSimulator.jsx';

const mockSpeciesData = [
  {
    id: 'whiteleg-shrimp',
    commonName: 'Pacific whiteleg shrimp',
    scientificName: 'Litopenaeus vannamei',
    taxonomicGroup: 'Crustacean',
    annualProductionTonnes: 5000000,
    annualIndividuals: '~440 billion',
    sentienceScore: 0.55,
    welfareStandardsCoverage: 0.05,
    certificationSchemes: [],
    topProducers: ['China', 'India'],
    keyWelfareConcerns: ['Eyestalk ablation', 'High density crowding'],
    productionSystems: ['Intensive ponds'],
    sentienceEvidence: 'Some evidence of nociception.',
    researchCitations: [],
    dataYear: 2024,
    dataSource: 'FAO',
  },
];

const mockGapsData = {
  total: 1,
  stats: {},
  data: [
    {
      speciesId: 'whiteleg-shrimp',
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

describe('InterventionSimulator component', () => {
  test('renders without crashing with valid props', () => {
    const { container } = render(
      <InterventionSimulator speciesData={mockSpeciesData} gapsData={mockGapsData} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  test('renders without crashing with empty speciesData', () => {
    const { container } = render(
      <InterventionSimulator speciesData={[]} gapsData={mockGapsData} />
    );
    expect(container).toBeDefined();
  });

  test('renders without crashing with null props', () => {
    const { container } = render(
      <InterventionSimulator speciesData={null} gapsData={null} />
    );
    expect(container).toBeDefined();
  });
});
