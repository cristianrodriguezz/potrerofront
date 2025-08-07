"use client";

import { useRef, useState, useEffect } from "react";
import DraggableElement from "./DraggableElement";
import Shield1SVG from "@/components/shield-bases/Shield1SVG";
import Shield2SVG from "@/components/shield-bases/Shield2SVG";
import Shield3SVG from "@/components/shield-bases/Shield3SVG";
import Shield4SVG from "@/components/shield-bases/Shield4SVG";
import Pattern1SVG from "@/components/shield-patterns/Pattern1SVG";
import Pattern2SVG from "@/components/shield-patterns/Pattern2SVG";
import Pattern3SVG from "@/components/shield-patterns/Pattern3SVG";
import Pattern4SVG from "@/components/shield-patterns/Pattern4SVG";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { IconSelector } from "./IconSelector";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { 
  Copy, 
  FlipHorizontal, 
  Trash2, 
  Settings, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Paintbrush,
  PaintBucket,
  Circle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Tipo para la configuración de patrones
type PatternConfig = {
  rotation: number;
  scale: number;
  density: number;
  elementSize: number; // Nuevo parámetro
  primaryColor: string;
  secondaryColor: string;
};

// Configuración inicial para los patrones
const initialPatternConfig: PatternConfig = {
  rotation: 0,
  scale: 1,
  density: 5,
  elementSize: 1, // Valor inicial
  primaryColor: "#ff0000",
  secondaryColor: "#ffffff"
};

const shieldOptions = {
  shield1: Shield1SVG,
  shield2: Shield2SVG,
  shield3: Shield3SVG,
  shield4: Shield4SVG,
};

const patternOptions = {
  pattern1: Pattern1SVG,
  pattern2: Pattern2SVG,
  pattern3: Pattern3SVG,
  pattern4: Pattern4SVG,
};

type Element = {
  id: string;
  transform: {
    xPercent: number;
    yPercent: number;
    scaleRel: number;
    rotation: number;
    zIndex: number;
    flipX?: number;
  };
  icon: {
    id: string;
    filename: string;
    category: string;
    premium: boolean;
  };
};

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 400,
    height: 400,
  });

  const [selectedShield, setSelectedShield] =
    useState<keyof typeof shieldOptions>("shield1");
    
  const [selectedPattern, setSelectedPattern] =
    useState<keyof typeof patternOptions | null>(null);
  
  const [patternConfig, setPatternConfig] = useState<PatternConfig>(initialPatternConfig);
  const [isPatternConfigOpen, setIsPatternConfigOpen] = useState(false);

  const [elements, setElements] = useState<Element[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Actualizar tamaño del contenedor
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } =
          containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleTransformEnd = (
    id: string,
    newTransform: {
      xPercent: number;
      yPercent: number;
      scaleRel: number;
      rotation: number;
      zIndex: number;
      flipX: number;
    }
  ) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              transform: {
                ...el.transform,
                xPercent: newTransform.xPercent,
                yPercent: newTransform.yPercent,
                scaleRel: newTransform.scaleRel,
                rotation: newTransform.rotation,
                flipX: newTransform.flipX,
              },
            }
          : el
      )
    );
  };

  const handleDelete = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDuplicate = (id: string) => {
    const originalElement = elements.find((el) => el.id === id);
    if (!originalElement) return;

    const newElement = {
      ...originalElement,
      id: nanoid(),
      transform: {
        ...originalElement.transform,
        xPercent: originalElement.transform.xPercent + 2,
        yPercent: originalElement.transform.yPercent + 2,
      },
    };

    setElements((prevElements) => [...prevElements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleFlipHorizontal = (id: string) => {
    setElements(prev => 
      prev.map(el => 
        el.id === id
          ? {
              ...el,
              transform: {
                ...el.transform,
                flipX: (el.transform.flipX ?? 1) * -1
              }
            }
          : el
      )
    );
  };

  const SelectedShieldSVG = shieldOptions[selectedShield];
  const SelectedPatternSVG = selectedPattern ? patternOptions[selectedPattern] : null;

  // Resetear configuración de patrón
  const resetPatternConfig = () => {
    setPatternConfig(initialPatternConfig);
  };

  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Diseñá tu escudo
          </h1>
          <p className="text-gray-600">
            Escala proporcional al tamaño del escudo
          </p>
        </div>

        <div className="flex gap-2">
          {Object.entries(shieldOptions).map(([key, Component]) => (
            <button
              key={key}
              onClick={() =>
                setSelectedShield(
                  key as keyof typeof shieldOptions
                )
              }
              className={`p-2 border-2 rounded-lg transition-all ${
                selectedShield === key
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="w-12 h-12">
                <Component className="w-full h-full" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 items-center">
          <span className="text-gray-700 text-sm font-medium">Patrones:</span>
          <div className="flex gap-2">
            {Object.entries(patternOptions).map(([key, PatternComponent]) => (
              <button
                key={key}
                onClick={() => setSelectedPattern(key as keyof typeof patternOptions)}
                className={`p-1 border-2 rounded transition-all ${
                  selectedPattern === key
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="w-8 h-8">
                  <svg viewBox="0 0 40 40" width="100%" height="100%">
                    <PatternComponent 
                      rotation={patternConfig.rotation}
                      scale={patternConfig.scale}
                      density={patternConfig.density}
                      elementSize={patternConfig.elementSize}
                      primaryColor={patternConfig.primaryColor}
                      secondaryColor={patternConfig.secondaryColor}
                    />
                    <rect width="40" height="40" fill={`url(#${key})`} />
                  </svg>
                </div>
              </button>
            ))}
            <button
              onClick={() => setSelectedPattern(null)}
              className={`p-1 border-2 rounded transition-all ${
                selectedPattern === null
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-700">X</span>
              </div>
            </button>
          </div>
        </div>

        <Drawer open={isPatternConfigOpen} onOpenChange={setIsPatternConfigOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              disabled={!selectedPattern}
            >
              <Settings className="w-4 h-4" />
              Configurar Patrón
            </Button>
          </DrawerTrigger>
          
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>Configuración del Patrón</DrawerTitle>
              <DrawerDescription>
                Personaliza la apariencia del patrón seleccionado
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rotación */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Rotación
                </Label>
                <Slider 
                  value={[patternConfig.rotation]}
                  onValueChange={([val]) => setPatternConfig(prev => ({
                    ...prev,
                    rotation: val
                  }))}
                  min={0}
                  max={360}
                  step={1}
                />
                <div className="flex justify-between">
                  <span>0°</span>
                  <span className="font-medium">{patternConfig.rotation}°</span>
                  <span>360°</span>
                </div>
              </div>
              
              {/* Escala */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  Escala
                </Label>
                <Slider 
                  value={[patternConfig.scale]}
                  onValueChange={([val]) => setPatternConfig(prev => ({
                    ...prev,
                    scale: val
                  }))}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
                <div className="flex justify-between">
                  <span>Pequeño</span>
                  <span className="font-medium">{patternConfig.scale.toFixed(1)}x</span>
                  <span>Grande</span>
                </div>
              </div>
              
              {/* Densidad */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" />
                  Densidad
                </Label>
                <Slider 
                  value={[patternConfig.density]}
                  onValueChange={([val]) => setPatternConfig(prev => ({
                    ...prev,
                    density: val
                  }))}
                  min={1}
                  max={20}
                  step={1}
                />
                <div className="flex justify-between">
                  <span>Baja</span>
                  <span className="font-medium">{patternConfig.density}</span>
                  <span>Alta</span>
                </div>
              </div>
              
              {/* Tamaño de elemento */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  Tamaño de elemento
                </Label>
                <Slider 
                  value={[patternConfig.elementSize]}
                  onValueChange={([val]) => setPatternConfig(prev => ({
                    ...prev,
                    elementSize: val
                  }))}
                  min={0.1}
                  max={3}
                  step={0.1}
                />
                <div className="flex justify-between">
                  <span>Pequeño</span>
                  <span className="font-medium">{patternConfig.elementSize.toFixed(1)}</span>
                  <span>Grande</span>
                </div>
              </div>
              
              {/* Colores */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Paintbrush className="w-4 h-4" />
                    Color Primario
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={patternConfig.primaryColor}
                        onChange={(e) => setPatternConfig(prev => ({
                          ...prev,
                          primaryColor: e.target.value
                        }))}
                        className="w-12 h-12 cursor-pointer rounded border border-gray-300"
                      />
                    </div>
                    <Input 
                      value={patternConfig.primaryColor}
                      onChange={(e) => setPatternConfig(prev => ({
                        ...prev,
                        primaryColor: e.target.value
                      }))}
                      className="w-32"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <PaintBucket className="w-4 h-4" />
                    Color Secundario
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={patternConfig.secondaryColor}
                        onChange={(e) => setPatternConfig(prev => ({
                          ...prev,
                          secondaryColor: e.target.value
                        }))}
                        className="w-12 h-12 cursor-pointer rounded border border-gray-300"
                      />
                    </div>
                    <Input 
                      value={patternConfig.secondaryColor}
                      onChange={(e) => setPatternConfig(prev => ({
                        ...prev,
                        secondaryColor: e.target.value
                      }))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DrawerFooter className="flex-row justify-between">
              <Button 
                variant="outline" 
                onClick={resetPatternConfig}
              >
                Restablecer valores
              </Button>
              <Button 
                onClick={() => setIsPatternConfigOpen(false)}
              >
                Aplicar cambios
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Copy className="w-4 h-4 mr-2" />
            Agregar Elemento
          </Button>
        </DrawerTrigger>

        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Seleccioná un elemento</DrawerTitle>
          </DrawerHeader>

          <div className="overflow-auto p-2">
            <IconSelector
              category="all"
              showPremium={true}
              onSelect={(icon) => {
                const newId = `icon-${Date.now()}`;
                const newElement = {
                  id: newId,
                  transform: {
                    xPercent: 50,
                    yPercent: 50,
                    scaleRel: 0.5,
                    rotation: 0,
                    zIndex: 1,
                    flipX: 1,
                  },
                  icon,
                };
                setElements((prev) => [...prev, newElement]);
                setSelectedId(newId);
                setIsDrawerOpen(false);
              }}
            />
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div
        ref={containerRef}
        className="relative bg-gradient-to-br aspect-square w-full from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden mx-auto border border-gray-200"
        style={{
          maxWidth: "600px",
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <SelectedShieldSVG 
              className="w-full h-full"
              patternId={selectedPattern || undefined}
            >
              {SelectedPatternSVG && (
                <SelectedPatternSVG
                  rotation={patternConfig.rotation}
                  scale={patternConfig.scale}
                  density={patternConfig.density}
                  elementSize={patternConfig.elementSize}
                  primaryColor={patternConfig.primaryColor}
                  secondaryColor={patternConfig.secondaryColor}
                />
              )}
            </SelectedShieldSVG>
          </div>

          {elements.map((el) => (
            <DraggableElement
              key={el.id}
              id={el.id}
              initialTransform={el.transform}
              transform={el.transform}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
              onTransformEnd={handleTransformEnd}
              isSelected={selectedId === el.id}
              onSelect={setSelectedId}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onFlipHorizontal={handleFlipHorizontal}
            >
              <Image
                src={`/icons/${el.icon.filename}`}
                alt={el.icon.id}
                width={40}
                height={40}
                className="object-contain"
              />
            </DraggableElement>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-gray-700 shadow-sm">
          Tamaño: {Math.round(containerSize.width)}×
          {Math.round(containerSize.height)}px
        </div>
      </div>
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="extra-clickable fixed bottom-4 inset-x-2 bg-white/80 border border-gray-200 backdrop-blur-sm p-4 rounded-lg shadow-md z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Button
              variant="ghost"
              onClick={() => handleFlipHorizontal(selectedId)}
            >
              <FlipHorizontal className="size-6 text-purple-600" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleDelete(selectedId)}
            >
              <Trash2 className="size-6 text-red-500" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleDuplicate(selectedId)}
            >
              <Copy className="size-6 text-yellow-600" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}