import { type FC, useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Minus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { CartItem } from '@/types/cart';
import type { IPhotographer } from '@/types/photographer';
import usePhotographerStore from '@/store/photographerStore';
import toast from 'react-hot-toast';

interface PhotographerItemComponentProps {
    item: CartItem;
    fullDetails?: IPhotographer;
    onRemove?: () => void;
    onUpdateQuantity?: (id: string, quantity: number) => void;
    onUpdateClientDescription?: (id: string, description: string) => void;
    onUpdatePaymentType?: (paymentType: 'full' | 'hourly') => void;
    onDetailsClick: (item: CartItem, fullDetails?: IPhotographer) => void;
}

const itemVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: {
        opacity: 1, x: 0,
        transition: { type: "spring", stiffness: 50, damping: 15, mass: 1.2, duration: 0.8 }
    },
    exit: {
        opacity: 0, x: 150,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
};

const PhotographerTabItem: FC<PhotographerItemComponentProps> = ({
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

    const updatePhotographerDescription = usePhotographerStore(state => state.updatePhotographerDescription);
    const updatePhotographersPaymentType = usePhotographerStore(state => state.updatePhotographerPaymentType);
    const updatePhotographerHours = usePhotographerStore(state => state.updatePhotographerHours);

    const removePhotographer = usePhotographerStore(state => state.removePhotographer);
    const selectedPhotographers = usePhotographerStore(state => state.selectedPhotographers);
    const currentPhotographer = selectedPhotographers.find(p => p._id === item.id);

    const [openDescriptionId, setOpenDescriptionId] = useState<string | null>(null);
    const [editingClientDescription, setEditingClientDescription] = useState({
        id: null as string | null,
        value: item.clientDescription || '',
        isFocused: false
    });

    useEffect(() => {
        setEditingClientDescription(prev => ({ ...prev, value: item.clientDescription || '' }));
    }, [item.clientDescription]);

    const handleRemove = () => {
        if (item.id) {
            removePhotographer(item.id);
            toast.success(`Фотограф '${fullDetails?.name || item.title}' був видалений!`)
            if (onRemove) {
                onRemove();
            }
        }
    };

    const handleDescriptionSave = (description: string) => {
        if (item.id) {
            updatePhotographerDescription(item.id, description);
            onUpdateClientDescription?.(item.id, description);
        }
    };

    const handlePaymentTypeChange = (paymentType: 'full' | 'hourly') => {
        if (item.id) {
            updatePhotographersPaymentType(item.id, paymentType);
            if (onUpdatePaymentType) {
                onUpdatePaymentType(paymentType);
            }
        }
    };

    const handleHoursChange = (hours: number) => {
        if (item.id) {
            updatePhotographerHours(item.id, hours);
            if (onUpdateQuantity) {
                onUpdateQuantity(item.id, hours);
            }
        }
    };

    const itemTitle = fullDetails?.name || item.title;

    return (
        <motion.div
            ref={ref}
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            exit="exit"
            className="bg-black-40 rounded-lg p-6 space-y-4"
        >
            <div className='flex w-full items-center justify-center'>
                <div className="w-[700px] h-auto  bg-black-30 flex items-center justify-center rounded-md overflow-hidden">
                    <img
                        src={`http://localhost:8087${item.images[0]}` || '/placeholder-animator.jpg'}
                        alt={itemTitle}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium">{itemTitle}</h3>
                    {fullDetails && (
                        <div className="text-muted text-sm mt-1">
                            <p>Досвід: {fullDetails.experience} років</p>
                            <p>Ціна за годину: {fullDetails.pricePerHour} грн</p>
                            <p>Ціна за день: {fullDetails.pricePerDay} грн</p>
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
                        className="mt-2 px-3 py-1 bg-black-30 text-muted text-sm rounded-md hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                        {item.clientDescription ? 'Редагувати опис' : 'Додати опис'}{' '}
                        {openDescriptionId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
                <button onClick={handleRemove} className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                    <Trash2 size={20} className="text-red-500" />
                </button>
            </div>

            {openDescriptionId === item.id && (
                <div className="relative">
                    <textarea
                        className="w-full p-3 rounded-lg bg-black-30 text-white placeholder-muted resize-none pr-24"
                        rows={3}
                        placeholder="Додати опис до замовлення (необов'язково)"
                        value={editingClientDescription.value}
                        onChange={(e) => setEditingClientDescription({ ...editingClientDescription, value: e.target.value })}
                        onBlur={() => {
                            handleDescriptionSave(editingClientDescription.value);
                            setEditingClientDescription(prev => ({ ...prev, isFocused: false }));
                        }}
                        onFocus={() => setEditingClientDescription(prev => ({ ...prev, isFocused: true }))}
                    />
                    <div className={`absolute bottom-2 right-2 text-xs text-muted/70 ${editingClientDescription.isFocused ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                        <span>Покиньте поле щоб зберегти опис</span>
                    </div>
                </div>
            )}
            {currentPhotographer && (
                <>
                    {currentPhotographer.pricePerHour && currentPhotographer.pricePerDay ? (
                        <div className="flex gap-4">
                            <button
                                onClick={() => handlePaymentTypeChange('full')}
                                className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${item.paymentType === 'full'
                                    ? 'bg-coral text-white'
                                    : 'bg-black-30 text-muted hover:bg-white/5'
                                    }`}
                            >
                                На весь день
                            </button>
                            <button
                                onClick={() => handlePaymentTypeChange('hourly')}
                                className={`flex-1 py-2 px-4 rounded-lg transition-colors cursor-pointer ${item.paymentType === 'hourly'
                                    ? 'bg-coral text-white'
                                    : 'bg-black-30 text-muted hover:bg-white/5'
                                    }`}
                            >
                                Погодинно
                            </button>
                        </div>
                    ) : currentPhotographer.pricePerHour ? (
                        <div className="text-muted mb-2">Оплата погодинно</div>
                    ) : (
                        <div className="text-muted mb-2">Оплата за весь день</div>
                    )}
                </>
            )}
            {item.paymentType === 'hourly' && currentPhotographer?.pricePerHour && (
                <div className="flex items-center gap-4">
                    <span className="text-muted">Кількість годин:</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleHoursChange((item.hours || 1) - 1)}
                            disabled={(item.hours || 1) <= 1}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="text-lg">{item.hours || 1}</span>
                        <button
                            onClick={() => handleHoursChange((item.hours || 1) + 1)}
                            disabled={(item.hours || 1) >= 14}
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

            <div className="flex justify-end">
                <span className="text-xl font-medium text-coral">
                    {item.paymentType === 'hourly' && currentPhotographer?.pricePerHour
                        ? `${currentPhotographer.pricePerHour * (item.hours || 1)} ₴`
                        : `${currentPhotographer?.pricePerDay || item.price} ₴`}
                </span>
            </div>
        </motion.div>
    );
};

export default PhotographerTabItem;
