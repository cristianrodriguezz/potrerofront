"use client";

import React from 'react';
import { useMultiStepStore } from '@/lib/store/useMultiStepStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StepProgress } from './StepProgress';
import { cn } from '@/lib/utils';

// Este componente recibe los pasos como un array de children
interface MultiStepContainerProps {
  children: React.ReactNode[];
  className?: string;
}

export const MultiStepContainer = ({ children, className }: MultiStepContainerProps) => {
  const { currentStep } = useMultiStepStore();

  // Muestra solo el componente del paso actual
  const activeStepComponent = children[currentStep - 1];
  const totalSteps = children.length;

  return (
    <Card className={cn("max-w-2xl sm:mx-auto", className)}>
      <CardHeader>
        {/* <StepProgress currentStep={currentStep} totalSteps={totalSteps} />  */}
      </CardHeader>
      <CardContent>
        {activeStepComponent}
      </CardContent>
    </Card>
  );
};
