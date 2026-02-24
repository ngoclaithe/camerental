import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

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

const customStorage: StateStorage = {
    getItem: (name: string): string | null => {
        return localStorage.getItem(name) || sessionStorage.getItem(name) || null;
    },
    setItem: (name: string, value: string): void => {
        if (sessionStorage.getItem('prefer_session') === 'true') {
            sessionStorage.setItem(name, value);
            localStorage.removeItem(name);
        } else {
            localStorage.setItem(name, value);
            sessionStorage.removeItem(name);
        }
    },
    removeItem: (name: string): void => {
        localStorage.removeItem(name);
        sessionStorage.removeItem(name);
    }
};

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: null, // Mặc định là NULL, phải đăng nhập
            setUser: (user: User | null) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'camrent-storage',
            storage: createJSONStorage(() => customStorage),
        }
    )
);
