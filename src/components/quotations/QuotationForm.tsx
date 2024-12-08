import { useState, useEffect } from 'react';
import { Quotation, QuotationItem, Room } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface QuotationFormProps {
  initialData?: Quotation;
  onSubmit: (data: Partial<Quotation>) => void;
  onCancel: () => void;
  guest_id?: string;
}

export function QuotationForm({ initialData, onSubmit, onCancel, guest_id }: QuotationFormProps) {
  const [items, setItems] = useState<QuotationItem[]>(initialData?.items || []);
  const [guestId, setGuestId] = useState(guest_id || initialData?.guest_id || '');
  const [validUntil, setValidUntil] = useState(initialData?.valid_until?.split('T')[0] || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [nights, setNights] = useState(1);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available')
        .order('room_number');
      
      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const addItem = () => {
    if (selectedRoom) {
      const newItem: QuotationItem = {
        description: `Room ${selectedRoom.room_number} - ${selectedRoom.room_type}`,
        quantity: nights,
        unit_price: selectedRoom.price_per_night,
        total: selectedRoom.price_per_night * nights
      };
      setItems([...items, newItem]);
      setSelectedRoom(null);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' || field === 'unit_price' 
        ? Number(value) * (field === 'quantity' ? newItems[index].unit_price : newItems[index].quantity)
        : newItems[index].total
    };
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.14; // 14% VAT/Levy
    const amount = subtotal + tax;
    return { subtotal, tax, amount };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { subtotal, tax, amount } = calculateTotals();
    onSubmit({
      guest_id: guestId,
      date: new Date().toISOString(),
      valid_until: new Date(validUntil).toISOString(),
      items,
      subtotal,
      tax,
      amount,
      status: 'draft',
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Guest ID</Label>
        <Input
          type="text"
          value={guestId}
          onChange={(e) => setGuestId(e.target.value)}
          required
          disabled={!!guest_id}
        />
      </div>

      <div>
        <Label>Valid Until</Label>
        <Input
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Items</Label>
          <div className="flex gap-4">
            <div>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedRoom?.id || ''}
                onChange={(e) => {
                  const room = rooms.find(r => r.id === e.target.value);
                  setSelectedRoom(room || null);
                }}
              >
                <option value="">Select a room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    Room {room.room_number} - {room.room_type} (BWP {room.price_per_night}/night)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Input
                type="number"
                min="1"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                placeholder="Nights"
              />
            </div>
            <Button type="button" onClick={addItem} variant="outline" size="sm" disabled={!selectedRoom}>
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-5">
              <Label>Description</Label>
              <Input
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Unit Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.unit_price}
                onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Total</Label>
              <div className="h-10 flex items-center">
                BWP {item.total.toFixed(2)}
              </div>
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Label>Notes</Label>
        <textarea
          className="w-full p-2 border rounded-md"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>BWP {calculateTotals().subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT/Levy (14%):</span>
          <span>BWP {calculateTotals().tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>BWP {calculateTotals().amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Quotation
        </Button>
      </div>
    </form>
  );
}
