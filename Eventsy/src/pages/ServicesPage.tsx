import { type FC, useState, useMemo, useEffect } from 'react';
import { Users, Camera, Car, SlidersHorizontal, ShoppingCart, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '@/components/ServiceCard/ServiceCard';
import { useCart } from '@/hooks/useCart';

type ServiceCategory = 'animators' | 'photographers' | 'cars';
type EventType = 'wedding' | 'birthday' | 'corporate' | 'graduation' | 'holiday';

interface Service {
    id: string;
    title: string;
    price: number;
    hourlyPrice?: number;
    duration: string;
    location: string;
    image: string;
    eventTypes: EventType[];
    category: ServiceCategory;
}

const servicesData: Record<ServiceCategory, Service[]> = {
    animators: [
        {
            id: 'animator-1',
            title: 'Аніматор Міккі Маус',
            price: 2000,
            hourlyPrice: 300,
            duration: '2 години',
            location: 'Київ',
            image: 'Міккі Маус',
            eventTypes: ['birthday', 'corporate'],
            category: 'animators'
        },
        {
            id: 'animator-2',
            title: 'Аніматор Спайдермен',
            price: 2000,
            hourlyPrice: 300,
            duration: '2 години',
            location: 'Київ',
            image: 'Спайдермен',
            eventTypes: ['birthday', 'corporate', 'graduation'],
            category: 'animators'
        },
        {
            id: 'animator-3',
            title: 'Аніматор Бетмен',
            price: 2000,
            hourlyPrice: 300,
            duration: '2 години',
            location: 'Київ',
            image: 'Бетмен',
            eventTypes: ['birthday', 'corporate'],
            category: 'animators'
        },
        {
            id: 'animator-4',
            title: 'Аніматор Принцеса',
            price: 2500,
            hourlyPrice: 350,
            duration: '2 години',
            location: 'Київ',
            image: 'Принцеса',
            eventTypes: ['birthday', 'holiday'],
            category: 'animators'
        },
        {
            id: 'animator-5',
            title: 'Аніматор Супермен',
            price: 2200,
            hourlyPrice: 320,
            duration: '2 години',
            location: 'Київ',
            image: 'Супермен',
            eventTypes: ['birthday', 'corporate', 'graduation'],
            category: 'animators'
        },
        {
            id: 'animator-6',
            title: 'Аніматор Пірати',
            price: 2600,
            hourlyPrice: 380,
            duration: '3 години',
            location: 'Київ',
            image: 'Пірати',
            eventTypes: ['birthday', 'corporate', 'holiday'],
            category: 'animators'
        },
        {
            id: 'animator-7',
            title: 'Аніматор Космонавт',
            price: 2800,
            hourlyPrice: 400,
            duration: '2 години',
            location: 'Київ',
            image: 'Космонавт',
            eventTypes: ['birthday', 'graduation'],
            category: 'animators'
        },
        {
            id: 'animator-8',
            title: 'Аніматор Фея',
            price: 2300,
            hourlyPrice: 330,
            duration: '2 години',
            location: 'Київ',
            image: 'Фея',
            eventTypes: ['birthday', 'holiday'],
            category: 'animators'
        }
    ],
    photographers: [
        {
            id: 'photographer-1',
            title: 'Фотограф на весілля',
            price: 5000,
            hourlyPrice: 800,
            duration: '6 годин',
            location: 'Київ',
            image: 'Фотограф 1',
            eventTypes: ['wedding'],
            category: 'photographers'
        },
        {
            id: 'photographer-2',
            title: 'Фотограф на день народження',
            price: 3000,
            hourlyPrice: 500,
            duration: '4 години',
            location: 'Київ',
            image: 'Фотограф 2',
            eventTypes: ['birthday', 'graduation'],
            category: 'photographers'
        },
        {
            id: 'photographer-3',
            title: 'Фотограф на корпоратив',
            price: 4000,
            hourlyPrice: 700,
            duration: '5 годин',
            location: 'Київ',
            image: 'Фотограф 3',
            eventTypes: ['corporate', 'holiday'],
            category: 'photographers'
        },
        {
            id: 'photographer-4',
            title: 'Студійний фотограф',
            price: 2000,
            hourlyPrice: 400,
            duration: '2 години',
            location: 'Київ',
            image: 'Студійний фотограф',
            eventTypes: ['birthday', 'graduation', 'corporate'],
            category: 'photographers'
        },
        {
            id: 'photographer-5',
            title: 'Репортажний фотограф',
            price: 6000,
            hourlyPrice: 1000,
            duration: '8 годин',
            location: 'Київ',
            image: 'Репортажний фотограф',
            eventTypes: ['wedding', 'corporate', 'holiday'],
            category: 'photographers'
        },
        {
            id: 'photographer-6',
            title: 'Сімейний фотограф',
            price: 2500,
            hourlyPrice: 450,
            duration: '3 години',
            location: 'Київ',
            image: 'Сімейний фотограф',
            eventTypes: ['birthday', 'holiday'],
            category: 'photographers'
        },
        {
            id: 'photographer-7',
            title: 'Фотограф на випускний',
            price: 4500,
            hourlyPrice: 750,
            duration: '5 годин',
            location: 'Київ',
            image: 'Фотограф на випускний',
            eventTypes: ['graduation'],
            category: 'photographers'
        },
        {
            id: 'photographer-8',
            title: 'Фотограф на свято',
            price: 3500,
            hourlyPrice: 600,
            duration: '4 години',
            location: 'Київ',
            image: 'Фотограф на свято',
            eventTypes: ['holiday', 'corporate'],
            category: 'photographers'
        }
    ],
    cars: [
        {
            id: 'car-1',
            title: 'Ретро автомобіль',
            price: 5000,
            duration: '1 день',
            location: 'Київ',
            image: 'Ретро авто',
            eventTypes: ['wedding', 'graduation'],
            category: 'cars'
        },
        {
            id: 'car-2',
            title: 'Спортивний автомобіль',
            price: 6000,
            duration: '1 день',
            location: 'Київ',
            image: 'Спорт авто',
            eventTypes: ['wedding', 'corporate'],
            category: 'cars'
        },
        {
            id: 'car-3',
            title: 'Лімузин',
            price: 8000,
            duration: '1 день',
            location: 'Київ',
            image: 'Лімузин',
            eventTypes: ['wedding', 'corporate', 'graduation'],
            category: 'cars'
        },
        {
            id: 'car-4',
            title: 'Класичний Роллс-Ройс',
            price: 15000,
            duration: '1 день',
            location: 'Київ',
            image: 'Роллс-Ройс',
            eventTypes: ['wedding'],
            category: 'cars'
        },
        {
            id: 'car-5',
            title: 'Відкритий кабріолет',
            price: 10000,
            duration: '1 день',
            location: 'Київ',
            image: 'Кабріолет',
            eventTypes: ['wedding', 'graduation', 'holiday'],
            category: 'cars'
        },
        {
            id: 'car-6',
            title: 'Мінівен для компанії',
            price: 7000,
            duration: '1 день',
            location: 'Київ',
            image: 'Мінівен',
            eventTypes: ['corporate', 'holiday'],
            category: 'cars'
        },
        {
            id: 'car-7',
            title: 'Електромобіль Tesla',
            price: 12000,
            duration: '1 день',
            location: 'Київ',
            image: 'Tesla',
            eventTypes: ['wedding', 'corporate'],
            category: 'cars'
        },
        {
            id: 'car-8',
            title: 'Вітчизняний автопром',
            price: 4000,
            duration: '1 день',
            location: 'Київ',
            image: 'Вітчизняний автопром',
            eventTypes: ['wedding', 'graduation', 'corporate'],
            category: 'cars'
        }
    ]
};

const eventTypeLabels: Record<EventType, string> = {
    wedding: 'Весілля',
    birthday: 'День народження',
    corporate: 'Корпоратив',
    graduation: 'Випускний',
    holiday: 'Свято'
};

const ServicesPage: FC = () => {
    const [activeCategory, setActiveCategory] = useState<ServiceCategory>('animators');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
    const [showCart, setShowCart] = useState(false);
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, updatePaymentType } = useCart();
    const navigate = useNavigate();

    const categories = [
        { id: 'animators', icon: <Users size={20} />, label: 'Аніматори' },
        { id: 'photographers', icon: <Camera size={20} />, label: 'Фотографи' },
        { id: 'cars', icon: <Car size={20} />, label: 'Автомобілі' }
    ] as const;

    // Знаходимо максимальну погодинну ціну
    const maxHourlyPrice = useMemo(() => {
        return Math.max(
            ...Object.values(servicesData).flatMap(services =>
                services.map(service => service.hourlyPrice || 0)
            )
        );
    }, []);

    // Оновлюємо початковий діапазон цін
    useEffect(() => {
        setPriceRange({ min: 0, max: maxHourlyPrice });
    }, [maxHourlyPrice]);

    const filteredServices = useMemo(() => {
        return servicesData[activeCategory].filter(service => {
            const matchesPrice = !service.hourlyPrice ||
                (service.hourlyPrice >= priceRange.min && service.hourlyPrice <= priceRange.max);
            const matchesEventType = selectedEventTypes.length === 0 ||
                selectedEventTypes.some(type => service.eventTypes.includes(type));
            return matchesPrice && matchesEventType;
        });
    }, [activeCategory, priceRange, selectedEventTypes]);

    const toggleEventType = (type: EventType) => {
        setSelectedEventTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex gap-8">
                {/* Бокове меню */}
                <div className="w-64 shrink-0 sticky top-4 h-fit">
                    <div className="bg-black-30 rounded-xl p-4 space-y-2">
                        {categories.map(({ id, icon, label }) => (
                            <button
                                key={id}
                                onClick={() => {
                                    setActiveCategory(id as ServiceCategory);
                                    setShowCart(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${activeCategory === id && !showCart
                                        ? 'bg-coral text-white'
                                        : 'text-muted hover:bg-white/5'
                                    }`}
                            >
                                {icon}
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Фільтри */}
                    <div className="bg-black-30 rounded-xl p-4 mt-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            disabled={showCart}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${showCart
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'text-muted hover:bg-white/5'
                                }`}
                        >
                            <SlidersHorizontal size={20} />
                            <span>Фільтри</span>
                        </button>

                        {showFilters && !showCart && (
                            <div className="mt-4 space-y-6">
                                {/* Фільтр по ціні */}
                                <div>
                                    <label className="block text-sm text-muted mb-2">
                                        Діапазон погодинних цін
                                    </label>
                                    <div className="space-y-4">
                                        <div className="relative h-2 bg-black-40 rounded-full">
                                            <div
                                                className="absolute h-full bg-coral rounded-full"
                                                style={{
                                                    left: `${(priceRange.min / maxHourlyPrice) * 100}%`,
                                                    right: `${100 - (priceRange.max / maxHourlyPrice) * 100}%`
                                                }}
                                            />
                                            <input
                                                type="range"
                                                min={0}
                                                max={maxHourlyPrice}
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({
                                                    ...prev,
                                                    min: Math.min(Number(e.target.value), prev.max)
                                                }))}
                                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <input
                                                type="range"
                                                min={0}
                                                max={maxHourlyPrice}
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({
                                                    ...prev,
                                                    max: Math.max(Number(e.target.value), prev.min)
                                                }))}
                                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm text-muted">
                                            <span>{priceRange.min} ₴</span>
                                            <span>{priceRange.max} ₴</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Фільтр по типу події */}
                                <div>
                                    <label className="block text-sm text-muted mb-2">
                                        Тип події
                                    </label>
                                    <div className="space-y-2">
                                        {Object.entries(eventTypeLabels).map(([type, label]) => (
                                            <label
                                                key={type}
                                                className="flex items-center gap-2 text-sm cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEventTypes.includes(type as EventType)}
                                                    onChange={() => toggleEventType(type as EventType)}
                                                    className="rounded border-white/20 bg-black-40 cursor-pointer"
                                                />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Кнопка кошика */}
                    <div className="bg-black-30 rounded-xl p-4 mt-4">
                        <button
                            onClick={() => setShowCart(!showCart)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${showCart
                                    ? 'bg-coral text-white'
                                    : 'text-muted hover:bg-white/5'
                                }`}
                        >
                            <ShoppingCart size={20} />
                            <span>Кошик</span>
                            {cartItems.length > 0 && (
                                <span className="ml-auto bg-coral text-white px-2 py-0.5 rounded-full text-sm">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Основний контент */}
                <div className="flex-1">
                    {showCart ? (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Кошик</h1>
                            </div>

                            <div className="space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="text-center text-muted py-12 text-lg">
                                        Кошик порожній
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-black-40 rounded-lg p-6 space-y-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-medium">{item.title}</h3>
                                                    <p className="text-muted mt-1">{item.duration}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={20} className="text-red-500" />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => updatePaymentType(item.id, 'full')}
                                                        className={`flex-1 py-2 px-4 rounded-lg transition-colors ${item.paymentType === 'full'
                                                                ? 'bg-coral text-white'
                                                                : 'bg-black-30 text-muted hover:bg-white/5'
                                                            }`}
                                                    >
                                                        На весь день
                                                    </button>
                                                        <button
                                                            onClick={() => updatePaymentType(item.id, 'hourly')}
                                                            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${item.paymentType === 'hourly'
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
                                                                onClick={() => updatePaymentType(item.id, 'hourly', (item.hours || 1) - 1)}
                                                                disabled={(item.hours || 1) <= 1}
                                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Minus size={20} />
                                                            </button>
                                                            <span className="text-lg">{item.hours || 1}</span>
                                                            <button
                                                                onClick={() => updatePaymentType(item.id, 'hourly', (item.hours || 1) + 1)}
                                                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                            >
                                                                <Plus size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <span className="text-xl font-medium text-coral">
                                                    {item.paymentType === 'hourly'
                                                        ? `${(item.hourlyPrice || item.price) * (item.hours || 1)} ₴`
                                                        : `${item.price} ₴`}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cartItems.length > 0 && (
                                <div className="mt-6 bg-black-30 rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xl">Всього:</span>
                                        <span className="text-2xl font-semibold text-coral">
                                            {getTotalPrice()} ₴
                                        </span>
                                    </div>
                                    <button
                                        className="w-full bg-coral text-white py-4 rounded-lg text-lg font-medium hover:bg-coral/90 transition-colors" rel='noreferrer'
                                    >
                                        Оформити замовлення
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    id={service.id}
                                    title={service.title}
                                    price={service.price}
                                    hourlyPrice={service.hourlyPrice}
                                    duration={service.duration}
                                    location={service.location}
                                    image={service.image}
                                    category={service.category}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage; 