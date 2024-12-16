import { create } from "zustand";

type SourcingPlatform = "all" | "aliexpress" | "cj";

interface ProductsFilterState {
  sourcingPlatform: SourcingPlatform;
  categories: any[];
  categorySelected: string | null;
  priceRange: [number, number];
  priceRangeSelected: [number, number];
  sortOption: string;
  isDataLoaded: boolean;

  setSourcingPlatform: (platform: SourcingPlatform) => void;
  setCategories: (categories: any[]) => void;
  setCategorySelected: (name: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setPriceRangeSelected: (range: [number, number]) => void;
  setSortOption: (option: string) => void;
  setIsDataLoaded: (loaded: boolean) => void;
}

export const usePotentialProductsFilterStore = create<ProductsFilterState>(
  (set) => ({
    sourcingPlatform: "aliexpress",
    categories: [],
    categorySelected: null,
    priceRange: [0, 10000],
    priceRangeSelected: [0, 10000],
    sortOption: "0",
    isDataLoaded: false,

    setSourcingPlatform: (platform) =>
      set({
        sourcingPlatform: platform,
        categorySelected: null,
        categories: [],
        isDataLoaded: false,
      }),
    setCategories: (categories) => set({ categories }),
    setCategorySelected: (name) => set({ categorySelected: name }),
    setPriceRange: (range) => set({ priceRange: range }),
    setPriceRangeSelected: (range) => set({ priceRangeSelected: range }),
    setSortOption: (option) => set({ sortOption: option }),
    setIsDataLoaded: (loaded) => set({ isDataLoaded: loaded }),
  })
);
