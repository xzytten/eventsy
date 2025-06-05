import { type FC, useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Minus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { type CartItem } from '@/types/cart';
import { type IAnimator } from '@/types/animator';
import { useAnimatorStore } from '@/store/animatorStore';

interface CartItemComponentProps {
    item: CartItem;
    fullDetails?: IAnimator;
    onRemove?: () => void;
    onUpdateQuantity?: (id: string, quantity: number) => void;
    onUpdateClientDescription?: (id: string, description: string) => void;
    onUpdatePaymentType?: (paymentType: 'full' | 'hourly') => void;
    onUpdateHours?: (hours: number) => void;
    onDetailsClick: (item: CartItem, fullDetails?: IAnimator) => void;
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

const AnimatorTabItem: FC<CartItemComponentProps> = ({
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
    const updateAnimatorDescription = useAnimatorStore(state => state.updateAnimatorDescription);
    const selectedAnimators = useAnimatorStore(state => state.selectedAnimators);
    const currentAnimator = selectedAnimators.find(a => a._id === item.id);
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

    const imageUrl = fullDetails && 'images' in fullDetails && fullDetails.images?.[0] || item.image || '/placeholder-service.jpg';
    const itemTitle = fullDetails && 'name' in fullDetails ? fullDetails.name : item.title;

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
                            {'experience' in fullDetails && <p>Досвід: {fullDetails.experience} років</p>}
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
                    onClick={onRemove}
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
                                    updateAnimatorDescription(item.id, description);
                                    if (onUpdateClientDescription) {
                                        onUpdateClientDescription(item.id, description);
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

                <div className="flex gap-4">
                    <button
                        onClick={() => onUpdatePaymentType?.('full')}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${item.paymentType === 'full'
                                ? 'bg-coral text-white'
                                : 'bg-black-30 text-muted hover:bg-white/5'
                            }`}
                    >
                        На весь день
                    </button>
                    <button
                        onClick={() => onUpdatePaymentType?.('hourly')}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${item.paymentType === 'hourly'
                                ? 'bg-coral text-white'
                                : 'bg-black-30 text-muted hover:bg-white/5'
                            }`}
                    >
                        Погодинно
                    </button>
                </div>

                {item.paymentType === 'hourly' && (
                    <div className="flex items-center gap-4">
                        <span className="text-muted">Кількість годин:</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onUpdateQuantity?.(item.id, (item.quantity || 1) - 1)}
                                disabled={(item.quantity || 1) <= 1}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="text-lg">{item.quantity || 1}</span>
                            <button
                                onClick={() => onUpdateQuantity?.(item.id, (item.quantity || 1) + 1)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
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
                    {item.paymentType === 'hourly' && item.hours && item.hourlyPrice
                        ? `${(item.hourlyPrice) * (item.hours)} ₴`
                        : `${item.price} ₴`}
                </span>
            </div>
        </motion.div>
    );
};

export default AnimatorTabItem; 