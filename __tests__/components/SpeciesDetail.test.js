/**
 * Tests for SpeciesDetail component.
 *
 * Verifies the component renders correctly for a given species, handles
 * null species gracefully, and displays key domain data (species name,
 * scientific name, production figures, sentience score).
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpeciesDetail from '../../components/SpeciesDetail.jsx';

const mockSpecies = {
  id: 'atlantic-salmon',
  commonName: 'Atlantic Salmon',
  scientificName: 'Salmo salar',
  taxonomicGroup: 'Fish',
  image: '🐟',
  annualProductionTonnes: 2790000,
  annualIndividuals: '~600 million',
  sentienceScore: 0.92,
  welfareStandardsCoverage: 0.65,
  certificationSchemes: ['ASC', 'GlobalGAP', 'RSPCA Assured', 'BAP'],
  topProducers: ['Norway', 'Chile', 'United Kingdom'],
  keyWelfareConcerns: ['High stocking density', 'Sea lice infestations'],
  sentienceEvidence: 'Strong evidence of pain perception.',
};

const mockGapsData = {
  data: [
    {
      speciesId: 'atlantic-salmon',
      compositeScore: 0.72,
      priorityLevel: 'Critical',
      components: {
        productionScale: 0.05,
        sentienceEvidence: 0.92,
        standardsGap: 0.35,
        regulatoryGap: 0.4,
        interventionFeasibility: 0.85,
      },
    },
  ],
};

describe('SpeciesDetail', () => {
  test('renders nothing when species is null', () => {
    const { container } = render(<SpeciesDetail species={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when species is undefined', () => {
    const { container } = render(<SpeciesDetail />);
    expect(container.firstChild).toBeNull();
  });

  test('renders the species common name', () => {
    render(<SpeciesDetail species={mockSpecies} gapsData={mockGapsData} onClose={() => {}} />);
    expect(screen.getByText('Atlantic Salmon')).toBeInTheDocument();
  });

  test('renders the scientific name', () => {
    render(<SpeciesDetail species={mockSpecies} gapsData={mockGapsData} onClose={() => {}} />);
    expect(screen.getByText('Salmo salar')).toBeInTheDocument();
  });

  test('renders the taxonomic group badge', () => {
    render(<SpeciesDetail species={mockSpecies} gapsData={mockGapsData} onClose={() => {}} />);
    expect(screen.getByText('Fish')).toBeInTheDocument();
  });

  test('renders without gapsData (gap info is optional)', () => {
    render(<SpeciesDetail species={mockSpecies} onClose={() => {}} />);
    expect(screen.getByText('Atlantic Salmon')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<SpeciesDetail species={mockSpecies} gapsData={mockGapsData} onClose={onClose} />);
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('displays priority level when gap data is present', () => {
    render(<SpeciesDetail species={mockSpecies} gapsData={mockGapsData} onClose={() => {}} />);
    expect(screen.getByText(/Critical/)).toBeInTheDocument();
  });
});
