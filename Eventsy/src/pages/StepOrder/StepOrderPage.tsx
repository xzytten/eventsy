import { useEffect, useState } from 'react';
import { useServiceStore } from '@/store/serviceStore';
import ThemeStep from '@/components/StepContent/ThemeStep';
import Stepper from '@/components/Stepper/Stepper';
import { type ReactElement } from 'react';
import { VenueList } from '@/components/Venue/VenueList';
import { AnimatorList } from '@/components/Animator/AnimatorList';
import { FoodList } from '@/components/Food/FoodList';
import { VehicleList } from '@/components/Vehicle/VehicleList';
import ServiceStep from '@/components/StepContent/ServiceStep';
import { type EventType } from '@/types/services';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useFoodStore from '@/store/foodStore';
import { useAnimatorStore } from '@/store/animatorStore';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import { useVenueStore } from '@/store/venueStore';
import { useVehicleStore } from '@/store/vehicleStore';

interface Step {
    id: number;
    title: string;
    content: ReactElement;
}

const StepOrderPage = () => {
    const {
        eventType,
        setEventType,
    } = useServiceStore();

    const resetFoodState = useFoodStore(state => state.resetFoodState);
    const resetAnimatorState = useAnimatorStore(state => state.resetAnimatorState);
    const clearSelectedVenues = useVenueStore(state => state.clearSelectedVenues);
    const clearSelectedVehicles = useVehicleStore(state => state.clearSelectedVehicles);

    const [currentStep, setCurrentStepState] = useState(() => {
        const savedStep = localStorage.getItem('active_step');
        return savedStep ? parseInt(savedStep, 10) : 1;
    });

    const setCurrentStep = (step: number) => {
        setCurrentStepState(step);
        localStorage.setItem('active_step', step.toString());
    };

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingEventType, setPendingEventType] = useState<EventType | null>(null);

    const handleConfirmThemeChange = () => {
        console.log('handleConfirmThemeChange started.');
        console.log('Pending event type in handleConfirmThemeChange:', pendingEventType);

        if (pendingEventType !== null) {
            // Close modal first
            setIsConfirmModalOpen(false);
            setPendingEventType(null);
            console.log('Modal closed.');

            console.log('User confirmed theme change. Clearing data in stores and localStorage.');

            console.log('Calling resetFoodState...');
            resetFoodState();
            console.log('resetFoodState called.');

            console.log('Calling resetAnimatorState...');
            resetAnimatorState();
            console.log('resetAnimatorState called.');

            console.log('Calling clearSelectedVenues...');
            clearSelectedVenues();
            console.log('clearSelectedVenues called.');

            console.log('Calling clearSelectedVehicles...');
            clearSelectedVehicles();
            console.log('clearSelectedVehicles called.');

            console.log('Explicitly clearing service localStorage keys as a safeguard...');
            localStorage.removeItem('eventsy_event_type');
            localStorage.removeItem('food-storage');
            localStorage.removeItem('selectedAnimators');
            localStorage.removeItem('selectedVenues');
            localStorage.removeItem('selectedVehicles');
            console.log('Finished explicitly clearing service localStorage keys as a safeguard.');

            // Set new event type and step
            console.log('Setting new event type:', pendingEventType);
            setEventType(pendingEventType);
            setCurrentStep(2);
            console.log('New event type and step set.');
        }

        console.log('handleConfirmThemeChange finished.');
    };

    const handleCancelThemeChange = () => {
        console.log('User cancelled theme change.');
        setIsConfirmModalOpen(false);
        setPendingEventType(null);
    };

    const handleThemeChange = (type: EventType) => {
        console.log('handleThemeChange started. Current event type (from store):', eventType, 'New type (passed to handler):', type);

        if (eventType !== null && eventType !== type) {
            console.log('Theme is changing. Opening confirmation modal.');
            setPendingEventType(type);
            setIsConfirmModalOpen(true);
            console.log('Pending event type set to:', type, 'isConfirmModalOpen set to true.');
        } else {
            console.log('Initial theme selection or same theme. Setting theme and step.');
            setEventType(type);
            setCurrentStep(2);
            console.log('Theme set to:', type, 'step set to 2.');
        }
        console.log('handleThemeChange finished.');
    };

    const createSteps = (): Step[] => {
        const steps = [
    {
        id: 1,
                title: 'Тип події',
                content: (
            <ThemeStep
                eventType={eventType}
                        onThemeChange={handleThemeChange}
            />
        )
    },
    {
        id: 2,
                title: 'Місце проведення',
                content: <VenueList showSelectButton={true} />
    },
    {
        id: 3,
                title: 'Аніматор',
                content: <AnimatorList showSelectButton={true} />
    },
    {
        id: 4,
                title: 'Фотограф',
                content: <ServiceStep />
    },
    {
        id: 5,
                title: 'Музика',
                content: <ServiceStep />
    },
    {
        id: 6,
                title: 'Їжа',
                content: <FoodList showSelectButton={true} />
            },
            {
                id: 7,
                title: 'Транспорт',
                content: <VehicleList showSelectButton={true} />
            }
        ];
        return steps;
    };

    const canNavigateToStep = (stepId: number) => {
        if (eventType === null && stepId !== 1) {
            return false;
        }

        if (eventType !== null) {
            return true;
        }

        return false;
    };

    const handleNext = () => {
        if (currentStep < createSteps().length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-16">
            <Stepper
                    steps={createSteps()}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
                canNavigateToStep={canNavigateToStep}
            />
            </div>
            <div className="flex justify-between items-center mt-16">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all duration-200 ${
                        currentStep === 1
                            ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                            : 'border-white text-white hover:border-coral hover:text-coral cursor-pointer'
                    }`}
                >
                    <ChevronLeft size={20} />
                    Назад
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentStep === createSteps().length}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all duration-200 ${
                        currentStep === createSteps().length
                            ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                            : 'border-white text-white hover:border-coral hover:text-coral cursor-pointer'
                    }`}
                    >
                        Далі
                    <ChevronRight size={20} />
                </button>
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelThemeChange}
                onConfirm={handleConfirmThemeChange}
                title="Підтвердження зміни теми"
                message="При зміні теми всі вибрані послуги будуть видалені. Продовжити?"
            />
        </div>
    );
};

export default StepOrderPage; 