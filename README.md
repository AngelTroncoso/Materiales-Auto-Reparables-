# Materiales Auto-Reparables

Repositorio para una aplicación científica orientada a la exploración, simulación y documentación de materiales auto-reparables.

> **Nota de mantenimiento:** en el estado actual del repositorio solo existe la estructura base de Git. Los archivos de aplicación mencionados en esta documentación (`server.ts`, `src/App.tsx` y los componentes de `src/components/`) todavía no están presentes en el árbol de trabajo. Esta guía describe la arquitectura objetivo esperada para el proyecto y debe mantenerse sincronizada cuando se incorporen esos módulos.

## Descripción general

La aplicación está diseñada como una experiencia web interactiva que combina:

- Simulación visual de estructuras tipo red cristalina o polimérica.
- Experimentación con ecuaciones y parámetros científicos.
- Síntesis asistida de materiales mediante un endpoint de servidor que consulta la API de Gemini.
- Documentación científica integrada para contextualizar los resultados.

## Arquitectura del proyecto

La arquitectura propuesta separa responsabilidades entre una capa de servidor ligera, una aplicación React principal y componentes especializados de dominio.

```text
.
├── server.ts
├── src/
│   ├── App.tsx
│   ├── types.ts
│   └── components/
│       ├── LatticeSimulator.tsx
│       ├── EquationSandbox.tsx
│       ├── MaterialSynthesizer.tsx
│       └── ScientificDocumentation.tsx
└── README.md
```

### `server.ts`

`server.ts` debe actuar como punto de entrada del backend. Su responsabilidad principal es exponer endpoints HTTP para operaciones que no deben ejecutarse directamente en el navegador, especialmente llamadas a servicios externos que requieren credenciales.

El endpoint que invoca la API de Gemini debe:

- Recibir desde el cliente los parámetros de síntesis o consulta científica.
- Validar que el cuerpo de la petición incluya los campos mínimos esperados.
- Leer la clave de Gemini desde variables de entorno, nunca desde código fuente versionado.
- Enviar la solicitud al proveedor externo.
- Normalizar la respuesta para que el frontend consuma una estructura estable.
- Responder con errores claros cuando falte configuración, la entrada sea inválida o Gemini devuelva un fallo.

### `src/App.tsx`

`src/App.tsx` debe ser el componente raíz de la interfaz. Coordina el estado global de la experiencia, decide qué componentes principales renderizar y define el flujo de datos entre ellos.

Sus responsabilidades esperadas son:

- Inicializar el estado compartido de simulaciones, parámetros y resultados.
- Componer los módulos principales de la aplicación.
- Pasar callbacks y datos tipados a los componentes de dominio.
- Mantener separada la lógica de presentación de la lógica de servidor.

### Componentes principales

#### `LatticeSimulator`

Componente encargado de visualizar o simular la estructura del material. Debe recibir parámetros físicos o estructurales desde `App.tsx` y emitir cambios cuando el usuario ajuste variables relevantes.

Ejemplos de responsabilidades:

- Renderizar una red, malla o representación molecular simplificada.
- Mostrar estados de daño y reparación.
- Comunicar métricas de simulación al resto de la aplicación.

#### `EquationSandbox`

Componente dedicado a la experimentación con ecuaciones, constantes y modelos matemáticos.

Ejemplos de responsabilidades:

- Permitir ajustar parámetros del modelo.
- Calcular resultados derivados de forma reproducible.
- Validar entradas numéricas antes de actualizar la simulación.

#### `MaterialSynthesizer`

Componente que conecta la interfaz con el backend para generar propuestas o análisis de materiales.

Flujo esperado:

1. El usuario introduce restricciones, propiedades deseadas o contexto experimental.
2. `MaterialSynthesizer` envía la solicitud al endpoint de `server.ts`.
3. El servidor llama a Gemini y devuelve una respuesta normalizada.
4. El componente muestra la propuesta y comunica resultados relevantes a `App.tsx`.

#### `ScientificDocumentation`

Componente orientado a presentar contenido explicativo, referencias y notas metodológicas.

Debe mantenerse desacoplado de llamadas externas siempre que sea posible; idealmente recibe contenido estructurado mediante props o importa documentación local versionada.

### Flujo de datos recomendado

```text
Usuario
  ↓
src/App.tsx
  ├── LatticeSimulator ← parámetros físicos y estado de simulación
  ├── EquationSandbox ← ecuaciones, constantes y callbacks de actualización
  ├── MaterialSynthesizer → server.ts → API de Gemini
  └── ScientificDocumentation ← contenido científico local o tipado
```

`App.tsx` debe funcionar como coordinador. Los componentes especializados deben mantenerse pequeños, tipados y enfocados en una única responsabilidad.

## Documentación de código

Cuando se agreguen los archivos de aplicación, documenta con JSDoc:

- Componentes React exportados.
- Props públicas de cada componente.
- Funciones de cálculo o transformación de datos.
- Handlers de endpoints del servidor, en especial el endpoint que llama a Gemini.
- Tipos e interfaces definidos en `src/types.ts`.

Ejemplo recomendado:

```ts
/**
 * Envía una solicitud de síntesis de materiales al proveedor de IA configurado.
 *
 * @param request - Parámetros científicos y restricciones ingresadas por el usuario.
 * @returns Respuesta normalizada con la propuesta de material y advertencias asociadas.
 * @throws Error cuando la configuración del proveedor o la entrada son inválidas.
 */
async function synthesizeMaterial(request: MaterialSynthesisRequest): Promise<MaterialSynthesisResult> {
  // ...
}
```

## Variables de entorno

El backend debe leer secretos desde variables de entorno. Para integraciones con Gemini se recomienda usar una variable como:

```bash
GEMINI_API_KEY=tu_clave
```

No subas archivos `.env` con secretos reales al repositorio.
