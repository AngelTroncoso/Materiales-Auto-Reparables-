import cors from 'cors';
import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ApiErrorResponse, MaterialRequest, MaterialSynthesis } from './src/types';

const app = express();
app.use(cors());
app.use(express.json({ limit: '32kb' }));

const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS ?? 15_000);

function isMaterialRequest(body: unknown): body is MaterialRequest {
  const value = body as Partial<MaterialRequest>;
  return typeof value?.baseMaterial === 'string' && value.baseMaterial.trim().length > 1 && typeof value.damageType === 'string' && value.damageType.trim().length > 1 && typeof value.targetProperty === 'string' && value.targetProperty.trim().length > 1;
}

function sendError(response: Response, status: number, error: string, detail?: string, retryable = status >= 500) {
  const payload: ApiErrorResponse = { error, detail, retryable };
  response.status(status).json(payload);
}

async function withTimeout<T>(operation: Promise<T>, ms: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timer = new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error(`La síntesis superó el tiempo límite de ${ms} ms.`)), ms); });
  try { return await Promise.race([operation, timer]); } finally { if (timeout) clearTimeout(timeout); }
}

app.post('/api/synthesize-material', async (request: Request, response: Response) => {
  if (!isMaterialRequest(request.body)) return sendError(response, 400, 'Solicitud inválida: baseMaterial, damageType y targetProperty son obligatorios.', undefined, false);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return sendError(response, 503, 'La síntesis de materiales no está configurada: falta GEMINI_API_KEY.');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash' });
    const prompt = `Propón un material autoreparable en JSON con name, summary, repairMechanism, risks y confidence. Base: ${request.body.baseMaterial}. Daño: ${request.body.damageType}. Objetivo: ${request.body.targetProperty}.`;
    const result = await withTimeout(model.generateContent(prompt), timeoutMs);
    const text = result.response.text().replace(/^```json\s*|```$/g, '').trim();
    const synthesis = JSON.parse(text) as MaterialSynthesis;
    if (!synthesis.name || !synthesis.summary || !synthesis.repairMechanism) throw new Error('Gemini devolvió una respuesta incompleta.');
    response.json({ ...synthesis, risks: Array.isArray(synthesis.risks) ? synthesis.risks : [], confidence: Number.isFinite(synthesis.confidence) ? synthesis.confidence : 0.5 });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : 'Error desconocido.';
    const isTimeout = message.includes('tiempo límite');
    sendError(response, isTimeout ? 504 : 502, isTimeout ? 'La síntesis de materiales tardó demasiado. Intenta de nuevo con una solicitud más específica.' : 'No se pudo completar la síntesis de materiales con Gemini.', message);
  }
});

if (process.env.NODE_ENV !== 'test') app.listen(Number(process.env.PORT ?? 3001), () => console.log('API listening'));
export { app, isMaterialRequest, withTimeout };
