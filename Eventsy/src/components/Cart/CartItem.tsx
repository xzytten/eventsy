import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import useFoodStore from '@/store/foodStore';
import { Trash2, Plus, Minus } from 'lucide-react';
import { type CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateDescription: (id: string, description: string) => void;
}

export default function CartItem({ item, updateQuantity, removeFromCart, updateDescription }: CartItemProps) {
  const { itemDescriptions } = useCartStore();
  const { foodDescriptions, updateFoodDescription } = useFoodStore();
  const [localDesc, setLocalDesc] = useState('');

  useEffect(() => {
    if (item.category === 'food') {
      const savedDesc = foodDescriptions[item.id] || '';
      setLocalDesc(savedDesc);
      console.log('Loading food description:', { id: item.id, description: savedDesc });
    } else {
      setLocalDesc(itemDescriptions[item.id] || '');
    }
  }, [item.category, item.id, foodDescriptions, itemDescriptions]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDesc(e.target.value);
  };

  const handleDescriptionBlur = () => {
    if (item.category === 'food') {
      console.log('Saving food description on blur:', { id: item.id, description: localDesc });
      updateFoodDescription(item.id, localDesc);
    } else {
      updateDescription(item.id, localDesc);
    }
  };

  return (
    <div className="bg-black-40 rounded-lg p-6 space-y-4">
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Minus size={20} />
          </button>
          <span className="text-lg">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <span className="text-xl font-medium text-coral">
          {(item.price || 0) * item.quantity} ₴
        </span>
      </div>
      <div className="mt-4">
        <textarea
          value={localDesc}
          onChange={handleDescriptionChange}
          onBlur={handleDescriptionBlur}
          placeholder="Додати опис до замовлення (необов'язково)"
          className="w-full bg-black-30 rounded-lg p-3 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-coral"
          rows={3}
        />
      </div>
    </div>
  );
} 