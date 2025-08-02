"use client";

import React from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Sword, Shield, Zap, Sun } from 'lucide-react';
import { CreateTeamStep2Type } from '@/lib/schemas/validation';
// 1. Importamos el registro de formas desde el archivo auto-generado
import { shapeRegistry } from '@/lib/shape-registry.generated';

const availableIcons = [
  { name: 'sword', component: <Sword size={48} /> },
  { name: 'shield', component: <Shield size={48} /> },
  { name: 'zap', component: <Zap size={48} /> },
  { name: 'sun', component: <Sun size={48} /> },
];

interface CrestPreviewProps {
  crestValues: CreateTeamStep2Type['crest'];
}

export const CrestPreview = ({ crestValues }: CrestPreviewProps) => {
  const debouncedCrest = useDebounce(crestValues, 100);
  
  const SelectedIcon = availableIcons.find(i => i.name === debouncedCrest.icon)?.component;
  
  // 2. Obtenemos el componente de forma correcto desde el registro
  const ShapeComponent = shapeRegistry[debouncedCrest.shape]?.component;

  return (
    <div className="relative w-40 h-40">
      <div className="w-full h-full">
        {/* 3. Renderizamos el componente de forma si existe en el registro */}
        {ShapeComponent && (
          <ShapeComponent 
            backgroundColor={debouncedCrest.backgroundColor} 
            patternColor={debouncedCrest.pattern.color} 
            patternType={debouncedCrest.pattern.type} 
          />
        )}
      </div>
      <div
        className="absolute top-1/2 left-1/2 flex items-center justify-center transition-all duration-100"
        style={{
          color: debouncedCrest.iconColor,
          transform: `translate(calc(-50% + ${debouncedCrest.positionIcon.x}px), calc(-50% + ${debouncedCrest.positionIcon.y}px))`,
          zIndex: 10,
        }}
      >
        {SelectedIcon}
      </div>
    </div>
  );
};
