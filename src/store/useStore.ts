import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    role: string;
    email?: string;
}

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: null, // Mặc định là NULL, phải đăng nhập
            setUser: (user: User | null) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'camrent-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
