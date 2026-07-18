import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EquationSandbox, { evaluateQuantumEquation, parseQuantumExpression } from './EquationSandbox';

describe('EquationSandbox', () => {
  it('parses and evaluates valid polynomial quantum terms', () => {
    expect(parseQuantumExpression('1x^2 + -0.5x^1')).toEqual([{ symbol: 'x', coefficient: 1, exponent: 2 }, { symbol: 'x', coefficient: -0.5, exponent: 1 }]);
    const evaluation = evaluateQuantumEquation('1x^2 + -0.5x^1', 1);
    expect(evaluation.probabilityDensity).toBe(0.025);
    expect(evaluation.stable).toBe(true);
  });

  it('reports warnings for invalid expressions and renders the sandbox', () => {
    expect(evaluateQuantumEquation('foo').warnings).toHaveLength(1);
    render(<EquationSandbox />);
    expect(screen.getByText('Sandbox de ecuaciones cuánticas')).toBeInTheDocument();
    expect(screen.getByText(/Densidad de probabilidad:/)).toBeInTheDocument();
  });
});
