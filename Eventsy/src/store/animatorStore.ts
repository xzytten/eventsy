import { create } from 'zustand';
import type { IAnimator } from '@/types/animator';
import { animatorService } from '@/services/animatorService';

interface AnimatorState {
  animators: IAnimator[];
  selectedAnimators: IAnimator[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;

  loadAnimators: () => Promise<void>;
  selectAnimator: (animator: IAnimator) => void;
  removeAnimator: (animatorId: string) => void;
  resetAnimatorState: () => void;
  updateAnimatorDescription: (animatorId: string, description: string) => void;
  updateAnimatorPaymentType: (animatorId: string, paymentType: 'full' | 'hourly') => void;
  updateAnimatorHours: (animatorId: string, hours: number) => void;
}

const animatorsLocalStorageKey = 'allAnimators';
const selectedAnimatorsLocalStorageKey = 'selectedAnimators';

const saveAllAnimators = (animators: IAnimator[]) => {
  try {
    localStorage.setItem(animatorsLocalStorageKey, JSON.stringify(animators));
  } catch (e) {
    console.error('Error saving all animators to localStorage:', e);
  }
};

const loadAllAnimators = (): IAnimator[] => {
  try {
    const stored = localStorage.getItem(animatorsLocalStorageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading animators:', e);
    return [];
  }
};

const saveSelectedAnimators = (animators: IAnimator[]) => {
  try {
    localStorage.setItem(selectedAnimatorsLocalStorageKey, JSON.stringify(animators));
  } catch (e) {
    console.error('Error saving selected animators:', e);
  }
};

const loadSelectedAnimators = (): IAnimator[] => {
  try {
    const stored = localStorage.getItem(selectedAnimatorsLocalStorageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading selected animators:', e);
    return [];
  }
};

export const useAnimatorStore = create<AnimatorState>((set, get) => ({
  animators: loadAllAnimators(),
  selectedAnimators: loadSelectedAnimators(),
  isLoading: false,
  isLoaded: loadAllAnimators().length > 0,
  error: null,

  loadAnimators: async () => {
    const { isLoading, isLoaded } = get();
    if (isLoading || isLoaded) return;

    set({ isLoading: true, error: null });

    try {
      const animatorsData = await animatorService.getAll();
      set({ animators: animatorsData, isLoading: false, isLoaded: true });
      saveAllAnimators(animatorsData);
    } catch (error) {
      set({ error: 'Помилка завантаження аніматорів', isLoading: false });
      console.error('Помилка завантаження аніматорів:', error);
    }
  },

  selectAnimator: (animator) => {
    const { selectedAnimators } = get();
    const isSelected = selectedAnimators.some(a => a._id === animator._id);
    const updated = isSelected
      ? selectedAnimators.filter(a => a._id !== animator._id)
      : [...selectedAnimators, animator];

    set({ selectedAnimators: updated });
    saveSelectedAnimators(updated);
  },

  removeAnimator: (animatorId) => {
    const updated = get().selectedAnimators.filter(a => a._id !== animatorId);
    set({ selectedAnimators: updated });
    saveSelectedAnimators(updated);
  },

  resetAnimatorState: () => {
    set({ selectedAnimators: [], isLoaded: false });
    localStorage.removeItem(selectedAnimatorsLocalStorageKey);
    localStorage.removeItem(animatorsLocalStorageKey);
  },

  updateAnimatorDescription: (animatorId, description) =>
    set((state) => {
      const updated = state.selectedAnimators.map(animator =>
        animator._id === animatorId ? { ...animator, description } : animator
      );
      saveSelectedAnimators(updated);
      return { selectedAnimators: updated };
    }),

  updateAnimatorPaymentType: (animatorId, paymentType) =>
    set((state) => {
      const updated = state.selectedAnimators.map(animator =>
        animator._id === animatorId
          ? {
              ...animator,
              paymentType,
              hours: paymentType === 'hourly' ? animator.hours || 1 : undefined
            }
          : animator
      );
      saveSelectedAnimators(updated);
      return { selectedAnimators: updated };
    }),

  updateAnimatorHours: (animatorId, hours) =>
    set((state) => {
      const updated = state.selectedAnimators.map(animator =>
        animator._id === animatorId ? { ...animator, hours } : animator
      );
      saveSelectedAnimators(updated);
      return { selectedAnimators: updated };
    }),
}));
