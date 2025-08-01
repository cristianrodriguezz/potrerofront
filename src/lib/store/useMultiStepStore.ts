import { create } from 'zustand';

// Define la estructura del estado de nuestro stepper genérico
type MultiStepState = {
  currentStep: number;
  formData: Record<string, unknown>; // Un objeto genérico para guardar cualquier dato
  setFormData: (data: Record<string, unknown>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
};

export const useMultiStepStore = create<MultiStepState>((set) => ({
  currentStep: 1,
  formData: {},
  // Acción para fusionar los datos del paso actual con los datos existentes
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  // Acciones para navegar entre pasos
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep === 1 ? 1 : state.currentStep - 1 })),
  goToStep: (step) => set({ currentStep: step }),
}));
