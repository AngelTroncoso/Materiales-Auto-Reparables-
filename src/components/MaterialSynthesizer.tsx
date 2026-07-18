import { useState } from 'react';
import type { MaterialRequest, MaterialSynthesis } from '../types';

export default function MaterialSynthesizer() {
  const [baseMaterial, setBaseMaterial] = useState('polímero epóxico');
  const [damageType, setDamageType] = useState('microfisuras');
  const [targetProperty, setTargetProperty] = useState('recuperación mecánica');
  const [result, setResult] = useState<MaterialSynthesis | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function synthesize() {
    setLoading(true); setError(''); setResult(null);
    const payload: MaterialRequest = { baseMaterial, damageType, targetProperty };
    try {
      const response = await fetch('/api/synthesize-material', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'No se pudo sintetizar el material.');
      setResult(data as MaterialSynthesis);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Error desconocido al sintetizar el material.');
    } finally { setLoading(false); }
  }

  return <section><h2>Sintetizador de materiales</h2><input aria-label="Material base" value={baseMaterial} onChange={(e) => setBaseMaterial(e.target.value)} /><input aria-label="Tipo de daño" value={damageType} onChange={(e) => setDamageType(e.target.value)} /><input aria-label="Propiedad objetivo" value={targetProperty} onChange={(e) => setTargetProperty(e.target.value)} /><button disabled={loading} onClick={synthesize}>{loading ? 'Sintetizando…' : 'Sintetizar'}</button>{error && <p role="alert">{error}</p>}{result && <article><h3>{result.name}</h3><p>{result.summary}</p><p>{result.repairMechanism}</p></article>}</section>;
}
