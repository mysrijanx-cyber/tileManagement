

import { create } from 'zustand';
import { Tile, Room, Showroom, TileApplication, UserProfile } from '../types';
import { persist } from 'zustand/middleware';
interface AppState {
  currentShowroom: Showroom | null;
  selectedTile: Tile | null;
  selectedRoom: Room | null;
  appliedTiles: Record<string, string>; // surface -> tileId
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  favorites: string[]; // tile IDs
  
  // Actions
  setCurrentShowroom: (showroom: Showroom) => void;
  setSelectedTile: (tile: Tile | null) => void;
  setSelectedRoom: (room: Room | null) => void;
  applyTileToSurface: (surface: string, tileId: string) => void;
  setCurrentUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  addToFavorites: (tileId: string) => void;
  removeFromFavorites: (tileId: string) => void;
  setFavorites: (favorites: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentShowroom: null,
  selectedTile: null,
  selectedRoom: null,
  appliedTiles: {},
  // ✅ FIXED: Real authentication only (no hardcoded users)
  currentUser: null,
  isAuthenticated: false,
  favorites: [],

  setCurrentShowroom: (showroom) => set({ currentShowroom: showroom }),
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  applyTileToSurface: (surface, tileId) => 
    set((state) => ({
      appliedTiles: { ...state.appliedTiles, [surface]: tileId }
    })),
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  addToFavorites: (tileId) => 
    set((state) => ({
      favorites: [...state.favorites.filter(id => id !== tileId), tileId]
    })),
  removeFromFavorites: (tileId) => 
    set((state) => ({
      favorites: state.favorites.filter(id => id !== tileId)
    })),
  setFavorites: (favorites) => set({ favorites }),
}));