
import React from 'react';
import CircleSVG from '@/components/shield-elements/CircleSVG';
import CrownSVG from '@/components/shield-elements/CrownSVG';

// Definimos un tipo para asegurar que los componentes son válidos
interface ElementDefinition {
  component: React.FC<any>;
  isPaid: boolean;
  category: string;
  defaultX: number;
  defaultY: number;
}

const elementDefinitions: Record<string, ElementDefinition> = {
  'Circle': {
        component: CircleSVG,
        isPaid: true,
        category: 'shapes',
        defaultX: 0,
        defaultY: 0,
      },
  'Crown': {
        component: CrownSVG,
        isPaid: true,
        category: 'shapes',
        defaultX: 0,
        defaultY: 0,
      },
};

export const initialElements = Object.entries(elementDefinitions).map(([key, value], index) => ({
  id: `${key}-${index}`,
  component: value.component,
  x: value.defaultX,
  y: value.defaultY,
  isPaid: value.isPaid,
  category: value.category,
}));
