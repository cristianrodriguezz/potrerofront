import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Reemplazo para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definimos la raíz del proyecto para construir las rutas correctamente
const projectRoot = path.join(__dirname, '..'); // Sube un nivel desde la carpeta 'scripts'

const svgComponentsDir = path.join(projectRoot, 'src/components/shield-elements');
const outputDataFile = path.join(projectRoot, 'src/data/svg-elements-data.ts');

async function generateDefinitions() {
  try {
    const svgFiles = (await fs.readdir(svgComponentsDir)).filter(file => file.endsWith('.tsx'));

    const componentNames = svgFiles.map(file => path.basename(file, '.tsx'));

    
    
    const imports = componentNames.map(name => `import ${name} from '@/components/shield-elements/${name}';`).join('\n');
    
    const definitions = componentNames.map(name => {
      const elementKey = name.replace(/SVG$/, '');
      const isPaid = Math.random() > 0.5;
      const category = 'shapes';
      const defaultX = 0;
      const defaultY = 0;
      
      return `  '${elementKey}': {
        component: ${name},
        isPaid: ${isPaid},
        category: '${category}',
        defaultX: ${defaultX},
        defaultY: ${defaultY},
      },`;
    }).join('\n');
    
    const outputFileContent = `
import React from 'react';
${imports}

// Definimos un tipo para asegurar que los componentes son válidos
interface ElementDefinition {
  component: React.FC<any>;
  isPaid: boolean;
  category: string;
  defaultX: number;
  defaultY: number;
}

const elementDefinitions: Record<string, ElementDefinition> = {
${definitions}
};

export const initialElements = Object.entries(elementDefinitions).map(([key, value], index) => ({
  id: \`\${key}-\${index}\`,
  component: value.component,
  x: value.defaultX,
  y: value.defaultY,
  isPaid: value.isPaid,
  category: value.category,
}));
`;
    
    // CORRECCIÓN: Asegurarse de que el directorio de salida exista antes de escribir el archivo.
    const outputDir = path.dirname(outputDataFile);
    await fs.mkdir(outputDir, { recursive: true });

    await fs.writeFile(outputDataFile, outputFileContent, 'utf-8');
    
    console.log('SVG definitions generated successfully!');
  } catch (error) {
    console.error("Error al generar las definiciones:", error);
    if (error.code === 'ENOENT') {
      console.error(`\nError: No se pudo encontrar la carpeta '${svgComponentsDir}'. Asegúrate de que la carpeta exista y contenga tus componentes SVG.`);
    }
  }
}

generateDefinitions();
