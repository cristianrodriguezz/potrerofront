import { create } from 'zustand';
import { FullCreateTeamType } from '@/lib/schemas/validation';
import { CrestElementType } from '@/lib/schemas/validationCreateTeam';

type MultiStepState = {
  currentStep: number;
  formData: Partial<FullCreateTeamType>;
  setFormData: (data: Partial<FullCreateTeamType>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  // Acciones para manipular los elementos del escudo
  addElement: (element: Omit<CrestElementType, 'id'>) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<Omit<CrestElementType, 'id'>>) => void;
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
  
  addElement: (elementData) => {
    const newElement: CrestElementType = { ...elementData, id: crypto.randomUUID() };
    set((state) => {
      const currentCrest = state.formData.crest || {};
      const currentElements = currentCrest.elements || [];
      return {
        formData: {
          ...state.formData,
          crest: {
            ...currentCrest,
            elements: [...currentElements, newElement],
          },
        },
      };
    });
  },
  removeElement: (elementId) =>
    set((state) => {
      const currentCrest = state.formData.crest || {};
      const currentElements = currentCrest.elements || [];
      return {
        formData: {
          ...state.formData,
          crest: {
            ...currentCrest,
            elements: currentElements.filter(el => el.id !== elementId),
          },
        },
      };
    }),
  updateElement: (elementId, updates) =>
    set((state) => {
      const currentCrest = state.formData.crest || {};
      const currentElements = currentCrest.elements || [];
      return {
        formData: {
          ...state.formData,
          crest: {
            ...currentCrest,
            elements: currentElements.map(el =>
              el.id === elementId ? { ...el, ...updates } : el
            ),
          },
        },
      };
    }),
}));
