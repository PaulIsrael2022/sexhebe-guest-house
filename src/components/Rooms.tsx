import React, { useEffect, useState } from 'react';
import { db } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { Button } from './ui/button';
import { toast } from './ui/toast';

type Room = Database['public']['Tables']['rooms']['Row'];
type NewRoom = Database['public']['Tables']['rooms']['Insert'];

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await db.rooms.getAll();
      if (error) throw error;
      setRooms(data || []);
      toast({
        title: 'Success',
        description: `Loaded {data?.length || 0} rooms from database`,
      });
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rooms. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestRoom = async () => {
    try {
      const newRoom: NewRoom = {
        room_number: '101',
        room_type: 'single',
        status: 'available',
        floor_number: 1,
        price_per_night: 100,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'AC'],
        description: 'A comfortable single room',
        images: []
      };

      const { data, error } = await db.rooms.create(newRoom);
      if (error) throw error;
      
      setRooms(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Test room created successfully',
      });
    } catch (error) {
      console.error('Error creating test room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create test room. Please check console for details.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Rooms</h2>
        <Button onClick={createTestRoom}>Create Test Room</Button>
      </div>
      
      {isLoading ? (
        <div>Loading rooms...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">Room {room.room_number}</h3>
              <p>Type: {room.room_type}</p>
              <p>Status: {room.status}</p>
              <p>Floor: {room.floor_number}</p>
              <p>Price: {room.price_per_night}</p>
              <p>Capacity: {room.capacity} persons</p>
              {room.amenities && (
                <p>Amenities: {(room.amenities as string[]).join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
