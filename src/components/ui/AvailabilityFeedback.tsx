import { LoaderCircle, CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';

interface AvailabilityFeedbackProps {
  isLoading: boolean;
  isAvailable: boolean;
  isDirty: boolean; // Para saber si el campo ha sido modificado
  minLength: number;
  value: string;
  loadingText: string; // Texto mientras se carga, ej: "Verificando nombre..."
  availableText: string; // Texto cuando está disponible, ej: "Nombre disponible"
  errorText?: string; // El mensaje de error específico si no está disponible
}

export const AvailabilityFeedback = ({
  isLoading,
  isAvailable,
  isDirty,
  minLength,
  value,
  loadingText,
  availableText,
  errorText,
}: AvailabilityFeedbackProps): React.ReactElement | null => {
  // Condición para empezar a mostrar feedback
  const shouldShowFeedback = isDirty && value.length >= minLength;
  console.log(errorText);

  // Muestra el spinner de carga con texto
  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
        <LoaderCircle className="animate-spin h-4 w-4" />
        {loadingText}
      </p>
    );
  }

  // Muestra el feedback de éxito o error si se cumplen las condiciones
  if (shouldShowFeedback) {
    if (!isAvailable && errorText) {
      return (
        <p className="flex items-center gap-2 text-sm text-destructive mt-2">
          <XCircle className="h-4 w-4" />
          {errorText}
        </p>
      );
    }
    if (isAvailable && !errorText) {
       return (
        <p className="flex items-center gap-2 text-sm text-green-500 mt-2">
          <CheckCircle2 className="h-4 w-4" />
          {availableText}
        </p>
      );
    }
  }

  // No renderiza nada si no hay feedback que mostrar, para no ocupar espacio
  return null;
};
