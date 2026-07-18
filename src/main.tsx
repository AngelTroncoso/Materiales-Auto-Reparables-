import React from 'react';
import { createRoot } from 'react-dom/client';
import LatticeSimulator from './components/LatticeSimulator';
import EquationSandbox from './components/EquationSandbox';
import MaterialSynthesizer from './components/MaterialSynthesizer';
import ScientificDocumentation from './components/ScientificDocumentation';

createRoot(document.getElementById('root')!).render(<React.StrictMode><LatticeSimulator /><EquationSandbox /><MaterialSynthesizer /><ScientificDocumentation /></React.StrictMode>);
