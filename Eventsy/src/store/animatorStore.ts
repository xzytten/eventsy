import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IAnimator } from '@/types/animator';
import { animatorService } from '@/services/animatorService';

interface AnimatorState {
  animators: IAnimator[];
  selectedAnimators: IAnimator[];
  isLoading: boolean;
  error: string | null;

  loadAnimators: () => Promise<void>;
  selectAnimator: (animator: IAnimator) => void;
  removeAnimator: (animatorId: string) => void;
  resetAnimatorState: () => void;
  updateAnimatorDescription: (animatorId: string, description: string) => void;
  updateAnimatorPaymentType: (animatorId: string, paymentType: 'full' | 'hourly') => void;
  updateAnimatorHours: (animatorId: string, hours: number) => void;
}

export const useAnimatorStore = create<AnimatorState>()(
  persist(
    (set, get) => ({
      animators: [],
      selectedAnimators: [],
      isLoading: false,
      error: null,

      loadAnimators: async () => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const animatorsData = await animatorService.getAll();
          set({ 
            animators: animatorsData, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Помилка завантаження аніматорів:', error);
          set({ 
            error: 'Помилка завантаження аніматорів', 
            isLoading: false
          });
        }
      },

      selectAnimator: (animator) => {
        const { selectedAnimators } = get();
        const isSelected = selectedAnimators.some(a => a._id === animator._id);
        const updated = isSelected
          ? selectedAnimators.filter(a => a._id !== animator._id)
          : [...selectedAnimators, animator];

        set({ selectedAnimators: updated });
      },

      removeAnimator: (animatorId) => {
        const updated = get().selectedAnimators.filter(a => a._id !== animatorId);
        set({ selectedAnimators: updated });
      },

      resetAnimatorState: () => {
        set({ selectedAnimators: [] });
      },

      updateAnimatorDescription: (animatorId, description) =>
        set((state) => {
          const updatedSelectedAnimators = state.selectedAnimators.map(animator =>
            animator._id === animatorId ? { ...animator, clientDescription: description } : animator
          );

          return {
            selectedAnimators: updatedSelectedAnimators
          };
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
          return { selectedAnimators: updated };
        }),

      updateAnimatorHours: (animatorId, hours) =>
        set((state) => {
          const updated = state.selectedAnimators.map(animator =>
            animator._id === animatorId ? { ...animator, hours } : animator
          );
          return { selectedAnimators: updated };
        }),
    }),
    {
      name: 'animator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedAnimators: state.selectedAnimators
      })
    }
  )
);
