import { type FC, type ReactElement } from 'react';
import { motion } from 'framer-motion';

interface Step {
    id: number;
    title: string;
    content: ReactElement;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick: (step: number) => void;
    canNavigateToStep: (step: number) => boolean;
}

const Stepper: FC<StepperProps> = ({ steps, currentStep, onStepClick, canNavigateToStep }) => {
    const activeStep = steps.find(step => step.id === currentStep);

    return (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                {steps.map((step, index) => {
                    const isStepAvailable = canNavigateToStep(step.id);
                    const isActive = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center">
                            <button
                                onClick={() => {
                                    if (isStepAvailable) {
                                        onStepClick(step.id);
                                    }
                                }}
                                className={`text-sm font-medium mb-2 transition-colors cursor-pointer ${
                                    isActive
                                        ? 'text-coral'
                                        : isStepAvailable
                                        ? 'text-muted hover:text-coral'
                                        : 'text-black-40'
                                }`}
                                disabled={!isStepAvailable}
                            >
                                {step.title.toUpperCase()}
                            </button>
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    isStepAvailable ? 'bg-coral' : 'bg-black-40'
                                }`}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="relative h-1 bg-black-40 rounded-full">
                <motion.div
                    className="absolute h-full bg-coral rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {activeStep && activeStep.content}
        </div>
    );
};

export default Stepper; 