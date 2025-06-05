import { type FC, useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Minus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { type CartItem } from '@/types/cart';
import { type IVehicle } from '@/types/vehicle';
import { useVehicleStore } from '@/store/vehicleStore';

interface CartItemComponentProps {
    item: CartItem;
    fullDetails?: IVehicle;
    onRemove?: () => void;
    onUpdateQuantity?: (id: string, quantity: number) => void;
    onUpdateClientDescription?: (description: string) => void;
    onUpdatePaymentType?: (paymentType: 'full' | 'hourly') => void;
    onUpdateHours?: (hours: number) => void;
    onDetailsClick: (item: CartItem, fullDetails?: IVehicle) => void;
}

const itemVariants = {
    hidden: {
        opacity: 0,
        x: -150
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 15,
            mass: 1.2,
            duration: 0.8
        }
    },
    exit: {
        opacity: 0,
        x: 150,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

const VehicleTabItem: FC<CartItemComponentProps> = ({
    item,
    fullDetails,
    onRemove,
    onUpdateQuantity,
    onUpdateClientDescription,
    onUpdatePaymentType,
    onDetailsClick
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "100px" });
    const [openDescriptionId, setOpenDescriptionId] = useState<string | null>(null);
    const updateVehicleDescription = useVehicleStore(state => state.updateVehicleDescription);
    const updateVehiclePaymentType = useVehicleStore(state => state.updateVehiclePaymentType);
    const updateVehicleHours = useVehicleStore(state => state.updateVehicleHours);
    const removeVehicle = useVehicleStore(state => state.removeVehicle);
    const selectedVehicles = useVehicleStore(state => state.selectedVehicles);
    const currentVehicle = selectedVehicles.find(v => v._id === item.id);
    console.log('Current vehicle state:', { 
        id: item.id, 
        currentVehicle, 
        paymentType: item.paymentType,
        hours: item.hours 
    });
    const [editingClientDescription, setEditingClientDescription] = useState<{ id: string | null, value: string, isFocused: boolean }>({
        id: null,
        value: item.clientDescription || '',
        isFocused: false
    });

    useEffect(() => {
        setEditingClientDescription(prev => ({
            ...prev,
            value: item.clientDescription || ''
        }));
    }, [item.clientDescription]);

    const handleRemove = () => {
        if (item.id) {
            removeVehicle(item.id);
            if (onRemove) {
                onRemove();
            }
        }
    };

    const handlePaymentTypeChange = (paymentType: 'full' | 'hourly') => {
        console.log('Payment type change:', { id: item.id, paymentType });
        if (item.id) {
            updateVehiclePaymentType(item.id, paymentType);
            if (onUpdatePaymentType) {
                onUpdatePaymentType(paymentType);
            }
        }
    };

    const handleHoursChange = (hours: number) => {
        console.log('Hours change:', { id: item.id, hours });
        if (item.id) {
            updateVehicleHours(item.id, hours);
            if (onUpdateQuantity) {
                onUpdateQuantity(item.id, hours);
            }
        }
    };

    const imageUrl = fullDetails && 'images' in fullDetails && fullDetails.images?.[0] || item.image || '/placeholder-service.jpg';
    const itemTitle = fullDetails && 'name' in fullDetails ? fullDetails.name : item.title;

    // Get current payment type from item or currentVehicle
    const currentPaymentType = item.paymentType || currentVehicle?.paymentType || (currentVehicle?.pricePerHour ? 'hourly' : 'full');
    const currentHours = item.hours || currentVehicle?.hours || 1;

    return (
        <motion.div
            ref={ref}
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            exit="exit"
            className="bg-black-40 rounded-lg p-6 space-y-4"
        >
            <div className="w-full h-48 bg-black-30 flex items-center justify-center rounded-md overflow-hidden">
                <img
                    src={imageUrl}
                    alt={itemTitle}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium">{itemTitle}</h3>
                    {fullDetails && (
                        <div className="text-muted text-sm mt-1">
                            {'type' in fullDetails && <p>Тип: {fullDetails.type}</p>}
                            {'capacity' in fullDetails && <p>Місткість: {fullDetails.capacity} осіб</p>}
                        </div>
                    )}
                    <button
                        onClick={() => {
                            if (openDescriptionId === item.id) {
                                setOpenDescriptionId(null);
                                setEditingClientDescription({ id: null, value: '', isFocused: false });
                            } else {
                                setOpenDescriptionId(item.id);
                                setEditingClientDescription({ id: item.id, value: item.clientDescription || '', isFocused: false });
                            }
                        }}
                        className="mt-2 px-3 py-1 bg-black-30 text-muted text-sm rounded-md hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        {item.clientDescription ? 'Редагувати опис' : 'Додати опис'} {openDescriptionId === item.id ? <ChevronUp size={16} className="inline-block" /> : <ChevronDown size={16} className="inline-block" />}
                    </button>
                </div>
                <button
                    onClick={handleRemove}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                    <Trash2 size={20} className="text-red-500" />
                </button>
            </div>

            <div className="space-y-4">
                {openDescriptionId === item.id && (
                    <div className="relative">
                        <textarea
                            className="w-full p-3 rounded-lg bg-black-30 text-white placeholder-muted resize-none pr-24"
                            rows={3}
                            placeholder="Додати опис до замовлення (необов'язково)"
                            value={editingClientDescription.id === item.id ? editingClientDescription.value : item.clientDescription || ''}
                            onChange={(e) => setEditingClientDescription({ id: item.id, value: e.target.value, isFocused: editingClientDescription.isFocused })}
                            onFocus={() => setEditingClientDescription(prev => ({ ...prev, isFocused: true }))}
                            onBlur={(e) => {
                                const description = e.target.value;
                                if (item.id) {
                                    updateVehicleDescription(item.id, description);
                                    if (onUpdateClientDescription) {
                                        onUpdateClientDescription(description);
                                    }
                                }
                                setEditingClientDescription(prev => ({ ...prev, isFocused: false }));
                            }}
                        ></textarea>
                        <div className={`absolute bottom-2 right-2 flex items-center gap-1.5 text-xs text-muted/70 transition-opacity duration-200 ${editingClientDescription.isFocused ? 'opacity-100' : 'opacity-0'}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>Покиньте поле щоб зберегти опис</span>
                        </div>
                    </div>
                )}

                {currentVehicle && (
                    <>
                        {currentVehicle.pricePerHour && currentVehicle.pricePerDay ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handlePaymentTypeChange('full')}
                                    className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                                        currentPaymentType === 'full'
                                            ? 'bg-coral text-white'
                                            : 'bg-black-30 text-muted hover:bg-white/5'
                                    }`}
                                >
                                    На весь день
                                </button>
                                <button
                                    onClick={() => handlePaymentTypeChange('hourly')}
                                    className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                                        currentPaymentType === 'hourly'
                                            ? 'bg-coral text-white'
                                            : 'bg-black-30 text-muted hover:bg-white/5'
                                    }`}
                                >
                                    Погодинно
                                </button>
                            </div>
                        ) : currentVehicle.pricePerHour ? (
                            <div className="text-muted mb-2">Оплата погодинно</div>
                        ) : (
                            <div className="text-muted mb-2">Оплата за весь день</div>
                        )}
                    </>
                )}

                {currentPaymentType === 'hourly' && currentVehicle?.pricePerHour && (
                    <div className="flex items-center gap-4">
                        <span className="text-muted">Кількість годин:</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleHoursChange(currentHours - 1)}
                                disabled={currentHours <= 1}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="text-lg">{currentHours}</span>
                            <button
                                onClick={() => handleHoursChange(currentHours + 1)}
                                disabled={currentHours >= 14}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                )}
                <div className="mt-4">
                    <button
                        onClick={() => onDetailsClick(item, fullDetails)}
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-coral rounded-md hover:bg-coral-dark transition-colors duration-200 cursor-pointer"
                    >
                        Детальніше
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <span className="text-xl font-medium text-coral">
                    {currentPaymentType === 'hourly' && currentVehicle?.pricePerHour
                        ? `${(currentVehicle.pricePerHour) * currentHours} ₴`
                        : `${currentVehicle?.pricePerDay || item.price} ₴`}
                </span>
            </div>
        </motion.div>
    );
};

export default VehicleTabItem;
