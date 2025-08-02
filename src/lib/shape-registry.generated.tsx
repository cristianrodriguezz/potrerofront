/* eslint-disable */
// ----------------------------------------------------------------------
// ESTE ARCHIVO ES AUTO-GENERADO. NO LO EDITES MANUALMENTE.
// Ejecuta 'npm run generate:shapes' para actualizarlo.
// ----------------------------------------------------------------------

import React from 'react';
import { EscudoBorrar, shapeLabel as EscudoBorrarLabel } from '@/components/ui/shapes/EscudoBorrar';
import { OtroBorrar, shapeLabel as OtroBorrarLabel } from '@/components/ui/shapes/OtroBorrar';

export const shapeNames = ['--escudo-borrar', '--otro-borrar', 'circle', 'square'] as const;

export type ShapeName = typeof shapeNames[number];


export const shapeRegistry: Record<ShapeName, { component: React.FC<any>; label: string }> = {
  '--escudo-borrar': { component: EscudoBorrar, label: EscudoBorrarLabel || 'Escudito' },
  '--otro-borrar': { component: OtroBorrar, label: OtroBorrarLabel || 'Otro Escudo' },
  'circle': { component: () => React.createElement('div', { className: "w-full h-full bg-current rounded-full" }), label: 'Círculo' },
  'square': { component: () => React.createElement('div', { className: "w-full h-full bg-current rounded-lg" }), label: 'Cuadrado' },
};
