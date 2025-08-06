import fs from 'fs';
import path from 'path';

// Definimos los directorios de entrada y salida
const iconsDir = path.join(process.cwd(), 'public', 'icons');
const outputDir = path.join(process.cwd(), 'src', 'lib'); // O donde prefieras guardarlo
const outputPath = path.join(outputDir, 'iconsMetadata.ts');

console.log('Generating icon metadata...');

try {
  // 1. Leer los nombres de archivo de la carpeta /public/icons
  const svgFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.svg'));

  // 2. Mapear los nombres de archivo al formato IconMeta
  const iconsMetadata = svgFiles.map(filename => {
    // Extraemos el nombre base del archivo (sin .svg) para usarlo como id y categoría
    const baseName = path.basename(filename, '.svg');

    // Lógica para determinar si es premium (opcional)
    // Por ejemplo, si el archivo termina en '-premium.svg'
    const isPremium = baseName.endsWith('-premium');
    const cleanBaseName = isPremium ? baseName.replace('-premium', '') : baseName;

    return {
      id: cleanBaseName,
      category: cleanBaseName, // Usamos el nombre base como categoría. Puedes ajustar esta lógica.
      premium: isPremium,
      filename: filename, // El nombre completo del archivo
    };
  });

  // 3. Generar el contenido del archivo TypeScript
  const fileContent = `// Archivo generado automáticamente por scripts/generate-icons.js. ¡No editar manualmente!
import type { IconMeta } from '@/types/icons'; // Ajusta la ruta si es necesario

export const iconsMetadata: IconMeta[] = ${JSON.stringify(iconsMetadata, null, 2)};
`;

  // 4. Escribir el archivo en el directorio de salida
  // Asegurarse de que el directorio de salida exista
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, fileContent);

  console.log(`✅ Successfully generated ${outputPath} with ${iconsMetadata.length} icons.`);

} catch (error) {
  console.error('❌ Error generating icon metadata:', error);
  // Si el directorio no existe, informamos al usuario.
  if (error.code === 'ENOENT') {
    console.error(`\nError: The directory '${iconsDir}' does not exist.`);
    console.error('Please create the directory and add your SVG icons to it.');
  }
}