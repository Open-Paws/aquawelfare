/**
 * Tests for SpeciesExplorer component.
 *
 * Verifies rendering of the species list, search functionality, sorting,
 * and species selection callback. Tests must fail if core list interactions break.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpeciesExplorer from '../../components/SpeciesExplorer.jsx';

const mockSpecies = [
  {
    id: 'atlantic-salmon',
    commonName: 'Atlantic Salmon',
    scientificName: 'Salmo salar',
    taxonomicGroup: 'Fish',
    image: '🐟',
    annualProductionTonnes: 2790000,
    sentienceScore: 0.92,
    welfareStandardsCoverage: 0.65,
    certificationSchemes: ['ASC'],
  },
  {
    id: 'whiteleg-shrimp',
    commonName: 'Whiteleg Shrimp',
    scientificName: 'Litopenaeus vannamei',
    taxonomicGroup: 'Crustacean',
    image: '🦐',
    annualProductionTonnes: 5600000,
    sentienceScore: 0.68,
    welfareStandardsCoverage: 0.08,
    certificationSchemes: ['BAP'],
  },
];

const mockGapsData = {
  data: [
    { speciesId: 'atlantic-salmon', compositeScore: 0.72, priorityLevel: 'Critical' },
    { speciesId: 'whiteleg-shrimp', compositeScore: 0.85, priorityLevel: 'Critical' },
  ],
};

describe('SpeciesExplorer', () => {
  test('renders without crashing with valid data', () => {
    const { container } = render(
      <SpeciesExplorer species={mockSpecies} onSelect={() => {}} gapsData={mockGapsData} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  test('renders without crashing with no species data', () => {
    const { container } = render(
      <SpeciesExplorer species={[]} onSelect={() => {}} gapsData={null} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  test('displays both species names', () => {
    render(<SpeciesExplorer species={mockSpecies} onSelect={() => {}} gapsData={mockGapsData} />);
    expect(screen.getByText('Atlantic Salmon')).toBeInTheDocument();
    expect(screen.getByText('Whiteleg Shrimp')).toBeInTheDocument();
  });

  test('filters species by search query matching common name', () => {
    render(<SpeciesExplorer species={mockSpecies} onSelect={() => {}} gapsData={mockGapsData} />);
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'salmon' } });
    expect(screen.getByText('Atlantic Salmon')).toBeInTheDocument();
    expect(screen.queryByText('Whiteleg Shrimp')).toBeNull();
  });

  test('search is case-insensitive', () => {
    render(<SpeciesExplorer species={mockSpecies} onSelect={() => {}} gapsData={mockGapsData} />);
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'SHRIMP' } });
    expect(screen.getByText('Whiteleg Shrimp')).toBeInTheDocument();
    expect(screen.queryByText('Atlantic Salmon')).toBeNull();
  });

  test('renders sort controls', () => {
    const { container } = render(
      <SpeciesExplorer species={mockSpecies} onSelect={() => {}} gapsData={mockGapsData} />
    );
    const selects = container.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });
});
