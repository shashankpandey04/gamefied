import { isBuiltin } from 'node:module';
import { statSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export async function resolve(specifier, context, nextResolve) {
  if (isBuiltin(specifier) || specifier.startsWith('node:')) {
    return nextResolve(specifier, context);
  }

  const { parentURL } = context;

  // If specifier is relative or absolute path without extension
  if (specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('file://')) {
    let resolvedUrl;
    try {
      resolvedUrl = new URL(specifier, parentURL);
    } catch {
      return nextResolve(specifier, context);
    }

    const filePath = fileURLToPath(resolvedUrl);

    // If it exists as is, use it
    if (existsSync(filePath)) {
      try {
        if (!statSync(filePath).isDirectory()) {
          return nextResolve(specifier, context);
        }
      } catch {
        // ignore
      }
    }

    // Try .ts extension
    if (existsSync(`${filePath}.ts`)) {
      return nextResolve(pathToFileURL(`${filePath}.ts`).href, context);
    }

    // Try /index.ts
    if (existsSync(path.join(filePath, 'index.ts'))) {
      return nextResolve(pathToFileURL(path.join(filePath, 'index.ts')).href, context);
    }
  }

  return nextResolve(specifier, context);
}
