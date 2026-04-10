/**
 * Smoke tests for WorldMap component.
 *
 * WorldMap renders a Leaflet-based choropleth map of country welfare scores.
 * These tests verify it mounts without errors. Leaflet is mocked to avoid
 * browser canvas API requirements in jsdom.
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorldMap from '../../components/WorldMap.jsx';

// WorldMap fetches GeoJSON from the public directory — mock fetch for jsdom
let originalFetch;
beforeAll(() => {
  originalFetch = global.fetch;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ type: 'FeatureCollection', features: [] }),
    })
  );
});

afterAll(() => {
  global.fetch = originalFetch;
});

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

describe('WorldMap component', () => {
  test('renders without crashing with valid countries prop', () => {
    const { container } = render(<WorldMap countries={mockCountriesData} />);
    expect(container).toBeDefined();
  });

  test('renders without crashing with null countries prop', () => {
    const { container } = render(<WorldMap countries={null} />);
    expect(container).toBeDefined();
  });

  test('renders without crashing with empty countries array', () => {
    const { container } = render(<WorldMap countries={[]} />);
    expect(container).toBeDefined();
  });
});
