/**
 * Tests for Sidebar navigation component.
 *
 * Verifies navigation items render, active tab highlighting, and tab
 * switching callback behavior.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../../components/Sidebar.jsx';

describe('Sidebar component', () => {
  const defaultProps = {
    activeTab: 'dashboard',
    setActiveTab: jest.fn(),
    isOpen: false,
    setIsOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<Sidebar {...defaultProps} />);
    expect(container.firstChild).not.toBeNull();
  });

  test('renders all navigation items', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Species Explorer')).toBeInTheDocument();
    expect(screen.getByText('Global Map')).toBeInTheDocument();
    expect(screen.getByText('Gap Analysis')).toBeInTheDocument();
    expect(screen.getByText('Simulator')).toBeInTheDocument();
    expect(screen.getByText('AI Suite')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  test('active nav item has active class', () => {
    const { container } = render(<Sidebar {...defaultProps} activeTab="species" />);
    const activeItems = container.querySelectorAll('.nav-item.active');
    expect(activeItems).toHaveLength(1);
  });

  test('clicking a nav item calls setActiveTab with correct id', () => {
    const setActiveTab = jest.fn();
    render(<Sidebar {...defaultProps} setActiveTab={setActiveTab} />);
    fireEvent.click(screen.getByText('Species Explorer'));
    expect(setActiveTab).toHaveBeenCalledWith('species');
  });

  test('clicking a nav item calls setIsOpen with false to close sidebar', () => {
    const setIsOpen = jest.fn();
    render(<Sidebar {...defaultProps} setIsOpen={setIsOpen} />);
    fireEvent.click(screen.getByText('Dashboard'));
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test('sidebar has open class when isOpen is true', () => {
    const { container } = render(<Sidebar {...defaultProps} isOpen={true} />);
    expect(container.querySelector('.sidebar')).toHaveClass('open');
  });

  test('sidebar does not have open class when isOpen is false', () => {
    const { container } = render(<Sidebar {...defaultProps} isOpen={false} />);
    expect(container.querySelector('.sidebar')).not.toHaveClass('open');
  });
});
