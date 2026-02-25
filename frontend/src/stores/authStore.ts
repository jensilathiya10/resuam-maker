'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User) => void;
}

/** No-op storage for SSR */
const createNoopStorage = () => ({
  getItem: (_name: string) => null,
  setItem: (_name: string, _value: string) => {},
  removeItem: (_name: string) => {},
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      login: async (email, password) => {
        try {
          const response = await authApi.login({ email, password });
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          set({
            user: response.user,
            isAuthenticated: true,
            accessToken: response.accessToken,
          });
        } catch (err: any) {
          console.error('Login failed', err);
          throw err;
        }
      },

      register: async (name, email, password) => {
        try {
          const response = await authApi.register({ name, email, password });
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          set({
            user: response.user,
            isAuthenticated: true,
            accessToken: response.accessToken,
          });
        } catch (err: any) {
          console.error('Register failed', err);
          throw err;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            authApi.logout(refreshToken).catch(() => {});
          }
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
        });
      },

      refreshAccessToken: async () => {
        if (typeof window === 'undefined') return;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token found');

          // Call refresh endpoint (make sure you have this in your authApi)
          const response = await authApi.refresh(refreshToken);

          localStorage.setItem('accessToken', response.accessToken);
          set({ accessToken: response.accessToken });
        } catch (err) {
          console.error('Failed to refresh token', err);
          get().logout();
        }
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () =>
        typeof window !== 'undefined' ? localStorage : createNoopStorage(),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);