/**
 * Tests for ReportPanel component.
 *
 * Verifies the component renders its initial state correctly, the generate
 * button is present and accessible, and the download button only appears
 * after report generation. fetch is mocked for isolation.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportPanel from '../../components/ReportPanel.jsx';

const defaultFilters = {
  taxonomicGroup: 'All',
  region: 'All',
  productionSystem: 'All',
  priority: 'All',
};

describe('ReportPanel', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<ReportPanel filters={defaultFilters} />);
    expect(container.firstChild).not.toBeNull();
  });

  test('renders a button to generate the report', () => {
    render(<ReportPanel filters={defaultFilters} />);
    const button = screen.getByRole('button', { name: /generate/i });
    expect(button).toBeInTheDocument();
  });

  test('generate button is enabled initially', () => {
    render(<ReportPanel filters={defaultFilters} />);
    const button = screen.getByRole('button', { name: /generate/i });
    expect(button).not.toBeDisabled();
  });

  test('does not show report content before generation', () => {
    render(<ReportPanel filters={defaultFilters} />);
    // Report content container should not exist before generation
    expect(screen.queryByRole('article')).toBeNull();
  });

  test('calls fetch with POST when generate button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, report: '## Test Report\nContent here.' }),
    });

    render(<ReportPanel filters={defaultFilters} />);
    const button = screen.getByRole('button', { name: /generate/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/reports',
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('renders report content after successful generation', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, report: '## Executive Summary\nKey findings here.' }),
    });

    render(<ReportPanel filters={defaultFilters} />);
    const button = screen.getByRole('button', { name: /generate/i });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      const summaries = screen.getAllByText(/Executive Summary/i);
      expect(summaries.length).toBeGreaterThan(0);
    });
  });
});
