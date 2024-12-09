import { create } from "zustand";

interface FilterState {
  filtersOpen: boolean;
  toggleFilters: () => void;
  setFiltersOpen: (open: boolean) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filtersOpen: true, // Por defecto abiertos
  toggleFilters: () => set((state) => ({ filtersOpen: !state.filtersOpen })),
  setFiltersOpen: (open) => set({ filtersOpen: open }),
}));
