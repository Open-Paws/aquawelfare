/**
 * Smoke tests for WelfareCharts component.
 *
 * WelfareCharts displays pie and bar charts summarizing welfare coverage
 * across species and regions. These tests verify it mounts without errors
 * with typical props.
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelfareCharts from '../../components/WelfareCharts.jsx';

const mockSpeciesData = [
  {
    id: 'atlantic-salmon',
    commonName: 'Atlantic salmon',
    taxonomicGroup: 'Fish',
    annualProductionTonnes: 2800000,
    welfareStandardsCoverage: 0.3,
    sentienceScore: 0.85,
    certificationSchemes: ['ASC'],
  },
  {
    id: 'whiteleg-shrimp',
    commonName: 'Pacific whiteleg shrimp',
    taxonomicGroup: 'Crustacean',
    annualProductionTonnes: 5000000,
    welfareStandardsCoverage: 0.05,
    sentienceScore: 0.55,
    certificationSchemes: [],
  },
];

const mockCountriesData = [
  {
    id: 'china',
    name: 'China',
    region: 'East Asia',
    totalAquacultureProduction: 57470000,
    welfareScore: 0.2,
    certifiedProductionPercent: 5,
    regulatoryFramework: { hasLegislation: false, enforced: false },
  },
  {
    id: 'norway',
    name: 'Norway',
    region: 'Northern Europe',
    totalAquacultureProduction: 1400000,
    welfareScore: 0.75,
    certifiedProductionPercent: 60,
    regulatoryFramework: { hasLegislation: true, enforced: true },
  },
];

describe('WelfareCharts component', () => {
  test('renders without crashing with valid props', () => {
    const { container } = render(
      <WelfareCharts speciesData={mockSpeciesData} countriesData={mockCountriesData} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  test('renders without crashing with empty speciesData', () => {
    const { container } = render(
      <WelfareCharts speciesData={[]} countriesData={mockCountriesData} />
    );
    expect(container).toBeDefined();
  });

  test('renders without crashing with null props', () => {
    const { container } = render(
      <WelfareCharts speciesData={null} countriesData={null} />
    );
    expect(container).toBeDefined();
  });
});
