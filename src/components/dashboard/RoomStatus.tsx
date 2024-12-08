import React, { useEffect, useState } from 'react';
import { Room } from '../../types';
import { roomService } from '../../services/roomService';

const statusColors = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-red-100 text-red-800',
  cleaning: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-gray-100 text-gray-800',
};

export function RoomStatus() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Room Status</h3>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Room Status</h3>
        <p className="text-sm text-gray-600">No rooms available to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Room Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Room {room.room_number}</span>
              <span className={`px-2 py-1 rounded-full text-xs {statusColors[room.status]}`}>
                {room.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>{room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)}</p>
              <p>{room.price_per_night}/night</p>
              <p>Floor {room.floor_number}</p>
              <p>Capacity: {room.capacity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}