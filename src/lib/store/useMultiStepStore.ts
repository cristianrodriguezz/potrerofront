import { create } from 'zustand';
import { FullCreateTeamType } from '@/lib/schemas/validation';

type MultiStepState = {
  currentStep: number;
  formData: Partial<FullCreateTeamType>;
  setFormData: (data: Partial<FullCreateTeamType>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

};

export const useMultiStepStore = create<MultiStepState>((set) => ({
  currentStep: 1,
  formData: {},
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  goToStep: (step) => set({ currentStep: step }),
}));
