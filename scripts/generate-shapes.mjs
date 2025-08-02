import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURACIÓN ---
const shapesDir = path.join(process.cwd(), 'src/components/ui/shapes');
const outputFile = path.join(process.cwd(), 'src/lib/shape-registry.generated.tsx');
// --- FIN DE LA CONFIGURACIÓN ---

function toKebabCase(str) {
  const kebab = str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  return `-${kebab}`;
}

function toLabelFallback(str) {
    return str.replace(/([A-Z])/g, ' $1').trim();
}

async function generateShapeRegistry() {
  console.log('🔍 Buscando componentes de formas en:', shapesDir);

  const files = await fs.readdir(shapesDir);
  const shapeFiles = files.filter(file => file.endsWith('.tsx') && file !== 'index.ts');

  if (shapeFiles.length === 0) {
    console.warn('⚠️ No se encontraron componentes de formas. El archivo no se generará.');
    return;
  }

  const shapeData = [];
  for (const file of shapeFiles) {
    const componentName = path.parse(file).name;
    const filePath = path.join(shapesDir, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Busca una constante exportada llamada 'shapeLabel'
    const labelRegex = /export\s+const\s+shapeLabel\s*=\s*['"](.*?)['"]/;
    const match = fileContent.match(labelRegex);
    
    let label;
    if (match && match[1]) {
      label = match[1];
    } else {
      label = toLabelFallback(componentName);
      console.warn(`⚠️ No se encontró 'export const shapeLabel' en ${file}. Usando el nombre del archivo como fallback: "${label}"`);
    }

    shapeData.push({
      componentName,
      kebabCaseName: toKebabCase(componentName),
      label,
    });
  }

  console.log(`✅ Formas encontradas: ${shapeData.map(s => s.componentName).join(', ')}`);

  const imports = shapeData.map(s => `import { ${s.componentName}, shapeLabel as ${s.componentName}Label } from '@/components/ui/shapes/${s.componentName}';`).join('\n');
  
  const shapeNamesArray = `export const shapeNames = [${shapeData.map(s => `'${s.kebabCaseName}'`).join(', ')}, 'circle', 'square'] as const;`;
  
  const shapeNameType = `export type ShapeName = typeof shapeNames[number];`;

  const registryObject = `
export const shapeRegistry: Record<ShapeName, { component: React.FC<any>; label: string }> = {
  ${shapeData.map(s => `'${s.kebabCaseName}': { component: ${s.componentName}, label: ${s.componentName}Label || '${s.label}' }`).join(',\n  ')},
  'circle': { component: () => React.createElement('div', { className: "w-full h-full bg-current rounded-full" }), label: 'Círculo' },
  'square': { component: () => React.createElement('div', { className: "w-full h-full bg-current rounded-lg" }), label: 'Cuadrado' },
};`;

  const fileContent = `/* eslint-disable */
// ----------------------------------------------------------------------
// ESTE ARCHIVO ES AUTO-GENERADO. NO LO EDITES MANUALMENTE.
// Ejecuta 'npm run generate:shapes' para actualizarlo.
// ----------------------------------------------------------------------

import React from 'react';
${imports}

${shapeNamesArray}

${shapeNameType}

${registryObject}
`;

  await fs.writeFile(outputFile, fileContent);
  console.log(`🎉 ¡Registro de formas generado exitosamente en ${outputFile}!`);
}

generateShapeRegistry().catch(console.error);
