import { useMemo, useState } from 'react';
import type { Atom, LatticeSimulationResult } from '../types';

const DEFAULT_SIZE = 6;

/**
 * Builds a deterministic square atomic lattice with bounded energy values.
 * Determinism keeps visualization, tests, and repair metrics reproducible.
 */
export function createLattice(size = DEFAULT_SIZE): Atom[] {
  if (!Number.isInteger(size) || size < 2 || size > 40) throw new RangeError('Lattice size must be an integer from 2 to 40.');
  return Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    return { id: `${x}-${y}`, x, y, energy: Number((0.35 + ((x * 17 + y * 31) % 50) / 100).toFixed(2)), damaged: false, repaired: false };
  });
}

/**
 * Applies a damage pulse and local repair rule to every atom in the lattice.
 * Atoms above the damage threshold are marked damaged; damaged atoms with
 * enough neighboring healthy atoms are flagged as repaired and lose energy.
 */
export function simulateLatticeRepair(atoms: Atom[], damageThreshold = 0.7): LatticeSimulationResult {
  if (!atoms.length) throw new Error('Cannot simulate an empty lattice.');
  if (damageThreshold <= 0 || damageThreshold >= 1) throw new RangeError('Damage threshold must be between 0 and 1.');
  const byPosition = new Map(atoms.map((atom) => [`${atom.x},${atom.y}`, atom]));
  const next = atoms.map((atom) => {
    const damaged = atom.energy >= damageThreshold;
    const neighbors = [[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy]) => byPosition.get(`${atom.x + dx},${atom.y + dy}`)).filter(Boolean) as Atom[];
    const healthyNeighbors = neighbors.filter((neighbor) => neighbor.energy < damageThreshold).length;
    const repaired = damaged && healthyNeighbors >= 2;
    return { ...atom, damaged, repaired, energy: repaired ? Number((atom.energy * 0.82).toFixed(2)) : atom.energy };
  });
  return { atoms: next, damagedCount: next.filter((a) => a.damaged).length, repairedCount: next.filter((a) => a.repaired).length, averageEnergy: Number((next.reduce((sum, a) => sum + a.energy, 0) / next.length).toFixed(3)) };
}

export default function LatticeSimulator() {
  const [threshold, setThreshold] = useState(0.7);
  const result = useMemo(() => simulateLatticeRepair(createLattice(), threshold), [threshold]);
  return <section><h2>Simulador de red atómica</h2><label>Umbral de daño <input aria-label="Umbral de daño" type="number" min="0.1" max="0.95" step="0.05" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /></label><p>Átomos dañados: {result.damagedCount}</p><p>Átomos reparados: {result.repairedCount}</p><p>Energía media: {result.averageEnergy}</p></section>;
}
