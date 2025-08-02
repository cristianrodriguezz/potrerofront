"use client";

import { cn } from '@/lib/utils';
// 1. Importamos el registro y el tipo de nombre de forma desde el archivo auto-generado
import { shapeRegistry, ShapeName } from '@/lib/shape-registry.generated';

interface ShapeSelectorProps {
  value: string;
  onChange: (value: ShapeName) => void;
}

// 2. Convertimos el registro en un array para poder mapearlo y renderizarlo
const shapeOptions = Object.entries(shapeRegistry).map(([value, { component, label }]) => ({
  value: value as ShapeName,
  component,
  label,
}));

export const ShapeSelector = ({ value, onChange }: ShapeSelectorProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {shapeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all w-24 h-24",
            value === option.value
              ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
              : "border-neutral-700 bg-transparent text-neutral-400 hover:border-neutral-500"
          )}
        >
          {/* 3. Renderizamos el componente SVG directamente desde nuestro registro */}
          <div className="w-10 h-10 flex items-center justify-center">
            <option.component backgroundColor="#333" patternColor="#555" patternType="none" />
          </div>
          <span className="text-sm mt-2">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
