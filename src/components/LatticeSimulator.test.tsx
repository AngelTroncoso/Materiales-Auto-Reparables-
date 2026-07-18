import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LatticeSimulator, { createLattice, simulateLatticeRepair } from './LatticeSimulator';

describe('LatticeSimulator', () => {
  it('simulates damaged and repaired atoms deterministically', () => {
    const result = simulateLatticeRepair(createLattice(4), 0.7);
    expect(result.atoms).toHaveLength(16);
    expect(result.damagedCount).toBeGreaterThan(0);
    expect(result.repairedCount).toBeGreaterThanOrEqual(0);
    expect(result.averageEnergy).toBeGreaterThan(0);
  });

  it('renders core simulation metrics', () => {
    render(<LatticeSimulator />);
    expect(screen.getByText('Simulador de red atómica')).toBeInTheDocument();
    expect(screen.getByText(/Átomos dañados:/)).toBeInTheDocument();
  });
});
