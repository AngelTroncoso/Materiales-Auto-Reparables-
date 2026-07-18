# Contribuir a Materiales Auto-Reparables

Gracias por contribuir a este proyecto. Esta guía resume cómo levantar el entorno local, cómo está organizada la aplicación y qué convenciones seguir al modificar el código.

## Requisitos previos

Cuando el proyecto incluya su configuración de Node.js, instala una versión LTS reciente de Node y el gestor de paquetes definido por el archivo de lock (`package-lock.json`, `pnpm-lock.yaml` o `yarn.lock`).

## Configuración local

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd Materiales-Auto-Reparables-
   ```

2. Instala dependencias cuando exista `package.json`:

   ```bash
   npm install
   ```

3. Configura variables de entorno para servicios externos. Para Gemini, usa una variable local como:

   ```bash
   GEMINI_API_KEY=tu_clave
   ```

4. Levanta el proyecto en modo desarrollo con el script definido en `package.json`, por ejemplo:

   ```bash
   npm run dev
   ```

> En el estado actual del repositorio no existe todavía `package.json`, `server.ts` ni `src/`. Actualiza esta guía con comandos exactos cuando se agregue la aplicación ejecutable.

## Estructura de carpetas esperada

```text
.
├── server.ts                  # Backend ligero y endpoints HTTP.
├── src/
│   ├── App.tsx                # Componente raíz y coordinación de estado.
│   ├── types.ts               # Tipos e interfaces compartidos.
│   └── components/            # Componentes React especializados.
│       ├── LatticeSimulator.tsx
│       ├── EquationSandbox.tsx
│       ├── MaterialSynthesizer.tsx
│       └── ScientificDocumentation.tsx
├── README.md                  # Descripción, arquitectura y uso del proyecto.
└── CONTRIBUTING.md            # Guía para contribuidores.
```

## Convenciones de código

- Usa TypeScript para código de aplicación y servidor.
- Define interfaces o tipos explícitos para props, solicitudes y respuestas.
- Documenta APIs públicas, componentes exportados y funciones de dominio con JSDoc.
- Mantén los componentes con una única responsabilidad clara.
- Evita mezclar llamadas a servicios externos dentro de componentes visuales; centraliza esas llamadas en `server.ts` o en clientes dedicados.
- Maneja errores de red, validación y configuración con mensajes accionables para el usuario o para logs de servidor.
- No escribas secretos en el repositorio. Usa variables de entorno locales.

## Manejo de errores recomendado

- Valida entradas antes de ejecutar cálculos o llamadas externas.
- Devuelve códigos HTTP adecuados desde el servidor (`400` para entrada inválida, `500` para fallos internos, `502` para fallos de proveedor externo cuando aplique).
- Muestra mensajes de error amigables en la interfaz y conserva detalles técnicos en logs de desarrollo.

## Antes de abrir un pull request

1. Ejecuta el formateador y el linter configurados en el proyecto.
2. Ejecuta la suite de pruebas disponible.
3. Verifica manualmente los flujos principales de simulación, ecuaciones, síntesis y documentación.
4. Asegúrate de que la documentación esté actualizada si cambias arquitectura, comandos o variables de entorno.
