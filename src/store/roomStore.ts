import { create } from 'zustand';
import { Room } from '../types';
import { roomService } from '../services/roomService';

interface RoomStore {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  fetchRooms: () => Promise<void>;
  updateRoomStatus: (id: string, status: Room['status']) => Promise<void>;
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  loading: false,
  error: null,
  fetchRooms: async () => {
    set({ loading: true });
    try {
      const rooms = await roomService.getAllRooms();
      set({ rooms, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateRoomStatus: async (id, status) => {
    try {
      await roomService.updateRoomStatus(id, status);
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === id ? { ...room, status } : room
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));