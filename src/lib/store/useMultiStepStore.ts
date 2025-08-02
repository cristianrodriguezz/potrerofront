import { create } from 'zustand';
// 1. Importamos nuestro nuevo tipo unificado del archivo de validación
import { FullCreateTeamType } from '@/lib/schemas/validation';

// Define la estructura del estado con el tipo correcto
type MultiStepState = {
  currentStep: number;
  // Usamos Partial<> porque los datos estarán incompletos hasta el último paso
  formData: Partial<FullCreateTeamType>;
  setFormData: (data: Partial<FullCreateTeamType>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
};

export const useMultiStepStore = create<MultiStepState>((set) => ({
  currentStep: 1,
  formData: {},
  // La acción ahora espera datos que coincidan con la estructura de nuestro formulario
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  goToStep: (step) => set({ currentStep: step }),
}));
