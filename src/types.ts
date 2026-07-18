export interface Atom { id: string; x: number; y: number; energy: number; damaged: boolean; repaired: boolean }
export interface LatticeSimulationResult { atoms: Atom[]; damagedCount: number; repairedCount: number; averageEnergy: number }
export interface EquationTerm { symbol: string; coefficient: number; exponent: number }
export interface EquationEvaluation { expression: string; probabilityDensity: number; normalizedEnergy: number; stable: boolean; warnings: string[] }
export interface MaterialRequest { baseMaterial: string; damageType: string; targetProperty: string; constraints?: string[] }
export interface MaterialSynthesis { name: string; summary: string; repairMechanism: string; risks: string[]; confidence: number }
export interface ApiErrorResponse { error: string; detail?: string; retryable: boolean }
