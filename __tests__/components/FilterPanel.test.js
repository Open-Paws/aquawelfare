/**
 * Tests for FilterPanel component.
 *
 * Verifies filter selects render, options are present, and onChange callbacks
 * fire with the correct arguments. These tests must fail if filter options or
 * their change handlers are broken.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterPanel from '../../components/FilterPanel.jsx';

const defaultFilters = {
  taxonomicGroup: 'All',
  region: 'All',
  productionSystem: 'All',
  priority: 'All',
};

describe('FilterPanel', () => {
  test('renders without crashing with default filters', () => {
    const { container } = render(
      <FilterPanel filters={defaultFilters} onFilterChange={() => {}} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  test('renders all four filter selects', () => {
    const { container } = render(
      <FilterPanel filters={defaultFilters} onFilterChange={() => {}} />
    );
    const selects = container.querySelectorAll('select');
    expect(selects.length).toBe(4);
  });

  test('species group select has Fish option', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={() => {}} />);
    const options = screen.getAllByRole('option');
    const fishOption = options.find(o => o.textContent === 'Fish');
    expect(fishOption).toBeDefined();
  });

  test('priority select has Critical option', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={() => {}} />);
    const options = screen.getAllByRole('option');
    const criticalOption = options.find(o => o.textContent === 'Critical');
    expect(criticalOption).toBeDefined();
  });

  test('priority select has all four priority levels', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={() => {}} />);
    const options = Array.from(screen.getAllByRole('option')).map(o => o.textContent);
    expect(options).toContain('Critical');
    expect(options).toContain('High');
    expect(options).toContain('Medium');
    expect(options).toContain('Low');
  });

  test('onFilterChange is called when species group changes', () => {
    const onChange = jest.fn();
    const { container } = render(
      <FilterPanel filters={defaultFilters} onFilterChange={onChange} />
    );
    const selects = container.querySelectorAll('select');
    fireEvent.change(selects[0], { target: { value: 'Fish' } });
    expect(onChange).toHaveBeenCalledWith('taxonomicGroup', 'Fish');
  });

  test('onFilterChange is called when priority changes', () => {
    const onChange = jest.fn();
    const { container } = render(
      <FilterPanel filters={defaultFilters} onFilterChange={onChange} />
    );
    const selects = container.querySelectorAll('select');
    // Priority is the 4th select (index 3)
    fireEvent.change(selects[3], { target: { value: 'Critical' } });
    expect(onChange).toHaveBeenCalledWith('priority', 'Critical');
  });
});
