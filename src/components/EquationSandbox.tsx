import { useMemo, useState } from 'react';
import type { EquationEvaluation, EquationTerm } from '../types';

/**
 * Parses a compact polynomial wave-function form such as `1x^2 + -0.5x^1`.
 * Invalid terms are ignored by design so the UI can report a clear warning
 * without crashing while a user is editing partial input.
 */
export function parseQuantumExpression(expression: string): EquationTerm[] {
  return expression.split('+').map((raw) => raw.trim()).map((term) => {
    const match = term.match(/^(-?\d+(?:\.\d+)?)x\^(-?\d+)$/);
    return match ? { symbol: 'x', coefficient: Number(match[1]), exponent: Number(match[2]) } : null;
  }).filter((term): term is EquationTerm => term !== null);
}

/**
 * Evaluates the normalized energy and probability density for the equation
 * terms at a supplied position. The result is clamped to finite values to
 * avoid NaN/Infinity leaking into charts or downstream material heuristics.
 */
export function evaluateQuantumEquation(expression: string, position = 1): EquationEvaluation {
  const terms = parseQuantumExpression(expression);
  const warnings: string[] = [];
  if (terms.length === 0) warnings.push('No se encontraron términos válidos con formato ax^n.');
  const amplitude = terms.reduce((sum, term) => sum + term.coefficient * position ** term.exponent, 0);
  const probabilityDensity = Number(Math.min(1, Math.max(0, amplitude ** 2 / 10)).toFixed(4));
  const normalizedEnergy = Number(Math.min(1, Math.abs(amplitude) / (terms.length || 1)).toFixed(4));
  return { expression, probabilityDensity, normalizedEnergy, stable: probabilityDensity < 0.85 && warnings.length === 0, warnings };
}

export default function EquationSandbox() {
  const [expression, setExpression] = useState('0.8x^2 + -0.3x^1');
  const evaluation = useMemo(() => evaluateQuantumEquation(expression), [expression]);
  return <section><h2>Sandbox de ecuaciones cuánticas</h2><input aria-label="Ecuación cuántica" value={expression} onChange={(event) => setExpression(event.target.value)} /><p>Densidad de probabilidad: {evaluation.probabilityDensity}</p><p>Estado: {evaluation.stable ? 'estable' : 'requiere revisión'}</p>{evaluation.warnings.map((warning) => <p role="alert" key={warning}>{warning}</p>)}</section>;
}
