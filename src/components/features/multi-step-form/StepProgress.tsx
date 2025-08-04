"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const StepProgress = ({ currentStep, totalSteps }: StepProgressProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center w-full ">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2",
              {
                // Estilo para paso completado: Borde amarillo, texto amarillo
                "border-yellow-400 bg-transparent text-yellow-400":
                  currentStep > step,
                // Estilo para paso actual: Fondo amarillo, texto negro
                "bg-yellow-400 text-black scale-110 border-yellow-400":
                  currentStep === step,
                // Estilo para paso pendiente: Fondo y borde grises
                "bg-neutral-800 text-neutral-500 border-neutral-700":
                  currentStep < step,
              }
            )}
          >
            {step}
          </div>
          {/* Renderiza la línea de conexión entre los pasos */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-1 transition-all duration-500 mx-2 rounded-full",
                // La línea se ilumina si el siguiente paso ya está activo o completado
                currentStep > index + 1 ? "bg-yellow-400" : "bg-neutral-800"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
